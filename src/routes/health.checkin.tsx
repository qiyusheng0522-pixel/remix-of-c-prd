import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Check, Pill, GlassWater, Footprints, UtensilsCrossed, Heart, Moon } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/health/checkin")({
  head: () => ({
    meta: [
      { title: "每日打卡 - 蜻蜓健康" },
      { name: "description", content: "依据健康方案完成每日多项打卡。" },
    ],
  }),
  component: CheckIn,
});

type Item = {
  key: string;
  label: string;
  source: string;
  icon: typeof Pill;
  target: string;
  bg: string;
  color: string;
  initialDone: number;
  total: number;
};

const initialItems: Item[] = [
  {
    key: "med",
    label: "服药",
    source: "健康方案 · 高血压",
    icon: Pill,
    target: "苯磺酸氨氯地平 早 1 次",
    bg: "bg-destructive/10",
    color: "text-destructive",
    initialDone: 1,
    total: 1,
  },
  {
    key: "water",
    label: "喝水",
    source: "健康方案 · 饮食",
    icon: GlassWater,
    target: "每日 8 杯（1500ml）",
    bg: "bg-primary-soft",
    color: "text-primary",
    initialDone: 4,
    total: 8,
  },
  {
    key: "walk",
    label: "健步走",
    source: "健康方案 · 运动",
    icon: Footprints,
    target: "每日 8000 步",
    bg: "bg-success/15",
    color: "text-success",
    initialDone: 0,
    total: 1,
  },
  {
    key: "meal",
    label: "三餐打卡",
    source: "健康方案 · 饮食",
    icon: UtensilsCrossed,
    target: "拍照记录早中晚",
    bg: "bg-warning/15",
    color: "text-warning",
    initialDone: 2,
    total: 3,
  },
  {
    key: "bp",
    label: "测血压",
    source: "健康方案 · 慢病",
    icon: Heart,
    target: "晨起 + 睡前各 1 次",
    bg: "bg-destructive/10",
    color: "text-destructive",
    initialDone: 1,
    total: 2,
  },
  {
    key: "sleep",
    label: "睡眠",
    source: "健康方案 · 作息",
    icon: Moon,
    target: "23:00 前入睡 · 7 小时",
    bg: "bg-accent-soft",
    color: "text-accent",
    initialDone: 0,
    total: 1,
  },
];

const members = [
  { name: "张大爷", done: true, avatar: "👴" },
  { name: "李阿姨(我)", done: false, avatar: "👵" },
  { name: "王叔叔", done: true, avatar: "🧓" },
];

function CheckIn() {
  const [items, setItems] = useState(
    initialItems.map((i) => ({ ...i, done: i.initialDone })),
  );
  const [days] = useState(12);

  const handleTick = (key: string) => {
    setItems((prev) =>
      prev.map((it) => {
        if (it.key !== key) return it;
        if (it.done >= it.total) {
          toast(`${it.label} 今日已完成`, { description: "明天继续坚持～" });
          return it;
        }
        const next = it.done + 1;
        toast.success(`${it.label} 打卡成功`, {
          description: next >= it.total ? `今日 ${it.label} 已完成 🎉` : `进度 ${next}/${it.total}`,
        });
        return { ...it, done: next };
      }),
    );
  };

  const allDone = items.every((i) => i.done >= i.total);
  const progress = items.reduce((s, i) => s + i.done, 0);
  const totalProg = items.reduce((s, i) => s + i.total, 0);

  return (
    <div className="mx-auto min-h-screen max-w-[480px] bg-gradient-bg pb-8">
      <header className="bg-gradient-primary px-5 pb-12 pt-12 text-primary-foreground">
        <Link
          to="/health"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm"
        >
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="mt-4 text-3xl font-bold">每日打卡</h1>
        <p className="mt-1 text-base opacity-90">
          打卡内容来自您的「健康方案」，连续坚持 {days} 天
        </p>

        <div className="mt-4 rounded-2xl bg-white/15 p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between text-sm">
            <span>今日整体进度</span>
            <span className="font-bold">
              {progress} / {totalProg}
            </span>
          </div>
          <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/25">
            <div
              className="h-full rounded-full bg-white transition-all"
              style={{ width: `${(progress / totalProg) * 100}%` }}
            />
          </div>
          {allDone && (
            <p className="mt-2 text-sm font-semibold">🎉 今日打卡全部完成，太棒啦！</p>
          )}
        </div>
      </header>

      {/* 多项目打卡 */}
      <section className="-mt-6 px-5">
        <div className="grid grid-cols-2 gap-3">
          {items.map((it) => {
            const Icon = it.icon;
            const done = it.done >= it.total;
            return (
              <button
                key={it.key}
                onClick={() => handleTick(it.key)}
                className={`flex flex-col items-start rounded-2xl bg-card p-4 text-left shadow-card active:scale-[0.98] ${
                  done ? "ring-2 ring-success" : ""
                }`}
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${it.bg}`}>
                  <Icon className={`h-6 w-6 ${it.color}`} />
                </div>
                <p className="mt-2 text-base font-bold text-foreground">{it.label}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{it.target}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">📋 {it.source}</p>
                <div className="mt-2 flex w-full items-center justify-between">
                  <span className={`text-sm font-bold ${done ? "text-success" : "text-primary"}`}>
                    {it.done}/{it.total}
                  </span>
                  {done ? (
                    <Check className="h-5 w-5 text-success" strokeWidth={3} />
                  ) : (
                    <span className="rounded-full bg-primary px-3 py-0.5 text-xs font-bold text-primary-foreground">
                      打卡 +1
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 小组成员 */}
      <section className="mt-6 px-5">
        <h2 className="mb-3 text-xl font-bold text-foreground">小组成员（健步走小队）</h2>
        <div className="grid grid-cols-3 gap-3">
          {members.map((m) => (
            <div
              key={m.name}
              className="flex flex-col items-center rounded-2xl bg-card p-4 shadow-card"
            >
              <div className="relative">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-soft text-3xl">
                  {m.avatar}
                </div>
                {m.done && (
                  <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-success ring-4 ring-card">
                    <Check className="h-4 w-4 text-white" strokeWidth={3} />
                  </div>
                )}
              </div>
              <p className="mt-2 text-sm font-bold text-foreground">{m.name}</p>
              <p
                className={`mt-0.5 text-xs font-semibold ${
                  m.done ? "text-success" : "text-muted-foreground"
                }`}
              >
                {m.done ? "已打卡" : "未打卡"}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 跳转健康方案 */}
      <section className="mt-6 px-5">
        <Link
          to="/health/plan"
          className="block rounded-2xl border-2 border-dashed border-primary/40 bg-primary-soft p-4 text-center"
        >
          <p className="text-base font-bold text-primary">查看完整健康方案</p>
          <p className="mt-1 text-sm text-muted-foreground">
            打卡项目由方案动态生成 · 已根据您的最新档案更新
          </p>
        </Link>
      </section>
    </div>
  );
}
