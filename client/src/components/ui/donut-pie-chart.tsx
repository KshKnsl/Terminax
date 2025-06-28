"use client";

import * as React from "react";
import { Pie, PieChart, Label, Cell, ResponsiveContainer } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

export function ChartPieDonutText({
  chartData,
  title = "Languages",
  description = "Project language breakdown",
}: {
  chartData: { browser: string; visitors: number; fill?: string }[];
  title?: string;
  description?: string;
  valueLabel?: string;
}) {
  const colorPalette = [
    "#7c3aed",
    "#f59e42",
    "#10b981",
    "#f43f5e",
    "#6366f1",
    "#fbbf24",
    "#3b82f6",
    "#ef4444",
    "#14b8a6",
    "#a21caf",
    "#eab308",
    "#0ea5e9",
    "#f472b6",
    "#22d3ee",
    "#84cc16",
    "#e11d48",
    "#facc15",
    "#2563eb",
    "#f87171",
    "#38bdf8",
    "#a3e635",
    "#f472b6",
    "#fcd34d",
    "#818cf8",
    "#fca5a5",
    "#f9a8d4",
    "#fef08a",
    "#c084fc",
    "#fde68a",
    "#fbbf24",
    "#f87171",
    "#a7f3d0",
    "#f472b6",
    "#fca5a5",
    "#fcd34d",
    "#818cf8",
    "#f9a8d4",
    "#fef08a",
    "#c084fc",
    "#fde68a",
  ];
  const total = React.useMemo(
    () => chartData.reduce((acc, curr) => acc + curr.visitors, 0),
    [chartData]
  );
  // Add color to each data entry
  const dataWithColors = chartData.map((d, i) => ({
    ...d,
    fill: colorPalette[i % colorPalette.length],
  }));

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4 pb-0">
        <ChartContainer
          className="mx-auto aspect-square max-h-[250px] min-w-[200px] min-h-[200px] w-full"
          config={{}}>
          <ResponsiveContainer width="100%" height={250} minWidth={200} minHeight={200}>
            <PieChart>
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={dataWithColors}
                dataKey="visitors"
                nameKey="browser"
                innerRadius={0}
                outerRadius={100}
                strokeWidth={2}
                isAnimationActive={false}>
                {dataWithColors.map((entry) => (
                  <Cell key={`cell-${entry.browser}`} fill={entry.fill} />
                ))}
                <Label content={() => null} />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <ul className="w-full flex flex-col gap-1 mt-2">
          {dataWithColors.map((entry) => {
            const percent = total > 0 ? (entry.visitors / total) * 100 : 0;
            return (
              <li key={entry.browser} className="flex items-center gap-2 text-xs">
                <span
                  className="inline-block w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.fill }}></span>
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  {entry.browser}
                </span>
                <span className="text-gray-500">{percent.toFixed(1)}%</span>
                <span className="ml-auto font-mono text-gray-400">
                  {entry.visitors.toLocaleString()}
                </span>
              </li>
            );
          })}
        </ul>
      </CardFooter>
    </Card>
  );
}
