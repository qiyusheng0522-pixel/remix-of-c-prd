import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

type Mode = "bp" | "bg";

export function IndicatorEntryModal({
  open,
  onOpenChange,
  initialMode = "bp",
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initialMode?: Mode;
}) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [sys, setSys] = useState("");
  const [dia, setDia] = useState("");
  const [bg, setBg] = useState("");
  const [followUp, setFollowUp] = useState<
    | null
    | { title: string; desc: string; tips: string[] }
  >(null);

  useEffect(() => {
    if (open) {
      setMode(initialMode);
      setSys("");
      setDia("");
      setBg("");
      setFollowUp(null);
    }
  }, [open, initialMode]);

  const handleSubmit = () => {
    if (mode === "bp") {
      const s = Number(sys);
      const d = Number(dia);
      if (!s || !d) {
        toast("请填写完整的收缩压和舒张压");
        return;
      }
      const high = s >= 140 || d >= 90;
      const low = s < 90 || d < 60;
      toast.success(`血压 ${s}/${d} mmHg 已录入`);
      if (high || low) {
        setFollowUp({
          title: `血压偏${high ? "高" : "低"} · 蜻蜓关心一下`,
          desc: `${s}/${d} mmHg 偏离正常范围，请回答以便分析原因`,
          tips: [
            "今天是否饮酒或吸烟？",
            "昨晚睡眠是否不足？",
            "今日是否按时服降压药？",
            "是否情绪紧张或剧烈运动？",
          ],
        });
      } else {
        onOpenChange(false);
      }
    } else {
      const v = Number(bg);
      if (!v) {
        toast("请填写血糖值");
        return;
      }
      const high = v >= 7.0;
      const low = v < 3.9;
      toast.success(`血糖 ${v} mmol/L 已录入`);
      if (high || low) {
        setFollowUp({
          title: `血糖偏${high ? "高" : "低"} · 蜻蜓关心一下`,
          desc: `${v} mmol/L 偏离正常范围，请回答以便分析原因`,
          tips: [
            "最近一餐吃了什么？",
            "进食距测量多久？",
            "是否漏服降糖药？",
            "近期是否运动量变化？",
          ],
        });
      } else {
        onOpenChange(false);
      }
    }
  };

  return (
    <>
      <Dialog open={open && !followUp} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[420px]">
          <DialogHeader>
            <DialogTitle>录入指标</DialogTitle>
            <DialogDescription>
              选择指标并填写数值，异常时蜻蜓会主动询问
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2">
            {(["bp", "bg"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 rounded-xl py-2.5 text-sm font-bold ${
                  mode === m
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {m === "bp" ? "血压" : "血糖"}
              </button>
            ))}
          </div>
          {mode === "bp" ? (
            <div className="grid grid-cols-2 gap-2">
              <input
                value={sys}
                onChange={(e) => setSys(e.target.value)}
                type="number"
                placeholder="收缩压"
                className="min-h-[52px] rounded-xl border border-border bg-background px-3 text-base"
              />
              <input
                value={dia}
                onChange={(e) => setDia(e.target.value)}
                type="number"
                placeholder="舒张压"
                className="min-h-[52px] rounded-xl border border-border bg-background px-3 text-base"
              />
            </div>
          ) : (
            <input
              value={bg}
              onChange={(e) => setBg(e.target.value)}
              type="number"
              step="0.1"
              placeholder="血糖 mmol/L"
              className="min-h-[52px] w-full rounded-xl border border-border bg-background px-3 text-base"
            />
          )}
          <button
            onClick={handleSubmit}
            className="min-h-[52px] rounded-xl bg-primary text-base font-bold text-primary-foreground active:scale-[0.98]"
          >
            提交录入
          </button>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!followUp}
        onOpenChange={(v) => {
          if (!v) {
            setFollowUp(null);
            onOpenChange(false);
          }
        }}
      >
        <DialogContent className="max-w-[420px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-2xl">⚠️</span>
              {followUp?.title}
            </DialogTitle>
            <DialogDescription>{followUp?.desc}</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {followUp?.tips.map((t) => (
              <button
                key={t}
                onClick={() => toast.success("已记录，谢谢您～")}
                className="w-full rounded-xl bg-muted px-4 py-3 text-left text-sm font-semibold text-foreground active:scale-[0.99]"
              >
                {t}
              </button>
            ))}
          </div>
          <button
            onClick={() => {
              setFollowUp(null);
              onOpenChange(false);
              toast.success("已生成分析建议", {
                description: "可在健康档案趋势中查看",
              });
            }}
            className="min-h-[52px] rounded-xl bg-primary text-base font-bold text-primary-foreground"
          >
            完成并查看建议
          </button>
        </DialogContent>
      </Dialog>
    </>
  );
}
