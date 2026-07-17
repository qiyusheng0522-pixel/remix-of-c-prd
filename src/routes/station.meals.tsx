import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Soup, Hospital, Check, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { StationSubPage, StationCard } from "@/components/StationSubPage";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/station/meals")({
  head: () => ({
    meta: [
      { title: "营养餐 - 蜻蜓健康" },
      { name: "description", content: "驿站营养餐：控糖、低盐、高蛋白，专病套餐可直送三甲医院。" },
    ],
  }),
  component: MealsPage,
});

const daily = [
  { name: "杂粮养生粥", price: 12, cal: 280, tag: "控糖", emoji: "🥣" },
  { name: "清蒸鲈鱼套餐", price: 38, cal: 420, tag: "高蛋白", emoji: "🐟" },
  { name: "时蔬豆腐煲", price: 22, cal: 260, tag: "低脂", emoji: "🥬" },
  { name: "山药排骨汤", price: 28, cal: 320, tag: "养胃", emoji: "🍲" },
  { name: "紫薯小米饭", price: 8, cal: 180, tag: "粗粮", emoji: "🍚" },
];

const specials = [
  { id: "diabetes", name: "糖尿病专病套餐", desc: "控糖餐 + 周复诊 + 血糖远程随访", price: "¥1980/月" },
  { id: "hypertension", name: "高血压专病套餐", desc: "低盐 DASH 餐 + 每日血压监测 + 医生周报", price: "¥1680/月" },
  { id: "tumor", name: "肿瘤术后康复套餐", desc: "高蛋白配餐 + 营养师 1v1 + 心理疏导", price: "¥3280/月" },
  { id: "kidney", name: "肾病专病套餐", desc: "低嘌呤低钾配餐 + 透析期随访", price: "¥2680/月" },
  { id: "elder", name: "老年慢病综合套餐", desc: "三高联调 + 跌倒预警 + 家属同步", price: "¥2380/月" },
];

const hospitals = [
  { id: "gulou", name: "鼓楼医院", tag: "三甲 · 综合" },
  { id: "spph", name: "省人民医院", tag: "三甲 · 综合" },
  { id: "tcm", name: "省中医院", tag: "三甲 · 中医" },
  { id: "zhongda", name: "东南大学附属中大医院", tag: "三甲 · 综合" },
  { id: "tumor", name: "省肿瘤医院", tag: "三甲 · 肿瘤" },
];

function MealsPage() {
  const [tab, setTab] = useState<"daily" | "special">("daily");
  const [pkg, setPkg] = useState<string | null>(null);
  const [hosp, setHosp] = useState<string | null>(null);
  const navigate = useNavigate();
  const chosenPkg = specials.find((p) => p.id === pkg);

  return (
    <StationSubPage
      title="营养餐"
      subtitle="营养师定制 · 控糖 / 低盐 / 高蛋白"
      Icon={Soup}
      gradient="from-emerald-500 to-teal-600"
    >
      <div className="grid grid-cols-2 gap-1 rounded-2xl bg-card p-1.5 shadow-card">
        {(
          [
            { k: "daily", label: "今日单点" },
            { k: "special", label: "专病套餐" },
          ] as const
        ).map((t) => (
          <button
            key={t.k}
            onClick={() => {
              setTab(t.k);
              setPkg(null);
              setHosp(null);
            }}
            className={cn(
              "rounded-xl py-3 text-sm font-bold transition-all",
              tab === t.k
                ? "bg-primary text-primary-foreground shadow-soft"
                : "text-muted-foreground",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "daily" && (
        <div className="space-y-3">
          {daily.map((m) => (
            <article key={m.name} className="flex items-center gap-3 rounded-2xl bg-card p-4 shadow-card">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-muted text-3xl">
                {m.emoji}
              </div>
              <div className="flex-1">
                <p className="text-base font-bold text-foreground">{m.name}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {m.cal} 千卡 · {m.tag}
                </p>
                <p className="mt-1 text-base font-bold text-accent">¥ {m.price}</p>
              </div>
              <button
                onClick={() =>
                  toast.success(`已加购：${m.name}`, { description: "可到店取或外送" })
                }
                className="flex h-11 items-center justify-center rounded-full bg-primary px-4 text-sm font-bold text-primary-foreground shadow-soft active:scale-95"
              >
                加购
              </button>
            </article>
          ))}
        </div>
      )}

      {tab === "special" && !pkg && (
        <StationCard desc="按病种定制 · 营养师审核 · 可配送至各大三甲医院">
          <div className="space-y-3">
            {specials.map((p) => (
              <button
                key={p.id}
                onClick={() => setPkg(p.id)}
                className="flex w-full items-center gap-3 rounded-2xl bg-muted/50 p-3 text-left active:scale-[0.99]"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <Soup className="h-6 w-6" />
                </span>
                <div className="flex-1">
                  <p className="text-base font-bold">{p.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{p.desc}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-primary">{p.price}</p>
                  <ChevronRight className="ml-auto mt-1 h-4 w-4 text-muted-foreground" />
                </div>
              </button>
            ))}
          </div>
        </StationCard>
      )}

      {tab === "special" && pkg && chosenPkg && (
        <>
          <StationCard title={chosenPkg.name} desc={`${chosenPkg.desc} · ${chosenPkg.price}`}>
            <p className="text-sm font-bold text-foreground">选择配送医院</p>
            <div className="mt-3 space-y-2">
              {hospitals.map((h) => {
                const active = hosp === h.id;
                return (
                  <button
                    key={h.id}
                    onClick={() => setHosp(h.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-2xl border-2 p-3 text-left active:scale-[0.99]",
                      active ? "border-primary bg-primary-soft" : "border-transparent bg-muted/50",
                    )}
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-primary">
                      <Hospital className="h-5 w-5" />
                    </span>
                    <div className="flex-1">
                      <p className="text-base font-bold">{h.name}</p>
                      <p className="text-xs text-muted-foreground">{h.tag}</p>
                    </div>
                    {active && <Check className="h-5 w-5 text-primary" />}
                  </button>
                );
              })}
            </div>
          </StationCard>

          <div className="sticky bottom-24 mt-4 flex gap-2">
            <button
              onClick={() => {
                setPkg(null);
                setHosp(null);
              }}
              className="flex min-h-[56px] flex-1 items-center justify-center rounded-2xl border-2 border-muted text-base font-bold text-muted-foreground"
            >
              返回
            </button>
            <button
              disabled={!hosp}
              onClick={() => {
                const h = hospitals.find((x) => x.id === hosp);
                toast.success(`${chosenPkg.name} · 已预约`, {
                  description: `配送至 ${h?.name} · 营养师 1 小时内联系您`,
                });
                setTimeout(() => navigate({ to: "/station" }), 600);
              }}
              className={cn(
                "flex min-h-[56px] flex-[2] items-center justify-center rounded-2xl text-base font-bold text-primary-foreground shadow-elevated",
                hosp ? "bg-gradient-primary active:scale-[0.98]" : "bg-muted-foreground/40",
              )}
            >
              确认预约
            </button>
          </div>
        </>
      )}
    </StationSubPage>
  );
}