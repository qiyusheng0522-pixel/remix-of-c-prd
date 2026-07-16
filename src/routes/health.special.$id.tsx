import { createFileRoute, useNavigate, useParams, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Pill,
  Activity,
  Apple,
  Stethoscope,
  Calendar,
  TrendingUp,
  Bell,
} from "lucide-react";
import { toast } from "sonner";
import { MobileLayout } from "@/components/MobileLayout";

export const Route = createFileRoute("/health/special/$id")({
  head: () => ({
    meta: [
      { title: "专病管理方案 - 蜻蜓健康" },
      { name: "description", content: "专病管理方案详情:饮食、用药、监测一体化。" },
    ],
  }),
  component: SpecialPlanPage,
});

const plans: Record<string, {
  name: string;
  icon: string;
  progress: number;
  desc: string;
  color: string;
  metrics: { label: string; value: string; status: "正常" | "偏高" | "偏低" }[];
  tasks: { icon: string; title: string; sub: string; done: boolean }[];
}> = {
  diabetes: {
    name: "糖尿病管理方案",
    icon: "🩸",
    progress: 68,
    desc: "饮食控糖 · 用药提醒 · 血糖监测",
    color: "from-rose-400 to-pink-500",
    metrics: [
      { label: "空腹血糖", value: "6.8 mmol/L", status: "偏高" },
      { label: "餐后 2h", value: "8.2 mmol/L", status: "正常" },
      { label: "糖化血红蛋白", value: "6.5%", status: "正常" },
    ],
    tasks: [
      { icon: "💊", title: "二甲双胍 0.5g", sub: "今早 08:00 已服用", done: true },
      { icon: "💊", title: "二甲双胍 0.5g", sub: "今晚 20:00 待服用", done: false },
      { icon: "🩸", title: "餐前血糖监测", sub: "今日已测 1/3 次", done: false },
      { icon: "🥗", title: "低 GI 饮食", sub: "今日参照执行", done: true },
    ],
  },
  hypertension: {
    name: "高血压管理方案",
    icon: "❤️",
    progress: 82,
    desc: "限盐饮食 · 血压监测 · 用药提醒",
    color: "from-red-400 to-orange-500",
    metrics: [
      { label: "晨起收缩压", value: "138 mmHg", status: "偏高" },
      { label: "晨起舒张压", value: "85 mmHg", status: "正常" },
      { label: "心率", value: "72 次/分", status: "正常" },
    ],
    tasks: [
      { icon: "💊", title: "氨氯地平 5mg", sub: "今早 07:30 已服用", done: true },
      { icon: "🩺", title: "晨起血压测量", sub: "今日已完成", done: true },
      { icon: "🧂", title: "限盐 < 5g", sub: "今日盐摄入 3.2g", done: true },
      { icon: "🚶", title: "30 分钟有氧", sub: "今日待完成", done: false },
    ],
  },
};

function SpecialPlanPage() {
  const navigate = useNavigate();
  const { id } = useParams({ from: "/health/special/$id" });
  const plan = plans[id] ?? plans.diabetes;

  const goBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      window.history.back();
    } else {
      navigate({ to: "/health/plan" });
    }
  };

  return (
    <MobileLayout>
      <header className={`relative bg-gradient-to-br ${plan.color} px-5 pb-6 pt-12 text-white`}>
        <button
          onClick={goBack}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/25 backdrop-blur-sm active:scale-95"
          aria-label="返回上一步"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div className="mt-3 flex items-center gap-3">
          <span className="text-5xl">{plan.icon}</span>
          <div className="flex-1">
            <h1 className="text-xl font-bold">{plan.name}</h1>
            <p className="mt-0.5 text-sm opacity-90">{plan.desc}</p>
          </div>
        </div>
        <div className="mt-4 rounded-2xl bg-white/20 p-3 backdrop-blur-sm">
          <div className="flex justify-between text-sm">
            <span>本月执行进度</span>
            <span className="font-bold">{plan.progress}%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/30">
            <div
              className="h-full rounded-full bg-white"
              style={{ width: `${plan.progress}%` }}
            />
          </div>
        </div>
      </header>

      <section className="mt-5 px-5">
        <h2 className="mb-3 flex items-center gap-2 text-lg font-bold">
          <TrendingUp className="h-5 w-5 text-primary" /> 关键指标
        </h2>
        <div className="grid grid-cols-3 gap-2">
          {plan.metrics.map((m) => (
            <div key={m.label} className="rounded-2xl bg-card p-3 text-center shadow-card">
              <p className="text-xs text-muted-foreground">{m.label}</p>
              <p className="mt-1 text-base font-bold text-foreground">{m.value}</p>
              <span
                className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  m.status === "正常"
                    ? "bg-success/15 text-success"
                    : m.status === "偏高"
                      ? "bg-destructive/10 text-destructive"
                      : "bg-warning/15 text-warning"
                }`}
              >
                {m.status}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-5 px-5">
        <h2 className="mb-3 flex items-center gap-2 text-lg font-bold">
          <Calendar className="h-5 w-5 text-primary" /> 今日任务
        </h2>
        <div className="space-y-2">
          {plan.tasks.map((t, i) => (
            <button
              key={i}
              onClick={() => toast(t.done ? "已完成" : `已提醒:${t.title}`, { description: t.sub })}
              className="flex w-full items-center gap-3 rounded-2xl bg-card p-4 text-left shadow-card active:scale-[0.98]"
            >
              <span className="text-2xl">{t.icon}</span>
              <div className="flex-1">
                <p className="text-base font-bold text-foreground">{t.title}</p>
                <p className="text-xs text-muted-foreground">{t.sub}</p>
              </div>
              {t.done ? (
                <span className="rounded-full bg-success/15 px-2.5 py-1 text-xs font-bold text-success">
                  ✓ 完成
                </span>
              ) : (
                <Bell className="h-5 w-5 text-warning" />
              )}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-5 grid grid-cols-2 gap-3 px-5">
        <Link
          to="/health/records"
          className="flex items-center gap-2 rounded-2xl bg-card p-4 shadow-card active:scale-[0.98]"
        >
          <Activity className="h-6 w-6 text-primary" />
          <div>
            <p className="text-sm font-bold">指标趋势</p>
            <p className="text-xs text-muted-foreground">查看 30 天</p>
          </div>
        </Link>
        <Link
          to="/health/meal"
          className="flex items-center gap-2 rounded-2xl bg-card p-4 shadow-card active:scale-[0.98]"
        >
          <Apple className="h-6 w-6 text-success" />
          <div>
            <p className="text-sm font-bold">饮食方案</p>
            <p className="text-xs text-muted-foreground">查看食谱</p>
          </div>
        </Link>
        <button
          onClick={() => toast.success("已为您预约 3 月 5 日 10:00 复诊")}
          className="flex items-center gap-2 rounded-2xl bg-card p-4 text-left shadow-card active:scale-[0.98]"
        >
          <Stethoscope className="h-6 w-6 text-accent" />
          <div>
            <p className="text-sm font-bold">预约复诊</p>
            <p className="text-xs text-muted-foreground">三甲专家</p>
          </div>
        </button>
        <button
          onClick={() => toast("用药提醒已开启", { description: "每日定时微信+短信通知" })}
          className="flex items-center gap-2 rounded-2xl bg-card p-4 text-left shadow-card active:scale-[0.98]"
        >
          <Pill className="h-6 w-6 text-rose-500" />
          <div>
            <p className="text-sm font-bold">用药提醒</p>
            <p className="text-xs text-muted-foreground">智能提醒</p>
          </div>
        </button>
      </section>

      <section className="mt-5 px-5">
        <Link
          to="/chat/xiaoqing"
          className="flex w-full items-center gap-3 rounded-2xl border-2 border-primary bg-primary-soft p-4 active:scale-[0.98]"
        >
          <span className="text-2xl">💬</span>
          <div className="flex-1">
            <p className="text-base font-bold text-primary">问问蜻蜓关于{plan.name}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">用药、并发症、饮食禁忌都可问</p>
          </div>
        </Link>
      </section>
    </MobileLayout>
  );
}
