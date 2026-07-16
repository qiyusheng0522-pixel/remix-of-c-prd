import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ShieldCheck, Building2, UserRound, ChevronRight } from "lucide-react";
import { MobileLayout } from "@/components/MobileLayout";

export const Route = createFileRoute("/partners")({
  head: () => ({
    meta: [
      { title: "权威背书 · 江苏亚寰健康" },
      { name: "description", content: "江苏亚寰健康与南京三甲医院及权威专家团队的循证合作。" },
    ],
  }),
  component: PartnersPage,
});

const hospitals = [
  { id: "gulou", name: "南京鼓楼医院", desc: "陪诊 · 报告解读 · 专病套餐直达" },
  { id: "jsph", name: "江苏省人民医院", desc: "心内 / 内分泌 专病随访" },
  { id: "njtcm", name: "南京市中医院", desc: "中医体质辨识 · 针灸康复" },
  { id: "jstcm", name: "江苏省中医院", desc: "养生茶饮 · 中药代煎" },
  { id: "njmu1", name: "南京医科大学第一附属医院", desc: "呼吸慢病 · 康复医学" },
];

function PartnersPage() {
  const navigate = useNavigate();
  return (
    <MobileLayout>
      <div className="min-h-screen bg-gradient-to-b from-primary-soft/30 to-background pb-8">
        <header className="flex items-center gap-3 px-4 pt-10 pb-4">
          <button
            onClick={() => navigate({ to: "/" })}
            aria-label="返回"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-card active:scale-95"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold">权威背书</h1>
            <p className="text-xs text-muted-foreground">江苏亚寰健康 · 循证合作</p>
          </div>
        </header>

        <section className="mx-4 mb-4 rounded-2xl bg-gradient-warm p-4 text-white shadow-elevated">
          <div className="mb-1 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" />
            <span className="text-sm font-bold">您的健康建议 均有出处</span>
          </div>
          <p className="text-xs leading-relaxed opacity-95">
            蜻蜓康健由江苏亚寰健康运营，与南京三甲医院及权威专家团队循证合作，AI 建议、健康方案、专病营养餐均有出处。
          </p>
        </section>

        <button
          onClick={() => navigate({ to: "/partners/$id", params: { id: "yahuan" } })}
          className="mx-4 mb-4 flex w-[calc(100%-2rem)] items-center gap-3 rounded-2xl bg-white p-4 text-left shadow-card active:scale-[0.98]"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-white">
            <ShieldCheck className="h-6 w-6" />
          </span>
          <div className="flex-1">
            <p className="font-bold">江苏亚寰健康</p>
            <p className="mt-0.5 text-xs text-muted-foreground">南京三甲医院 · 合作医生名单</p>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </button>

        <div className="mx-4 mb-2 text-xs font-semibold text-muted-foreground">合作三甲医院</div>
        <div className="space-y-2 px-4">
          {hospitals.map((h) => (
            <button
              key={h.id}
              onClick={() => navigate({ to: "/partners/$id", params: { id: h.id } })}
              className="flex w-full items-start gap-3 rounded-2xl bg-white p-4 text-left shadow-card active:scale-[0.98]"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <Building2 className="h-6 w-6" />
              </span>
              <div className="flex-1">
                <p className="font-bold">{h.name}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{h.desc}</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>
    </MobileLayout>
  );
}
