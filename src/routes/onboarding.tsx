import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import {
  ArrowLeft,
  FileText,
  Upload,
  ClipboardList,
  Check,
  Camera,
  FileHeart,
  Stethoscope,
  Pill,
  ScrollText,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "完善健康档案 - 蜻蜓健康" },
      { name: "description", content: "上传报告或填写问卷，让蜻蜓更懂您。" },
    ],
  }),
  component: OnboardingPage,
});

const docTypes = [
  { key: "exam", label: "体检报告", icon: FileHeart, color: "from-emerald-400 to-green-500" },
  { key: "lab", label: "化验单", icon: ScrollText, color: "from-cyan-400 to-blue-500" },
  { key: "outpatient", label: "门诊单", icon: Stethoscope, color: "from-violet-400 to-purple-500" },
  { key: "admission", label: "入院单", icon: ClipboardList, color: "from-rose-400 to-red-500" },
  { key: "checkup", label: "检查单", icon: FileText, color: "from-amber-400 to-orange-500" },
  { key: "medicine", label: "用药记录", icon: Pill, color: "from-pink-400 to-rose-500" },
];

const questions = [
  {
    q: "您目前有以下哪些慢性疾病？（可多选）",
    options: ["高血压", "糖尿病", "高血脂", "冠心病", "都没有"],
    multi: true,
  },
  {
    q: "您日常的运动习惯是？",
    options: ["几乎不运动", "每周 1-2 次", "每周 3-5 次", "每天都运动"],
    multi: false,
  },
  {
    q: "您每天的睡眠时长大约？",
    options: ["少于 5 小时", "5-6 小时", "7-8 小时", "8 小时以上"],
    multi: false,
  },
];

function OnboardingPage() {
  const [step, setStep] = useState<"upload" | "survey" | "done">("upload");
  const [uploaded, setUploaded] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Record<number, string[]>>({});
  const [qIdx, setQIdx] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleUpload = (label: string) => {
    fileRef.current?.click();
    fileRef.current!.dataset.label = label;
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const label = e.target.dataset.label || "报告";
    setUploaded((prev) => [...prev, `${label} · ${f.name}`]);
    toast.success(`${label} 上传成功`, { description: "蜻蜓正在识别内容…" });
    e.target.value = "";
  };

  const handleAnswer = (option: string) => {
    const cur = answers[qIdx] || [];
    const isMulti = questions[qIdx].multi;
    let next: string[];
    if (isMulti) {
      next = cur.includes(option) ? cur.filter((o) => o !== option) : [...cur, option];
    } else {
      next = [option];
    }
    setAnswers({ ...answers, [qIdx]: next });
    if (!isMulti) {
      setTimeout(() => {
        if (qIdx < questions.length - 1) setQIdx(qIdx + 1);
        else setStep("done");
      }, 200);
    }
  };

  const handleNextQuestion = () => {
    if ((answers[qIdx] || []).length === 0) {
      toast("请至少选择一项");
      return;
    }
    if (qIdx < questions.length - 1) setQIdx(qIdx + 1);
    else setStep("done");
  };

  return (
    <div className="mx-auto min-h-screen max-w-[480px] bg-gradient-bg pb-8">
      <header className="bg-gradient-primary px-5 pb-8 pt-12 text-primary-foreground">
        <Link
          to="/"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm"
        >
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="mt-4 text-3xl font-bold">完善您的档案</h1>
        <p className="mt-1 text-base opacity-90">让蜻蜓给您更精准的健康建议</p>

        {/* 步骤指示 */}
        <div className="mt-5 flex items-center gap-2">
          {["upload", "survey", "done"].map((s, i) => (
            <div key={s} className="flex flex-1 items-center gap-2">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold",
                  step === s || (step === "done" && i < 2)
                    ? "bg-white text-primary"
                    : "bg-white/30 text-white",
                )}
              >
                {step === "done" && i < 2 ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              {i < 2 && <div className="h-0.5 flex-1 bg-white/30" />}
            </div>
          ))}
        </div>
      </header>

      {/* Step 1: 上传报告 */}
      {step === "upload" && (
        <>
          <section className="-mt-4 px-5">
            <div className="rounded-2xl bg-card p-5 shadow-card">
              <h2 className="text-lg font-bold text-foreground">上传医疗报告</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                支持拍照或上传图片/PDF，蜻蜓会自动识别
              </p>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {docTypes.map((d) => {
                  const Icon = d.icon;
                  return (
                    <button
                      key={d.key}
                      onClick={() => handleUpload(d.label)}
                      className="flex flex-col items-center gap-2 rounded-xl bg-muted/40 p-3 active:scale-95"
                    >
                      <div
                        className={cn(
                          "flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-soft",
                          d.color,
                        )}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="text-xs font-semibold text-foreground">
                        {d.label}
                      </span>
                    </button>
                  );
                })}
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                onChange={handleFile}
              />
            </div>

            {uploaded.length > 0 && (
              <div className="mt-3 rounded-2xl bg-card p-4 shadow-card">
                <p className="mb-2 text-sm font-semibold text-foreground">
                  已上传 {uploaded.length} 份
                </p>
                <ul className="space-y-1.5">
                  {uploaded.map((u, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-success" /> {u}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          <section className="mt-5 grid grid-cols-2 gap-3 px-5">
            <button
              onClick={() => setStep("survey")}
              className="flex min-h-[52px] items-center justify-center rounded-xl bg-muted text-base font-bold text-foreground active:scale-[0.98]"
            >
              先填问卷
            </button>
            <button
              onClick={() => setStep("survey")}
              className="flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-primary text-base font-bold text-primary-foreground shadow-soft active:scale-[0.98]"
            >
              下一步 <ClipboardList className="h-5 w-5" />
            </button>
          </section>
        </>
      )}

      {/* Step 2: 问卷 */}
      {step === "survey" && (
        <>
          <section className="-mt-4 px-5">
            <div className="rounded-2xl bg-card p-5 shadow-card">
              <p className="text-sm font-semibold text-primary">
                问题 {qIdx + 1} / {questions.length}
              </p>
              <h2 className="mt-2 text-xl font-bold text-foreground">
                {questions[qIdx].q}
              </h2>
              <div className="mt-4 space-y-2">
                {questions[qIdx].options.map((o) => {
                  const selected = (answers[qIdx] || []).includes(o);
                  return (
                    <button
                      key={o}
                      onClick={() => handleAnswer(o)}
                      className={cn(
                        "flex min-h-[56px] w-full items-center justify-between rounded-xl border-2 px-4 text-left text-base font-semibold transition-colors",
                        selected
                          ? "border-primary bg-primary-soft text-primary"
                          : "border-border bg-card text-foreground",
                      )}
                    >
                      {o}
                      {selected && <Check className="h-5 w-5 text-primary" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {questions[qIdx].multi && (
            <section className="mt-5 px-5">
              <button
                onClick={handleNextQuestion}
                className="flex min-h-[56px] w-full items-center justify-center rounded-xl bg-primary text-base font-bold text-primary-foreground shadow-soft active:scale-[0.98]"
              >
                {qIdx < questions.length - 1 ? "下一题" : "完成问卷"}
              </button>
            </section>
          )}
        </>
      )}

      {/* Step 3: 完成 */}
      {step === "done" && (
        <section className="px-5 pt-12 text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary to-success shadow-elevated">
            <Check className="h-12 w-12 text-white" strokeWidth={3} />
          </div>
          <h2 className="mt-6 text-2xl font-bold text-foreground">档案完善成功！</h2>
          <p className="mt-2 text-base text-muted-foreground">
            已为您建立专属健康档案，<br />
            蜻蜓会根据您的情况定制方案
          </p>
          <div className="mt-8 space-y-3">
            <button
              onClick={() => navigate({ to: "/health/plan" })}
              className="flex min-h-[56px] w-full items-center justify-center gap-2 rounded-xl bg-primary text-base font-bold text-primary-foreground shadow-soft active:scale-[0.98]"
            >
              查看我的健康方案
            </button>
            <button
              onClick={() => navigate({ to: "/" })}
              className="flex min-h-[56px] w-full items-center justify-center rounded-xl bg-muted text-base font-bold text-foreground active:scale-[0.98]"
            >
              返回首页
            </button>
          </div>
        </section>
      )}

      {/* 拍照备用按钮 */}
      {step === "upload" && (
        <section className="mt-5 px-5">
          <button
            onClick={() => handleUpload("拍照上传")}
            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary/40 bg-primary-soft p-4 text-base font-semibold text-primary active:scale-[0.98]"
          >
            <Camera className="h-5 w-5" /> 直接拍照上传
            <Upload className="h-5 w-5" />
          </button>
        </section>
      )}
    </div>
  );
}
