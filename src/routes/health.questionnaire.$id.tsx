import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ChevronRight, ClipboardList, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { MobileLayout } from "@/components/MobileLayout";

export const Route = createFileRoute("/health/questionnaire/$id")({
  head: () => ({
    meta: [
      { title: "健康问卷 - 蜻蜓健康" },
      { name: "description", content: "完成问卷以获取更精准的健康方案。" },
    ],
  }),
  component: QuestionnairePage,
});

const meta: Record<string, { name: string; desc: string; reward: number }> = {
  special: { name: "专病问卷", desc: "针对糖尿病、高血压等慢病", reward: 30 },
  risk: { name: "风险评估问卷", desc: "心脑血管、骨质疏松风险", reward: 20 },
  lifestyle: { name: "生活方式问卷", desc: "饮食、作息、运动习惯", reward: 15 },
};

const questions = [
  { q: "您每周锻炼几次?", opts: ["几乎不锻炼", "1-2 次", "3-4 次", "5 次以上"] },
  { q: "您日均饮水量?", opts: ["少于 4 杯", "4-6 杯", "6-8 杯", "8 杯以上"] },
  { q: "您每日睡眠时长?", opts: ["少于 6 小时", "6-7 小时", "7-8 小时", "8 小时以上"] },
  { q: "您是否有定期体检的习惯?", opts: ["从不", "2-3 年一次", "1 年一次", "半年一次"] },
];

function QuestionnairePage() {
  const navigate = useNavigate();
  const { id } = useParams({ from: "/health/questionnaire/$id" });
  const info = meta[id] ?? { name: "健康问卷", desc: "请如实作答", reward: 10 };
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  const choose = (idx: number) => {
    const next = [...answers, idx];
    setAnswers(next);
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      toast.success(`《${info.name}》已完成`, { description: `+${info.reward} 健康积分,已为您更新方案` });
      setTimeout(() => {
        if (typeof window !== "undefined" && window.history.length > 1) {
          window.history.back();
        } else {
          navigate({ to: "/health/plan" });
        }
      }, 600);
    }
  };

  const goBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      window.history.back();
    } else {
      navigate({ to: "/health/plan" });
    }
  };

  return (
    <MobileLayout>
      <header className="flex items-center gap-3 bg-card px-5 pb-4 pt-12 shadow-soft">
        <button
          onClick={goBack}
          className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted active:scale-95"
          aria-label="返回上一步"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-bold">{info.name}</h1>
          <p className="text-xs text-muted-foreground">{info.desc}</p>
        </div>
        <span className="rounded-full bg-primary-soft px-2.5 py-1 text-xs font-bold text-primary">
          +{info.reward} 积分
        </span>
      </header>

      <div className="px-5 pt-4">
        <div className="mb-2 flex justify-between text-xs text-muted-foreground">
          <span>{step + 1} / {questions.length}</span>
          <span>{Math.round(((step + 1) / questions.length) * 100)}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-success transition-all"
            style={{ width: `${((step + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <section className="mt-5 px-5">
        <div className="rounded-2xl bg-card p-5 shadow-card">
          <p className="flex items-start gap-2 text-base font-bold text-foreground">
            <ClipboardList className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            {questions[step].q}
          </p>
          <div className="mt-4 space-y-2">
            {questions[step].opts.map((o, i) => (
              <button
                key={o}
                onClick={() => choose(i)}
                className="flex w-full items-center justify-between rounded-xl border border-border bg-card p-4 text-left text-base font-semibold text-foreground active:scale-[0.98] hover:border-primary hover:bg-primary-soft"
              >
                <span>{o}</span>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-start gap-2 rounded-xl bg-success/10 p-3 text-xs text-muted-foreground">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
          <p>您的回答仅用于生成个性化健康方案,蜻蜓健康承诺严格保密。</p>
        </div>
      </section>
    </MobileLayout>
  );
}
