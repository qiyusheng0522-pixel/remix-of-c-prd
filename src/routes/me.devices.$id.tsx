import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  Watch,
  Activity,
  Heart,
  Footprints,
  Battery,
  Bluetooth,
  Sparkles,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Calendar,
  Moon,
  Zap,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { MobileLayout } from "@/components/MobileLayout";

export const Route = createFileRoute("/me/devices/$id")({
  head: () => ({
    meta: [
      { title: "设备数据分析 - 蜻蜓健康" },
      { name: "description", content: "查看设备历史数据可视化、多维分析和 AI 建议。" },
    ],
  }),
  component: DeviceDetailPage,
});

type Metric = {
  key: string;
  label: string;
  unit: string;
  icon: typeof Heart;
  color: string;
  current: string;
  trend: number; // pct change
  series: { day: string; value: number }[];
};

type DeviceInfo = {
  name: string;
  type: string;
  icon: typeof Watch;
  battery: number;
  lastSync: string;
  metrics: Metric[];
  hourly: { hour: string; value: number; rest: number }[];
  weekly: { week: string; avg: number; goal: number }[];
  ai: { title: string; level: "good" | "warn" | "alert"; text: string }[];
};

const days7 = ["5/19", "5/20", "5/21", "5/22", "5/23", "5/24", "今日"];

const devices: Record<string, DeviceInfo> = {
  "watch-1": {
    name: "蜻蜓健康手表 Pro",
    type: "智能手表",
    icon: Watch,
    battery: 78,
    lastSync: "1 分钟前",
    metrics: [
      {
        key: "hr",
        label: "静息心率",
        unit: "bpm",
        icon: Heart,
        color: "#ef4444",
        current: "72",
        trend: -2.7,
        series: days7.map((d, i) => ({ day: d, value: [76, 74, 75, 73, 72, 73, 72][i] })),
      },
      {
        key: "steps",
        label: "日步数",
        unit: "步",
        icon: Footprints,
        color: "#10b981",
        current: "5,128",
        trend: 12.4,
        series: days7.map((d, i) => ({ day: d, value: [3200, 4100, 4800, 3900, 5200, 4700, 5128][i] })),
      },
      {
        key: "spo2",
        label: "血氧",
        unit: "%",
        icon: Activity,
        color: "#3b82f6",
        current: "97",
        trend: 0.8,
        series: days7.map((d, i) => ({ day: d, value: [96, 96, 97, 96, 97, 97, 97][i] })),
      },
      {
        key: "sleep",
        label: "睡眠时长",
        unit: "小时",
        icon: Moon,
        color: "#8b5cf6",
        current: "7.4",
        trend: 5.2,
        series: days7.map((d, i) => ({ day: d, value: [6.5, 7.0, 7.2, 6.8, 7.5, 7.3, 7.4][i] })),
      },
    ],
    hourly: [
      { hour: "0", value: 62, rest: 60 },
      { hour: "3", value: 58, rest: 60 },
      { hour: "6", value: 65, rest: 60 },
      { hour: "9", value: 88, rest: 60 },
      { hour: "12", value: 92, rest: 60 },
      { hour: "15", value: 84, rest: 60 },
      { hour: "18", value: 102, rest: 60 },
      { hour: "21", value: 76, rest: 60 },
    ],
    weekly: [
      { week: "W1", avg: 3800, goal: 5000 },
      { week: "W2", avg: 4200, goal: 5000 },
      { week: "W3", avg: 4600, goal: 5000 },
      { week: "W4", avg: 4892, goal: 5000 },
    ],
    ai: [
      {
        title: "心率趋势健康",
        level: "good",
        text: "静息心率较上周下降 2.7%，反映心肺耐力提升，继续保持当前步行节奏。",
      },
      {
        title: "傍晚心率偏高",
        level: "warn",
        text: "18:00 前后心率达 102 bpm，建议晚饭后散步控制在 6000 步/小时以下，避免诱发血压波动。",
      },
      {
        title: "运动建议",
        level: "good",
        text: "您距离每日 5000 步目标仅差 128 步，建议睡前在小区再走 10 分钟即可达标，连续达标 7 天可领健康积分。",
      },
    ],
  },
  "bp-1": {
    name: "欧姆龙血压计 U30",
    type: "血压计",
    icon: Activity,
    battery: 60,
    lastSync: "今早 07:30",
    metrics: [
      {
        key: "sys",
        label: "收缩压",
        unit: "mmHg",
        icon: TrendingUp,
        color: "#ef4444",
        current: "128",
        trend: -3.0,
        series: days7.map((d, i) => ({ day: d, value: [135, 132, 130, 131, 129, 130, 128][i] })),
      },
      {
        key: "dia",
        label: "舒张压",
        unit: "mmHg",
        icon: TrendingDown,
        color: "#3b82f6",
        current: "82",
        trend: -2.4,
        series: days7.map((d, i) => ({ day: d, value: [86, 85, 83, 84, 83, 82, 82][i] })),
      },
      {
        key: "pulse",
        label: "脉搏",
        unit: "bpm",
        icon: Heart,
        color: "#f59e0b",
        current: "74",
        trend: -1.3,
        series: days7.map((d, i) => ({ day: d, value: [78, 76, 75, 75, 74, 75, 74][i] })),
      },
    ],
    hourly: [
      { hour: "晨起", value: 132, rest: 120 },
      { hour: "早餐后", value: 128, rest: 120 },
      { hour: "午后", value: 124, rest: 120 },
      { hour: "晚饭前", value: 130, rest: 120 },
      { hour: "睡前", value: 126, rest: 120 },
    ],
    weekly: [
      { week: "W1", avg: 135, goal: 130 },
      { week: "W2", avg: 133, goal: 130 },
      { week: "W3", avg: 131, goal: 130 },
      { week: "W4", avg: 129, goal: 130 },
    ],
    ai: [
      {
        title: "血压稳步回落",
        level: "good",
        text: "近 4 周平均收缩压从 135 降至 129 mmHg，提示降压方案有效，建议继续低盐饮食并保持当前用药节奏。",
      },
      {
        title: "晨起血压偏高",
        level: "warn",
        text: "晨起 132 mmHg 仍高于日均，建议起床前先静坐 3 分钟再测量，并复诊确认是否需调整服药时间。",
      },
      {
        title: "用药提醒",
        level: "alert",
        text: "检测到周三晚未上传读数，请确认是否漏服降压药。可在「服务记录」中查看用药日历。",
      },
    ],
  },
};

const colors = {
  good: { bg: "bg-success/10", text: "text-success", icon: Sparkles },
  warn: { bg: "bg-warning/10", text: "text-warning", icon: AlertTriangle },
  alert: { bg: "bg-destructive/10", text: "text-destructive", icon: AlertTriangle },
};

function DeviceDetailPage() {
  const { id } = useParams({ from: "/me/devices/$id" });
  const navigate = useNavigate();
  const device = devices[id] ?? devices["watch-1"];
  const Icon = device.icon;
  const [activeMetric, setActiveMetric] = useState(0);
  const [range, setRange] = useState<"7d" | "30d" | "90d">("7d");

  const metric = device.metrics[activeMetric];

  return (
    <MobileLayout>
      <header className="bg-gradient-to-br from-primary to-accent px-5 pb-8 pt-12 text-primary-foreground">
        <button
          onClick={() => navigate({ to: "/me/devices" })}
          className="mb-3 inline-flex items-center gap-1 text-sm opacity-90 active:opacity-70"
        >
          <ArrowLeft className="h-4 w-4" /> 返回设备列表
        </button>
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
            <Icon className="h-7 w-7" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold">{device.name}</h1>
            <p className="mt-0.5 text-sm opacity-90">{device.type}</p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-4 text-xs opacity-90">
          <span className="flex items-center gap-1">
            <Battery className="h-3.5 w-3.5" /> {device.battery}%
          </span>
          <span className="flex items-center gap-1">
            <Bluetooth className="h-3.5 w-3.5" /> 上次同步 {device.lastSync}
          </span>
        </div>
      </header>

      <section className="-mt-4 space-y-4 px-5 pb-8">
        {/* Metric pills */}
        <div className="rounded-2xl bg-card p-4 shadow-card">
          <div className="grid grid-cols-2 gap-2">
            {device.metrics.map((m, i) => {
              const MIcon = m.icon;
              const active = i === activeMetric;
              return (
                <button
                  key={m.key}
                  onClick={() => setActiveMetric(i)}
                  className={`flex items-center gap-2 rounded-xl p-3 text-left transition ${
                    active ? "bg-primary-soft ring-2 ring-primary" : "bg-muted"
                  }`}
                >
                  <MIcon className="h-5 w-5" style={{ color: m.color }} />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">{m.label}</p>
                    <p className="text-base font-bold text-foreground">
                      {m.current}
                      <span className="ml-0.5 text-xs font-normal text-muted-foreground">{m.unit}</span>
                    </p>
                  </div>
                  <span
                    className={`text-xs font-bold ${m.trend < 0 ? "text-success" : "text-warning"}`}
                  >
                    {m.trend > 0 ? "+" : ""}
                    {m.trend}%
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main trend chart */}
        <div className="rounded-2xl bg-card p-4 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold">{metric.label} · 趋势</h2>
              <p className="text-xs text-muted-foreground">{metric.unit}</p>
            </div>
            <div className="flex gap-1 rounded-lg bg-muted p-1 text-xs">
              {(["7d", "30d", "90d"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`rounded-md px-2 py-1 font-bold ${
                    range === r ? "bg-card text-foreground shadow" : "text-muted-foreground"
                  }`}
                >
                  {r === "7d" ? "近7天" : r === "30d" ? "近30天" : "近90天"}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-3 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metric.series}>
                <defs>
                  <linearGradient id={`grad-${metric.key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={metric.color} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={metric.color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" width={32} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid hsl(var(--border))",
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={metric.color}
                  strokeWidth={2.5}
                  fill={`url(#grad-${metric.key})`}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hourly dimension */}
        <div className="rounded-2xl bg-card p-4 shadow-card">
          <h2 className="text-base font-bold">时段分布</h2>
          <p className="text-xs text-muted-foreground">今日 24 小时多维度分析</p>
          <div className="mt-3 h-44">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={device.hourly}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="hour" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" width={32} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid hsl(var(--border))",
                    fontSize: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                  name="实测"
                />
                <Line
                  type="monotone"
                  dataKey="rest"
                  stroke="hsl(var(--muted-foreground))"
                  strokeDasharray="5 5"
                  strokeWidth={1.5}
                  dot={false}
                  name="参考"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly */}
        <div className="rounded-2xl bg-card p-4 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold">周度统计</h2>
              <p className="text-xs text-muted-foreground">达标率 vs 目标</p>
            </div>
            <span className="rounded-full bg-success/15 px-2 py-0.5 text-xs font-bold text-success">
              ↑ 持续提升
            </span>
          </div>
          <div className="mt-3 h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={device.weekly}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="week" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" width={36} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid hsl(var(--border))",
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="avg" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} name="实际" />
                <Bar dataKey="goal" fill="hsl(var(--muted))" radius={[8, 8, 0, 0]} name="目标" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "30 天均值", value: metric.current, icon: Calendar },
            { label: "最高", value: Math.max(...metric.series.map((s) => s.value)).toString(), icon: TrendingUp },
            { label: "最低", value: Math.min(...metric.series.map((s) => s.value)).toString(), icon: TrendingDown },
          ].map((s) => {
            const SIcon = s.icon;
            return (
              <div key={s.label} className="rounded-xl bg-card p-3 text-center shadow-card">
                <SIcon className="mx-auto h-4 w-4 text-primary" />
                <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
                <p className="text-lg font-bold text-foreground">{s.value}</p>
              </div>
            );
          })}
        </div>

        {/* AI advice */}
        <div className="rounded-2xl bg-gradient-to-br from-fuchsia-500 to-purple-600 p-5 text-white shadow-card">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            <h2 className="text-base font-bold">AI 蜻蜓 · 健康建议</h2>
          </div>
          <p className="mt-1 text-xs opacity-90">基于近 7 天 {metric.label} 数据与多维分析</p>
          <div className="mt-3 space-y-2">
            {device.ai.map((a) => {
              const C = colors[a.level];
              const CIcon = C.icon;
              return (
                <div key={a.title} className="rounded-xl bg-white/95 p-3 text-foreground">
                  <div className={`flex items-center gap-2 ${C.text}`}>
                    <CIcon className="h-4 w-4" />
                    <p className="text-sm font-bold">{a.title}</p>
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{a.text}</p>
                </div>
              );
            })}
          </div>
          <button
            onClick={() => navigate({ to: "/chat/xiaoqing" })}
            className="mt-4 flex min-h-[44px] w-full items-center justify-center gap-1.5 rounded-xl bg-white text-sm font-bold text-fuchsia-600 active:scale-[0.99]"
          >
            <Zap className="h-4 w-4" /> 找蜻蜓深度解读
          </button>
        </div>
      </section>
    </MobileLayout>
  );
}
