import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { ArrowLeft, Camera, Image as ImageIcon, Check, Sparkles, Wine } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { SpecialConditionModal } from "@/components/SpecialConditionModal";

export const Route = createFileRoute("/health/meal")({
  head: () => ({
    meta: [
      { title: "拍食物打卡 - 蜻蜓健康" },
      { name: "description", content: "拍一拍今天吃了什么，让蜻蜓为您分析营养。" },
    ],
  }),
  component: MealCheckIn,
});

type MealType = "breakfast" | "lunch" | "dinner";
const meals: { key: MealType; label: string; emoji: string }[] = [
  { key: "breakfast", label: "早餐", emoji: "🥣" },
  { key: "lunch", label: "午餐", emoji: "🍱" },
  { key: "dinner", label: "晚餐", emoji: "🍲" },
];

function MealCheckIn() {
  const [meal, setMeal] = useState<MealType>("lunch");
  const [photo, setPhoto] = useState<string | null>(null);
  const [analyzed, setAnalyzed] = useState(false);
  const [alcoholDetected, setAlcoholDetected] = useState(false);
  const [alcoholModalOpen, setAlcoholModalOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setPhoto(url);
    setAnalyzed(false);
    setAlcoholDetected(false);
    toast("照片已上传", { description: "蜻蜓正在为您分析…" });
    setTimeout(() => {
      setAnalyzed(true);
      // 示例效果：识别到画面中含有酒类
      const detected = true;
      setAlcoholDetected(detected);
      if (detected) {
        setAlcoholModalOpen(true);
      } else {
        toast.success("分析完成！", { description: "今日午餐营养均衡，做得很好" });
      }
    }, 1500);
  };

  const handleSubmit = () => {
    if (!photo) {
      toast("请先拍一张食物照片", { description: "点击上方相机按钮即可" });
      return;
    }
    toast.success("打卡成功！", { description: "已记录今日饮食，继续坚持～" });
    setTimeout(() => navigate({ to: "/" }), 800);
  };

  return (
    <div className="mx-auto min-h-screen max-w-[480px] bg-gradient-bg pb-8">
      <header className="bg-gradient-primary px-5 pb-10 pt-12 text-primary-foreground">
        <Link
          to="/"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm"
        >
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="mt-4 text-3xl font-bold">拍食物打卡</h1>
        <p className="mt-1 text-base opacity-90">拍一拍今天吃了什么，蜻蜓帮您看营养</p>
      </header>

      {/* 选择餐别 */}
      <section className="-mt-4 px-5">
        <div className="grid grid-cols-3 gap-2 rounded-2xl bg-card p-2 shadow-card">
          {meals.map((m) => (
            <button
              key={m.key}
              onClick={() => setMeal(m.key)}
              className={cn(
                "flex flex-col items-center gap-1 rounded-xl py-3 transition-colors",
                meal === m.key
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground",
              )}
            >
              <span className="text-2xl">{m.emoji}</span>
              <span className="text-sm font-semibold">{m.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* 拍照区 */}
      <section className="mt-4 px-5">
        <div className="overflow-hidden rounded-2xl bg-card shadow-card">
          {photo ? (
            <img src={photo} alt="食物" className="h-72 w-full object-cover" />
          ) : (
            <div className="flex h-72 flex-col items-center justify-center gap-3 bg-muted/40">
              <Camera className="h-16 w-16 text-muted-foreground" strokeWidth={1.5} />
              <p className="text-base text-muted-foreground">还没有照片</p>
            </div>
          )}
          <div className="grid grid-cols-2 gap-2 p-3">
            <button
              onClick={() => fileRef.current?.click()}
              className="flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-primary text-base font-bold text-primary-foreground shadow-soft active:scale-[0.98]"
            >
              <Camera className="h-5 w-5" /> 拍照
            </button>
            <button
              onClick={() => fileRef.current?.click()}
              className="flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-muted text-base font-bold text-foreground active:scale-[0.98]"
            >
              <ImageIcon className="h-5 w-5" /> 从相册选
            </button>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFile}
          />
        </div>
      </section>

      {/* 识别到酒类 · 主动询问 */}
      {analyzed && alcoholDetected && (
        <section className="mt-4 px-5">
          <div className="rounded-2xl border-2 border-rose-300 bg-rose-50 p-4">
            <div className="mb-2 flex items-center gap-2">
              <Wine className="h-5 w-5 text-rose-600" />
              <span className="text-base font-bold text-rose-700">
                蜻蜓发现画面里似乎有酒
              </span>
            </div>
            <p className="text-[15px] leading-relaxed text-foreground">
              请问您今天是否饮酒了？如实告诉蜻蜓，方便为您调整今日方案。
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                onClick={() => setAlcoholModalOpen(true)}
                className="min-h-[48px] rounded-xl bg-rose-600 text-sm font-bold text-white active:scale-95"
              >
                是 · 记录一下
              </button>
              <button
                onClick={() => {
                  setAlcoholDetected(false);
                  toast("好的，蜻蜓已忽略");
                }}
                className="min-h-[48px] rounded-xl bg-white text-sm font-bold text-rose-700 ring-1 ring-rose-300 active:scale-95"
              >
                没有 · 识别错了
              </button>
            </div>
          </div>
        </section>
      )}

      {/* AI 分析结果 */}
      {analyzed && (
        <section className="mt-4 px-5">
          <div className="rounded-2xl border-2 border-primary/30 bg-primary-soft p-4">
            <div className="mb-2 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="text-base font-bold text-primary">蜻蜓的分析</span>
            </div>
            <ul className="space-y-1.5 text-[15px] leading-relaxed text-foreground">
              <li>✅ 蛋白质：约 28g（优质）</li>
              <li>✅ 蔬菜量：约 200g（充足）</li>
              <li>⚠️ 主食略多，建议下次少半碗米饭</li>
              <li>💡 建议餐后散步 15 分钟帮助消化</li>
            </ul>
          </div>
        </section>
      )}

      {/* 提交 */}
      <section className="mt-5 px-5">
        <button
          onClick={handleSubmit}
          className="flex min-h-[60px] w-full items-center justify-center gap-2 rounded-2xl bg-gradient-warm text-lg font-bold text-white shadow-elevated active:scale-[0.98]"
        >
          <Check className="h-6 w-6" strokeWidth={3} />
          完成饮食打卡
        </button>
      </section>

      <SpecialConditionModal
        open={alcoholModalOpen}
        onOpenChange={setAlcoholModalOpen}
        initialType="alcohol"
      />
    </div>
  );
}
