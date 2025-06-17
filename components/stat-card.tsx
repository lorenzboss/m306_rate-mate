import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import React from "react";

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  color = "violet",
}: {
  title: string;
  value: string | number;
  icon: any;
  trend?: "up" | "down" | "neutral";
  color?: "violet" | "green" | "blue" | "orange";
}) {
  const colorClasses = {
    violet: "from-violet-500 to-purple-600",
    green: "from-green-500 to-emerald-600",
    blue: "from-blue-500 to-cyan-600",
    orange: "from-orange-500 to-red-500",
  };

  const trendIcon =
    trend === "up" ? ArrowUpRight : trend === "down" ? ArrowDownRight : null;
  const TrendIcon = trendIcon;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/20 bg-white/70 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <p className="text-3xl font-bold text-slate-900">{value}</p>
        </div>
        <div
          className={`rounded-xl bg-gradient-to-br p-3 ${colorClasses[color]} shadow-lg`}
        >
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
      {TrendIcon && (
        <div className="absolute top-4 right-4">
          <TrendIcon
            className={`h-4 w-4 ${trend === "up" ? "text-green-500" : "text-red-500"}`}
          />
        </div>
      )}
    </div>
  );
}
