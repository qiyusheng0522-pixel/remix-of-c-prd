import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
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
} from "lucide-react";

import { toast } from "sonner";
import { MobileLayout } from "@/components/MobileLayout";
import { ShareButton } from "@/components/ShareButton";
import { logoutAdmin } from "@/admin/auth";
import avatarFull from "@/assets/avatar-fullbody.png";
import dragonflyLogo from "@/assets/dragonfly-logo.png";

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

const REACTIONS = ["❤️", "✨", "👋", "🌸", "😊", "🎉", "💚"];

function HomePage() {
  const [idx, setIdx] = useState(0);
  const msg = messages[idx];
  const Icon = msg.icon;
  const [greeting, setGreeting] = useState("您好");
  const [bubbleKey, setBubbleKey] = useState(0);
  const [avatarPose, setAvatarPose] = useState<"idle" | "wave" | "jump" | "shake">("idle");
  const [bursts, setBursts] = useState<Array<{ id: number; emoji: string; x: number; y: number }>>([]);
  const [showTutorial, setShowTutorial] = useState(false);
  const burstId = useRef(0);

  useEffect(() => {
    logoutAdmin();
    const h = new Date().getHours();
    setGreeting(h < 12 ? "早上好" : h < 18 ? "下午好" : "晚上好");
  }, []);
  useEffect(() => {
    setBubbleKey((k) => k + 1);
  }, [idx]);
  const navigate = useNavigate();

  const handleAvatarTap = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const poses: Array<"wave" | "jump" | "shake"> = ["wave", "jump", "shake"];
    setAvatarPose(poses[Math.floor(Math.random() * poses.length)]);
    setTimeout(() => setAvatarPose("idle"), 700);
    // 生成 3 个漂浮的表情
    const newBursts = Array.from({ length: 3 }).map((_, i) => ({
      id: ++burstId.current,
      emoji: REACTIONS[Math.floor(Math.random() * REACTIONS.length)],
      x: x + (Math.random() * 60 - 30),
      y: y - 20 - i * 10,
    }));
    setBursts((b) => [...b, ...newBursts]);
    setTimeout(() => {
      setBursts((b) => b.filter((x) => !newBursts.find((n) => n.id === x.id)));
    }, 1400);
  };

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
              <span className="whitespace-nowrap">协和 · 北体大 · 营养学会 ›</span>
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

        {/* 对话气泡 · 消息 + 操作一体化 */}
        <section className="relative z-10 mx-6 mt-4">
          <div
            key={bubbleKey}
            className="relative rounded-[28px] rounded-bl-md bg-white px-5 py-4 shadow-elevated"
            style={{ animation: "bubblePop 0.45s cubic-bezier(.34,1.56,.64,1)" }}
          >
            <div className="mb-2 flex items-center gap-2">
              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-success" />
              <span className="text-sm font-semibold text-primary">蜻蜓医生</span>
              <span className="ml-auto rounded-full bg-primary-soft px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                {msg.category}
              </span>
            </div>
            <p className="overflow-hidden text-ellipsis whitespace-nowrap text-[17px] font-semibold leading-[1.45] text-foreground">
              {msg.text.replace(/\n/g, "")}
              <span className="ml-0.5 inline-block h-4 w-0.5 translate-y-0.5 animate-pulse bg-primary align-middle" />
            </p>
            {/* 操作区：主按钮 + 等会儿 + 说话 */}
            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={handleDone}
                className="flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-full bg-primary px-4 text-sm font-bold text-primary-foreground shadow-card active:scale-[0.97]"
              >
                <Icon className="h-5 w-5" strokeWidth={2.5} />
                {msg.action}
              </button>
              <button
                onClick={handleLater}
                aria-label="稍后再说"
                className="flex h-12 shrink-0 items-center justify-center gap-1 rounded-full bg-muted px-4 text-sm font-semibold text-muted-foreground shadow-card active:scale-95"
              >
                <Clock className="h-4 w-4" />
                稍后
              </button>
              <button
                onClick={() => toast.success("蜻蜓在听～", { description: "请说出您想问的健康问题" })}
                aria-label="对蜻蜓说话"
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-warm text-white shadow-card active:scale-95"
              >
                <Mic className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="ml-6 -mt-px h-0 w-0 border-l-[14px] border-r-[14px] border-t-[14px] border-l-transparent border-r-transparent border-t-white drop-shadow-sm" />
          {/* 追随气泡尾部的两个小圆 · 让对话更"真"一点 */}
          <div className="ml-3 mt-0.5 flex items-center gap-1">
            <span className="block h-2 w-2 rounded-full bg-white/95 shadow-sm" />
            <span className="block h-1.5 w-1.5 rounded-full bg-white/85 shadow-sm" />
            <span className="block h-1 w-1 rounded-full bg-white/70" />
          </div>
          {/* 消息切换指示点 */}
          <div className="mt-2 flex justify-center gap-1.5">
            {messages.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                aria-label={`第 ${i + 1} 条消息`}
                className={`h-1.5 rounded-full transition-all ${
                  i === idx ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>
        </section>

        {/* 3D 虚拟人 · 自适应填充剩余区域 */}
        <div className="relative z-0 flex flex-1 flex-col items-center justify-end py-2 min-h-0">
          <button
            onClick={handleAvatarTap}
            aria-label="点击虚拟人和蜻蜓互动"
            className="group relative flex min-h-0 flex-1 items-end justify-center"
          >
            <span className="pointer-events-none absolute -bottom-1 left-1/2 h-6 w-40 -translate-x-1/2 rounded-[50%] bg-primary/25 blur-2xl" />
            <span className="pointer-events-none absolute inset-0 -z-10 m-auto h-56 w-56 animate-pulse rounded-full bg-gradient-to-br from-primary/25 via-transparent to-orange-300/25 blur-2xl" />
            <div className="relative flex h-full max-h-[20%] items-end">
              <div className="relative h-full">
                <img
                  src={avatarFull}
                  alt="健康管家蜻蜓"
                  width={768}
                  height={1536}
                  className="h-full w-auto object-contain drop-shadow-2xl"
                  style={{
                    transformOrigin: "50% 95%",
                    animation:
                      avatarPose === "wave"
                        ? "avatarWave 0.8s ease-in-out"
                        : avatarPose === "jump"
                        ? "avatarJump 0.7s cubic-bezier(.34,1.56,.64,1)"
                        : avatarPose === "shake"
                        ? "avatarShake 0.6s ease-in-out"
                        : `avatarIdle 5.5s ease-in-out infinite, avatarBreath 3.2s ease-in-out infinite, avatarSway 7s ease-in-out infinite`,
                  }}
                />
              </div>

            </div>
            {/* 引导互动 */}
            <span className="absolute -top-1 right-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold text-primary shadow-card backdrop-blur-md animate-bounce">
              点我互动 ✨
            </span>
            {/* 漂浮表情爆点 */}
            {bursts.map((b) => (
              <span
                key={b.id}
                className="pointer-events-none absolute text-2xl"
                style={{ left: b.x, top: b.y, animation: "burstFloat 1.3s ease-out forwards" }}
              >
                {b.emoji}
              </span>
            ))}
          </button>
          <style>{`
            @keyframes avatarIdle{0%,100%{transform:translateY(0) rotate(0deg)}25%{transform:translateY(-8px) rotate(-1.2deg)}50%{transform:translateY(-4px) rotate(0deg)}75%{transform:translateY(-10px) rotate(1.2deg)}}
            @keyframes avatarBreath{0%,100%{filter:drop-shadow(0 10px 12px rgba(0,0,0,0.18))}50%{filter:drop-shadow(0 14px 18px rgba(0,0,0,0.22)) brightness(1.03)}}
            @keyframes avatarSway{0%,100%{transform-origin:50% 100%}25%{}50%{}}
            @keyframes avatarWave{0%,100%{transform:rotate(0) translateY(-4px)}20%{transform:rotate(-6deg) translateY(-10px)}50%{transform:rotate(6deg) translateY(-14px)}80%{transform:rotate(-4deg) translateY(-8px)}}
            @keyframes avatarJump{0%{transform:translateY(0) scale(1,1)}25%{transform:translateY(4px) scale(1.06,0.94)}55%{transform:translateY(-38px) scale(0.96,1.06)}80%{transform:translateY(0) scale(1.04,0.96)}100%{transform:translateY(0) scale(1,1)}}
            @keyframes avatarShake{0%,100%{transform:translateX(0) rotate(0)}15%{transform:translateX(-8px) rotate(-3deg)}30%{transform:translateX(8px) rotate(3deg)}45%{transform:translateX(-6px) rotate(-2deg)}60%{transform:translateX(6px) rotate(2deg)}80%{transform:translateX(-3px) rotate(-1deg)}}
            @keyframes bubblePop{0%{transform:translateY(-8px) scale(0.96);opacity:0}100%{transform:translateY(0) scale(1);opacity:1}}
            @keyframes burstFloat{0%{transform:translateY(0) scale(0.6);opacity:0}20%{opacity:1;transform:translateY(-10px) scale(1.15)}100%{transform:translateY(-90px) scale(0.9);opacity:0}}
            @keyframes avatarBlink{0%,92%,100%{transform:scaleY(1)}94%,97%{transform:scaleY(0.1)}}
          `}</style>


          {/* 唯一入口：AI 助手 */}
          <button
            onClick={() => navigate({ to: "/chat/xiaoqing" })}
            className="mt-2 flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-bold text-foreground shadow-card active:scale-95"
          >
            <Sparkles className="h-4 w-4 text-primary" />
            AI 助手 · 和我聊一聊
          </button>
          <p className="mt-1 text-[11px] text-muted-foreground">大模型驱动 · 24 小时在线陪伴</p>
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

      {/* 悬浮 · 和我聊一聊（长按可拖动到任意位置） */}
      <DraggableChatFab onTap={() => navigate({ to: "/chat/xiaoqing" })} />
      {showTutorial && <TutorialModal onClose={() => setShowTutorial(false)} />}
    </MobileLayout>
  );
}

function DraggableChatFab({ onTap }: { onTap: () => void }) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  const [hint, setHint] = useState(false);
  const stateRef = useRef({
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
    moved: false,
    longPress: false,
    timer: null as ReturnType<typeof setTimeout> | null,
    nodeW: 0,
    nodeH: 0,
  }).current;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const margin = 16;
    const w = 168;
    const h = 64;
    setPos({ x: window.innerWidth - w - margin, y: window.innerHeight - h - 112 });
  }, []);

  const clearTimer = () => {
    if (stateRef.timer) {
      clearTimeout(stateRef.timer);
      stateRef.timer = null;
    }
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!pos) return;
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    stateRef.nodeW = rect.width;
    stateRef.nodeH = rect.height;
    stateRef.startX = e.clientX;
    stateRef.startY = e.clientY;
    stateRef.originX = pos.x;
    stateRef.originY = pos.y;
    stateRef.moved = false;
    stateRef.longPress = false;
    clearTimer();
    stateRef.timer = setTimeout(() => {
      stateRef.longPress = true;
      setDragging(true);
      setHint(true);
      if (navigator.vibrate) navigator.vibrate(20);
    }, 320);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const dx = e.clientX - stateRef.startX;
    const dy = e.clientY - stateRef.startY;
    if (!stateRef.moved && Math.hypot(dx, dy) > 6) stateRef.moved = true;
    // 未长按前若发生滚动/滑动，取消长按
    if (!stateRef.longPress && stateRef.moved) clearTimer();
    if (!stateRef.longPress) return;
    const maxX = window.innerWidth - stateRef.nodeW - 4;
    const maxY = window.innerHeight - stateRef.nodeH - 4;
    setPos({
      x: Math.min(Math.max(4, stateRef.originX + dx), maxX),
      y: Math.min(Math.max(4, stateRef.originY + dy), maxY),
    });
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    try {
      (e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId);
    } catch {}
    const wasLong = stateRef.longPress;
    const wasMoved = stateRef.moved;
    clearTimer();
    stateRef.longPress = false;
    setDragging(false);
    setTimeout(() => setHint(false), 600);
    if (!wasLong && !wasMoved) onTap();
  };

  if (!pos) return null;

  return (
    <div
      role="button"
      aria-label="和蜻蜓聊一聊（长按可拖动）"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      style={{ left: pos.x, top: pos.y, touchAction: "none" }}
      className={`fixed z-50 flex select-none items-center gap-2 rounded-full bg-gradient-warm py-2 pl-2 pr-4 shadow-elevated transition-transform ${
        dragging ? "scale-110 ring-4 ring-white/60" : "active:scale-95"
      }`}
    >
      <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-white">
        <img src={dragonflyLogo} alt="" width={36} height={36} className="h-9 w-9 pointer-events-none" />
        <span className="absolute right-0 top-0 h-3 w-3 animate-pulse rounded-full bg-success ring-2 ring-white" />
      </span>
      <span className="pointer-events-none text-sm font-bold text-white">
        {hint ? "拖到任意位置 ✋" : "和我聊一聊"}
      </span>
    </div>
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
