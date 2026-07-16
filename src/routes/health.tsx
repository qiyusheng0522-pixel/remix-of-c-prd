import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import {
  FileHeart, Sparkles, ClipboardCheck, ChevronRight, TrendingUp, HeartPulse, Lightbulb,
  UtensilsCrossed, Camera, Salad, Activity, Video, Shield, Users, MessageCircle,
  Moon, HeartHandshake, Stethoscope, Pill, ScanLine, Watch, HeartHandshake as Family, Puzzle, Leaf,
} from "lucide-react";
import { MobileLayout } from "@/components/MobileLayout";
import { ShareButton } from "@/components/ShareButton";

export const Route = createFileRoute("/health")({
  head: () => ({
    meta: [
      { title: "健康中心 - 蜻蜓健康" },
      { name: "description", content: "您的专属健康档案、健康方案和每日打卡。" },
    ],
  }),
  component: HealthRoot,
});

function HealthRoot() {
  const location = useLocation();
  // 子路由（/health/xxx）由 Outlet 渲染；/health 本身渲染中心页
  if (location.pathname !== "/health") {
    return <Outlet />;
  }
  return <HealthHome />;
}

const entries = [
  {
    to: "/health/records" as const,
    icon: FileHeart,
    title: "健康档案",
    desc: "查看血压、血糖等健康指标",
    color: "from-teal-400 to-cyan-500",
  },
  {
    to: "/health/plan" as const,
    icon: Sparkles,
    title: "健康方案",
    desc: "为您定制的运动和饮食方案",
    color: "from-orange-400 to-amber-500",
  },
  {
    to: "/health/checkin" as const,
    icon: ClipboardCheck,
    title: "每日打卡",
    desc: "和邻居一起坚持好习惯",
    color: "from-green-400 to-emerald-500",
  },
];

function HealthHome() {
  return (
    <MobileLayout>
      {/* 顶部健康分卡片 */}
      <header className="bg-gradient-primary px-5 pb-12 pt-12 text-primary-foreground">
        <h1 className="text-3xl font-bold">健康中心</h1>
        <p className="mt-1 text-base opacity-90">您今天的健康状态</p>

        <div className="mt-5 rounded-3xl bg-white/15 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base opacity-90">健康分</p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-5xl font-bold">85</span>
                <span className="text-base opacity-90">/ 100</span>
              </div>
              <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-white/25 px-3 py-1 text-sm font-semibold">
                <TrendingUp className="h-4 w-4" />
                较上周 +3 分
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <HeartPulse className="h-14 w-14 fill-white/20 text-white" strokeWidth={1.8} />
              <ShareButton
                variant="pill"
                label="晒健康分"
                title="我的健康分 85 分，超越同龄人 78%"
                desc="蜻蜓为我生成：连续打卡 28 天，血压稳定，睡眠提升 8%。健康路上一起加油！"
                className="bg-white/25 text-white"
              />
            </div>
          </div>

          {/* 三维度迷你条 */}
          <div className="mt-5 space-y-3">
            {[
              { label: "基础指标", value: 30, max: 30, color: "bg-success" },
              { label: "生活习惯", value: 25, max: 30, color: "bg-warning" },
              { label: "健康管理", value: 30, max: 40, color: "bg-white" },
            ].map((d) => (
              <div key={d.label}>
                <div className="mb-1 flex justify-between text-sm font-medium">
                  <span>{d.label}</span>
                  <span>
                    {d.value}/{d.max}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/25">
                  <div
                    className={`h-full rounded-full ${d.color}`}
                    style={{ width: `${(d.value / d.max) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* 三大核心入口 */}
      <section className="-mt-6 space-y-4 px-5">
        {entries.map((e) => {
          const Icon = e.icon;
          return (
            <Link
              key={e.to}
              to={e.to}
              className="flex items-center gap-4 rounded-2xl bg-card p-5 shadow-card transition-transform active:scale-[0.98]"
            >
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${e.color} shadow-soft`}
              >
                <Icon className="h-8 w-8 text-white" strokeWidth={2.2} />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-foreground">{e.title}</h2>
                <p className="mt-1 text-base text-muted-foreground">{e.desc}</p>
              </div>
              <ChevronRight className="h-6 w-6 text-muted-foreground" />
            </Link>
          );
        })}
      </section>

      {/* 全部服务 · 20 大功能模块 */}
      <section className="mt-6 px-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">全部服务</h2>
          <span className="text-xs text-muted-foreground">20 个模块 · 全场景陪伴</span>
        </div>
        {allModules.map((group) => (
          <div key={group.title} className="mb-5">
            <p className="mb-2 text-sm font-semibold text-muted-foreground">{group.title}</p>
            <div className="grid grid-cols-4 gap-3 rounded-2xl bg-card p-4 shadow-card">
              {group.items.map((m) => {
                const I = m.icon;
                return (
                  <Link
                    key={m.label}
                    to={m.to}
                    className="flex flex-col items-center gap-1.5 rounded-xl py-2 active:scale-95"
                  >
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${m.bg}`}>
                      <I className={`h-6 w-6 ${m.color}`} strokeWidth={2} />
                    </div>
                    <span className="text-center text-xs font-medium text-foreground leading-tight">
                      {m.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </section>

      {/* 蜻蜓提示 */}
      <section className="mt-2 px-5 pb-4">
        <div className="rounded-2xl border-2 border-dashed border-primary/30 bg-primary-soft p-4">
          <p className="flex items-center gap-1.5 text-base font-semibold text-primary">
            <Lightbulb className="h-4 w-4" /> 蜻蜓建议
          </p>
          <p className="mt-1 text-base leading-relaxed text-foreground">
            您的水分摄入有点不足，今天记得多喝两杯温水哦～
          </p>
        </div>
      </section>
    </MobileLayout>
  );
}

const allModules: {
  title: string;
  items: { icon: typeof FileHeart; label: string; to: string; color: string; bg: string }[];
}[] = [
  {
    title: "数据底座 · 档案与设备",
    items: [
      { icon: FileHeart, label: "健康档案", to: "/health/records", color: "text-primary", bg: "bg-primary-soft" },
      { icon: ScanLine, label: "病历识别", to: "/health/ocr", color: "text-cyan-600", bg: "bg-cyan-100" },
      { icon: Watch, label: "智能设备", to: "/me/devices", color: "text-accent", bg: "bg-accent-soft" },
      { icon: ClipboardCheck, label: "我的量表", to: "/me/scales", color: "text-violet-600", bg: "bg-violet-100" },
    ],
  },
  {
    title: "陪吃 · 营养饮食",
    items: [
      { icon: Sparkles, label: "饮食方案", to: "/health/plan", color: "text-orange-500", bg: "bg-orange-100" },
      { icon: Camera, label: "AI 拍菜", to: "/health/meal", color: "text-amber-600", bg: "bg-amber-100" },
      { icon: UtensilsCrossed, label: "智慧食堂", to: "/health/canteen", color: "text-rose-500", bg: "bg-rose-100" },
      { icon: ClipboardCheck, label: "每日打卡", to: "/health/checkin", color: "text-success", bg: "bg-success/10" },
    ],
  },
  {
    title: "陪动 · 运动与安全",
    items: [
      { icon: Activity, label: "运动处方", to: "/health/plan", color: "text-emerald-600", bg: "bg-emerald-100" },
      { icon: Video, label: "视频跟练", to: "/health/workout", color: "text-teal-600", bg: "bg-teal-100" },
      { icon: Shield, label: "安全监护", to: "/health/safety", color: "text-red-500", bg: "bg-red-100" },
      { icon: Activity, label: "康复跟踪", to: "/health/rehab", color: "text-teal-500", bg: "bg-teal-100" },
    ],
  },
  {
    title: "陪玩 · 蜻蜓圈",
    items: [
      { icon: Puzzle, label: "解闷小游戏", to: "/games", color: "text-rose-500", bg: "bg-rose-100" },
      { icon: Users, label: "社区活动", to: "/circle/activities", color: "text-primary", bg: "bg-primary-soft" },
      { icon: Sparkles, label: "赛事", to: "/circle/events", color: "text-amber-500", bg: "bg-amber-100" },
      { icon: MessageCircle, label: "名人", to: "/circle/stars", color: "text-fuchsia-500", bg: "bg-fuchsia-100" },
      { icon: MessageCircle, label: "蜻蜓圈", to: "/circle", color: "text-accent", bg: "bg-accent-soft" },
    ],
  },
  {
    title: "陪睡 · 陪心 · 身心养护",
    items: [
      { icon: Moon, label: "智慧睡眠", to: "/health/sleep", color: "text-indigo-600", bg: "bg-indigo-100" },
      { icon: HeartHandshake, label: "心理健康", to: "/health/mind", color: "text-pink-500", bg: "bg-pink-100" },
      { icon: Leaf, label: "数字中医人", to: "/health/tcm", color: "text-emerald-600", bg: "bg-emerald-100" },
    ],
  },
  {
    title: "陪看病 · 全病程",
    items: [
      { icon: Stethoscope, label: "在线问诊", to: "/health/consult", color: "text-sky-600", bg: "bg-sky-100" },
      { icon: HeartHandshake, label: "陪诊服务", to: "/health/consult", color: "text-violet-600", bg: "bg-violet-100" },
      { icon: Family, label: "家人代管", to: "/me/family", color: "text-destructive", bg: "bg-destructive/10" },
      { icon: Sparkles, label: "叙事报告", to: "/health/report", color: "text-fuchsia-600", bg: "bg-fuchsia-100" },
    ],
  },
];
