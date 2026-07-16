import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  Pill,
  GlassWater,
  Footprints,
  UtensilsCrossed,
  UserPlus,
  Calendar,
  Activity,
  Stethoscope,
  ChevronRight,
  Camera,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/messages")({
  head: () => ({
    meta: [
      { title: "消息中心 - 蜻蜓健康" },
      { name: "description", content: "您的所有提醒、引导、活动通知和医嘱回复。" },
    ],
  }),
  component: MessagesPage,
});

type Category = "all" | "important" | "reminder" | "guide" | "activity" | "doctor";

const categories: { key: Category; label: string }[] = [
  { key: "all", label: "全部" },
  { key: "important", label: "重要提醒" },
  { key: "reminder", label: "打卡提醒" },
  { key: "guide", label: "新手引导" },
  { key: "activity", label: "活动通知" },
  { key: "doctor", label: "医嘱回复" },
];

type Msg = {
  id: number;
  category: Exclude<Category, "all">;
  icon: typeof Pill;
  iconColor: string;
  title: string;
  content: string;
  time: string;
  action: string;
  to?: string;
  toastTip?: string;
  unread?: boolean;
  important?: boolean;
};

const initialMessages: Msg[] = [
  {
    id: 0,
    category: "important",
    icon: Activity,
    iconColor: "from-red-500 to-rose-600",
    title: "重要 · 建议停药并就近就诊",
    content:
      "您近 7 天血压持续偏高（平均 152/96，未见下降趋势）。建议暂停目前服用的「苯磺酸氨氯地平 5mg」，今日尽快前往就近三甲医院心内科就诊，由医生重新评估用药方案。停药期间请每 2 小时测一次血压并记录。",
    time: "刚刚",
    action: "查看附近医院",
    to: "/health/records",
    unread: true,
    important: true,
  },
  {
    id: 1,
    category: "reminder",
    icon: Pill,
    iconColor: "from-rose-400 to-rose-500",
    title: "该吃降压药啦",
    content: "苯磺酸氨氯地平 5mg，今早 8:00 的剂量还没打卡哦～",
    time: "刚刚",
    action: "去打卡吃药",
    to: "/health/checkin",
    unread: true,
  },
  {
    id: 2,
    category: "reminder",
    icon: UtensilsCrossed,
    iconColor: "from-amber-400 to-orange-500",
    title: "午餐时间到啦",
    content: "今天的推荐是清蒸鲈鱼+杂粮饭。吃饭前拍一拍食物，蜻蜓帮您看营养是否达标 📷",
    time: "5 分钟前",
    action: "拍食物打卡",
    to: "/health/meal",
    unread: true,
  },
  {
    id: 3,
    category: "reminder",
    icon: GlassWater,
    iconColor: "from-cyan-400 to-blue-500",
    title: "记得喝水",
    content: "上次喝水是 2 小时前，今天还差 3 杯达标，去倒一杯温水吧～",
    time: "15 分钟前",
    action: "我喝了一杯",
    toastTip: "已记录 +200ml，今日 5/8 杯",
    unread: true,
  },
  {
    id: 4,
    category: "reminder",
    icon: Footprints,
    iconColor: "from-emerald-400 to-green-500",
    title: "下午散步打卡",
    content: "天气 22°C，适合散步。去公园走 30 分钟，和邻居一起打卡吧！",
    time: "30 分钟前",
    action: "去打卡散步",
    to: "/health/checkin",
  },
  {
    id: 5,
    category: "guide",
    icon: UserPlus,
    iconColor: "from-violet-400 to-purple-500",
    title: "完善您的健康档案",
    content: "上传体检报告、化验单或入院单，蜻蜓能给您更精准的健康方案。也可以填写问卷哦～",
    time: "今天 9:00",
    action: "去完善档案",
    to: "/onboarding",
    unread: true,
  },
  {
    id: 6,
    category: "activity",
    icon: Calendar,
    iconColor: "from-pink-400 to-rose-500",
    title: "为您匹配到「太极养生班」",
    content: "根据您的「高血压+喜爱运动」标签，本周六上午 9:00 社区中心开课，距您 200m。",
    time: "今天 8:30",
    action: "查看活动",
    to: "/circle/activities",
  },
  {
    id: 7,
    category: "activity",
    icon: Activity,
    iconColor: "from-orange-400 to-red-500",
    title: "血压数据有波动",
    content: "近 3 天清晨血压偏高（平均 148/92），建议查看趋势并咨询蜻蜓调整方案。",
    time: "今天 7:30",
    action: "查看健康档案",
    to: "/health/records",
    unread: true,
  },
  {
    id: 8,
    category: "doctor",
    icon: Stethoscope,
    iconColor: "from-teal-400 to-cyan-500",
    title: "李医生回复了您的问题",
    content: "「关于服药后头晕的咨询」：建议改为饭后服用，并观察 3 天，如未缓解请来面诊。",
    time: "昨天 16:20",
    action: "查看完整对话",
    to: "/messages/doctor/li",
    unread: true,
  },
  {
    id: 9,
    category: "doctor",
    icon: Stethoscope,
    iconColor: "from-teal-400 to-cyan-500",
    title: "王医生：化验单解读已生成",
    content: "上周三上传的血常规报告：各项指标正常，仅维生素 D 略低，建议多晒太阳。",
    time: "昨天 10:00",
    action: "查看解读对话",
    to: "/messages/doctor/wang",
  },
  {
    id: 10,
    category: "doctor",
    icon: Stethoscope,
    iconColor: "from-teal-400 to-cyan-500",
    title: "张医生：本周随访通知",
    content: "您本周打卡完成度 86%，做得很好！明天 14:00 是本月健康随访。",
    time: "今天 09:00",
    action: "进入医生对话",
    to: "/messages/doctor/zhang",
  },
];

function MessagesPage() {
  const [filter, setFilter] = useState<Category>("all");
  const [msgs, setMsgs] = useState(initialMessages);
  const navigate = useNavigate();

  const filtered =
    filter === "all" ? msgs : msgs.filter((m) => m.category === filter);

  const handleAction = (msg: Msg) => {
    setMsgs((prev) =>
      prev.map((m) => (m.id === msg.id ? { ...m, unread: false } : m)),
    );
    if (msg.to) {
      navigate({ to: msg.to });
    } else if (msg.toastTip) {
      toast.success(msg.action, { description: msg.toastTip });
    }
  };

  const unreadCount = msgs.filter((m) => m.unread).length;

  return (
    <div className="mx-auto min-h-screen max-w-[480px] bg-gradient-bg pb-8">
      <header className="bg-gradient-primary px-5 pb-6 pt-12 text-primary-foreground">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm"
          >
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">消息中心</h1>
            <p className="text-sm opacity-90">
              {unreadCount > 0 ? `您有 ${unreadCount} 条未读消息` : "暂无未读消息"}
            </p>
          </div>
        </div>
      </header>

      {/* 分类筛选 */}
      <div className="sticky top-0 z-10 -mt-3 border-b border-border bg-card/95 backdrop-blur-md">
        <div className="flex gap-2 overflow-x-auto px-4 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => setFilter(c.key)}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                filter === c.key
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* 消息列表 */}
      <section className="space-y-3 px-4 py-4">
        {filtered.length === 0 ? (
          <div className="rounded-2xl bg-card p-8 text-center shadow-card">
            <p className="text-base text-muted-foreground">这个分类下没有新消息～</p>
          </div>
        ) : (
          filtered.map((m) => {
            const Icon = m.icon;
            return (
              <article
                key={m.id}
                className={cn(
                  "rounded-2xl bg-card p-4 shadow-card",
                  m.important && "ring-2 ring-destructive bg-destructive/5",
                  m.unread && !m.important && "ring-2 ring-primary/30",
                )}
              >
                <header className="mb-2 flex items-start gap-3">
                  <div
                    className={cn(
                      "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-soft",
                      m.iconColor,
                    )}
                  >
                    <Icon className="h-6 w-6" strokeWidth={2.2} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h2 className="text-base font-bold text-foreground">
                        {m.important && (
                          <span className="mr-1.5 rounded-md bg-destructive px-1.5 py-0.5 text-[10px] font-bold text-white align-middle">
                            重要
                          </span>
                        )}
                        {m.title}
                      </h2>
                      {m.unread && (
                        <span className="h-2 w-2 shrink-0 rounded-full bg-destructive" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{m.time}</p>
                  </div>
                </header>
                <p className="mb-3 text-[15px] leading-relaxed text-foreground">
                  {m.content}
                </p>
                <button
                  onClick={() => handleAction(m)}
                  className={cn(
                    "flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl text-base font-bold shadow-soft transition-transform active:scale-[0.98]",
                    m.important
                      ? "bg-destructive text-destructive-foreground"
                      : "bg-primary text-primary-foreground",
                  )}
                >
                  {m.category === "reminder" && m.title.includes("食物") ? (
                    <Camera className="h-5 w-5" />
                  ) : (
                    <Check className="h-5 w-5" />
                  )}
                  {m.action}
                  {m.to && <ChevronRight className="h-5 w-5" />}
                </button>
              </article>
            );
          })
        )}
      </section>
    </div>
  );
}
