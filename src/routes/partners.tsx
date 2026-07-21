import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  ShieldCheck,
  Building2,
  UserRound,
  ChevronRight,
  GraduationCap,
  FlaskConical,
  PlayCircle,
  MapPin,
} from "lucide-react";
import { MobileLayout } from "@/components/MobileLayout";
import { toast } from "sonner";

export const Route = createFileRoute("/partners")({
  head: () => ({
    meta: [
      { title: "权威背书 · 江苏亚寰健康" },
      { name: "description", content: "江苏亚寰健康 · 专病科研、科研合作医院、专家与高校。" },
    ],
  }),
  component: PartnersPage,
});

type Tab = "research" | "hospital" | "expert" | "school";

const researchProjects = [
  { disease: "糖尿病", title: "老年 2 型糖尿病一体化管理", partner: "南京鼓楼医院内分泌科", stage: "III 期" },
  { disease: "高血压", title: "社区高血压智慧随访方案", partner: "江苏省人民医院心内科", stage: "II 期" },
  { disease: "肌少症", title: "老年营养不良与肌少症干预", partner: "北京协和医院临床营养科", stage: "II 期" },
  { disease: "冠心病", title: "冠心病院外心脏康复课题", partner: "南京医科大学第一附属医院", stage: "III 期" },
  { disease: "骨质疏松", title: "骨骼退行性疾病居家干预", partner: "北京大学第三医院骨科", stage: "I 期" },
  { disease: "中医体质", title: "中医体质辨识与慢病预防", partner: "江苏省中医院", stage: "长期" },
];

const hospitalsByRegion: Record<string, { id: string; name: string; desc: string }[]> = {
  南京: [
    { id: "gulou", name: "南京鼓楼医院", desc: "陪诊 · 报告解读 · 专病套餐直达" },
    { id: "jsph", name: "江苏省人民医院", desc: "心内 / 内分泌 专病随访" },
    { id: "njmu1", name: "南京医科大学第一附属医院", desc: "呼吸慢病 · 康复医学" },
    { id: "njtcm", name: "南京市中医院", desc: "中医体质辨识 · 针灸康复" },
    { id: "jstcm", name: "江苏省中医院", desc: "养生茶饮 · 中药代煎" },
  ],
  北京: [
    { id: "pumc", name: "北京协和医院", desc: "临床营养 · 医学减重" },
    { id: "bjh", name: "北京医院", desc: "老年心血管综合治疗" },
    { id: "puth", name: "北京大学第三医院", desc: "运动医学 · 骨科" },
  ],
  江苏其他: [
    { id: "ntu", name: "南通大学附属医院", desc: "神经再生临床研究" },
  ],
};

const schoolsByRegion: Record<string, { name: string; desc: string }[]> = {
  南京: [
    { name: "南京中医药大学", desc: "中医未病学 · 慢病预防课题" },
    { name: "南京体育学院", desc: "运动心理 · 老年康复居家平台" },
    { name: "南京医科大学", desc: "呼吸慢病 · 健康管理研究" },
  ],
  北京: [
    { name: "北京中医药大学", desc: "中医体质辨识与慢病干预" },
    { name: "北京大学医学部", desc: "骨骼退行性疾病研究" },
  ],
  上海: [
    { name: "上海体育大学", desc: "老年体适能标准化研究" },
  ],
};

function PartnersPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("research");
  const [region, setRegion] = useState<string>("南京");

  const tabs: { id: Tab; label: string; icon: typeof FlaskConical }[] = [
    { id: "research", label: "专病科研", icon: FlaskConical },
    { id: "hospital", label: "合作医院", icon: Building2 },
    { id: "expert", label: "合作专家", icon: UserRound },
    { id: "school", label: "合作高校", icon: GraduationCap },
  ];

  return (
    <MobileLayout>
      <div className="min-h-screen bg-gradient-to-b from-primary-soft/30 to-background pb-8">
        <header className="flex items-center gap-3 px-4 pt-10 pb-3">
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

        {/* 企业宣传视频 */}
        <section className="mx-4 mb-4 overflow-hidden rounded-2xl shadow-elevated">
          <button
            onClick={() => toast.success("正在播放企业宣传视频…", { description: "江苏亚寰健康 · 3 分钟品牌短片" })}
            className="relative flex aspect-video w-full items-center justify-center bg-gradient-to-br from-primary to-emerald-600 text-white active:opacity-95"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.25),transparent_60%)]" />
            <div className="relative flex flex-col items-center gap-1">
              <PlayCircle className="h-16 w-16 drop-shadow-lg" strokeWidth={1.5} />
              <span className="text-sm font-bold">江苏亚寰健康 · 企业宣传片</span>
              <span className="text-[11px] opacity-90">3:20 · 循证健康管理</span>
            </div>
          </button>
        </section>

        <section className="mx-4 mb-3 rounded-2xl bg-white p-4 shadow-card">
          <div className="mb-1 flex items-center gap-2 text-primary">
            <ShieldCheck className="h-5 w-5" />
            <span className="text-sm font-bold">您的健康建议 均有出处</span>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            蜻蜓康健由江苏亚寰健康运营，与国内三甲医院、权威专家及高校循证合作，AI 建议、健康方案、专病营养餐均有出处。
          </p>
        </section>

        {/* Tabs */}
        <div className="sticky top-0 z-10 mx-4 mb-3 flex gap-1 rounded-2xl bg-white p-1 shadow-card">
          {tabs.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex flex-1 flex-col items-center gap-0.5 rounded-xl py-2 text-[11px] font-semibold transition-all ${
                  active ? "bg-primary text-primary-foreground shadow-card" : "text-muted-foreground"
                }`}
              >
                <Icon className="h-4 w-4" strokeWidth={2.5} />
                {t.label}
              </button>
            );
          })}
        </div>

        {tab === "research" && (
          <div className="space-y-2 px-4">
            {researchProjects.map((r) => (
              <div key={r.title} className="rounded-2xl bg-white p-4 shadow-card">
                <div className="mb-1.5 flex items-center gap-2">
                  <span className="rounded-full bg-primary-soft px-2 py-0.5 text-[11px] font-bold text-primary">
                    {r.disease}
                  </span>
                  <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[11px] font-bold text-orange-600">
                    {r.stage}
                  </span>
                </div>
                <p className="text-[15px] font-bold">{r.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">合作单位：{r.partner}</p>
              </div>
            ))}
          </div>
        )}

        {tab === "hospital" && (
          <RegionList
            data={hospitalsByRegion}
            region={region}
            setRegion={setRegion}
            render={(items) => (
              <div className="space-y-2 px-4">
                {(items as { id: string; name: string; desc: string }[]).map((h) => (
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
            )}
          />
        )}

        {tab === "expert" && (
          <div className="px-4">
            <button
              onClick={() => navigate({ to: "/experts" })}
              className="mb-3 flex w-full items-center gap-3 rounded-2xl bg-gradient-to-br from-sky-500 to-primary p-4 text-left text-white shadow-elevated active:scale-[0.98]"
            >
              <UserRound className="h-6 w-6" />
              <div className="flex-1">
                <p className="text-[15px] font-bold">查看全部合作专家</p>
                <p className="mt-0.5 text-[11px] opacity-90">按城市 / 医院 / 专科 筛选</p>
              </div>
              <ChevronRight className="h-5 w-5" />
            </button>
            <p className="mb-2 text-xs font-semibold text-muted-foreground">按病种查看重点专家</p>
            <div className="space-y-2">
              {DISEASE_EXPERTS.map((d) => (
                <button
                  key={d.disease}
                  onClick={() => navigate({ to: "/experts", search: { disease: d.disease } })}
                  className="flex w-full items-start gap-3 rounded-2xl bg-white p-4 text-left shadow-card active:scale-[0.98]"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                    <UserRound className="h-6 w-6" />
                  </span>
                  <div className="flex-1">
                    <p className="font-bold">{d.disease}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{d.experts.join(" · ")}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>
        )}

        {tab === "school" && (
          <RegionList
            data={schoolsByRegion}
            region={region}
            setRegion={setRegion}
            render={(items) => (
              <div className="space-y-2 px-4">
                {(items as { name: string; desc: string }[]).map((s) => (
                  <div
                    key={s.name}
                    className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-card"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                      <GraduationCap className="h-6 w-6" />
                    </span>
                    <div className="flex-1">
                      <p className="font-bold">{s.name}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          />
        )}
      </div>
    </MobileLayout>
  );
}

const DISEASE_EXPERTS: { disease: string; experts: string[] }[] = [
  { disease: "糖尿病", experts: ["毕艳 · 鼓楼医院", "王静 · 鼓楼医院"] },
  { disease: "高血压", experts: ["陈晓虎 · 江苏省中医院", "吕东岭 · 江苏省人民医院"] },
  { disease: "冠心病", experts: ["于雪 · 北京医院", "杨刚 · 南医大一附院"] },
  { disease: "肌少症/营养", experts: ["陈伟 · 北京协和医院"] },
  { disease: "骨质疏松", experts: ["宋纯理 · 北医三院", "蒋青 · 鼓楼医院"] },
  { disease: "中医体质", experts: ["王琦 · 北京中医药大学", "吴文忠 · 江苏省中医院"] },
  { disease: "康复/运动", experts: ["陆晓 · 南医大一附院", "陈爱国 · 南京体育学院"] },
];

function RegionList<T>({
  data,
  region,
  setRegion,
  render,
}: {
  data: Record<string, T[]>;
  region: string;
  setRegion: (r: string) => void;
  render: (items: T[]) => React.ReactNode;
}) {
  const regions = Object.keys(data);
  const active = regions.includes(region) ? region : regions[0];
  return (
    <>
      <div className="mx-4 mb-3 flex items-center gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
        {regions.map((r) => (
          <button
            key={r}
            onClick={() => setRegion(r)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
              r === active ? "bg-primary text-primary-foreground shadow-card" : "bg-white text-foreground shadow-sm"
            }`}
          >
            {r}
          </button>
        ))}
      </div>
      {render(data[active])}
    </>
  );
}
