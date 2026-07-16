import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Trophy, Calendar, Gift, Users } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/circle/events/$id")({
  component: EventDetail,
});

const eventMap: Record<
  string,
  {
    title: string;
    cover: string;
    period: string;
    join: number;
    rule: string[];
    prize: string[];
    status: "进行中" | "已结束";
    summary?: string;
  }
> = {
  "wanbu": {
    title: "万步走 · 邻里挑战",
    cover: "🏃",
    period: "2026-04-01 至 2026-04-30",
    join: 1280,
    status: "进行中",
    rule: [
      "每天累计步数 ≥ 8000 视为达标",
      "每次达标得 1 朵小红花，可在蜻蜓圈晒成绩",
      "月底按累计步数排行评奖",
    ],
    prize: [
      "Top 1-3：限量蜻蜓健康大礼包（价值 ¥ 580）",
      "Top 4-10：营养师定制餐券 ¥ 200",
      "全员达标 20 天：500 健康积分",
    ],
  },
  "spring": {
    title: "春季健步登山赛 · 历届",
    cover: "⛰️",
    period: "2026-03-15 已结束",
    join: 860,
    status: "已结束",
    rule: ["分 5km / 10km 两组", "完赛即获得纪念奖牌"],
    prize: ["Top 3：奖杯 + ¥ 1000 健康基金", "完赛奖：纪念毛巾 + 茶礼"],
    summary: "本届共有 860 人参赛，平均年龄 64 岁，最大年龄 82 岁，全员安全完赛。点击下方查看比赛精彩瞬间。",
  },
};

function EventDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const e = eventMap[id];

  if (!e) {
    return (
      <div className="mx-auto min-h-screen max-w-[480px] bg-gradient-bg p-8 text-center text-muted-foreground">
        赛事不存在
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-[480px] bg-gradient-bg pb-8">
      <header className="bg-gradient-warm px-5 pb-6 pt-12 text-white">
        <button
          onClick={() => navigate({ to: "/circle/events" })}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div className="mt-3 flex items-center gap-3">
          <span className="text-6xl">{e.cover}</span>
          <div>
            <h1 className="text-2xl font-bold">{e.title}</h1>
            <p className="mt-1 flex items-center gap-1.5 text-sm opacity-90">
              <Calendar className="h-4 w-4" />
              {e.period}
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-sm opacity-90">
              <Users className="h-4 w-4" />
              {e.join} 人参与
            </p>
          </div>
        </div>
      </header>

      <section className="px-5 pt-4">
        <h2 className="mb-2 flex items-center gap-2 text-lg font-bold text-foreground">
          <Trophy className="h-5 w-5 text-warning" /> 赛制规则
        </h2>
        <ul className="space-y-1.5 rounded-2xl bg-card p-4 text-base text-foreground shadow-card">
          {e.rule.map((r) => (
            <li key={r}>· {r}</li>
          ))}
        </ul>
      </section>

      <section className="px-5 pt-4">
        <h2 className="mb-2 flex items-center gap-2 text-lg font-bold text-foreground">
          <Gift className="h-5 w-5 text-accent" /> 奖品设置
        </h2>
        <ul className="space-y-1.5 rounded-2xl bg-card p-4 text-base text-foreground shadow-card">
          {e.prize.map((r) => (
            <li key={r}>🎁 {r}</li>
          ))}
        </ul>
      </section>

      {e.summary && (
        <section className="px-5 pt-4">
          <h2 className="mb-2 text-lg font-bold text-foreground">赛事回顾</h2>
          <p className="rounded-2xl bg-success/10 p-4 text-base leading-relaxed text-foreground">{e.summary}</p>
        </section>
      )}

      <div className="mt-6 px-5">
        <button
          onClick={() =>
            e.status === "进行中"
              ? toast.success("已加入赛事！", { description: "每日 8000 步打卡即可计入排名" })
              : toast.success("已查看赛事相册", { description: "为您加载了 18 张精彩瞬间" })
          }
          className="min-h-[56px] w-full rounded-full bg-primary text-lg font-bold text-primary-foreground shadow-elevated active:scale-[0.98]"
        >
          {e.status === "进行中" ? "立即加入挑战" : "查看精彩瞬间"}
        </button>
      </div>
    </div>
  );
}
