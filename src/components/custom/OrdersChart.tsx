"use client";

import { TrendingUp } from "lucide-react";
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
const chartData = [{ month: "january", mending: 1260, bought: 550 }];
const totalAmount = 110;

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export default function Component() {
  const totalOrders = chartData[0].mending + chartData[0].bought;

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Receipt of goods</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 items-center -pb-">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full -mb-24"
        >
          <RadialBarChart
            data={chartData}
            endAngle={180}
            innerRadius={80}
            outerRadius={120}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 16}
                          className="fill-foreground text-2xl font-bold"
                        >
                          ${totalAmount}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 4}
                          className="fill-muted-foreground"
                        >
                          {totalOrders.toLocaleString()} Orders
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
            <RadialBar
              dataKey="bought"
              stackId="a"
              cornerRadius={5}
              fill="#373F51"
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="mending"
              fill="#848294"
              stackId="a"
              cornerRadius={5}
              className="stroke-transparent stroke-2"
            />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex items-center justify-between text-sm">
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1 -mb-1">
            <button className="w-1.5 h-1.5 bg-[#373F51]"/>
            <h1 className="text-base font-semibold">$550</h1>
          </div>
          <h2 className="text-xs  text-gray-400 font-semibold">{chartData[0].bought} bought</h2>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1 -mb-1">
            <button className="w-1.5 h-1.5 bg-[#848294]"/>
            <h1 className="text-base font-semibold">$1260</h1>
          </div>
          <h2 className="text-xs  text-gray-400 font-semibold">{chartData[0].mending} mending deals</h2>
        </div>

      </CardFooter>
    </Card>
  );
}
