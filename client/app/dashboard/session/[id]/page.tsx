"use client";

import React from "react";
import { db, type SessionInterface } from "@/lib/db";
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
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function useLatestSession() {
  const [latest, setLatest] = React.useState<SessionInterface | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const s = await db.sessions.orderBy("date").reverse().first();
        if (mounted) setLatest(s ?? null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return { latest, loading };
}

// Convert seconds to minutes (number) for charting; keep one decimal to avoid zeroing tiny values
function chartMinutes(n: number | undefined | null) {
  const mins = (n ?? 0) / 60;
  return +mins.toFixed(1);
}

// Format seconds for text: show seconds if < 60, otherwise minutes (rounded)
function formatDuration(seconds: number | undefined | null) {
  const s = Math.max(0, Math.round(seconds ?? 0));
  if (s < 60) return `${s} sec`;
  const m = Math.round(s / 60);
  return `${m} min`;
}

export default function SessionStatisticsPage() {
  const { latest, loading } = useLatestSession();

  if (loading) {
    return (
      <div className="container mx-auto grid gap-6 p-6">
        <div className="text-sm text-muted-foreground">
          Loading session statistics…
        </div>
      </div>
    );
  }

  if (!latest) {
    return (
      <div className="container mx-auto grid gap-6 p-6">
        <Card>
          <CardHeader>
            <CardTitle>No data yet</CardTitle>
            <CardDescription>
              Start a session to see statistics here.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const totalBreakSeconds = (latest.breakDurations || []).reduce(
    (a, b) => a + (b || 0),
    0
  );
  const sittingSeconds = Math.max(0, latest.timeSpentSitting ?? 0);
  const badDurationsClamped = (latest.badPostureDurations || []).map((v) =>
    Math.max(0, v || 0)
  );
  const rawBadPostureSeconds = badDurationsClamped.reduce((a, b) => a + b, 0);
  const totalBadPostureSeconds = Math.min(rawBadPostureSeconds, sittingSeconds);
  const goodPostureSeconds = Math.max(
    0,
    sittingSeconds - totalBadPostureSeconds
  );
  const totalDurationSeconds = latest.duration ?? 0;
  const dateStr = latest.date
    ? new Date(latest.date as unknown as string).toLocaleString()
    : "";

  const avg = (arr: number[]) => {
    if (!arr || arr.length === 0) return 0;
    const sum = arr.reduce((a, b) => a + (b || 0), 0);
    return Math.round(sum / arr.length);
  };

  const avgSittingSeconds = avg(latest.sittingDurations || []);
  const avgBreakSeconds = avg(latest.breakDurations || []);
  const avgBadPostureSeconds = avg(badDurationsClamped);

  const postureChartData = [
    {
      label: "Latest Session",
      good: chartMinutes(goodPostureSeconds),
      bad: chartMinutes(totalBadPostureSeconds),
    },
  ];

  const sittingIntervals = (latest.sittingDurations || []).map((v, i) => ({
    name: `#${i + 1}`,
    minutes: chartMinutes(v),
  }));

  const breakIntervals = (latest.breakDurations || []).map((v, i) => ({
    name: `#${i + 1}`,
    minutes: chartMinutes(v),
  }));
  const badPostureIntervals = badDurationsClamped.map((v, i) => ({
    name: `#${i + 1}`,
    minutes: chartMinutes(v),
  }));

  return (
    <div className="mx-auto grid gap-6 p-6 w-full max-w-full">
      <div className="grid gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          Session statistics
        </h1>
        <p className="text-sm text-muted-foreground">
          Latest entry • {dateStr}
        </p>
      </div>
      <Link href={"/dashboard"}>
        <Button className="w-full">Continue</Button>
      </Link>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4 min-w-0">
        <Card className="min-w-0">
          <CardHeader>
            <CardTitle className="text-base">Total duration</CardTitle>
            <CardDescription>Total time of the session</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatDuration(totalDurationSeconds)}
            </div>
          </CardContent>
        </Card>

        <Card className="min-w-0">
          <CardHeader>
            <CardTitle className="text-base">Good posture</CardTitle>
            <CardDescription>Time with good posture</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatDuration(goodPostureSeconds)}
            </div>
          </CardContent>
        </Card>

        <Card className="min-w-0">
          <CardHeader>
            <CardTitle className="text-base">Bad posture</CardTitle>
            <CardDescription>Total bad posture time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatDuration(totalBadPostureSeconds)}
            </div>
          </CardContent>
        </Card>

        <Card className="min-w-0">
          <CardHeader>
            <CardTitle className="text-base">Breaks</CardTitle>
            <CardDescription>Number of breaks taken</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{latest.numberOfBreaks}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="col-span-1 min-w-0">
        <CardHeader>
          <CardTitle>Good vs bad posture</CardTitle>
          <CardDescription>Minutes in latest session</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              good: {
                label: "Good posture (min)",
                color: "#22c55e",
              },
              bad: {
                label: "Bad posture (min)",
                color: "#ef4444",
              },
            }}
            className="h-72 w-full max-w-full"
          >
            <BarChart data={postureChartData}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="good"
                fill="var(--color-good)"
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey="bad"
                fill="var(--color-bad)"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 min-w-0">
        <Card className="min-w-0">
          <CardHeader>
            <CardTitle>Sitting intervals</CardTitle>
            <CardDescription>
              Average {formatDuration(avgSittingSeconds)} •{" "}
              {sittingIntervals.length} intervals
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sittingIntervals.length === 0 ? (
              <div className="text-sm text-muted-foreground">No intervals</div>
            ) : (
              <ChartContainer
                config={{ minutes: { label: "Minutes", color: "#3b82f6" } }}
                className="h-64 w-full max-w-full"
              >
                <BarChart data={sittingIntervals}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                  <Tooltip content={<ChartTooltipContent nameKey="name" />} />
                  <Bar
                    dataKey="minutes"
                    fill="var(--color-minutes)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        <Card className="min-w-0">
          <CardHeader>
            <CardTitle>Break intervals</CardTitle>
            <CardDescription>
              Average {formatDuration(avgBreakSeconds)} •{" "}
              {breakIntervals.length} breaks
            </CardDescription>
          </CardHeader>
          <CardContent>
            {breakIntervals.length === 0 ? (
              <div className="text-sm text-muted-foreground">No breaks</div>
            ) : (
              <ChartContainer
                config={{ minutes: { label: "Minutes", color: "#f97316" } }}
                className="h-64 w-full max-w-full"
              >
                <BarChart data={breakIntervals}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                  <Tooltip content={<ChartTooltipContent nameKey="name" />} />
                  <Bar
                    dataKey="minutes"
                    fill="var(--color-minutes)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="min-w-0">
        <CardHeader>
          <CardTitle>Bad posture intervals</CardTitle>
          <CardDescription>
            Average {formatDuration(avgBadPostureSeconds)} •{" "}
            {badPostureIntervals.length} intervals
          </CardDescription>
        </CardHeader>
        <CardContent>
          {badPostureIntervals.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              No bad posture detected
            </div>
          ) : (
            <ChartContainer
              config={{ minutes: { label: "Minutes", color: "#ef4444" } }}
              className="h-64 w-full max-w-full"
            >
              <BarChart data={badPostureIntervals}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                <Tooltip content={<ChartTooltipContent nameKey="name" />} />
                <Bar
                  dataKey="minutes"
                  fill="var(--color-minutes)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      <Card className="min-w-0">
        <CardHeader>
          <CardTitle>Details</CardTitle>
          <CardDescription>All fields for the latest session</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 min-w-0">
            <div>
              <div className="text-sm text-muted-foreground">Date</div>
              <div className="font-medium">{dateStr}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Duration</div>
              <div className="font-medium">
                {formatDuration(totalDurationSeconds)}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Time sitting</div>
              <div className="font-medium">
                {formatDuration(sittingSeconds)}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground"># Breaks</div>
              <div className="font-medium">{latest.numberOfBreaks}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Good posture</div>
              <div className="font-medium">
                {formatDuration(goodPostureSeconds)}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Bad posture</div>
              <div className="font-medium">
                {formatDuration(totalBadPostureSeconds)}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Avg sitting</div>
              <div className="font-medium">
                {formatDuration(avgSittingSeconds)}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Avg break</div>
              <div className="font-medium">
                {formatDuration(avgBreakSeconds)}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">
                Avg bad posture
              </div>
              <div className="font-medium">
                {formatDuration(avgBadPostureSeconds)}
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 min-w-0">
            <div>
              <div className="text-sm text-muted-foreground">
                Sitting durations
              </div>
              <div className="text-xs break-words">
                {(latest.sittingDurations || []).length
                  ? (latest.sittingDurations || [])
                      .map((v) => formatDuration(v))
                      .join(", ")
                  : "—"}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">
                Break durations
              </div>
              <div className="text-xs break-words">
                {(latest.breakDurations || []).length
                  ? (latest.breakDurations || [])
                      .map((v) => formatDuration(v))
                      .join(", ")
                  : "—"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
