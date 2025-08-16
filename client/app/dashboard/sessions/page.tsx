"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { db, SessionInterface } from "@/lib/db";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

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

// Text formatter: show seconds if under 60, otherwise rounded minutes
function formatDuration(seconds: number | undefined | null) {
  const s = Math.max(0, Math.round(seconds ?? 0));
  if (s < 60) return `${s} sec`;
  const m = Math.round(s / 60);
  return `${m} min`;
}

function sum(arr: Array<number | undefined | null>): number {
  return arr.reduce<number>((acc, b) => acc + (b ?? 0), 0);
}

export default function Sessions() {
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

  return (
    <div className="grid grid-cols-1 gap-4 mt-4">
      <Link href={"/dashboard"}>
        <Button className="max-w-min">
          <ArrowLeft /> Home
        </Button>
      </Link>
      {sessionsSorted.map((s, idx) => {
        const d = toDateSafe(s.date);
        const dateStr = d ? d.toLocaleString() : "";
        const breakSeconds = sum((s.breakDurations || []) as number[]);
        return (
          <Link href={`/dashboard/session/${s.id}`} key={idx}>
            <Card className="rounded-md border p-3 hover:cursor-pointer">
              <CardContent className="py-4">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3 lg:grid-cols-6">
                  <div>
                    <div className="text-xs text-muted-foreground">Date</div>
                    <div className="font-medium">{dateStr}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">
                      Duration
                    </div>
                    <div className="font-medium">
                      {formatDuration(s.duration)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Sitting</div>
                    <div className="font-medium">
                      {formatDuration(s.timeSpentSitting)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">
                      # Breaks
                    </div>
                    <div className="font-medium">{s.numberOfBreaks}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">
                      Break time
                    </div>
                    <div className="font-medium">
                      {formatDuration(breakSeconds)}
                    </div>
                  </div>
                </div>
                <Separator className="my-3" />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <div className="text-xs text-muted-foreground">
                      Sitting intervals
                    </div>
                    <div className="text-xs break-words">
                      {(s.sittingDurations || []).length
                        ? (s.sittingDurations || [])
                            .map((v) => formatDuration(v))
                            .join(", ")
                        : "—"}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">
                      Break intervals
                    </div>
                    <div className="text-xs break-words">
                      {(s.breakDurations || []).length
                        ? (s.breakDurations || [])
                            .map((v) => formatDuration(v))
                            .join(", ")
                        : "—"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
