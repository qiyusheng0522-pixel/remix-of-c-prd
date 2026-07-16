import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Gift, Coins, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { MobileLayout } from "@/components/MobileLayout";

export const Route = createFileRoute("/me/points")({
  head: () => ({
    meta: [
      { title: "积分商城 - 蜻蜓健康" },
      { name: "description", content: "用健康积分兑换好礼。" },
    ],
  }),
  component: PointsPage,
});

const earnTasks: {
  label: string;
  points: number;
  done: boolean;
  to: "/health/checkin" | "/health/records" | "/circle/activities" | "/me/family";
}[] = [
  { label: "今日打卡", points: 10, done: true, to: "/health/checkin" },
  { label: "上传一次血压记录", points: 20, done: true, to: "/health/records" },
  { label: "参与一次社区活动", points: 50, done: false, to: "/circle/activities" },
  { label: "邀请好友加入", points: 100, done: false, to: "/me/family" },
];

const goods = [
  { id: "g1", name: "金龙鱼食用油 5L", points: 1200, emoji: "🛢️", stock: "库存 23" },
  { id: "g2", name: "雀巢中老年奶粉", points: 800, emoji: "🥛", stock: "库存 56" },
  { id: "g3", name: "蜻蜓体检卡 198 元", points: 1980, emoji: "🩺", stock: "限量 20" },
  { id: "g4", name: "驿站推拿券 60 分钟", points: 600, emoji: "💆", stock: "库存充足" },
  { id: "g5", name: "蜻蜓周边帆布包", points: 300, emoji: "👜", stock: "库存 88" },
  { id: "g6", name: "营养早餐券 ×5", points: 500, emoji: "🥗", stock: "库存 40" },
];

const records = [
  { date: "4 月 16 日", desc: "兑换 · 营养早餐券", change: -500 },
  { date: "4 月 16 日", desc: "签到打卡", change: +10 },
  { date: "4 月 15 日", desc: "完成血压记录", change: +20 },
  { date: "4 月 14 日", desc: "参加太极活动", change: +50 },
];

function PointsPage() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(2680);
  const [view, setView] = useState<"shop" | "history">("shop");

  const exchange = (g: (typeof goods)[number]) => {
    if (balance < g.points) {
      toast.error("积分不足", { description: `还差 ${g.points - balance} 积分` });
      return;
    }
    setBalance((b) => b - g.points);
    toast.success(`兑换成功 · ${g.name}`, { description: "请到「我的订单」查看物流" });
  };

  return (
    <MobileLayout>
      <header className="flex items-center gap-3 bg-gradient-warm px-5 pb-4 pt-12 text-white">
        <button
          onClick={() => navigate({ to: "/me" })}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 hover:bg-white/30"
          aria-label="返回"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-bold">积分商城</h1>
      </header>

      <section className="bg-gradient-warm px-5 pb-8 pt-2 text-white">
        <div className="flex items-end gap-2">
          <Coins className="h-7 w-7" />
          <span className="text-5xl font-bold leading-none">{balance.toLocaleString()}</span>
          <span className="mb-1 text-sm opacity-90">可用积分</span>
        </div>
        <p className="mt-2 text-xs opacity-90">积分有效期至 2027-04-17</p>
      </section>

      <section className="-mt-5 px-5">
        <div className="rounded-2xl bg-card p-4 shadow-card">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-bold">每日任务赚积分</h2>
            <span className="text-xs text-muted-foreground">已完成 2/4</span>
          </div>
          <div className="space-y-2">
            {earnTasks.map((t) => (
              <div key={t.label} className="flex items-center justify-between rounded-xl bg-muted px-3 py-2.5">
                <div>
                  <p className="text-sm font-medium">{t.label}</p>
                  <p className="text-xs text-warning">+{t.points} 积分</p>
                </div>
                {t.done ? (
                  <span className="rounded-full bg-success/15 px-3 py-1 text-xs font-bold text-success">已完成</span>
                ) : (
                  <button
                    onClick={() => navigate({ to: t.to })}
                    className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground active:scale-95"
                  >
                    去完成
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mt-4 flex gap-2 px-5">
        <button
          onClick={() => setView("shop")}
          className={`flex-1 rounded-xl py-2.5 text-sm font-bold ${view === "shop" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground shadow-card"}`}
        >
          🎁 兑换好礼
        </button>
        <button
          onClick={() => setView("history")}
          className={`flex-1 rounded-xl py-2.5 text-sm font-bold ${view === "history" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground shadow-card"}`}
        >
          📜 积分明细
        </button>
      </div>

      {view === "shop" && (
        <section className="grid grid-cols-2 gap-3 px-5 py-4">
          {goods.map((g) => (
            <article key={g.id} className="rounded-2xl bg-card p-3 shadow-card">
              <div className="flex h-24 items-center justify-center rounded-xl bg-muted text-5xl">{g.emoji}</div>
              <h3 className="mt-2 text-sm font-bold leading-tight">{g.name}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{g.stock}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="flex items-center gap-0.5 text-base font-bold text-warning">
                  <Coins className="h-4 w-4" />
                  {g.points}
                </span>
                <button
                  onClick={() => exchange(g)}
                  className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground active:scale-95"
                >
                  兑换
                </button>
              </div>
            </article>
          ))}
        </section>
      )}

      {view === "history" && (
        <section className="space-y-2 px-5 py-4">
          {records.map((r, i) => (
            <div key={i} className="flex items-center justify-between rounded-xl bg-card px-4 py-3 shadow-card">
              <div>
                <p className="text-sm font-bold">{r.desc}</p>
                <p className="text-xs text-muted-foreground">{r.date}</p>
              </div>
              <span className={`text-base font-bold ${r.change > 0 ? "text-success" : "text-destructive"}`}>
                {r.change > 0 ? "+" : ""}
                {r.change}
              </span>
            </div>
          ))}
        </section>
      )}
    </MobileLayout>
  );
}
