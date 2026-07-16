import { createFileRoute } from "@tanstack/react-router";
import { Star, Award, Lock } from "lucide-react";
import { toast } from "sonner";
import { ShareButton } from "@/components/ShareButton";

export const Route = createFileRoute("/circle/stars")({
  component: CircleStars,
});

const stars = [
  {
    name: "李秀兰",
    age: 68,
    title: "本月健康之星",
    avatar: "李",
    story: "坚持太极 5 年，带动 30 位邻居一起锻炼，血压血糖全部稳定。",
    highlights: ["连续打卡 365 天", "组织活动 28 场"],
    exclusives: [
      { name: "李老师太极小课堂", price: 0, slots: "本周日 09:00 · 仅限 12 位", emoji: "🧘‍♀️" },
      { name: "一对一太极指导", price: 199, slots: "可预约下周三/周五", emoji: "👩‍🏫" },
    ],
  },
  {
    name: "张建国",
    age: 71,
    title: "知识达人",
    avatar: "张",
    story: "退休内科医生，每周在驿站开讲座，把专业知识讲得通俗易懂。",
    highlights: ["科普文章 56 篇", "粉丝 1200+"],
    exclusives: [
      { name: "张医生免费义诊", price: 0, slots: "本周六 10:00 · 阳光驿站", emoji: "🩺" },
      { name: "慢病管理付费咨询", price: 99, slots: "线上 30 分钟一对一", emoji: "💬" },
    ],
  },
  {
    name: "陈美玲",
    age: 65,
    title: "运动榜样",
    avatar: "陈",
    story: "从不爱动到月走 30 万步，瘦了 12 斤，膝盖反而更轻松了。",
    highlights: ["万步走 6 个月冠军", "广场舞队队长"],
    exclusives: [
      { name: "广场舞新手公开课", price: 0, slots: "每周三 19:00 · 中心广场", emoji: "💃" },
      { name: "陈姐减重训练营", price: 299, slots: "21 天打卡课程", emoji: "🔥" },
    ],
  },
];

function CircleStars() {
  return (
    <div className="space-y-3">
      {stars.map((s) => (
        <article key={s.name} className="rounded-2xl bg-card p-4 shadow-card">
          <header className="mb-3 flex items-center gap-3">
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-warm text-2xl font-bold text-white">
              {s.avatar}
              <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white shadow-card">
                <Star className="h-4 w-4 fill-current" />
              </span>
            </div>
            <div className="flex-1">
              <p className="text-lg font-bold text-foreground">
                {s.name}{" "}
                <span className="text-sm font-normal text-muted-foreground">· {s.age}岁</span>
              </p>
              <p className="flex items-center gap-1 text-sm font-semibold text-primary">
                <Award className="h-4 w-4" /> {s.title}
              </p>
            </div>
            <ShareButton variant="icon" title={`${s.name} · ${s.title}`} desc={s.story} />
          </header>

          <p className="mb-3 text-base leading-relaxed text-foreground">{s.story}</p>

          <div className="mb-3 flex flex-wrap gap-2">
            {s.highlights.map((h) => (
              <span
                key={h}
                className="rounded-full bg-secondary/20 px-3 py-1 text-sm font-medium text-foreground"
              >
                {h}
              </span>
            ))}
          </div>

          {/* 名人专属活动 */}
          <div className="rounded-xl bg-primary-soft p-3">
            <p className="mb-2 flex items-center gap-1.5 text-sm font-bold text-primary">
              ⭐ {s.name} 的专属活动
            </p>
            <div className="space-y-2">
              {s.exclusives.map((ex) => (
                <button
                  key={ex.name}
                  onClick={() =>
                    toast.success(`已为您预留：${ex.name}`, {
                      description: `${ex.slots} · ${ex.price === 0 ? "免费" : "¥" + ex.price}`,
                    })
                  }
                  className="flex w-full items-center gap-3 rounded-xl bg-card p-3 text-left active:scale-[0.98]"
                >
                  <span className="text-2xl">{ex.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-foreground">{ex.name}</p>
                    <p className="text-xs text-muted-foreground">{ex.slots}</p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${
                      ex.price === 0
                        ? "bg-success/15 text-success"
                        : "bg-accent/15 text-accent"
                    }`}
                  >
                    {ex.price === 0 ? (
                      "免费"
                    ) : (
                      <span className="flex items-center gap-0.5">
                        <Lock className="h-3 w-3" />¥{ex.price}
                      </span>
                    )}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => toast(`已关注 ${s.name}`, { description: "TA 发布的新活动会第一时间通知您" })}
            className="mt-3 min-h-[48px] w-full rounded-full border-2 border-primary text-base font-bold text-primary active:scale-[0.98]"
          >
            关注 TA
          </button>
        </article>
      ))}
    </div>
  );
}
