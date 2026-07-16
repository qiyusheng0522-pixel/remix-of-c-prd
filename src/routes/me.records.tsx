import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  Star,
  Sparkles,
  ChevronRight,
  Upload,
  UtensilsCrossed,
  Activity,
  CalendarHeart,
  TrendingUp,
  TrendingDown,
  ThumbsUp,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/me/records")({
  head: () => ({
    meta: [
      { title: "我的服务记录 - 蜻蜓健康" },
      { name: "description", content: "线下服务、用餐和活动数据回传，自动分析您的偏好并给出建议。" },
    ],
  }),
  component: MeRecords,
});

type Tab = "diet" | "exercise" | "activity" | "service";

const services = [
  { date: "2026-04-15", station: "阳光社区驿站", item: "中医推拿 30 分钟", price: 88, rated: false, star: 0 },
  { date: "2026-04-12", station: "阳光社区驿站", item: "健康检测套餐", price: 30, rated: true, star: 5 },
  { date: "2026-04-08", station: "中央旗舰驿站", item: "全科健康体检", price: 580, rated: true, star: 5 },
  { date: "2026-03-30", station: "幸福里养生驿站", item: "太极入门课", price: 0, rated: true, star: 4 },
];

const meals = [
  { date: "2026-04-15", station: "阳光社区驿站", item: "清蒸鲈鱼套餐", price: 38, cal: 420, tag: "高蛋白", rated: false, star: 0 },
  { date: "2026-04-13", station: "阳光社区驿站", item: "杂粮养生粥 + 凉拌木耳", price: 22, cal: 360, tag: "控糖", rated: true, star: 5 },
  { date: "2026-04-09", station: "中央旗舰驿站", item: "降压养生套餐", price: 88, cal: 450, tag: "低钠", rated: true, star: 5 },
  { date: "2026-04-05", station: "阳光社区驿站", item: "山药排骨汤 + 紫薯小米饭", price: 36, cal: 500, tag: "养胃", rated: true, star: 4 },
  { date: "2026-04-02", station: "阳光社区驿站", item: "时蔬豆腐煲 + 杂粮粥", price: 32, cal: 380, tag: "低脂", rated: true, star: 5 },
  { date: "2026-03-28", station: "幸福里养生驿站", item: "白灼虾 + 蒜蓉西兰花", price: 48, cal: 320, tag: "高蛋白", rated: true, star: 4 },
];

const exercises = [
  { date: "2026-04-15", item: "晨练太极", duration: 45, kcal: 130, station: "阳光驿站团体课" },
  { date: "2026-04-13", item: "公园散步", duration: 50, kcal: 165, station: "自主打卡" },
  { date: "2026-04-12", item: "广场舞", duration: 60, kcal: 220, station: "邻里小队" },
  { date: "2026-04-10", item: "推拿+理疗", duration: 60, kcal: 0, station: "阳光驿站康复" },
  { date: "2026-04-08", item: "晨练太极", duration: 45, kcal: 130, station: "阳光驿站团体课" },
  { date: "2026-04-05", item: "公园散步", duration: 40, kcal: 130, station: "自主打卡" },
];

const activities = [
  { date: "2026-04-14", item: "营养师讲座《老年控糖饮食》", host: "中央旗舰驿站", paid: false, rated: true, star: 5 },
  { date: "2026-04-09", item: "邻里包饺子比赛", host: "阳光社区", paid: false, rated: true, star: 5 },
  { date: "2026-04-02", item: "茶艺体验课", host: "幸福里驿站", paid: true, rated: true, star: 4 },
  { date: "2026-03-26", item: "李医生健康讲座", host: "线上直播", paid: false, rated: false, star: 0 },
];

function MeRecords() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("diet");

  // Diet analysis
  const dietTotalCal = meals.reduce((s, m) => s + m.cal, 0);
  const dietAvgCal = Math.round(dietTotalCal / meals.length);
  const tagCount = meals.reduce<Record<string, number>>((acc, m) => {
    acc[m.tag] = (acc[m.tag] ?? 0) + 1;
    return acc;
  }, {});
  const topTag = Object.entries(tagCount).sort((a, b) => b[1] - a[1])[0];
  const stationCount = meals.reduce<Record<string, number>>((acc, m) => {
    acc[m.station] = (acc[m.station] ?? 0) + 1;
    return acc;
  }, {});
  const favStation = Object.entries(stationCount).sort((a, b) => b[1] - a[1])[0];
  const dietAvgRating = (
    meals.filter((m) => m.rated).reduce((s, m) => s + m.star, 0) /
    meals.filter((m) => m.rated).length
  ).toFixed(1);

  // Exercise analysis
  const exTotalMin = exercises.reduce((s, e) => s + e.duration, 0);
  const exTotalKcal = exercises.reduce((s, e) => s + e.kcal, 0);
  const exItemCount = exercises.reduce<Record<string, number>>((acc, e) => {
    acc[e.item] = (acc[e.item] ?? 0) + 1;
    return acc;
  }, {});
  const favExercise = Object.entries(exItemCount).sort((a, b) => b[1] - a[1])[0];

  // Activity analysis
  const actTotal = activities.length;
  const actFree = activities.filter((a) => !a.paid).length;
  const actRatedAvg = (
    activities.filter((a) => a.rated).reduce((s, a) => s + a.star, 0) /
    activities.filter((a) => a.rated).length
  ).toFixed(1);

  return (
    <div className="mx-auto min-h-screen max-w-[480px] bg-gradient-bg pb-8">
      <header className="bg-gradient-primary px-5 pb-6 pt-12 text-primary-foreground">
        <button
          onClick={() => navigate({ to: "/me" })}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm"
          aria-label="返回"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="mt-3 text-2xl font-bold">服务与生活记录</h1>
        <p className="mt-1 text-sm opacity-90">所有线下数据已自动回传 · 蜻蜓为您分析偏好与建议</p>
      </header>

      {/* 数据回传卡片 */}
      <section className="-mt-3 px-5">
        <button
          onClick={() =>
            toast.success("线下数据已同步", {
              description: "近 30 天 7 次服务、12 次用餐数据已并入档案，方案已重新生成",
            })
          }
          className="flex w-full items-center gap-3 rounded-2xl bg-card p-4 shadow-card active:scale-[0.98]"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary text-white">
            <Upload className="h-6 w-6" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-base font-bold text-foreground">线下数据回传 · 立即同步</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              体检 / 推拿 / 用餐 / 活动 → 健康档案 → 重新生成方案
            </p>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </button>
      </section>

      {/* Tab */}
      <div className="mt-4 px-5">
        <div className="grid grid-cols-4 gap-1 rounded-2xl bg-card p-1.5 shadow-card">
          {(
            [
              { k: "diet", label: "饮食", icon: UtensilsCrossed },
              { k: "exercise", label: "运动", icon: Activity },
              { k: "activity", label: "活动", icon: CalendarHeart },
              { k: "service", label: "服务", icon: Star },
            ] as const
          ).map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.k}
                onClick={() => setTab(t.k)}
                className={cn(
                  "flex flex-col items-center gap-0.5 rounded-xl py-2 text-xs font-bold transition-all",
                  tab === t.k
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "text-muted-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 饮食分析 */}
      {tab === "diet" && (
        <>
          <section className="mt-4 px-5">
            <article className="rounded-2xl bg-gradient-warm p-5 text-white shadow-elevated">
              <p className="flex items-center gap-1.5 text-sm font-medium opacity-90">
                <Sparkles className="h-4 w-4" /> 蜻蜓为您画像 · 近 30 天饮食偏好
              </p>
              <div className="mt-3 grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-2xl font-bold">{meals.length}</p>
                  <p className="mt-0.5 text-xs opacity-90">就餐次数</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{dietAvgCal}</p>
                  <p className="mt-0.5 text-xs opacity-90">平均千卡/餐</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{dietAvgRating}★</p>
                  <p className="mt-0.5 text-xs opacity-90">平均评分</p>
                </div>
              </div>
              <div className="mt-3 rounded-xl bg-white/20 px-3 py-2 text-sm backdrop-blur-sm">
                您最偏爱<b className="px-1">{topTag?.[0]}</b>类菜品（{topTag?.[1]} 次），
                常去<b className="px-1">{favStation?.[0]}</b>用餐。
              </div>
            </article>
          </section>

          <section className="mt-4 px-5">
            <div className="rounded-2xl border-2 border-dashed border-primary/30 bg-primary-soft p-4">
              <p className="flex items-center gap-2 text-sm font-bold text-primary">
                <ThumbsUp className="h-4 w-4" /> 结合您的档案的建议
              </p>
              <ul className="mt-2 space-y-1.5 text-sm text-foreground">
                <li>• 您有高血压，已识别您偏爱「{topTag?.[0]}」，建议增加 1 次/周「低钠」类菜品</li>
                <li>• 单餐平均 {dietAvgCal} 千卡，符合您 BMI 23 的目标摄入</li>
                <li>• 高蛋白菜品摄入良好，可继续保持白灼虾、清蒸鱼等</li>
              </ul>
              <button
                onClick={() => navigate({ to: "/health/plan" })}
                className="mt-3 min-h-[44px] w-full rounded-full bg-primary text-sm font-bold text-primary-foreground active:scale-[0.98]"
              >
                查看为您定制的饮食方案 ›
              </button>
            </div>
          </section>

          <section className="mt-4 px-5">
            <h2 className="mb-2 text-lg font-bold">用餐历史</h2>
            <div className="space-y-2">
              {meals.map((m) => (
                <article key={m.date + m.item} className="rounded-2xl bg-card p-4 shadow-card">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-base font-bold text-foreground">{m.item}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {m.date} · {m.station} · {m.cal}千卡
                      </p>
                      <span className="mt-1 inline-block rounded-full bg-success/15 px-2 py-0.5 text-xs font-bold text-success">
                        {m.tag}
                      </span>
                    </div>
                    <p className="text-base font-bold text-accent">¥{m.price}</p>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    {m.rated ? (
                      <p className="flex items-center gap-1 text-sm text-warning">
                        {"★".repeat(m.star)}
                        <span className="ml-1 text-muted-foreground">已评价</span>
                      </p>
                    ) : (
                      <p className="text-sm font-semibold text-destructive">待您评价</p>
                    )}
                    <button
                      onClick={() =>
                        toast.success(m.rated ? "查看评价" : "评分已提交", {
                          description: m.rated ? `《${m.item}》${m.star}星` : `感谢您给《${m.item}》打分`,
                        })
                      }
                      className="flex items-center gap-1 rounded-full border border-primary px-4 py-1.5 text-sm font-bold text-primary active:scale-95"
                    >
                      <Star className="h-4 w-4" />
                      {m.rated ? "查看" : "去评价"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </>
      )}

      {/* 运动分析 */}
      {tab === "exercise" && (
        <>
          <section className="mt-4 px-5">
            <article className="rounded-2xl bg-gradient-primary p-5 text-primary-foreground shadow-elevated">
              <p className="flex items-center gap-1.5 text-sm font-medium opacity-90">
                <Sparkles className="h-4 w-4" /> 近 30 天运动概览
              </p>
              <div className="mt-3 grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-2xl font-bold">{exercises.length}</p>
                  <p className="mt-0.5 text-xs opacity-90">运动次数</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{exTotalMin}</p>
                  <p className="mt-0.5 text-xs opacity-90">累计分钟</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{exTotalKcal}</p>
                  <p className="mt-0.5 text-xs opacity-90">消耗千卡</p>
                </div>
              </div>
              <div className="mt-3 rounded-xl bg-white/20 px-3 py-2 text-sm backdrop-blur-sm">
                您最喜爱<b className="px-1">{favExercise?.[0]}</b>（{favExercise?.[1]} 次），
                <span className="inline-flex items-center gap-1">
                  <TrendingUp className="h-3.5 w-3.5" /> 较上月 +18%
                </span>
              </div>
            </article>
          </section>

          <section className="mt-4 px-5">
            <div className="rounded-2xl border-2 border-dashed border-success/40 bg-success/10 p-4">
              <p className="flex items-center gap-2 text-sm font-bold text-success">
                <ThumbsUp className="h-4 w-4" /> 个性化建议（北京体育大学科研团队提供）
              </p>
              <ul className="mt-2 space-y-1.5 text-sm text-foreground">
                <li>• 太极对您的高血压有显著帮助，建议保持每周 3 次</li>
                <li>• 散步累计偏少，建议晚餐后增加 20 分钟</li>
                <li>• 注意：剧烈运动前请先测血压，超过 150/95 暂停运动</li>
              </ul>
              <button
                onClick={() => navigate({ to: "/health/plan" })}
                className="mt-3 min-h-[44px] w-full rounded-full bg-success text-sm font-bold text-white active:scale-[0.98]"
              >
                查看个性化运动方案 ›
              </button>
            </div>
          </section>

          <section className="mt-4 px-5">
            <h2 className="mb-2 text-lg font-bold">运动历史</h2>
            <div className="space-y-2">
              {exercises.map((e) => (
                <article key={e.date + e.item} className="flex items-center gap-3 rounded-2xl bg-card p-4 shadow-card">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/15 text-2xl">
                    🏃
                  </div>
                  <div className="flex-1">
                    <p className="text-base font-bold text-foreground">{e.item}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {e.date} · {e.station}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-bold text-foreground">{e.duration} 分钟</p>
                    {e.kcal > 0 && (
                      <p className="text-xs text-muted-foreground">~{e.kcal} 千卡</p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        </>
      )}

      {/* 活动分析 */}
      {tab === "activity" && (
        <>
          <section className="mt-4 px-5">
            <article className="rounded-2xl bg-gradient-to-br from-purple-400 to-pink-500 p-5 text-white shadow-elevated">
              <p className="flex items-center gap-1.5 text-sm font-medium opacity-90">
                <Sparkles className="h-4 w-4" /> 近 30 天活动参与
              </p>
              <div className="mt-3 grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-2xl font-bold">{actTotal}</p>
                  <p className="mt-0.5 text-xs opacity-90">参与次数</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{actFree}</p>
                  <p className="mt-0.5 text-xs opacity-90">免费活动</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{actRatedAvg}★</p>
                  <p className="mt-0.5 text-xs opacity-90">平均评分</p>
                </div>
              </div>
              <div className="mt-3 rounded-xl bg-white/20 px-3 py-2 text-sm backdrop-blur-sm">
                您偏好「健康讲座 + 邻里互动」类型，已为您匹配下周 3 场同类活动
              </div>
            </article>
          </section>

          <section className="mt-4 px-5">
            <div className="rounded-2xl border-2 border-dashed border-accent/40 bg-accent-soft p-4">
              <p className="flex items-center gap-2 text-sm font-bold text-accent">
                <ThumbsUp className="h-4 w-4" /> 推荐活动
              </p>
              <ul className="mt-2 space-y-1.5 text-sm text-foreground">
                <li>• 4 月 22 日《王医生 · 糖尿病随访沙龙》— 与您的内分泌档案匹配</li>
                <li>• 4 月 24 日《邻里太极晨练》— 与您高频运动偏好匹配</li>
                <li>• 4 月 26 日《营养师定制餐试吃会》— 免费 + 控糖菜单</li>
              </ul>
              <button
                onClick={() => navigate({ to: "/circle/activities" })}
                className="mt-3 min-h-[44px] w-full rounded-full bg-accent text-sm font-bold text-accent-foreground active:scale-[0.98]"
              >
                去活动广场看看 ›
              </button>
            </div>
          </section>

          <section className="mt-4 px-5">
            <h2 className="mb-2 text-lg font-bold">参与历史</h2>
            <div className="space-y-2">
              {activities.map((a) => (
                <article key={a.date + a.item} className="rounded-2xl bg-card p-4 shadow-card">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-base font-bold text-foreground">{a.item}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {a.date} · {a.host}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-xs font-bold",
                        a.paid ? "bg-warning/15 text-warning" : "bg-success/15 text-success",
                      )}
                    >
                      {a.paid ? "付费" : "免费"}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    {a.rated ? (
                      <p className="text-sm text-warning">{"★".repeat(a.star)}</p>
                    ) : (
                      <p className="text-sm font-semibold text-destructive">待评价</p>
                    )}
                    <button
                      onClick={() => navigate({ to: "/circle/activities/$id", params: { id: "1" } })}
                      className="flex items-center gap-1 rounded-full border border-primary px-3 py-1 text-xs font-bold text-primary active:scale-95"
                    >
                      查看活动详情
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </>
      )}

      {/* 线下服务 */}
      {tab === "service" && (
        <>
          <section className="mt-4 px-5">
            <article className="rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-500 p-5 text-white shadow-elevated">
              <p className="flex items-center gap-1.5 text-sm font-medium opacity-90">
                <Sparkles className="h-4 w-4" /> 服务消费分析
              </p>
              <div className="mt-3 grid grid-cols-2 gap-3 text-center">
                <div>
                  <p className="text-2xl font-bold">{services.length}</p>
                  <p className="mt-0.5 text-xs opacity-90">服务次数</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">¥{services.reduce((s, x) => s + x.price, 0)}</p>
                  <p className="mt-0.5 text-xs opacity-90">累计消费</p>
                </div>
              </div>
              <div className="mt-3 rounded-xl bg-white/20 px-3 py-2 text-sm backdrop-blur-sm">
                <span className="inline-flex items-center gap-1">
                  <TrendingDown className="h-3.5 w-3.5" /> 较上月 -¥120
                </span>
                ，主要是减少了非必要套餐，结构更健康。
              </div>
            </article>
          </section>

          <section className="mt-4 px-5">
            <h2 className="mb-2 text-lg font-bold">线下服务记录</h2>
            <div className="space-y-2">
              {services.map((s) => (
                <article key={s.date + s.item} className="rounded-2xl bg-card p-4 shadow-card">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-base font-bold text-foreground">{s.item}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {s.date} · {s.station}
                      </p>
                    </div>
                    <p className="text-base font-bold text-accent">
                      {s.price === 0 ? "免费" : `¥${s.price}`}
                    </p>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    {s.rated ? (
                      <p className="flex items-center gap-1 text-sm text-warning">
                        {"★".repeat(s.star)}
                        <span className="ml-1 text-muted-foreground">已评价</span>
                      </p>
                    ) : (
                      <p className="text-sm font-semibold text-destructive">待您评价</p>
                    )}
                    <button
                      onClick={() =>
                        toast.success(s.rated ? "查看评价" : "评分已提交", {
                          description: `《${s.item}》${s.rated ? `${s.star}星` : "感谢您的反馈"}`,
                        })
                      }
                      className="flex items-center gap-1 rounded-full border border-primary px-4 py-1.5 text-sm font-bold text-primary active:scale-95"
                    >
                      <Star className="h-4 w-4" />
                      {s.rated ? "查看" : "去评价"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </>
      )}

      {/* 智能方案重生成 */}
      <section className="mt-5 px-5">
        <div className="rounded-2xl border-2 border-dashed border-primary/30 bg-primary-soft p-4">
          <p className="flex items-center gap-2 text-base font-bold text-primary">
            <Sparkles className="h-5 w-5" />
            蜻蜓已根据您的线下数据更新方案
          </p>
          <p className="mt-1 text-sm leading-relaxed text-foreground">
            最近 1 次体检显示血脂略高，方案已自动加入「Omega-3 早餐」与「每周 2 次太极」。
          </p>
          <button
            onClick={() => navigate({ to: "/health/plan" })}
            className="mt-3 min-h-[44px] w-full rounded-full bg-primary text-base font-bold text-primary-foreground shadow-soft active:scale-[0.98]"
          >
            查看最新健康方案
          </button>
        </div>
      </section>
    </div>
  );
}
