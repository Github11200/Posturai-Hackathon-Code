"use client";

import React, { useEffect } from "react";
import { db, SettingsInterface, type SessionInterface } from "@/lib/db";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import GoodBadOverview from "./good-bad-overview";

function useAllSessions() {
  const [sessions, setSessions] = React.useState<SessionInterface[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // Order by date ascending for charts/timelines
        const arr = await db.sessions.orderBy("date").toArray();
        if (mounted) setSessions(arr ?? []);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return { sessions, loading };
}

function toDateSafe(d: unknown): Date | null {
  if (!d) return null;
  const dt = new Date(d as any);
  return isNaN(dt.getTime()) ? null : dt;
}

// Convert seconds to minutes (with a single decimal) for charts
function chartMinutes(n: number | undefined | null) {
  const mins = (n ?? 0) / 60;
  return +mins.toFixed(1);
}

// Text formatter: show seconds if under 60, otherwise rounded minutes
function formatDuration(seconds: number | undefined | null) {
  const s = Math.max(0, Math.round(seconds ?? 0));
  if (s < 60) return `${s} sec`;
  const m = Math.round(s / 60);
  return `${m} min`;
}

function formatShort(d: Date | null) {
  if (!d) return "";
  try {
    return d.toLocaleDateString(undefined, {
      month: "short",
      day: "2-digit",
    });
  } catch {
    return d.toISOString().slice(5, 10);
  }
}

function weekKey(d: Date): string {
  // Monday-based start of week
  const dd = new Date(d);
  const dow = (dd.getDay() + 6) % 7; // 0..6, Monday=0
  const monday = new Date(dd);
  monday.setDate(dd.getDate() - dow);
  monday.setHours(0, 0, 0, 0);
  return monday.toISOString().slice(0, 10); // YYYY-MM-DD
}

function sum(arr: Array<number | undefined | null>): number {
  return arr.reduce<number>((acc, b) => acc + (b ?? 0), 0);
}

function average(arr: Array<number | undefined | null>): number {
  if (!arr || arr.length === 0) return 0;
  const total = sum(arr);
  return arr.length ? total / arr.length : 0;
}

function binValue(n: number) {
  if (n < 5) return "<5";
  if (n < 10) return "5-10";
  if (n < 20) return "10-20";
  if (n < 30) return "20-30";
  return ">=30";
}

export default function StatsOverview() {
  useEffect(() => {
    const defaultSettings: SettingsInterface = {
      id: 0,
      breakTimeReminder: 1800000, // 30 minutes
      noUserDetectedIsBreak: true,
      soundEnabled: true,
      volume: 1,
    };
    db.settings.count().then((entries) => {
      if (entries === 0)
        db.settings.add(defaultSettings).then((id) => {
          console.log("added entry!");
        });
    });
  });

  const { sessions, loading } = useAllSessions();

  const sessionsSorted = React.useMemo(() => {
    const sorted = [...sessions];
    sorted.sort((a, b) => {
      const da = toDateSafe(a.date)?.getTime() ?? 0;
      const dbb = toDateSafe(b.date)?.getTime() ?? 0;
      return da - dbb;
    });
    return sorted;
  }, [sessions]);

  const stats = React.useMemo(() => {
    const totalSessions = sessionsSorted.length;
    // Aggregate in seconds for textual display
    const totalDurationSec = sum(sessionsSorted.map((s) => s.duration || 0));
    const totalSittingSec = sum(
      sessionsSorted.map((s) => s.timeSpentSitting || 0)
    );
    const totalBreakTimeSec = sum(
      sessionsSorted.map((s) => sum((s.breakDurations || []) as number[]))
    );
    const totalBreaksCount = sum(
      sessionsSorted.map((s) => s.numberOfBreaks || 0)
    );

    // Averages in seconds
    const avgDurationSec = average(sessionsSorted.map((s) => s.duration || 0));
    const avgSittingSec = average(
      sessionsSorted.map((s) => s.timeSpentSitting || 0)
    );
    const avgBreaksTimeSec = average(
      sessionsSorted.map((s) =>
        sum((s.breakDurations || []).map((x) => x ?? 0))
      )
    );
    const avgBreaksPerSession = (
      totalSessions ? totalBreaksCount / totalSessions : 0
    ).toFixed(1);

    // Weekly aggregation
    const weekly = new Map<
      string,
      {
        week: string;
        sittingSec: number;
        breaksSec: number;
        durationSec: number;
        sessions: number;
      }
    >();
    for (const s of sessionsSorted) {
      const d = toDateSafe(s.date);
      if (!d) continue;
      const key = weekKey(d);
      const w = weekly.get(key) || {
        week: key,
        sittingSec: 0,
        breaksSec: 0,
        durationSec: 0,
        sessions: 0,
      };
      w.sittingSec += s.timeSpentSitting || 0;
      w.durationSec += s.duration || 0;
      w.breaksSec += sum((s.breakDurations || []).map((x) => x ?? 0));
      w.sessions += 1;
      weekly.set(key, w);
    }
    const weeklyData = Array.from(weekly.values())
      .sort((a, b) => a.week.localeCompare(b.week))
      .map((w) => ({
        week: w.week,
        sitting: chartMinutes(w.sittingSec),
        breaks: chartMinutes(w.breaksSec),
        duration: chartMinutes(w.durationSec),
        sessions: w.sessions,
      }));

    // Per-session time series (by date)
    const perSessionTimeline = sessionsSorted.map((s) => {
      const d = toDateSafe(s.date);
      const label = formatShort(d);
      return {
        label,
        duration: chartMinutes(s.duration),
        sitting: chartMinutes(s.timeSpentSitting),
        breaks: chartMinutes(sum((s.breakDurations || []) as number[])),
        breaksCount: s.numberOfBreaks || 0,
      };
    });

    // Breaks per session
    const breaksPerSession = perSessionTimeline.map((x) => ({
      label: x.label,
      breaks: x.breaksCount,
    }));

    // Interval distributions
    const allSittingIntervalsMin: number[] = [];
    const allBreakIntervalsMin: number[] = [];
    const allSittingIntervalsSec: number[] = [];
    const allBreakIntervalsSec: number[] = [];
    for (const s of sessionsSorted) {
      for (const v of s.sittingDurations || []) {
        allSittingIntervalsMin.push(chartMinutes(v));
        allSittingIntervalsSec.push(v);
      }
      for (const v of s.breakDurations || []) {
        allBreakIntervalsMin.push(chartMinutes(v));
        allBreakIntervalsSec.push(v);
      }
    }
    const avgSitIntervalSec = average(allSittingIntervalsSec);
    const avgBreakIntervalSec = average(allBreakIntervalsSec);

    const bins = ["<5", "5-10", "10-20", "20-30", ">=30"] as const;
    const sitBinsCount = Object.fromEntries(bins.map((b) => [b, 0])) as Record<
      (typeof bins)[number],
      number
    >;
    const breakBinsCount = Object.fromEntries(
      bins.map((b) => [b, 0])
    ) as Record<(typeof bins)[number], number>;
    for (const v of allSittingIntervalsMin)
      sitBinsCount[binValue(v) as (typeof bins)[number]]++;
    for (const v of allBreakIntervalsMin)
      breakBinsCount[binValue(v) as (typeof bins)[number]]++;
    const sittingBinsData = bins.map((b) => ({
      bin: b,
      count: sitBinsCount[b],
    }));
    const breakBinsData = bins.map((b) => ({
      bin: b,
      count: breakBinsCount[b],
    }));

    return {
      totalSessions,
      totalDurationSec,
      totalSittingSec,
      totalBreakTimeSec,
      totalBreaksCount,
      avgDurationSec,
      avgSittingSec,
      avgBreaksTimeSec,
      avgBreaksPerSession,
      avgSitIntervalSec,
      avgBreakIntervalSec,
      weeklyData,
      perSessionTimeline,
      breaksPerSession,
      sittingBinsData,
      breakBinsData,
      allSittingIntervalsCount: allSittingIntervalsSec.length,
      allBreakIntervalsCount: allBreakIntervalsSec.length,
    };
  }, [sessionsSorted]);

  if (loading) {
    return (
      <div className="grid gap-6">
        <div className="text-sm text-muted-foreground">Loading statistics…</div>
      </div>
    );
  }

  if (!sessionsSorted.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No statistics yet</CardTitle>
          <CardDescription>
            Start tracking sessions to see your dashboard.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 min-w-0">
      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4 min-w-0">
        <Card className="min-w-0">
          <CardHeader>
            <CardTitle className="text-base">Total sessions</CardTitle>
            <CardDescription>All recorded sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalSessions}</div>
          </CardContent>
        </Card>
        <Card className="min-w-0">
          <CardHeader>
            <CardTitle className="text-base">Total duration</CardTitle>
            <CardDescription>Sum across sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatDuration(stats.totalDurationSec)}
            </div>
          </CardContent>
        </Card>
        <Card className="min-w-0">
          <CardHeader>
            <CardTitle className="text-base">Total sitting</CardTitle>
            <CardDescription>Active sitting time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatDuration(stats.totalSittingSec)}
            </div>
          </CardContent>
        </Card>
        <Card className="min-w-0">
          <CardHeader>
            <CardTitle className="text-base">Total break time</CardTitle>
            <CardDescription>Sum of breaks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatDuration(stats.totalBreakTimeSec)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4 min-w-0">
        <Card className="min-w-0">
          <CardHeader>
            <CardTitle className="text-base">Avg duration</CardTitle>
            <CardDescription>Per session</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatDuration(stats.avgDurationSec)}
            </div>
          </CardContent>
        </Card>
        <Card className="min-w-0">
          <CardHeader>
            <CardTitle className="text-base">Avg sitting</CardTitle>
            <CardDescription>Per session</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatDuration(stats.avgSittingSec)}
            </div>
          </CardContent>
        </Card>
        <Card className="min-w-0">
          <CardHeader>
            <CardTitle className="text-base">Avg break time</CardTitle>
            <CardDescription>Per session</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatDuration(stats.avgBreaksTimeSec)}
            </div>
          </CardContent>
        </Card>
        <Card className="min-w-0">
          <CardHeader>
            <CardTitle className="text-base">Avg # breaks</CardTitle>
            <CardDescription>Per session</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {stats.avgBreaksPerSession}
            </div>
          </CardContent>
        </Card>
      </div>

      <GoodBadOverview />

      {/* Weekly sitting vs breaks */}
      <Card className="min-w-0">
        <CardHeader>
          <CardTitle>Weekly sitting vs breaks</CardTitle>
          <CardDescription>
            Totals grouped by week (Monday start)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              sitting: { label: "Sitting (min)", color: "#3b82f6" },
              breaks: { label: "Breaks (min)", color: "#f97316" },
            }}
            className="h-72 w-full max-w-full"
          >
            <BarChart
              data={stats.weeklyData.map((w) => ({
                week: w.week.slice(5), // MM-DD
                sitting: w.sitting,
                breaks: w.breaks,
              }))}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="week"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="sitting"
                fill="var(--color-sitting)"
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey="breaks"
                fill="var(--color-breaks)"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Session duration timeline */}
      <Card className="min-w-0">
        <CardHeader>
          <CardTitle>Session timeline</CardTitle>
          <CardDescription>
            Duration, sitting, and break time by date (min)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              duration: { label: "Duration (min)", color: "#10b981" },
              sitting: { label: "Sitting (min)", color: "#3b82f6" },
              breaks: { label: "Breaks (min)", color: "#f97316" },
            }}
            className="h-72 w-full max-w-full"
          >
            <LineChart data={stats.perSessionTimeline}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip
                content={<ChartTooltipContent indicator="dashed" />}
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Line
                type="monotone"
                dataKey="duration"
                stroke="var(--color-duration)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="sitting"
                stroke="var(--color-sitting)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="breaks"
                stroke="var(--color-breaks)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 min-w-0">
        {/* Breaks per session */}
        <Card className="min-w-0">
          <CardHeader>
            <CardTitle>Breaks per session</CardTitle>
            <CardDescription>How many breaks you usually take</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{ breaks: { label: "# Breaks", color: "#8b5cf6" } }}
              className="h-64 w-full max-w-full"
            >
              <BarChart data={stats.breaksPerSession}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  allowDecimals={false}
                />
                <Tooltip content={<ChartTooltipContent nameKey="label" />} />
                <Bar
                  dataKey="breaks"
                  fill="var(--color-breaks)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Interval distribution */}
        <Card className="min-w-0">
          <CardHeader>
            <CardTitle>Interval lengths</CardTitle>
            <CardDescription>
              Avg sitting {formatDuration(stats.avgSitIntervalSec)} • Avg break{" "}
              {formatDuration(stats.avgBreakIntervalSec)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                sitting: { label: "Sitting intervals", color: "#3b82f6" },
                breaks: { label: "Break intervals", color: "#f97316" },
              }}
              className="h-64 w-full max-w-full"
            >
              <BarChart
                data={stats.sittingBinsData.map((s, i) => ({
                  bin: s.bin,
                  sitting: s.count,
                  breaks: stats.breakBinsData[i]?.count || 0,
                }))}
              >
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="bin"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  allowDecimals={false}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar
                  dataKey="sitting"
                  fill="var(--color-sitting)"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="breaks"
                  fill="var(--color-breaks)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
