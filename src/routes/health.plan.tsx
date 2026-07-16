import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MobileLayout } from "@/components/MobileLayout";
import {
  ArrowLeft,
  AlertTriangle,
  MapPin,
  Users,
  Play,
  Flame,
  Droplet,
  Apple,
  ClipboardList,
  Stethoscope,
  Sparkles,
  ChevronRight,
  Trophy,
  MessageCircle,
  RefreshCw,
  X,
  Truck,
  Store,
  Calendar,
  BookOpen,
  Share2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ShareButton } from "@/components/ShareButton";
import avatarFull from "@/assets/avatar-fullbody.png";

export const Route = createFileRoute("/health/plan")({
  head: () => ({
    meta: [
      { title: "健康方案 - 蜻蜓健康" },
      { name: "description", content: "为您定制的运动方案、饮食建议、专病管理和健康陪伴。" },
    ],
  }),
  component: HealthPlan,
});

const concernTags = [
  { label: "作息不规律", color: "bg-destructive/10 text-destructive" },
  { label: "无运动", color: "bg-destructive/10 text-destructive" },
  { label: "进餐速度快", color: "bg-warning/15 text-warning" },
  { label: "饮水量不足", color: "bg-warning/15 text-warning" },
  { label: "不按时就餐", color: "bg-warning/15 text-warning" },
  { label: "超重", color: "bg-destructive/10 text-destructive" },
  { label: "在外就餐频繁", color: "bg-warning/15 text-warning" },
  { label: "糖尿病", color: "bg-destructive/10 text-destructive" },
  { label: "口味偏重", color: "bg-warning/15 text-warning" },
];

const exercises = [
  { name: "散步", level: "适合", icon: "🚶‍♀️", duration: "30 分钟", intensity: "低强度" },
  { name: "太极养生", level: "适合", icon: "🧘‍♀️", duration: "20 分钟", intensity: "低强度" },
];

const meals = [
  {
    type: "早餐",
    icon: "🌅",
    time: "07:00 - 08:30",
    calories: 420,
    dishes: [
      { id: "oatmeal", name: "燕麦牛奶粥", emoji: "🥣", calories: 180, tag: "高纤维", hasVideo: true },
      { id: "egg", name: "水煮蛋", emoji: "🥚", calories: 80, tag: "高蛋白", hasVideo: false },
      { id: "blueberry", name: "蓝莓", emoji: "🫐", calories: 60, tag: "抗氧化", hasVideo: false },
      { id: "toast", name: "全麦吐司", emoji: "🍞", calories: 100, tag: "粗粮", hasVideo: false },
    ],
  },
  {
    type: "午餐",
    icon: "☀️",
    time: "11:30 - 13:00",
    calories: 580,
    dishes: [
      { id: "rice", name: "杂粮饭", emoji: "🍚", calories: 200, tag: "控糖", hasVideo: true },
      { id: "salmon", name: "清蒸三文鱼", emoji: "🐟", calories: 220, tag: "Omega-3", hasVideo: true },
      { id: "broccoli", name: "蒜蓉西兰花", emoji: "🥦", calories: 80, tag: "高纤维", hasVideo: false },
      { id: "soup", name: "番茄豆腐汤", emoji: "🍲", calories: 80, tag: "低脂", hasVideo: true },
    ],
  },
  {
    type: "晚餐",
    icon: "🌙",
    time: "17:30 - 19:00",
    calories: 451,
    dishes: [
      { id: "millet", name: "小米粥", emoji: "🥣", calories: 120, tag: "易消化", hasVideo: false },
      { id: "shrimp", name: "白灼虾", emoji: "🍤", calories: 140, tag: "高蛋白", hasVideo: true },
      { id: "spinach", name: "凉拌菠菜", emoji: "🥬", calories: 60, tag: "高铁", hasVideo: false },
      { id: "almond", name: "巴旦木", emoji: "🌰", calories: 131, tag: "好脂肪", hasVideo: false },
    ],
  },
];

const stations = [
  { name: "阳光社区驿站", distance: "1.2 公里", icon: "🏡" },
];

const questionnaires = [
  { id: "special", name: "专病问卷", desc: "针对糖尿病、高血压等慢病", status: "待完成", color: "bg-destructive/10 text-destructive" },
  { id: "risk", name: "风险评估问卷", desc: "心脑血管、骨质疏松风险", status: "已完成", color: "bg-success/15 text-success" },
  { id: "lifestyle", name: "生活方式问卷", desc: "饮食、作息、运动习惯", status: "可更新", color: "bg-warning/15 text-warning" },
];

const specialPlans = [
  {
    id: "diabetes",
    name: "糖尿病管理方案",
    progress: 68,
    desc: "饮食控糖 · 用药提醒 · 血糖监测",
    icon: "🩸",
  },
  {
    id: "hypertension",
    name: "高血压管理方案",
    progress: 82,
    desc: "限盐饮食 · 血压监测 · 用药提醒",
    icon: "❤️",
  },
];

// 三方好友平台
const sharePlatforms = [
  { id: "wechat", name: "微信好友", emoji: "💬", color: "bg-[oklch(0.75_0.18_145)]" },
  { id: "wechat-moments", name: "微信朋友圈", emoji: "🌈", color: "bg-[oklch(0.78_0.16_145)]" },
  { id: "qq", name: "QQ 好友", emoji: "🐧", color: "bg-[oklch(0.7_0.15_240)]" },
  { id: "sms", name: "短信邀请", emoji: "✉️", color: "bg-[oklch(0.72_0.13_60)]" },
];

function HealthPlan() {
  const navigate = useNavigate();
  // 用 false 初始化以避免 SSR / 客户端不一致；在 effect 中再读 localStorage
  const [isNewbie, setIsNewbie] = useState(false);
  useEffect(() => {
    setIsNewbie(localStorage.getItem("joinedExerciseCircle") !== "1");
  }, []);
  const [buyDish, setBuyDish] = useState<{ title: string; mode: "single" | "stage" } | null>(null);
  const [shareEx, setShareEx] = useState<string | null>(null);

  const handleJoinCircle = () => {
    localStorage.setItem("joinedExerciseCircle", "1");
    setIsNewbie(false);
    toast.success("已加入锻炼圈", { description: "稍后可在蜻蜓圈查看伙伴动态" });
  };

  const goBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      window.history.back();
    } else {
      navigate({ to: "/health" });
    }
  };

  return (
    <MobileLayout>
      {/* 顶部 - 人物形象 + 健康标签 */}
      <header className="relative bg-gradient-to-b from-[oklch(0.85_0.08_180)] to-[oklch(0.94_0.04_180)] px-5 pb-6 pt-12">
        <div className="flex items-center justify-between">
          <button
            onClick={goBack}
            aria-label="返回上一步"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/60 backdrop-blur-sm active:scale-95"
          >
            <ArrowLeft className="h-6 w-6 text-foreground" />
          </button>
          <ShareButton
            variant="pill"
            label="分享方案"
            title="我的蜻蜓专属健康方案"
            desc="AI 健康管家为我定制 · 一起看看吧"
          />
        </div>

        <div className="mt-2 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">健康方案</h1>
        </div>


        <div className="mt-3 flex items-end gap-3">
          <div className="flex flex-wrap gap-2">
            {concernTags.slice(0, 5).map((t) => (
              <span
                key={t.label}
                className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${t.color}`}
              >
                {t.label}
              </span>
            ))}
          </div>
          <img
            src={avatarFull}
            alt="您的健康画像"
            width={768}
            height={1536}
            loading="lazy"
            className="h-44 w-auto shrink-0 object-contain"
          />
        </div>

        <div className="mt-2 flex flex-wrap gap-2">
          {concernTags.slice(5).map((t) => (
            <span
              key={t.label}
              className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${t.color}`}
            >
              {t.label}
            </span>
          ))}
        </div>

        <div className="mt-4 rounded-xl bg-warning/15 p-3 text-sm font-medium text-warning">
          ⚠️ 根据您的身体状况，建议您先调整健康习惯
        </div>
      </header>

      {/* 健康问卷入口 */}
      <section className="mt-5 px-5">
        <h2 className="mb-3 flex items-center gap-2 text-xl font-bold text-foreground">
          <ClipboardList className="h-6 w-6 text-primary" />
          健康问卷
        </h2>
        <div className="space-y-2">
          {questionnaires.map((q) => (
            <Link
              key={q.id}
              to="/health/questionnaire/$id"
              params={{ id: q.id }}
              className="flex w-full items-center gap-3 rounded-2xl bg-card p-4 text-left shadow-card active:scale-[0.98]"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-base font-bold text-foreground">{q.name}</p>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${q.color}`}>
                    {q.status}
                  </span>
                </div>
                <p className="mt-0.5 text-sm text-muted-foreground">{q.desc}</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </Link>
          ))}
        </div>
      </section>

      {/* 专病管理方案 */}
      <section className="mt-5 px-5">
        <h2 className="mb-3 flex items-center gap-2 text-xl font-bold text-foreground">
          <Stethoscope className="h-6 w-6 text-destructive" />
          专病管理方案
        </h2>
        <div className="space-y-3">
          {specialPlans.map((p) => (
            <Link
              key={p.id}
              to="/health/special/$id"
              params={{ id: p.id }}
              className="block w-full rounded-2xl bg-card p-4 text-left shadow-card active:scale-[0.98]"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{p.icon}</span>
                <div className="flex-1">
                  <p className="text-base font-bold text-foreground">{p.name}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{p.desc}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="mt-3">
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-muted-foreground">本月执行进度</span>
                  <span className="font-bold text-primary">{p.progress}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-success"
                    style={{ width: `${p.progress}%` }}
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 饮食方案 */}
      <section className="mt-5 px-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-xl font-bold text-foreground">
            <Apple className="h-6 w-6 text-success" />
            今日饮食方案
          </h2>
          <button
            onClick={() =>
              toast.success("整阶段已换新", {
                description: "营养师已为您换一套本周菜单,营养均衡度保持一致",
              })
            }
            className="flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-1 text-xs font-semibold text-success active:scale-95"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            阶段换一换
          </button>
        </div>

        <div className="rounded-2xl bg-card p-5 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">今日建议摄入</p>
              <p className="mt-1 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-foreground">1451</span>
                <span className="text-base font-medium text-muted-foreground">千卡</span>
              </p>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-success" /> 蛋白质
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-warning" /> 脂肪
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-primary" /> 碳水
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-accent" /> 膳食纤维
              </span>
            </div>
          </div>

          <div className="mt-3 flex items-start gap-2 rounded-xl bg-success/10 p-3 text-xs">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-success" />
            <p className="text-muted-foreground">
              本方案由 <strong className="text-success">江苏亚寰健康</strong>{" "}
              根据您的体检指标、慢病情况与口味偏好定制，每周更新一次。
            </p>
          </div>

          <button
            onClick={() => toast("饮水打卡 +1", { description: "今日已饮水 4 杯（建议 8 杯）" })}
            className="mt-3 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-primary-soft text-base font-bold text-primary active:scale-[0.98]"
          >
            <Droplet className="h-5 w-5" />
            饮水量打卡（4 / 8 杯）
          </button>
        </div>

        {/* 三餐菜谱 */}
        <div className="mt-3 space-y-3">
          {meals.map((meal) => (
            <div key={meal.type} className="rounded-2xl bg-card p-4 shadow-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{meal.icon}</span>
                  <div>
                    <p className="text-base font-bold text-foreground">{meal.type}</p>
                    <p className="text-xs text-muted-foreground">{meal.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      toast.success(`${meal.type}已换一份`, {
                        description: "营养师已为您挑选同类替代,热量与营养接近",
                      })
                    }
                    className="flex items-center gap-1 rounded-full bg-primary-soft px-2.5 py-1 text-xs font-bold text-primary active:scale-95"
                  >
                    <RefreshCw className="h-3 w-3" />
                    换一换
                  </button>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">{meal.calories}</p>
                    <p className="text-xs text-muted-foreground">千卡</p>
                  </div>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                {meal.dishes.map((d) => (
                  <div key={d.id} className="rounded-xl bg-muted p-2.5">
                    <Link
                      to="/health/dish/$id"
                      params={{ id: d.id }}
                      className="flex items-start gap-2 active:scale-95"
                    >
                      <span className="text-2xl">{d.emoji}</span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-foreground">{d.name}</p>
                        <p className="text-xs text-muted-foreground">{d.calories} 千卡</p>
                        <div className="mt-1 flex flex-wrap items-center gap-1">
                          <span className="inline-block rounded bg-success/15 px-1.5 py-0.5 text-[10px] font-semibold text-success">
                            {d.tag}
                          </span>
                          {d.hasVideo ? (
                            <span className="inline-flex items-center gap-0.5 rounded bg-rose-100 px-1.5 py-0.5 text-[10px] font-semibold text-rose-600">
                              <Play className="h-2.5 w-2.5 fill-rose-600" />
                              教学
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-0.5 rounded bg-muted-foreground/10 px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                              <BookOpen className="h-2.5 w-2.5" />
                              图文
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                    <button
                      onClick={() =>
                        toast(`已为您替换《${d.name}》`, {
                          description: "替换为同类同热量菜品,蜻蜓已记录您的偏好",
                        })
                      }
                      className="mt-2 flex w-full items-center justify-center gap-1 rounded-lg bg-card py-1 text-[10px] font-semibold text-muted-foreground active:scale-95"
                    >
                      <RefreshCw className="h-2.5 w-2.5" />
                      替换这道
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setBuyDish({ title: `${meal.type}食材包`, mode: "single" })}
                className="mt-3 flex min-h-[44px] w-full items-center justify-center gap-1.5 rounded-xl bg-accent text-sm font-bold text-accent-foreground shadow-soft active:scale-[0.98]"
              >
                🛒 一键购买食材
              </button>

              <button
                onClick={() =>
                  toast(`已记录:跟着吃 ${meal.type}`, {
                    description: "已同步到饮食打卡,获得 +5 健康积分",
                  })
                }
                className="mt-2 flex min-h-[40px] w-full items-center justify-center gap-1.5 rounded-xl bg-muted text-sm font-semibold text-foreground active:scale-[0.98]"
              >
                ✅ 跟着吃
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 运动方案 */}
      <section className="mt-5 px-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-xl font-bold text-foreground">
            <Flame className="h-6 w-6 text-accent" />
            个性化运动方案
          </h2>
          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
            运动医学团队
          </span>
        </div>
        <div className="rounded-2xl bg-card p-5 shadow-card">
          {/* 始终显示的运动风险提示 */}
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm">
            <p className="flex items-center gap-1.5 font-bold text-destructive">
              <AlertTriangle className="h-4 w-4" />
              运动风险提示
            </p>
            <ul className="mt-1.5 space-y-0.5 text-xs text-muted-foreground">
              <li>· 您当前血压偏高，请避免高强度、爆发性运动</li>
              <li>· 运动前后做 5 分钟热身和拉伸，循序渐进</li>
              <li>· 若出现胸闷、头晕、心悸，请立即停止并联系家人</li>
              <li>· 建议家人陪同或在驿站、社区活动中心进行</li>
            </ul>
          </div>

          <div className="mt-3 flex items-start gap-2 rounded-xl bg-primary/10 p-3 text-xs">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <p className="text-muted-foreground">
              本方案由 <strong className="text-primary">北京体育大学运动康复科研团队</strong>{" "}
              联合三甲医院心内科专家，根据老年人慢病康复指南循证设计。
            </p>
          </div>

          <p className="mt-4 text-base font-semibold text-foreground">为您推荐</p>
          <div className="mt-2 space-y-2">
            {exercises.map((ex) => (
              <button
                key={ex.name}
                onClick={() =>
                  toast(`${ex.name} 教学视频`, {
                    description: `${ex.duration} · ${ex.intensity} · 含动作要领与安全提示`,
                  })
                }
                className="flex w-full items-center gap-3 rounded-xl bg-muted p-3 active:scale-[0.98]"
              >
                <span className="text-3xl">{ex.icon}</span>
                <div className="flex-1 text-left">
                  <p className="text-base font-bold text-foreground">{ex.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {ex.duration} · {ex.intensity}
                  </p>
                </div>
                <span className="rounded-full bg-success/15 px-3 py-1 text-sm font-semibold text-success">
                  {ex.level}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 康复进度 */}
      <section className="mt-5 px-5">
        <h2 className="mb-3 flex items-center gap-2 text-xl font-bold text-foreground">
          <Trophy className="h-6 w-6 text-accent" />
          本周康复进度
        </h2>
        <div className="rounded-2xl bg-card p-5 shadow-card">
          <div className="grid grid-cols-7 gap-1.5">
            {["一", "二", "三", "四", "五", "六", "日"].map((d, i) => {
              const done = i < 4;
              const today = i === 4;
              return (
                <div key={d} className="flex flex-col items-center gap-1">
                  <span className="text-xs text-muted-foreground">{d}</span>
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold ${
                      done
                        ? "bg-success text-success-foreground"
                        : today
                          ? "border-2 border-primary bg-primary-soft text-primary"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {done ? "✓" : today ? "今" : "-"}
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            本周已完成 4/7 天，再坚持 3 天就能达成"周冠军"勋章
          </p>
          <Link
            to="/health/checkin"
            className="mt-3 flex min-h-[48px] w-full items-center justify-center rounded-xl bg-primary text-base font-bold text-primary-foreground shadow-soft active:scale-[0.98]"
          >
            去打卡
          </Link>
        </div>
      </section>

      {/* 附近驿站推荐 */}
      <section className="mt-5 px-5">
        <h2 className="mb-3 flex items-center gap-2 text-xl font-bold text-foreground">
          <MapPin className="h-6 w-6 text-primary" />
          附近驿站推荐
        </h2>
        <div className="rounded-2xl bg-card p-5 shadow-card">
          <p className="text-sm text-muted-foreground">
            附近的邻居都爱这些运动
          </p>
          {stations.map((s) => (
            <div key={s.name} className="mt-3">
              <Link
                to="/station"
                className="flex items-center gap-3 rounded-xl bg-primary-soft p-3 active:scale-[0.98]"
              >
                <span className="text-3xl">{s.icon}</span>
                <div className="flex-1">
                  <p className="text-base font-bold text-foreground">{s.name}</p>
                  <p className="text-sm text-muted-foreground">
                    距离您 {s.distance}
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </Link>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {exercises.map((ex) => (
                  <div
                    key={ex.name}
                    className="flex items-center gap-2 rounded-xl border border-border p-2"
                  >
                    <span className="text-xl">{ex.icon}</span>
                    <span className="flex-1 text-sm font-semibold">
                      {ex.name}
                    </span>
                  </div>
                ))}
              </div>
              {isNewbie ? (
                <button
                  onClick={handleJoinCircle}
                  className="mt-2 min-h-[48px] w-full rounded-xl bg-primary text-base font-bold text-primary-foreground shadow-soft active:scale-[0.98]"
                >
                  加入锻炼圈
                </button>
              ) : (
                <Link
                  to="/circle"
                  className="mt-2 flex min-h-[48px] w-full items-center justify-center gap-1.5 rounded-xl border-2 border-primary bg-primary-soft text-base font-bold text-primary active:scale-[0.98]"
                >
                  <Users className="h-5 w-5" />
                  查看锻炼圈动态
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 找伴运动 */}
      <section className="mt-5 px-5">
        <h2 className="mb-3 flex items-center gap-2 text-xl font-bold text-foreground">
          <Users className="h-6 w-6 text-accent" />
          找伴运动
        </h2>
        <div className="rounded-2xl bg-card p-5 shadow-card">
          <div className="space-y-2">
            {exercises.map((ex) => (
              <div
                key={ex.name}
                className="flex items-center gap-3 rounded-xl bg-muted p-3"
              >
                <span className="text-3xl">{ex.icon}</span>
                <span className="flex-1 text-base font-bold text-foreground">
                  {ex.name}
                </span>
                <button
                  onClick={() => setShareEx(ex.name)}
                  className="flex items-center gap-1 rounded-full bg-accent px-3 py-1.5 text-sm font-bold text-accent-foreground active:scale-95"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  一起练
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 健康百科 */}
      <section className="mt-5 px-5">
        <h2 className="mb-3 text-xl font-bold text-foreground">健康百科</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { title: "中医内科常见病", duration: "13:46", color: "from-red-400 to-orange-400" },
            { title: "山东专科权威", duration: "08:22", color: "from-purple-400 to-pink-400" },
          ].map((v) => (
            <button
              key={v.title}
              onClick={() => toast.success(`正在播放：${v.title}`, { description: "已为您加入「我的收藏」" })}
              className="overflow-hidden rounded-2xl bg-card text-left shadow-card active:scale-[0.98]"
            >
              <div
                className={`flex aspect-video items-center justify-center bg-gradient-to-br ${v.color}`}
              >
                <Play className="h-10 w-10 fill-white text-white" />
              </div>
              <div className="p-3">
                <p className="text-sm font-bold text-foreground line-clamp-2">
                  {v.title}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  时长 {v.duration}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 名医直播 */}
      <section className="mt-5 px-5">
        <button
          onClick={() => toast("已为您预约名医直播", { description: "开播前 30 分钟会通过蜻蜓提醒您" })}
          className="flex w-full items-center gap-3 rounded-2xl bg-gradient-warm p-5 text-left text-white shadow-soft active:scale-[0.98]"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/25 text-3xl backdrop-blur-sm">
            🎥
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold opacity-90">名医直播</p>
            <p className="mt-0.5 text-base font-bold">
              糖尿病最新治疗手段
            </p>
            <p className="mt-0.5 text-xs opacity-90">
              开播时间：2025/03/01 10:00:00
            </p>
          </div>
          <span className="rounded-full bg-white/25 px-3 py-1 text-sm font-bold">
            预约
          </span>
        </button>
      </section>

      {/* AI 健康咨询 */}
      <section className="mt-5 px-5">
        <Link
          to="/"
          className="flex w-full items-center gap-3 rounded-2xl border-2 border-primary bg-primary-soft p-5 text-left active:scale-[0.98]"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-2xl text-primary-foreground">
            <Sparkles className="h-7 w-7" />
          </div>
          <div className="flex-1">
            <p className="text-base font-bold text-primary">问问蜻蜓</p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              用药、饮食、症状，都可以语音问她
            </p>
          </div>
          <MessageCircle className="h-6 w-6 text-primary" />
        </Link>
      </section>

      {/* 健康商城横幅 */}
      <section className="mt-5 px-5">
        <Link
          to="/me/points"
          className="relative flex items-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-[oklch(0.78_0.14_30)] to-[oklch(0.72_0.16_15)] p-5 text-white shadow-elevated active:scale-[0.99]"
        >
          <div className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/15 blur-2xl" />
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-3xl backdrop-blur">
            🛍️
          </span>
          <div className="relative flex-1">
            <p className="text-xs opacity-90">蜻蜓健康商城 · 严选直供</p>
            <p className="mt-0.5 text-lg font-bold">营养餐 · 养生茶 · 智能设备 · 食材包</p>
            <p className="mt-0.5 text-xs opacity-90">会员专享 8 折 · 积分可抵现</p>
          </div>
          <span className="relative rounded-full bg-white px-3 py-1.5 text-sm font-bold text-[oklch(0.55_0.18_25)]">
            去逛逛 ›
          </span>
        </Link>
      </section>

      {/* 一键购买弹窗 - 周期/驿站自提 */}
      {buyDish && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setBuyDish(null)}
        >
          <div
            className="w-full max-w-[480px] rounded-t-3xl bg-card p-5 pb-8 shadow-elevated"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground">购买《{buyDish.title}》</h3>
              <button
                onClick={() => setBuyDish(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted"
                aria-label="关闭"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="mb-2 text-sm font-bold text-muted-foreground">📦 配送周期</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "今日单次", desc: "今晚送达", price: "¥48" },
                { label: "每周配送", desc: "每周一/四送", price: "¥168/周" },
                { label: "整月套餐", desc: "营养师定制", price: "¥598/月" },
              ].map((p) => (
                <button
                  key={p.label}
                  onClick={() =>
                    toast.success(`${p.label}下单成功`, {
                      description: `${buyDish.title} · ${p.price} · ${p.desc}`,
                    })
                  }
                  className="rounded-2xl border-2 border-border p-3 text-center active:scale-95 hover:border-primary"
                >
                  <Calendar className="mx-auto h-5 w-5 text-primary" />
                  <p className="mt-1 text-sm font-bold text-foreground">{p.label}</p>
                  <p className="text-[10px] text-muted-foreground">{p.desc}</p>
                  <p className="mt-1 text-sm font-bold text-accent">{p.price}</p>
                </button>
              ))}
            </div>

            <p className="mb-2 mt-4 text-sm font-bold text-muted-foreground">🚚 配送方式</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  toast.success("已下单 · 配送到家", { description: "由蜻蜓优选社区团购今晚送达" });
                  setBuyDish(null);
                }}
                className="flex items-center gap-2 rounded-2xl border-2 border-border p-3 text-left active:scale-95 hover:border-primary"
              >
                <Truck className="h-6 w-6 text-primary" />
                <div>
                  <p className="text-sm font-bold text-foreground">配送到家</p>
                  <p className="text-[10px] text-muted-foreground">今晚 18:00 前送达</p>
                </div>
              </button>
              <button
                onClick={() => {
                  toast.success("已下单 · 驿站自提", { description: "凭取货码到阳光社区驿站自提" });
                  setBuyDish(null);
                }}
                className="flex items-center gap-2 rounded-2xl border-2 border-border p-3 text-left active:scale-95 hover:border-primary"
              >
                <Store className="h-6 w-6 text-success" />
                <div>
                  <p className="text-sm font-bold text-foreground">驿站自提</p>
                  <p className="text-[10px] text-muted-foreground">阳光社区驿站</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 一起练 - 三方好友平台分享 */}
      {shareEx && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setShareEx(null)}
        >
          <div
            className="w-full max-w-[480px] rounded-t-3xl bg-card p-5 pb-8 shadow-elevated"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-foreground">邀请好友一起练《{shareEx}》</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">选择平台,把邀请发送给指定的好友</p>
              </div>
              <button
                onClick={() => setShareEx(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted"
                aria-label="关闭"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {sharePlatforms.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    toast.success(`已通过${p.name}发出邀请`, {
                      description: `请在弹出的${p.name}选择具体好友`,
                    });
                    setShareEx(null);
                  }}
                  className="flex flex-col items-center gap-1.5 active:scale-95"
                >
                  <span
                    className={cn(
                      "flex h-14 w-14 items-center justify-center rounded-2xl text-2xl shadow-card",
                      p.color,
                    )}
                  >
                    {p.emoji}
                  </span>
                  <span className="text-xs font-semibold text-foreground">{p.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </MobileLayout>
  );
}
