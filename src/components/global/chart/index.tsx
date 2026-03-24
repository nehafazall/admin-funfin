import React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export interface DataPoint {
  date: string;
  value: number;
}

export interface ChartIndicator {
  value: number;
  label: string;
  color?: string;
}

export interface ChartProps {
  data: DataPoint[];
  indicators?: ChartIndicator[];
  title?: string;
  subtitle?: string;
  yAxisWidth?: number;
  lineColor?: string;
  fillColor?: string;
  minValue?: number;
  maxValue?: number;
  gridColor?: string;
  tooltipTitle?: string;
  valueFormatter?: (value: number) => string;
  dateFormatter?: (date: string) => string;
  className?: string;
}

const Chart: React.FC<ChartProps> = ({
  data,
  indicators = [],
 
  yAxisWidth = 40,
  lineColor = "hsl(12, 76%, 61%)",
  fillColor = "rgba(249, 115, 22, 0.1)",
  minValue,
  maxValue,
  gridColor = "rgba(255, 255, 255, 0.1)",
  tooltipTitle = "Value",
  valueFormatter = (value) => value.toFixed(4),
  dateFormatter = (date) => date,
  className,
}) => {
  // Calculate min and max values automatically if not provided
  const calculatedMin =
    minValue ?? Math.min(...data.map((d) => d.value)) * 0.9995;
  const calculatedMax =
    maxValue ?? Math.max(...data.map((d) => d.value)) * 1.0005;

  const ChartTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) {
      return null;
    }

    return (
      <div className="rounded-lg border bg-background p-2 shadow-md">
        <div className="grid grid-cols-2 gap-2">
          <span className="text-sm font-medium">Date:</span>
          <span className="text-sm text-right">{dateFormatter(label)}</span>
          <span className="text-sm font-medium">{tooltipTitle}:</span>
          <span className="text-sm text-right">
            {valueFormatter(payload[0].value)}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-[250px] md:max-h-[450px] max-h-[250px] h-[450px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
        >
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={lineColor} stopOpacity={0.3} />
              <stop offset="95%" stopColor={lineColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            tickFormatter={dateFormatter}
            tick={{ fontSize: 12 }}
            axisLine={{ stroke: gridColor }}
            tickLine={{ stroke: gridColor }}
          />
          <YAxis
            domain={[calculatedMin, calculatedMax]}
            width={yAxisWidth}
            tick={{ fontSize: 12 }}
            tickFormatter={valueFormatter}
            axisLine={{ stroke: gridColor }}
            tickLine={{ stroke: gridColor }}
          />
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <Tooltip content={<ChartTooltip />} />
{/* 
          {indicators.map((indicator, index) => (
            <CartesianGrid
              key={`indicator-${index}`}
              horizontal={true}
              vertical={false}
              y={indicator.value}
              strokeDasharray="3 3"
              stroke={indicator.color || lineColor}
              strokeOpacity={0.8}
            />
          ))} */}

          <Area
            type="monotone"
            dataKey="value"
            stroke={lineColor}
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorValue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
