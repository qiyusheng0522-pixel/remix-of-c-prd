import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Wine, Cigarette, Moon, BedDouble } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type SpecialType = "alcohol" | "smoke" | "late-night" | "insomnia";

type Flow = {
  title: string;
  Icon: LucideIcon;
  desc: string;
  questions: { q: string; options: string[] }[];
};

const flows: Record<SpecialType, Flow> = {
  alcohol: {
    title: "饮酒情况",
    Icon: Wine,
    desc: "如实记录有助于蜻蜓调整今日方案",
    questions: [
      { q: "喝了什么？", options: ["啤酒", "白酒", "红酒", "其他"] },
      { q: "大概多少？", options: ["一点", "一杯", "两杯以上"] },
      { q: "是否空腹？", options: ["是", "否"] },
    ],
  },
  smoke: {
    title: "吸烟情况",
    Icon: Cigarette,
    desc: "记录后蜻蜓会评估今日肺部负担",
    questions: [
      { q: "今天大概抽了多少？", options: ["1-2 支", "半包", "一包以上"] },
      { q: "主要时段？", options: ["饭前", "饭后", "睡前"] },
      { q: "是否有咳嗽？", options: ["有", "没有"] },
    ],
  },
  "late-night": {
    title: "熬夜情况",
    Icon: Moon,
    desc: "明天蜻蜓会提醒您补眠",
    questions: [
      { q: "昨晚几点入睡？", options: ["12 点前", "12-2 点", "2 点后"] },
      { q: "主要原因？", options: ["加班", "追剧", "失眠", "其他"] },
      { q: "白天是否补觉？", options: ["有", "没有"] },
    ],
  },
  insomnia: {
    title: "失眠情况",
    Icon: BedDouble,
    desc: "我们会推送助眠建议",
    questions: [
      { q: "入睡花了多久？", options: ["1 小时内", "1-2 小时", "超过 2 小时"] },
      { q: "夜间惊醒次数？", options: ["未惊醒", "1-2 次", "3 次以上"] },
      { q: "白天精神状态？", options: ["还行", "疲惫", "很困"] },
    ],
  },
};

const chooser: { key: SpecialType; label: string; Icon: LucideIcon; cls: string }[] = [
  { key: "alcohol", label: "饮酒", Icon: Wine, cls: "bg-rose-100 text-rose-700" },
  { key: "smoke", label: "抽烟", Icon: Cigarette, cls: "bg-amber-100 text-amber-700" },
  { key: "late-night", label: "熬夜", Icon: Moon, cls: "bg-indigo-100 text-indigo-700" },
  { key: "insomnia", label: "失眠", Icon: BedDouble, cls: "bg-violet-100 text-violet-700" },
];

export function SpecialConditionModal({
  open,
  onOpenChange,
  initialType,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initialType?: SpecialType;
}) {
  const [type, setType] = useState<SpecialType | null>(initialType ?? null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      setType(initialType ?? null);
      setStep(0);
      setAnswers([]);
    }
  }, [open, initialType]);

  const flow = type ? flows[type] : null;

  const handleSelect = (opt: string) => {
    if (!flow) return;
    const next = [...answers, opt];
    if (step + 1 < flow.questions.length) {
      setAnswers(next);
      setStep(step + 1);
    } else {
      toast.success(`${flow.title}已记录`, {
        description: next.join(" · ") + "，蜻蜓已为您更新今日建议",
      });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[420px]">
        {!type ? (
          <>
            <DialogHeader>
              <DialogTitle>今日特殊情况</DialogTitle>
              <DialogDescription>
                请选择今天发生的情况，蜻蜓会主动调整方案
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-3">
              {chooser.map((c) => (
                <button
                  key={c.key}
                  onClick={() => setType(c.key)}
                  className={`flex flex-col items-center gap-2 rounded-2xl py-5 ${c.cls} active:scale-95`}
                >
                  <c.Icon className="h-7 w-7" strokeWidth={2} />
                  <span className="text-base font-bold">{c.label}</span>
                </button>
              ))}
            </div>
          </>
        ) : flow ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <flow.Icon className="h-6 w-6 text-primary" strokeWidth={2} />
                {flow.title}
              </DialogTitle>
              <DialogDescription>
                {flow.desc} · 第 {step + 1} / {flow.questions.length} 步
              </DialogDescription>
            </DialogHeader>
            <p className="text-base font-bold text-foreground">
              {flow.questions[step].q}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {flow.questions[step].options.map((o) => (
                <button
                  key={o}
                  onClick={() => handleSelect(o)}
                  className="min-h-[48px] rounded-xl bg-muted px-4 py-3 text-sm font-semibold text-foreground active:scale-95"
                >
                  {o}
                </button>
              ))}
            </div>
            {!initialType && (
              <button
                onClick={() => {
                  setType(null);
                  setStep(0);
                  setAnswers([]);
                }}
                className="text-left text-xs text-muted-foreground"
              >
                ← 返回选择
              </button>
            )}
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
