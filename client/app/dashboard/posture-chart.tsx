"use client";

import * as React from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Dummy weekly data: minutes of good posture per day
const data = [
  { day: "Sun", good: 210 },
  { day: "Mon", good: 185 },
  { day: "Tue", good: 240 },
  { day: "Wed", good: 195 },
  { day: "Thu", good: 260 },
  { day: "Fri", good: 220 },
  { day: "Sat", good: 275 },
];

// Configure styling/labels for the series used in the chart
const chartConfig = {
  good: {
    label: "Good posture (min)",
    // Use a readable blue; ChartContainer maps this to --color-good
    color: "var(--chart-2)",
  },
} as const;

export default function PostureChart() {
  return (
    <div className="flex justify-center items-center border p-6 rounded-(--radius) w-full">
      <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
        <ComposedChart data={data} margin={{ left: 12, right: 12, top: 8 }}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="day"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <YAxis tickLine={false} axisLine={false} tickMargin={8} width={40} />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

          {/* Bars */}
          <Bar
            dataKey="good"
            fill="var(--color-good)"
            radius={[4, 4, 0, 0]}
            maxBarSize={42}
          />

          {/* Line connecting the bar tops */}
          <Line
            type="monotone"
            dataKey="good"
            stroke="var(--color-good)"
            strokeWidth={2}
            dot={{ r: 2.5 }}
            activeDot={{ r: 4 }}
          />
        </ComposedChart>
      </ChartContainer>
    </div>
  );
}
