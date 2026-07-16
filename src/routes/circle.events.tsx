import { createFileRoute, Link } from "@tanstack/react-router";
import { Trophy, Footprints, Flame, ChevronRight, History } from "lucide-react";
import { ShareButton } from "@/components/ShareButton";
import coverWalk from "@/assets/cover-walk-challenge.jpg";
import coverHike from "@/assets/cover-spring-hike.jpg";

export const Route = createFileRoute("/circle/events")({
  component: CircleEvents,
});

const ranking = [
  { rank: 1, name: "李秀兰", steps: 12480, badge: "🥇" },
  { rank: 2, name: "陈美玲", steps: 11320, badge: "🥈" },
  { rank: 3, name: "张建国", steps: 10870, badge: "🥉" },
  { rank: 4, name: "王阿姨（您）", steps: 8326, badge: "" },
  { rank: 5, name: "刘玉芳", steps: 7950, badge: "" },
  { rank: 6, name: "赵长河", steps: 7210, badge: "" },
];

const history = [
  { id: "spring", title: "春季健步登山赛", date: "2026-03", join: 860, prize: "¥1000 健康基金", cover: coverHike },
];

function CircleEvents() {
  return (
    <div className="space-y-4">
      {/* 当前赛事 */}
      <Link
        to="/circle/events/$id"
        params={{ id: "wanbu" }}
        className="relative block overflow-hidden rounded-2xl text-white shadow-elevated active:scale-[0.99]"
      >
        <img
          src={coverWalk}
          alt="万步走 邻里挑战"
          width={1024}
          height={576}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-accent/85 via-accent/60 to-primary/70" />
        <div className="relative p-5">
          <div className="mb-2 flex items-center gap-2">
            <Trophy className="h-6 w-6" />
            <span className="text-sm font-semibold uppercase tracking-wide">本月赛事</span>
            <span onClick={(e) => e.preventDefault()} className="ml-auto">
              <ShareButton variant="icon" title="万步走 · 邻里挑战" desc="每天 8000 步，月底前 10 名得健康礼包" className="bg-white/30 text-white" />
            </span>
          </div>
          <h2 className="text-2xl font-bold drop-shadow">万步走 · 邻里挑战</h2>
          <p className="mt-1 text-base opacity-95">每天 8000 步打卡，月底前 10 名得健康礼包</p>
          <div className="mt-4 flex items-center justify-between rounded-2xl bg-white/25 p-3 backdrop-blur-sm">
            <div>
              <p className="text-xs opacity-90">您今日步数</p>
              <p className="text-2xl font-bold">8,326</p>
            </div>
            <div className="text-right">
              <p className="text-xs opacity-90">当前排名</p>
              <p className="text-2xl font-bold">第 4 名</p>
            </div>
          </div>
        </div>
      </Link>

      {/* 排行榜 */}
      <section className="rounded-2xl bg-card p-4 shadow-card">
        <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-foreground">
          <Footprints className="h-5 w-5 text-primary" />
          实时排行榜
        </h3>
        <ul className="divide-y divide-border">
          {ranking.map((r) => {
            const me = r.name.includes("您");
            return (
              <li
                key={r.rank}
                className={`flex items-center gap-3 py-3 ${me ? "rounded-xl bg-primary/10 px-2" : ""}`}
              >
                <span className="w-8 text-center text-lg font-bold text-foreground">
                  {r.badge || r.rank}
                </span>
                <span className={`flex-1 text-base ${me ? "font-bold text-primary" : "text-foreground"}`}>
                  {r.name}
                </span>
                <span className="flex items-center gap-1 text-base font-semibold text-foreground">
                  <Flame className="h-4 w-4 text-destructive" />
                  {r.steps.toLocaleString()}
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      {/* 历届赛事 */}
      <section>
        <h3 className="mb-2 flex items-center gap-2 text-lg font-bold text-foreground">
          <History className="h-5 w-5 text-muted-foreground" />
          历届赛事
        </h3>
        <div className="space-y-2">
          {history.map((h) => (
            <div key={h.id} className="relative">
              <Link
                to="/circle/events/$id"
                params={{ id: h.id }}
                className="flex items-center gap-3 rounded-2xl bg-card p-3 shadow-card active:scale-[0.99]"
              >
                <img
                  src={h.cover}
                  alt={h.title}
                  width={1024}
                  height={576}
                  loading="lazy"
                  className="h-16 w-20 flex-shrink-0 rounded-xl object-cover grayscale"
                />
                <div className="flex-1">
                  <p className="text-base font-bold text-foreground">{h.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {h.date} · {h.join} 人参与 · 奖金 {h.prize}
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </Link>
              <div className="absolute right-2 top-2">
                <ShareButton variant="icon" title={h.title} desc={`${h.date} · ${h.join} 人参与`} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
