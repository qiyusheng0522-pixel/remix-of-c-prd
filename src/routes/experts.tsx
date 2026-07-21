import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import {
  ArrowLeft,
  Search,
  Star,
  MessageSquare,
  Phone,
  Video,
  UserRound,
} from "lucide-react";
import { MobileLayout } from "@/components/MobileLayout";
import { toast } from "sonner";

const searchSchema = z.object({
  disease: fallback(z.string(), "").default(""),
});

export const Route = createFileRoute("/experts")({
  head: () => ({
    meta: [
      { title: "问专家 · 三甲医生一对一" },
      { name: "description", content: "按城市、医院、专科筛选合作三甲医生，一对一图文/电话/视频咨询。" },
    ],
  }),
  validateSearch: zodValidator(searchSchema),
  component: ExpertsPage,
});

type Expert = {
  id: string;
  name: string;
  title: string;
  titleShort: string;
  city: string;
  hospital: string;
  hospitalTag: string;
  dept: string;
  tags: string[];
  rating: number;
  reviews: number;
  price: number;
  emoji: string;
};

const EXPERTS: Expert[] = [
  { id: "e1", name: "张敏", title: "主任医师·博导", titleShort: "主任", city: "南京", hospital: "市第一人民医院", hospitalTag: "鼓楼医生", dept: "内分泌科", tags: ["糖尿病", "甲状腺", "20年经验"], rating: 4.9, reviews: 1284, price: 68, emoji: "👩‍⚕️" },
  { id: "e2", name: "李文博", title: "副主任医师", titleShort: "副主任", city: "南京", hospital: "市第一人民医院", hospitalTag: "鼓楼医生", dept: "内分泌科", tags: ["胰岛素方案", "并发症"], rating: 4.8, reviews: 932, price: 48, emoji: "👨‍⚕️" },
  { id: "e3", name: "王慧", title: "主治医师", titleShort: "主治", city: "南京", hospital: "中心医院", hospitalTag: "社区医院", dept: "内分泌科", tags: ["妊娠糖尿病", "饮食干预"], rating: 4.9, reviews: 612, price: 38, emoji: "👩‍⚕️" },
  { id: "e4", name: "陈晓虎", title: "主任医师/教授", titleShort: "主任", city: "南京", hospital: "江苏省中医院", hospitalTag: "鼓楼医生", dept: "心血管内科", tags: ["高血压", "冠心病", "中西医结合"], rating: 4.9, reviews: 2103, price: 98, emoji: "👨‍⚕️" },
  { id: "e5", name: "吕东岭", title: "主任医师", titleShort: "主任", city: "南京", hospital: "江苏省人民医院", hospitalTag: "鼓楼医生", dept: "心血管内科", tags: ["冠心病介入", "高血压"], rating: 4.8, reviews: 1567, price: 88, emoji: "👨‍⚕️" },
  { id: "e6", name: "毕艳", title: "主任医师/教授", titleShort: "主任", city: "南京", hospital: "南京鼓楼医院", hospitalTag: "鼓楼医生", dept: "内分泌科", tags: ["1型糖尿病", "甲状腺"], rating: 5.0, reviews: 3204, price: 128, emoji: "👩‍⚕️" },
  { id: "e7", name: "陈伟", title: "主任医师/教授", titleShort: "主任", city: "北京", hospital: "北京协和医院", hospitalTag: "协和", dept: "临床营养科", tags: ["肌少症", "医学减重"], rating: 5.0, reviews: 4102, price: 168, emoji: "👨‍⚕️" },
  { id: "e8", name: "于雪", title: "主任医师", titleShort: "主任", city: "北京", hospital: "北京医院", hospitalTag: "老年病", dept: "心血管内科", tags: ["急性心梗", "PCI"], rating: 4.9, reviews: 1876, price: 118, emoji: "👩‍⚕️" },
  { id: "e9", name: "宋纯理", title: "研究员/教授", titleShort: "教授", city: "北京", hospital: "北京大学第三医院", hospitalTag: "北医三院", dept: "骨科", tags: ["骨质疏松", "骨折愈合"], rating: 4.9, reviews: 1421, price: 128, emoji: "👨‍⚕️" },
  { id: "e10", name: "陆晓", title: "主任医师/教授", titleShort: "主任", city: "南京", hospital: "南京医科大学第一附属医院", hospitalTag: "南医大", dept: "康复医学科", tags: ["神经康复", "疼痛康复"], rating: 4.8, reviews: 987, price: 78, emoji: "👨‍⚕️" },
  { id: "e11", name: "吴文忠", title: "主任医师/博士", titleShort: "主任", city: "南京", hospital: "江苏省中医院", hospitalTag: "省中医", dept: "针灸康复科", tags: ["中风", "面瘫", "失眠"], rating: 4.9, reviews: 1345, price: 88, emoji: "👨‍⚕️" },
  { id: "e12", name: "王琦", title: "中国工程院院士", titleShort: "院士", city: "北京", hospital: "北京中医药大学", hospitalTag: "北中医", dept: "中医未病学", tags: ["体质辨识", "疑难杂症"], rating: 5.0, reviews: 5203, price: 388, emoji: "👨‍⚕️" },
];

const CITIES = ["全部", "南京", "北京"];
const DEPTS = ["全部", "内分泌科", "心血管内科", "康复医学科", "针灸康复科", "临床营养科", "骨科", "中医未病学"];

function ExpertsPage() {
  const navigate = useNavigate();
  const { disease } = Route.useSearch();
  const [city, setCity] = useState("全部");
  const [hospitalTag, setHospitalTag] = useState("全部");
  const [dept, setDept] = useState("全部");
  const [q, setQ] = useState("");

  const hospitalTags = useMemo(() => {
    const tags = new Set<string>();
    EXPERTS.forEach((e) => {
      if (city === "全部" || e.city === city) tags.add(e.hospitalTag);
    });
    return ["全部", ...Array.from(tags)];
  }, [city]);

  const list = useMemo(() => {
    return EXPERTS.filter((e) => {
      if (city !== "全部" && e.city !== city) return false;
      if (hospitalTag !== "全部" && e.hospitalTag !== hospitalTag) return false;
      if (dept !== "全部" && e.dept !== dept) return false;
      if (disease && !e.tags.some((t) => t.includes(disease)) && !e.dept.includes(disease)) return false;
      if (q) {
        const kw = q.toLowerCase();
        const hay = [e.name, e.dept, e.hospital, ...e.tags].join(" ").toLowerCase();
        if (!hay.includes(kw)) return false;
      }
      return true;
    });
  }, [city, hospitalTag, dept, disease, q]);

  const openConsult = (e: Expert, mode: string) => {
    toast.success(`发起${mode}咨询`, { description: `${e.name} · ${e.dept} · ￥${e.price}/次` });
    navigate({ to: "/messages/doctor/$id", params: { id: e.id } });
  };

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
            <h1 className="text-xl font-bold">问专家</h1>
            <p className="text-xs text-muted-foreground">三甲医生 · 一对一答疑</p>
          </div>
        </header>

        {/* 搜索 */}
        <div className="mx-4 mb-3 flex items-center gap-2 rounded-full bg-muted/70 px-4 py-3">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="搜索医生 / 科室 / 擅长"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>

        {/* 城市筛选 */}
        <FilterRow label="城市" options={CITIES} value={city} onChange={(v) => { setCity(v); setHospitalTag("全部"); }} />
        {/* 医院筛选 */}
        <FilterRow label="医院" options={hospitalTags} value={hospitalTag} onChange={setHospitalTag} />
        {/* 专科筛选 */}
        <FilterRow label="专科" options={DEPTS} value={dept} onChange={setDept} />

        {disease && (
          <div className="mx-4 mb-2 flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1.5 text-xs">
            <span className="font-semibold text-primary">病种：{disease}</span>
            <button
              onClick={() => navigate({ to: "/experts", search: {} })}
              className="ml-auto text-muted-foreground"
            >
              清除
            </button>
          </div>
        )}

        <p className="mx-4 mb-2 text-xs font-semibold text-muted-foreground">
          可咨询医生 · {list.length}
        </p>

        <div className="space-y-3 px-4">
          {list.map((e, i) => {
            const highlight = i === 1;
            return (
              <div
                key={e.id}
                className={`rounded-2xl bg-white p-4 shadow-card ${highlight ? "ring-1 ring-primary/40" : ""}`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft text-3xl">
                      {e.emoji}
                    </span>
                    <span className="absolute -right-0.5 bottom-0.5 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-[17px] font-bold">{e.name}</span>
                      <span className="text-[13px] font-semibold text-foreground">{e.titleShort}</span>
                      <span className="truncate text-xs text-muted-foreground">·{e.title}</span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {e.dept} · {e.hospital}
                    </p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {e.tags.map((t) => (
                        <span key={t} className="rounded-md bg-primary-soft px-1.5 py-0.5 text-[11px] font-semibold text-primary">
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-foreground">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span className="font-semibold">{e.rating}</span>
                        <span className="text-muted-foreground"> · {e.reviews} 评价</span>
                      </div>
                      <div className="text-sm font-bold text-primary">￥{e.price}<span className="text-xs font-normal">/次</span></div>
                    </div>
                  </div>
                </div>
                {highlight && (
                  <div className="mt-3 grid grid-cols-3 gap-2 border-t border-dashed border-border pt-3">
                    <button
                      onClick={() => openConsult(e, "图文")}
                      className="flex items-center justify-center gap-1.5 rounded-xl bg-primary py-2.5 text-sm font-bold text-primary-foreground active:scale-95"
                    >
                      <MessageSquare className="h-4 w-4" /> 图文
                    </button>
                    <button
                      onClick={() => openConsult(e, "电话")}
                      className="flex items-center justify-center gap-1.5 rounded-xl bg-muted py-2.5 text-sm font-bold text-foreground active:scale-95"
                    >
                      <Phone className="h-4 w-4" /> 电话
                    </button>
                    <button
                      onClick={() => openConsult(e, "视频")}
                      className="flex items-center justify-center gap-1.5 rounded-xl bg-muted py-2.5 text-sm font-bold text-foreground active:scale-95"
                    >
                      <Video className="h-4 w-4" /> 视频
                    </button>
                  </div>
                )}
              </div>
            );
          })}
          {list.length === 0 && (
            <div className="rounded-2xl bg-white p-8 text-center shadow-card">
              <UserRound className="mx-auto mb-2 h-10 w-10 text-muted-foreground" />
              <p className="text-sm font-semibold">未找到符合条件的医生</p>
              <p className="mt-1 text-xs text-muted-foreground">试试调整筛选条件</p>
            </div>
          )}
        </div>
      </div>
    </MobileLayout>
  );
}

function FilterRow({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="mx-4 mb-2 flex items-center gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <span className="shrink-0 text-[11px] font-semibold text-muted-foreground">{label}</span>
      {options.map((o) => {
        const active = o === value;
        return (
          <button
            key={o}
            onClick={() => onChange(o)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
              active ? "bg-primary text-primary-foreground shadow-card" : "bg-white text-foreground shadow-sm"
            }`}
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}