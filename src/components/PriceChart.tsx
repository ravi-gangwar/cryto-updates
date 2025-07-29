import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { PriceHistory } from "../types/crypto";

interface PriceChartProps {
  data: PriceHistory | null;
  coinName: string;
  loading: boolean;
}

export const PriceChart: React.FC<PriceChartProps> = React.memo(
  ({ data, coinName, loading }) => {
    const chartData = useMemo(
      () =>
        data?.prices?.map(([timestamp, price]) => ({
          date: new Date(timestamp).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          price: price,
          timestamp,
        })) || [],
      [data?.prices]
    );

    const { minPrice, maxPrice, isPositiveTrend } = useMemo(() => {
      if (!chartData.length)
        return { minPrice: 0, maxPrice: 0, isPositiveTrend: false };
      const minPrice = Math.min(...chartData.map((d) => d.price));
      const maxPrice = Math.max(...chartData.map((d) => d.price));
      const isPositiveTrend =
        chartData[chartData.length - 1].price > chartData[0].price;
      return { minPrice, maxPrice, isPositiveTrend };
    }, [chartData]);

    if (loading) {
      return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-1/3"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      );
    }

    if (!data) {
      return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            Price Chart - Last 7 Days
          </h3>
          <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
            Select a cryptocurrency to view its price chart
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">
            {coinName} - Last 7 Days
          </h3>
          <div
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              isPositiveTrend
                ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
            }`}
          >
            {isPositiveTrend ? "↗ Trending Up" : "↘ Trending Down"}
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f0f0f0"
                className="dark:stroke-gray-600"
              />
              <XAxis
                dataKey="date"
                stroke="#666"
                className="dark:stroke-gray-400"
                fontSize={12}
              />
              <YAxis
                domain={[minPrice * 0.95, maxPrice * 1.05]}
                stroke="#666"
                className="dark:stroke-gray-400"
                fontSize={12}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <Tooltip
                formatter={(value: number) => [
                  `$${value.toLocaleString()}`,
                  "Price",
                ]}
                labelFormatter={(label) => `Date: ${label}`}
                contentStyle={{
                  backgroundColor: "var(--tooltip-bg)",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  color: "var(--tooltip-color)",
                }}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke={isPositiveTrend ? "#10b981" : "#ef4444"}
                strokeWidth={3}
                dot={{
                  fill: isPositiveTrend ? "#10b981" : "#ef4444",
                  strokeWidth: 2,
                  r: 4,
                }}
                activeDot={{
                  r: 6,
                  stroke: isPositiveTrend ? "#10b981" : "#ef4444",
                  strokeWidth: 2,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }
);
