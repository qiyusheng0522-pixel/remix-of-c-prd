import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  Phone,
  Video,
  Stethoscope,
  Award,
  Hospital,
  Calendar,
  Mic,
  Plus,
  Camera,
  Sparkles,
  Stethoscope as StethoIcon,
  Briefcase,
  ScanLine,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/messages_/doctor/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `医生对话 - 蜻蜓健康` },
      { name: "description", content: `查看与医生 ${params.id} 的历史对话与名片。` },
    ],
  }),
  component: DoctorChatPage,
});

type Doctor = {
  name: string;
  title: string;
  hospital: string;
  dept: string;
  years: number;
  rating: number;
  specialties: string[];
  avatar: string;
  online: boolean;
};

const doctors: Record<string, Doctor> = {
  li: {
    name: "李建华",
    title: "主任医师",
    hospital: "北京协和医院",
    dept: "心血管内科",
    years: 28,
    rating: 4.9,
    specialties: ["高血压", "冠心病", "心律失常", "老年心血管疾病"],
    avatar: "👨‍⚕️",
    online: true,
  },
  wang: {
    name: "王慧敏",
    title: "副主任医师",
    hospital: "北京大学第三医院",
    dept: "内分泌科",
    years: 18,
    rating: 4.8,
    specialties: ["糖尿病", "甲状腺", "骨质疏松"],
    avatar: "👩‍⚕️",
    online: false,
  },
  zhang: {
    name: "张明远",
    title: "主任医师",
    hospital: "中日友好医院",
    dept: "全科医学",
    years: 22,
    rating: 4.9,
    specialties: ["健康管理", "慢病随访", "用药指导"],
    avatar: "👨‍⚕️",
    online: true,
  },
};

type ChatMsg = {
  id: number;
  from: "me" | "doctor";
  type: "text" | "image" | "card";
  content: string;
  time: string;
};

const initialChats: Record<string, ChatMsg[]> = {
  li: [
    { id: 1, from: "me", type: "text", content: "李医生您好，我最近吃完降压药后有点头晕，是怎么回事呢？", time: "昨天 15:30" },
    { id: 2, from: "doctor", type: "text", content: "您好王阿姨，请问头晕是在什么时候出现？早上空腹吃药还是饭后？", time: "昨天 15:45" },
    { id: 3, from: "me", type: "text", content: "都是早上起床后空腹吃的，吃完大概半小时就开始有点头晕。", time: "昨天 16:00" },
    {
      id: 4,
      from: "doctor",
      type: "text",
      content:
        "建议您改为饭后服用苯磺酸氨氯地平 5mg，并观察 3 天。如果仍有头晕，请来面诊检查血压波动情况。期间请每天早晚各测一次血压并记录。",
      time: "昨天 16:20",
    },
    { id: 5, from: "me", type: "text", content: "好的，谢谢李医生，我今天就改成饭后吃。", time: "昨天 16:25" },
    {
      id: 6,
      from: "doctor",
      type: "card",
      content: "为您开具复诊预约：4 月 22 日（周三）上午 9:30，协和心内科 3 诊室",
      time: "昨天 16:30",
    },
  ],
  wang: [
    { id: 1, from: "doctor", type: "text", content: "王阿姨您好，我是王医生。看到您上传的化验单，想跟您确认下空腹血糖测的时间。", time: "3 天前" },
    { id: 2, from: "me", type: "text", content: "王医生您好，是早上 7 点起床后立刻测的，没吃任何东西。", time: "3 天前" },
    { id: 3, from: "doctor", type: "text", content: "好的，您的空腹血糖 6.8 略高，建议先调整饮食，主食换成杂粮，控制甜食。两周后我们再看看。", time: "3 天前" },
  ],
  zhang: [
    { id: 1, from: "doctor", type: "text", content: "王阿姨，您本周的健康打卡完成度 86%，做得很好！", time: "今天 09:00" },
    { id: 2, from: "doctor", type: "text", content: "提醒您：明天 14:00 是您本月的健康随访，到时我会主动联系您。", time: "今天 09:01" },
  ],
};

const quickReplies = [
  "好的，我记住啦～",
  "谢谢医生",
  "请问可以面诊吗？",
  "我想再咨询一个问题",
];

function DoctorChatPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const doctor = doctors[id];
  const [msgs, setMsgs] = useState<ChatMsg[]>(initialChats[id] ?? []);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs]);

  if (!doctor) {
    return (
      <div className="mx-auto min-h-screen max-w-[480px] bg-gradient-bg p-8 text-center">
        <p className="text-base text-muted-foreground">该医生信息不存在</p>
        <button onClick={() => navigate({ to: "/messages" })} className="mt-4 text-primary underline">
          返回消息中心
        </button>
      </div>
    );
  }

  const send = (text?: string) => {
    const t = (text ?? input).trim();
    if (!t) return;
    const myMsg: ChatMsg = {
      id: Date.now(),
      from: "me",
      type: "text",
      content: t,
      time: "刚刚",
    };
    setMsgs((m) => [...m, myMsg]);
    setInput("");
    setTimeout(() => {
      setMsgs((m) => [
        ...m,
        {
          id: Date.now() + 1,
          from: "doctor",
          type: "text",
          content: "已收到您的消息，稍后回复您～",
          time: "刚刚",
        },
      ]);
    }, 800);
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-[480px] flex-col bg-gradient-bg">
      {/* Header */}
      <header className="flex items-center gap-3 bg-card px-4 pb-3 pt-12 shadow-soft">
        <button
          onClick={() => navigate({ to: "/messages" })}
          className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted"
          aria-label="返回"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div className="flex-1">
          <p className="text-base font-bold">{doctor.name} {doctor.title}</p>
          <p className="text-xs text-muted-foreground">
            {doctor.online ? "● 在线" : "○ 离线"} · {doctor.dept}
          </p>
        </div>
        <button
          onClick={() => toast("正在呼叫医生…", { description: "电话咨询 ¥30/15分钟" })}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-soft text-primary"
          aria-label="电话"
        >
          <Phone className="h-5 w-5" />
        </button>
        <button
          onClick={() => toast("视频问诊", { description: "正在为您接通医生，请稍候" })}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-soft text-accent"
          aria-label="视频"
        >
          <Video className="h-5 w-5" />
        </button>
      </header>

      {/* Doctor Card */}
      <section className="px-4 pt-4">
        <article className="rounded-2xl bg-gradient-primary p-4 text-white shadow-elevated">
          <div className="flex items-center gap-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/25 text-4xl backdrop-blur-sm">
              {doctor.avatar}
            </div>
            <div className="flex-1">
              <p className="text-xl font-bold">{doctor.name}</p>
              <p className="mt-0.5 text-sm opacity-90">{doctor.title} · 从医 {doctor.years} 年</p>
              <p className="mt-0.5 flex items-center gap-1 text-xs opacity-90">
                <Hospital className="h-3.5 w-3.5" /> {doctor.hospital} · {doctor.dept}
              </p>
            </div>
            <div className="flex flex-col items-center rounded-xl bg-white/20 px-3 py-1.5 backdrop-blur-sm">
              <Award className="h-4 w-4" />
              <span className="mt-0.5 text-base font-bold">{doctor.rating}</span>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {doctor.specialties.map((sp) => (
              <span key={sp} className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium backdrop-blur-sm">
                {sp}
              </span>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              onClick={() => toast.success("已预约面诊", { description: "4 月 22 日 上午 9:30 协和门诊" })}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-white py-2 text-sm font-bold text-primary active:scale-95"
            >
              <Calendar className="h-4 w-4" /> 预约面诊
            </button>
            <button
              onClick={() => toast.success("已关注医生", { description: "新动态会通知您" })}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-white/25 py-2 text-sm font-bold text-white backdrop-blur-sm active:scale-95"
            >
              <Stethoscope className="h-4 w-4" /> 关注医生
            </button>
          </div>
        </article>
      </section>

      {/* Chat */}
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        <p className="text-center text-xs text-muted-foreground">— 历史对话 —</p>
        {msgs.map((m) => (
          <div
            key={m.id}
            className={cn("flex gap-2", m.from === "me" ? "flex-row-reverse" : "flex-row")}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-lg">
              {m.from === "me" ? "👵" : doctor.avatar}
            </div>
            <div className={cn("flex max-w-[78%] flex-col", m.from === "me" ? "items-end" : "items-start")}>
              {m.type === "card" ? (
                <div className="rounded-2xl border-2 border-accent bg-accent-soft px-4 py-3 text-sm font-medium text-accent-foreground">
                  <p className="mb-1 flex items-center gap-1 text-xs font-bold text-accent">
                    <Calendar className="h-3.5 w-3.5" /> 预约确认
                  </p>
                  {m.content}
                </div>
              ) : (
                <div
                  className={cn(
                    "rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed",
                    m.from === "me"
                      ? "rounded-tr-sm bg-primary text-primary-foreground"
                      : "rounded-tl-sm bg-card text-foreground shadow-card",
                  )}
                >
                  {m.content}
                </div>
              )}
              <span className="mt-1 px-1 text-[10px] text-muted-foreground">{m.time}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick replies */}
      <div className="flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {quickReplies.map((q) => (
          <button
            key={q}
            onClick={() => send(q)}
            className="shrink-0 rounded-full bg-card px-3 py-1.5 text-xs font-medium text-foreground shadow-card active:scale-95"
          >
            {q}
          </button>
        ))}
      </div>

      {/* AI 工具条 + 输入框（参考示例样式） */}
      <div className="space-y-2 bg-gradient-to-b from-transparent to-[oklch(0.96_0.03_290)] px-3 pb-4 pt-2">
        <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button
            onClick={() => toast("智能模式", { description: "蜻蜓将根据您的健康档案智能回复" })}
            className="flex shrink-0 items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-foreground shadow-card active:scale-95"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            智能
            <ChevronDown className="h-3 w-3 text-muted-foreground" />
          </button>
          <button
            onClick={() => navigate({ to: "/health/plan" })}
            className="flex shrink-0 items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-foreground shadow-card active:scale-95"
          >
            <StethoIcon className="h-3.5 w-3.5 text-accent" />
            AI 诊室
          </button>
          <button
            onClick={() => toast("就医服务", { description: "为您预约协和心内科门诊" })}
            className="flex shrink-0 items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-foreground shadow-card active:scale-95"
          >
            <Briefcase className="h-3.5 w-3.5 text-success" />
            就医服务
          </button>
          <button
            onClick={() => toast("拍皮肤", { description: "对准皮肤患处拍照，AI 辅助识别" })}
            className="flex shrink-0 items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-foreground shadow-card active:scale-95"
          >
            <ScanLine className="h-3.5 w-3.5 text-rose-500" />
            拍皮肤
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-full bg-white px-2 py-1.5 shadow-card">
            <button
              onClick={() => toast("按住说话", { description: "语音消息会自动转文字发送给医生" })}
              aria-label="语音"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted active:scale-95"
            >
              <Mic className="h-5 w-5 text-foreground" />
            </button>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="点击输入或按住说话"
              className="flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
            />
            <button
              onClick={() => (input.trim() ? send() : toast("更多功能", { description: "发图 · 发文件 · 发位置 · 转人工" }))}
              aria-label={input.trim() ? "发送" : "更多"}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted active:scale-95"
            >
              <Plus className="h-5 w-5 text-foreground" />
            </button>
          </div>
          <button
            onClick={() => toast("拍照问医生", { description: "拍下检查单/化验单/患处照片，发给医生" })}
            aria-label="拍照"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-primary text-white shadow-elevated active:scale-95"
          >
            <Camera className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
