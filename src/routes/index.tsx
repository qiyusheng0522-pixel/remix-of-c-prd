import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Bell,
  Mic,
  Clock,
  Pill,
  GlassWater,
  Footprints,
  UtensilsCrossed,
  UserPlus,
  Calendar,
  Activity,
  Stethoscope,
  Camera,
  History,
  Sparkles,
  Leaf,
  PlayCircle,
  X,
  ScanLine,
  Send,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { MobileLayout } from "@/components/MobileLayout";
import { ShareButton } from "@/components/ShareButton";
import { logoutAdmin } from "@/admin/auth";
import { Users, MessageSquarePlus } from "lucide-react";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "蜻蜓健康 - 您的贴心健康管家" },
      {
        name: "description",
        content: "专为中老年人打造的健康管理平台，AI 健康管家蜻蜓陪伴您每一天。",
      },
    ],
  }),
  component: HomePage,
});

type Msg = {
  text: string;
  action: string;
  icon: typeof Pill;
  category: string;
  to?: string;
  toastTitle?: string;
  toastDesc?: string;
};

const messages: Msg[] = [
  {
    text: "王阿姨，午餐时间到啦！\n吃饭前拍一拍食物，\n蜻蜓帮您看看营养够不够～",
    action: "拍食物打卡",
    icon: Camera,
    category: "用餐提醒",
    to: "/health/meal",
  },
  {
    text: "饭后 2 小时服药时间到～\n头孢克肟胶囊 100mg · 温水送服\n禁忌：服药期间及停药 7 天内不可饮酒，避免与抗酸剂同服。",
    action: "我吃药了",
    icon: Pill,
    category: "服药提醒 · 饭后",
    toastTitle: "已记录服药",
    toastDesc: "头孢克肟 100mg · 饭后 2 小时 · 温水送服",
  },
  {
    text: "已经 2 小时没喝水啦，\n今天还差 3 杯达标，\n去倒杯温水吧～",
    action: "我喝了一杯",
    icon: GlassWater,
    category: "喝水提醒",
    toastTitle: "已记录 +200ml",
    toastDesc: "今日 5/8 杯，继续加油",
  },
  {
    text: "天气真好，\n下午一起去散散步吧～\n邻居张大爷也在等您。",
    action: "去打卡散步",
    icon: Footprints,
    category: "运动提醒",
    to: "/health/checkin",
  },
  {
    text: "您的档案还差一点～\n上传体检/化验单，\n蜻蜓才能更懂您哦。",
    action: "去完善档案",
    icon: UserPlus,
    category: "新手引导",
    to: "/onboarding",
  },
  {
    text: "为您找到「太极养生班」！\n本周六上午 9 点，\n社区中心，距您 200 米。",
    action: "看看活动",
    icon: Calendar,
    category: "专属活动",
    to: "/circle/activities",
  },
  {
    text: "近 3 天清晨血压偏高，\n平均 148/92，\n咱们一起看看趋势好吗？",
    action: "查看健康档案",
    icon: Activity,
    category: "健康提醒",
    to: "/health/records",
  },
  {
    text: "李医生回复了您的问题～\n关于服药后头晕，\n建议改为饭后服用。",
    action: "进入医生对话",
    icon: Stethoscope,
    category: "医嘱回复",
    to: "/messages/doctor/li",
  },
  {
    text: "您今天的健康方案出来啦，\n要不要看看？",
    action: "看看方案",
    icon: UtensilsCrossed,
    category: "今日方案",
    to: "/health/plan",
  },
  {
    text: "王阿姨，昨天晚上的降压药\n您好像忘记吃了～\n今天可别再漏啦。",
    action: "查看用药记录",
    icon: History,
    category: "昨日遗漏 · 用药",
    to: "/me/prescriptions",
  },
  {
    text: "昨天的血压还没测哦～\n咱们今早补一次，\n我帮您记录到档案里。",
    action: "现在去测量",
    icon: History,
    category: "昨日遗漏 · 测量",
    to: "/health/records",
  },
  {
    text: "昨天的午餐没有打卡，\n吃了什么记一下吧，\n蜻蜓帮您回顾营养。",
    action: "补打卡",
    icon: History,
    category: "昨日遗漏 · 餐食",
    to: "/health/meal",
  },
  {
    text: "昨天计步只有 2300 步～\n今天目标 6000 步，\n下午散个步就够啦。",
    action: "去散步打卡",
    icon: History,
    category: "昨日遗漏 · 运动",
    to: "/health/checkin",
  },
];

const aiShortcuts = [
  { label: "寻医", icon: Stethoscope, to: "/messages/doctor/li" },
  { label: "报告解读", icon: ScanLine, to: "/health/ocr" },
  { label: "用药指导", icon: Pill, to: "/chat/xiaoqing" },
  { label: "健康管理", icon: Activity, to: "/health" },
  { label: "饮食建议", icon: UtensilsCrossed, to: "/health/meal" },
  { label: "运动计划", icon: Footprints, to: "/health/workout" },
];


function HomePage() {
  const [idx, setIdx] = useState(0);
  const msg = messages[idx];
  const Icon = msg.icon;
  const [greeting, setGreeting] = useState("您好");
  const [bubbleKey, setBubbleKey] = useState(0);
  const [showTutorial, setShowTutorial] = useState(false);
  const [aiInput, setAiInput] = useState("");

  useEffect(() => {
    logoutAdmin();
    const h = new Date().getHours();
    setGreeting(h < 12 ? "早上好" : h < 18 ? "下午好" : "晚上好");
  }, []);
  useEffect(() => {
    setBubbleKey((k) => k + 1);
  }, [idx]);
  const navigate = useNavigate();

  const handleDone = () => {
    if (msg.to) {
      navigate({ to: msg.to });
    } else if (msg.toastTitle) {
      toast.success(msg.toastTitle, { description: msg.toastDesc });
      setIdx((i) => (i + 1) % messages.length);
    }
  };
  const handleLater = () => {
    toast("好的，等会儿提醒您～");
    setIdx((i) => (i + 1) % messages.length);
  };

  return (
    <MobileLayout>
      <div className="relative flex min-h-[calc(100vh-96px)] flex-col overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.94_0.04_180)] via-[oklch(0.97_0.025_185)] to-[oklch(0.99_0.01_60)]" />
        <div className="pointer-events-none absolute bottom-32 left-1/2 h-40 w-72 -translate-x-1/2 rounded-[50%] bg-primary/15 blur-3xl" />

        {/* 顶部 */}
        <header className="relative z-10 flex items-center justify-between px-6 pt-12">
          <div>
            <p className="text-base text-muted-foreground">{greeting}</p>
            <h1 className="mt-0.5 text-2xl font-bold text-foreground">王阿姨</h1>
            <button
              onClick={() => navigate({ to: "/partners" })}
              className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground active:opacity-70"
            >
              <span className="whitespace-nowrap rounded-full bg-success/15 px-1.5 py-0.5 font-bold text-success">
                权威背书
              </span>
              <span className="whitespace-nowrap">江苏亚寰健康 ›</span>
            </button>
          </div>
          <div className="flex items-center gap-2">
          <button
            onClick={() => setShowTutorial(true)}
            aria-label="新手教学视频"
            className="relative flex h-12 w-12 items-center justify-center rounded-full bg-white/70 shadow-card backdrop-blur-md active:scale-95"
          >
            <PlayCircle className="h-6 w-6 text-primary" />
            <span className="absolute -right-0.5 -top-0.5 rounded-full bg-warm px-1 py-0.5 text-[9px] font-bold text-white shadow" style={{background:"linear-gradient(90deg,#ff8a3d,#ff5a7a)"}}>教学</span>
          </button>
          <button
            onClick={() => navigate({ to: "/messages" })}
            aria-label="消息中心"
            className="relative flex h-12 w-12 items-center justify-center rounded-full bg-white/70 shadow-card backdrop-blur-md active:scale-95"
          >
            <Bell className="h-6 w-6 text-foreground" />
            <span className="absolute right-2.5 top-2.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white ring-2 ring-white">
              5
            </span>
          </button>
          </div>
        </header>

        {/* 对话气泡 · 消息 + 操作一体化 · 适老放大版 */}
        <section className="relative z-10 mx-5 mt-6">
          <div
            key={bubbleKey}
            className="relative rounded-[32px] rounded-bl-md bg-white px-6 py-5 shadow-elevated"
            style={{ animation: "bubblePop 0.45s cubic-bezier(.34,1.56,.64,1)" }}
          >
            <div className="mb-3 flex items-center gap-2.5">
              <span className="inline-block h-2.5 w-2.5 animate-pulse rounded-full bg-success" />
              <span className="text-base font-semibold text-primary">蜻蜓医生</span>
              <span className="ml-auto rounded-full bg-primary-soft px-3 py-1 text-[13px] font-semibold text-primary">
                {msg.category}
              </span>
            </div>
            <p className="whitespace-pre-line text-[23px] font-semibold leading-[1.6] text-foreground">
              {msg.text}
              <span className="ml-1 inline-block h-6 w-0.5 translate-y-1 animate-pulse bg-primary align-middle" />
            </p>
            {/* 操作区：主按钮 + 等会儿 + 说话 */}
            <div className="mt-5 flex items-center gap-3">
              <button
                onClick={handleDone}
                className="flex min-h-[64px] flex-1 items-center justify-center gap-2.5 whitespace-nowrap rounded-full bg-primary px-4 text-[17px] font-bold text-primary-foreground shadow-card active:scale-[0.97]"
              >
                <Icon className="h-6 w-6" strokeWidth={2.5} />
                {msg.action}
              </button>
              <button
                onClick={handleLater}
                aria-label="稍后再说"
                className="flex h-[64px] shrink-0 items-center justify-center gap-1.5 rounded-full bg-muted px-5 text-base font-semibold text-muted-foreground shadow-card active:scale-95"
              >
                <Clock className="h-6 w-6" />
                稍后
              </button>
              <button
                onClick={() => toast.success("蜻蜓在听～", { description: "请说出您想问的健康问题" })}
                aria-label="对蜻蜓说话"
                className="flex h-[64px] w-[64px] shrink-0 items-center justify-center rounded-full bg-gradient-warm text-white shadow-card active:scale-95"
              >
                <Mic className="h-7 w-7" />
              </button>
            </div>
          </div>
          <div className="ml-6 -mt-px h-0 w-0 border-l-[16px] border-r-[16px] border-t-[16px] border-l-transparent border-r-transparent border-t-white drop-shadow-sm" />
          {/* 追随气泡尾部的两个小圆 · 让对话更"真"一点 */}
          <div className="ml-3 mt-0.5 flex items-center gap-1">
            <span className="block h-2.5 w-2.5 rounded-full bg-white/95 shadow-sm" />
            <span className="block h-2 w-2 rounded-full bg-white/85 shadow-sm" />
            <span className="block h-1.5 w-1.5 rounded-full bg-white/70" />
          </div>
          {/* 消息切换指示点 */}
          <div className="mt-3 flex justify-center gap-2">
            {messages.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                aria-label={`第 ${i + 1} 条消息`}
                className={`h-2 rounded-full transition-all ${
                  i === idx ? "w-7 bg-primary" : "w-2 bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>
        </section>

        {/* 加群 · 问专家 · 显著入口 */}
        <section className="relative z-10 mx-5 mt-3 grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate({ to: "/circle" })}
            className="flex items-center gap-3 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 px-4 py-3 text-left text-white shadow-elevated active:scale-[0.98]"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/25">
              <Users className="h-6 w-6" strokeWidth={2.5} />
            </span>
            <div className="flex-1">
              <div className="text-[16px] font-bold leading-tight">加入病友群</div>
              <div className="mt-0.5 text-[11px] opacity-90">同病相伴 · 互助打卡</div>
            </div>
          </button>
          <button
            onClick={() => navigate({ to: "/experts" })}
            className="flex items-center gap-3 rounded-2xl bg-gradient-to-br from-sky-500 to-primary px-4 py-3 text-left text-white shadow-elevated active:scale-[0.98]"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/25">
              <MessageSquarePlus className="h-6 w-6" strokeWidth={2.5} />
            </span>
            <div className="flex-1">
              <div className="text-[16px] font-bold leading-tight">问专家</div>
              <div className="mt-0.5 text-[11px] opacity-90">三甲医生 · 一对一答疑</div>
            </div>
          </button>
        </section>

        {/* AI 快捷入口 + 输入框 · 填充剩余区域 */}
        <div className="relative z-10 mt-auto flex flex-col items-center px-5 pb-3 pt-3">
          <style>{`@keyframes bubblePop{0%{transform:translateY(-8px) scale(0.96);opacity:0}100%{transform:translateY(0) scale(1);opacity:1}}`}</style>
          <div className="mb-2 w-full overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex items-center gap-2 pb-0.5">
              {aiShortcuts.map((s) => {
                const SIcon = s.icon;
                return (
                  <button
                    key={s.label}
                    onClick={() => navigate({ to: s.to })}
                    className="flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-2 text-sm font-semibold text-foreground shadow-sm active:scale-95"
                  >
                    <SIcon className="h-4 w-4 text-primary" strokeWidth={2.5} />
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const q = aiInput.trim();
              navigate({ to: "/chat/xiaoqing", search: q ? { message: q } : undefined });
              setAiInput("");
            }}
            className="w-full"
          >
            <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2 shadow-card focus-within:ring-2 focus-within:ring-primary/20">
              <Sparkles className="h-5 w-5 shrink-0 text-primary" />
              <input
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder="AI 助手 · 和我聊一聊"
                className="flex-1 bg-transparent text-[15px] font-medium text-foreground outline-none placeholder:text-muted-foreground"
              />
              <button
                type="button"
                onClick={() => toast.success("蜻蜓在听～", { description: "请说出您想问的健康问题" })}
                aria-label="语音输入"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted active:scale-95"
              >
                <Mic className="h-4 w-4 text-foreground" />
              </button>
              <button
                type="submit"
                aria-label={aiInput.trim() ? "发送" : "拍照问蜻蜓"}
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full active:scale-95",
                  aiInput.trim()
                    ? "bg-primary text-primary-foreground shadow-card"
                    : "bg-muted text-foreground",
                )}
              >
                {aiInput.trim() ? <Send className="h-4 w-4" /> : <Camera className="h-4 w-4" />}
              </button>
            </div>
            <p className="mt-1 text-center text-[11px] text-muted-foreground">大模型驱动 · 24 小时在线陪伴</p>
          </form>
        </div>
      </div>

      {/* 悬浮 · 数字中医人（左下角固定入口） */}
      <button
        onClick={() => navigate({ to: "/health/tcm" })}
        aria-label="数字中医人"
        className="fixed bottom-28 left-3 z-40 flex items-center gap-1.5 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 py-2 pl-2 pr-3 shadow-elevated active:scale-95"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/25">
          <Leaf className="h-5 w-5 text-white" strokeWidth={2.5} />
        </span>
        <span className="whitespace-nowrap text-xs font-bold text-white">数字中医人</span>
      </button>

      {showTutorial && <TutorialModal onClose={() => setShowTutorial(false)} />}

    </MobileLayout>
  );
}




function TutorialModal({ onClose }: { onClose: () => void }) {
  const chapters = [
    { t: "01 · 认识蜻蜓管家", d: "长按 AI 悬浮球可拖到任意位置，随时呼叫。" },
    { t: "02 · 每日健康打卡", d: "拍食物、测血压、喝水、走路，一键记录。" },
    { t: "03 · 报告解读与打印", d: "报告可下载，凭验证码到驿站打印纸质版。" },
    { t: "04 · 陪诊与专病套餐", d: "对接协和 / 鼓楼 / 省人民等三甲医院。" },
  ];
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-t-3xl bg-white p-5 shadow-elevated"
        style={{ animation: "bubblePop 0.35s cubic-bezier(.34,1.56,.64,1)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">新手教学视频</h3>
            <p className="text-xs text-muted-foreground">3 分钟带您上手蜻蜓健康</p>
          </div>
          <button onClick={onClose} aria-label="关闭" className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="relative mb-4 flex aspect-video items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-primary/80 to-primary">
          <button
            onClick={() => toast.success("正在播放教学视频…")}
            className="flex flex-col items-center gap-1 text-white active:scale-95"
          >
            <PlayCircle className="h-16 w-16" strokeWidth={1.5} />
            <span className="text-sm font-bold">播放 · 3:20</span>
          </button>
        </div>
        <div className="space-y-2">
          {chapters.map((c) => (
            <button
              key={c.t}
              onClick={() => toast(c.t, { description: c.d })}
              className="flex w-full items-center gap-3 rounded-xl bg-muted/50 p-3 text-left active:scale-[0.98]"
            >
              <PlayCircle className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <div className="text-sm font-bold">{c.t}</div>
                <div className="text-xs text-muted-foreground">{c.d}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
