"use client";
import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Slider } from "@/components/ui/slider";

const baselineData = [
  { month: "Jan", before: 450 },
  { month: "Feb", before: 420 },
  { month: "Mar", before: 380 },
  { month: "Apr", before: 350 },
  { month: "May", before: 320 },
  { month: "Jun", before: 400 },
];

const chartStyles = {
  embedded: {
    gridStroke: "hsl(var(--border))",
    gridOpacity: 0.5,
    axisTick: { fill: "hsl(var(--muted-foreground))", fontSize: 12 },
    tooltip: {
      cursor: { fill: "hsl(var(--secondary) / 0.2)" },
      contentStyle: {
        backgroundColor: "hsl(var(--card))",
        border: "1px solid hsl(var(--border))",
        borderRadius: "8px",
        fontSize: "12px",
        color: "hsl(var(--foreground))",
      },
      itemStyle: { padding: "2px 0" as const },
    },
    legendStyle: { paddingBottom: "20px", fontSize: "12px" },
  },
  standalone: {
    gridStroke: "#334155",
    gridOpacity: 0.3,
    axisTick: { fill: "#94a3b8", fontSize: 13 },
    tooltip: {
      cursor: { fill: "rgba(51, 65, 85, 0.2)" },
      contentStyle: {
        backgroundColor: "#1e293b",
        border: "1px solid #334155",
        borderRadius: "8px",
        fontSize: "12px",
        color: "#f1f5f9",
      },
      itemStyle: { padding: "2px 0" as const },
    },
    legendStyle: { paddingBottom: "20px", fontSize: "13px", color: "#cbd5e1" },
  },
};

export function EnergyCostReductionChart({ embedded = false }: { embedded?: boolean }) {
  const [savings, setSavings] = useState(60);
  const styles = chartStyles[embedded ? "embedded" : "standalone"];

  const chartData = useMemo(() => {
    return baselineData.map((item) => ({
      month: item.month,
      before: item.before,
      after: Math.round(item.before * (1 - savings / 100)),
    }));
  }, [savings]);

  const totals = useMemo(() => {
    const totalBefore = chartData.reduce((sum, item) => sum + item.before, 0);
    const totalAfter = chartData.reduce((sum, item) => sum + item.after, 0);
    const totalSavingsAmount = totalBefore - totalAfter;
    const totalSavingsPercent = ((totalSavingsAmount / totalBefore) * 100).toFixed(1);

    return {
      before: totalBefore,
      after: totalAfter,
      savingsAmount: totalSavingsAmount,
      savingsPercent: totalSavingsPercent,
    };
  }, [chartData]);

  const chartAndSlider = (
    <>
      <div className="h-[400px] w-full mt-8 mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            barGap={12}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke={styles.gridStroke}
              opacity={styles.gridOpacity}
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={embedded ? { ...styles.axisTick, dy: 10 } : { ...styles.axisTick, dy: 10 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={styles.axisTick}
              tickFormatter={(value) => `$${value}`}
              domain={[0, 600]}
              ticks={[0, 150, 300, 450, 600]}
            />
            <Tooltip
              cursor={styles.tooltip.cursor}
              contentStyle={styles.tooltip.contentStyle}
              labelStyle={embedded ? { color: "hsl(var(--muted-foreground))", marginBottom: "4px" } : { color: "#cbd5e1", marginBottom: "4px" }}
              itemStyle={styles.tooltip.itemStyle}
              formatter={(value: number | undefined) => [`$${value ?? 0}`, ""]}
            />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="rect"
              wrapperStyle={styles.legendStyle}
            />
            <Bar
              name="Before Upgrade"
              dataKey="before"
              fill="#ef4444"
              radius={[4, 4, 0, 0]}
              barSize={40}
              animationDuration={300}
            />
            <Bar
              name="After Upgrade"
              dataKey="after"
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
              barSize={40}
              animationDuration={300}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className={embedded ? "mt-8 max-w-2xl mx-auto" : "mt-12 max-w-2xl mx-auto"}>
        <div
          className={
            embedded
              ? "bg-secondary/30 border border-border rounded-xl p-6"
              : "bg-slate-800/40 border border-slate-700/50 rounded-xl p-6"
          }
        >
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <label
                className={
                  embedded
                    ? "text-sm font-medium text-foreground"
                    : "text-sm font-medium text-slate-300"
                }
                htmlFor="savings-slider"
              >
                Upgrade Savings (%)
              </label>
              <span className="text-2xl font-bold text-primary tabular-nums">
                {savings}%
              </span>
            </div>
            <Slider
              id="savings-slider"
              aria-label="Upgrade savings percentage"
              value={[savings]}
              onValueChange={(value) => setSavings(value[0])}
              min={0}
              max={80}
              step={1}
              className="w-full"
            />
            <div
              className={
                embedded
                  ? "flex justify-between text-xs text-muted-foreground mt-2"
                  : "flex justify-between text-xs text-slate-500 mt-2"
              }
            >
              <span>0%</span>
              <span>80%</span>
            </div>
          </div>

          <div
            className={
              embedded
                ? "grid grid-cols-3 gap-4 pt-6 border-t border-border"
                : "grid grid-cols-3 gap-4 pt-6 border-t border-slate-700/50"
            }
          >
            <div className="text-center">
              <div className={embedded ? "text-xs text-muted-foreground mb-1" : "text-xs text-slate-400 mb-1"}>
                Total Before
              </div>
              <div className="text-xl font-bold text-destructive tabular-nums">
                ${totals.before.toLocaleString()}
              </div>
            </div>
            <div className="text-center">
              <div className={embedded ? "text-xs text-muted-foreground mb-1" : "text-xs text-slate-400 mb-1"}>
                Total After
              </div>
              <div className="text-xl font-bold text-primary tabular-nums">
                ${totals.after.toLocaleString()}
              </div>
            </div>
            <div className="text-center">
              <div className={embedded ? "text-xs text-muted-foreground mb-1" : "text-xs text-slate-400 mb-1"}>
                Total Savings
              </div>
              <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                ${totals.savingsAmount.toLocaleString()}
              </div>
              <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                ({totals.savingsPercent}%)
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  if (embedded) {
    return chartAndSlider;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-6xl bg-slate-900/60 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-8 md:p-12 shadow-2xl">
        <div className="text-center mb-12">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">
            Monthly Energy Cost Reduction
          </h1>
          <p className="text-slate-400 text-base">
            See the difference our solutions make
          </p>
        </div>
        {chartAndSlider}
      </div>
    </div>
  );
}
