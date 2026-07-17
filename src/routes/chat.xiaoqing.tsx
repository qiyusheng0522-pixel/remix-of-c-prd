import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  Phone,
  Sparkles,
  ShieldCheck,
  Mic,
  Plus,
  Camera,
  Stethoscope,
  Briefcase,
  ScanLine,
  Pill,
  UtensilsCrossed,
  Activity,
  FileHeart,
  Upload,
  Wand2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import defaultAvatarFull from "@/assets/avatar-fullbody.png";

export const Route = createFileRoute("/chat/xiaoqing")({
  head: () => ({
    meta: [
      { title: "和蜻蜓聊聊 - 蜻蜓健康" },
      { name: "description", content: "蜻蜓大模型驱动的 AI 健康管家蜻蜓，随时陪您聊健康。" },
    ],
  }),
  component: XiaoqingChatPage,
});

type ChatMsg = {
  id: number;
  from: "me" | "ai";
  content: string;
  time: string;
};

const initialMsgs: ChatMsg[] = [
  {
    id: 1,
    from: "ai",
    content:
      "王阿姨您好～我是蜻蜓，您的健康管家 🌿\n点一个问题开始吧 👇",
    time: "刚刚",
  },
];

const presetQuestions = [
  { icon: Pill, label: "今天的药怎么吃？", color: "from-rose-400 to-rose-500" },
  { icon: UtensilsCrossed, label: "推荐一份午餐", color: "from-amber-400 to-orange-500" },
  { icon: Activity, label: "看看血压趋势", color: "from-emerald-400 to-green-500" },
  { icon: Stethoscope, label: "解读化验单", color: "from-teal-400 to-cyan-500" },
];

const askScopes = ["💊 用药", "🥗 饮食", "🚶 运动", "📈 化验单", "🎯 慢病管理"];

function XiaoqingChatPage() {
  const navigate = useNavigate();
  const [msgs, setMsgs] = useState<ChatMsg[]>(initialMsgs);
  const [input, setInput] = useState("");
  const [useArchive, setUseArchive] = useState(true);
  const [avatarFull, setAvatarFull] = useState<string>(defaultAvatarFull);
  const [generating, setGenerating] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleUpload = (file: File) => {
    setGenerating(true);
    const reader = new FileReader();
    reader.onload = () => {
      // 演示：直接用上传图替换全身像，模拟"专属虚拟人生成"
      setTimeout(() => {
        setAvatarFull(String(reader.result));
        setGenerating(false);
        toast.success("专属虚拟人已生成", { description: "蜻蜓已根据您的照片定制形象" });
      }, 1200);
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs]);

  const send = (text?: string) => {
    const t = (text ?? input).trim();
    if (!t) return;
    setMsgs((m) => [
      ...m,
      { id: Date.now(), from: "me", content: t, time: "刚刚" },
    ]);
    setInput("");
    setTimeout(() => {
      setMsgs((m) => [
        ...m,
        {
          id: Date.now() + 1,
          from: "ai",
          content:
            "收到啦～蜻蜓正在结合您的健康档案给您回复。如果是紧急问题，建议同步进入「医生对话」找李医生面诊哦。",
          time: "刚刚",
        },
      ]);
    }, 700);
  };

  const search = useSearch({ from: "/chat/xiaoqing" });
  const initialSentRef = useRef(false);
  useEffect(() => {
    if (search.message && typeof search.message === "string" && !initialSentRef.current) {
      initialSentRef.current = true;
      send(search.message);
      navigate({ to: "/chat/xiaoqing", search: {} });
    }
  }, [search]);

  return (
    <div className="mx-auto flex min-h-screen max-w-[480px] flex-col bg-gradient-bg">
      {/* Header */}
      <header className="flex items-center gap-3 bg-card px-4 pb-3 pt-12 shadow-soft">
        <button
          onClick={() => navigate({ to: "/" })}
          className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted"
          aria-label="返回"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div className="flex-1">
          <p className="text-base font-bold">蜻蜓 · 健康管家</p>
          <p className="text-xs text-muted-foreground">● 在线 · 蜻蜓大模型驱动</p>
        </div>
        <button
          onClick={() => toast("语音通话", { description: "正在为您接通蜻蜓语音模式…" })}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-soft text-primary"
          aria-label="语音"
        >
          <Phone className="h-5 w-5" />
        </button>
      </header>

      {/* AI 名片 / 大模型背书 */}
      <section className="px-4 pt-4">
        <article className="flex items-center gap-3 rounded-2xl bg-gradient-primary p-3 text-white shadow-elevated">
          <button
            onClick={() => fileRef.current?.click()}
            className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/25 backdrop-blur-sm active:scale-95"
            aria-label="上传专属虚拟人形象"
          >
            <img src={avatarFull} alt="蜻蜓" className="h-16 w-auto object-contain" />
            <span className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-white text-primary ring-2 ring-primary">
              <Upload className="h-3 w-3" />
            </span>
            {generating && (
              <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-[10px] font-bold">
                <Wand2 className="h-4 w-4 animate-pulse" />
              </span>
            )}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleUpload(f);
            }}
          />
          <div className="flex-1">
            <p className="flex items-center gap-1 text-lg font-bold">
              蜻蜓 <Sparkles className="h-4 w-4" />
            </p>
            <p className="mt-0.5 text-xs opacity-90">蜻蜓健康大模型 · 中老年专属</p>
            <button
              onClick={() => fileRef.current?.click()}
              className="mt-1 inline-flex items-center gap-1 rounded-full bg-white/25 px-2 py-0.5 text-[11px] font-bold active:scale-95"
            >
              <Wand2 className="h-3 w-3" /> 上传照片 · 生成专属虚拟人
            </button>
          </div>
        </article>
      </section>

      {/* Chat */}
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        <p className="text-center text-xs text-muted-foreground">— 和蜻蜓聊聊 —</p>
        {msgs.map((m) => (
          <div key={m.id} className={cn("flex gap-2", m.from === "me" ? "flex-row-reverse" : "flex-row")}>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted">
              {m.from === "me" ? (
                <span className="text-lg">👵</span>
              ) : (
                <img src={avatarFull} alt="蜻蜓" className="h-12 w-auto object-contain" />
              )}
            </div>
            <div className={cn("flex max-w-[78%] flex-col", m.from === "me" ? "items-end" : "items-start")}>
              <div
                className={cn(
                  "whitespace-pre-line rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed",
                  m.from === "me"
                    ? "rounded-tr-sm bg-primary text-primary-foreground"
                    : "rounded-tl-sm bg-card text-foreground shadow-card",
                )}
              >
                {m.content}
              </div>
              <span className="mt-1 px-1 text-[10px] text-muted-foreground">{m.time}</span>
            </div>
          </div>
        ))}

        {/* 预置问题 */}
        {msgs.length <= 1 && (
          <div className="ml-11 space-y-2 pt-1">
            <div className="grid grid-cols-1 gap-2">
              {presetQuestions.map((q) => {
                const Icon = q.icon;
                return (
                  <button
                    key={q.label}
                    onClick={() => send(q.label)}
                    className="flex items-center gap-2.5 rounded-2xl bg-card p-3 text-left text-[14px] font-medium text-foreground shadow-card active:scale-[0.98]"
                  >
                    <span
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white",
                        q.color,
                      )}
                    >
                      <Icon className="h-4 w-4" strokeWidth={2.4} />
                    </span>
                    {q.label}
                  </button>
                );
              })}
            </div>

            {/* 可问范围 */}
            <div className="rounded-2xl border border-dashed border-primary/40 bg-primary-soft/40 p-3">
              <p className="mb-2 flex items-center gap-1 text-xs font-bold text-primary">
                <Sparkles className="h-3.5 w-3.5" /> 您可以问我这些方面：
              </p>
              <div className="flex flex-wrap gap-1.5">
                {askScopes.map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-foreground shadow-card"
                  >
                    {s}
                  </span>
                ))}
              </div>
              <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
                蜻蜓不能替代医生诊断，紧急情况请拨打 120 或在「医嘱」中联系您的签约医生。
              </p>
            </div>
          </div>
        )}
      </div>

      {/* AI 工具条 + 输入框 */}
      <div className="space-y-2 bg-gradient-to-b from-transparent to-[oklch(0.96_0.03_290)] px-3 pb-4 pt-2">
        <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex shrink-0 items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-card">
            <FileHeart className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-semibold text-foreground">结合档案</span>
            <Switch
              checked={useArchive}
              onCheckedChange={(v) => {
                setUseArchive(v);
                toast(v ? "已开启「结合档案」" : "已关闭「结合档案」", {
                  description: v
                    ? "蜻蜓将参考您的健康档案、用药史与体检报告作答"
                    : "蜻蜓将以通用知识作答,不读取您的档案",
                });
              }}
            />
          </div>
          <button
            onClick={() => navigate({ to: "/health/plan" })}
            className="flex shrink-0 items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-foreground shadow-card active:scale-95"
          >
            <Stethoscope className="h-3.5 w-3.5 text-accent" />
            AI 诊室
          </button>
          <button
            onClick={() => navigate({ to: "/messages/doctor/$id", params: { id: "li" } })}
            className="flex shrink-0 items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-foreground shadow-card active:scale-95"
          >
            <Briefcase className="h-3.5 w-3.5 text-success" />
            找医生
          </button>
          <button
            onClick={() => toast("拍照识别", { description: "对准化验单/食物/患处拍照" })}
            className="flex shrink-0 items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-foreground shadow-card active:scale-95"
          >
            <ScanLine className="h-3.5 w-3.5 text-rose-500" />
            拍一拍
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-full bg-white px-2 py-1.5 shadow-card">
            <button
              onClick={() => toast("按住说话", { description: "语音消息会自动转文字" })}
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
              onClick={() => (input.trim() ? send() : toast("更多功能", { description: "发图 · 发文件 · 发位置" }))}
              aria-label={input.trim() ? "发送" : "更多"}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted active:scale-95"
            >
              <Plus className="h-5 w-5 text-foreground" />
            </button>
          </div>
          <button
            onClick={() => toast("拍照问蜻蜓", { description: "拍下化验单/食物/患处，让蜻蜓为您解读" })}
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

