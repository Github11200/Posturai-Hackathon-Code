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
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function useAllSessions() {
  const [sessions, setSessions] = React.useState<SessionInterface[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
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

function sum(arr: Array<number | undefined | null>): number {
  return arr.reduce<number>((acc, b) => acc + (b ?? 0), 0);
}

function chartMinutes(n: number | undefined | null) {
  const mins = (n ?? 0) / 60;
  return +mins.toFixed(1);
}

function formatDuration(seconds: number | undefined | null) {
  const s = Math.max(0, Math.round(seconds ?? 0));
  if (s < 60) return `${s} sec`;
  const m = Math.round(s / 60);
  return `${m} min`;
}

function toDateSafe(d: unknown): Date | null {
  if (!d) return null;
  const dt = new Date(d as any);
  return isNaN(dt.getTime()) ? null : dt;
}

function weekKey(d: Date): string {
  const dd = new Date(d);
  const dow = (dd.getDay() + 6) % 7; // Monday=0
  const monday = new Date(dd);
  monday.setDate(dd.getDate() - dow);
  monday.setHours(0, 0, 0, 0);
  return monday.toISOString().slice(0, 10);
}

export default function GoodBadOverview() {
  const { sessions, loading } = useAllSessions();

  const computed = React.useMemo(() => {
    let totalGoodPostureSec = 0;
    let totalBadPostureSec = 0;

    const weekly = new Map<
      string,
      { week: string; goodSec: number; badSec: number }
    >();
    for (const s of sessions) {
      const d = toDateSafe(s.date);
      if (!d) continue;
      const key = weekKey(d);
      const w = weekly.get(key) || { week: key, goodSec: 0, badSec: 0 };
      const sitting = Math.max(0, s.timeSpentSitting || 0);
      const badRaw = sum((s.badPostureDurations || []) as number[]);
      const bad = Math.min(Math.max(0, badRaw), sitting); // clamp to [0, sitting]
      const good = Math.max(0, sitting - bad);

      // accumulate weekly
      w.goodSec += good;
      w.badSec += bad;
      weekly.set(key, w);

      // accumulate totals from per-session clamped values
      totalGoodPostureSec += good;
      totalBadPostureSec += bad;
    }

    const totalData = [
      {
        label: "All time",
        good: chartMinutes(totalGoodPostureSec),
        bad: chartMinutes(totalBadPostureSec),
      },
    ];

    return {
      totalGoodPostureSec,
      totalBadPostureSec,
      totalData,
    };
  }, [sessions]);

  if (loading) {
    return (
      <div className="grid gap-6">
        <div className="text-sm text-muted-foreground">
          Loading posture overview…
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 min-w-0">
      <Card className="min-w-0">
        <CardHeader>
          <CardTitle>Total good vs bad posture</CardTitle>
          <CardDescription>All-time minutes</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              good: { label: "Good posture (min)", color: "#22c55e" },
              bad: { label: "Bad posture (min)", color: "#ef4444" },
            }}
            className="h-64 w-full max-w-full"
          >
            <BarChart data={computed.totalData}>
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
    </div>
  );
}
