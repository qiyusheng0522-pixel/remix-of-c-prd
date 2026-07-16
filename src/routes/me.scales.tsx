import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ClipboardCheck, ChevronRight, FileText, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { MobileLayout } from "@/components/MobileLayout";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/me/scales")({
  head: () => ({
    meta: [
      { title: "我的量表 - 蜻蜓健康" },
      { name: "description", content: "查看历史填写的健康量表与评估结果。" },
    ],
  }),
  component: MyScales,
});

const PENDING = [
  { id: "s1", name: "高血压自我管理量表（季度）", desc: "上次填写：2025-01-15", time: "约 5 分钟" },
  { id: "s2", name: "老年抑郁量表 GDS-15", desc: "由李医生指派", time: "约 3 分钟" },
];

const HISTORY = [
  { id: "h1", name: "高血压自我管理量表", date: "2025-01-15", score: 78, level: "良好", levelColor: "bg-emerald-100 text-emerald-700" },
  { id: "h2", name: "糖尿病饮食评估", date: "2025-01-08", score: 62, level: "需改善", levelColor: "bg-amber-100 text-amber-700" },
  { id: "h3", name: "睡眠质量量表 PSQI", date: "2024-12-20", score: 8, level: "睡眠尚可", levelColor: "bg-blue-100 text-blue-700" },
  { id: "h4", name: "老年人跌倒风险评估", date: "2024-12-01", score: 12, level: "低风险", levelColor: "bg-emerald-100 text-emerald-700" },
  { id: "h5", name: "焦虑自评量表 SAS", date: "2024-11-15", score: 42, level: "正常", levelColor: "bg-emerald-100 text-emerald-700" },
];

function MyScales() {
  return (
    <MobileLayout>
      <header className="sticky top-0 z-30 flex items-center gap-2 border-b border-border bg-card/95 px-4 py-3 backdrop-blur">
        <Link to="/me" className="-m-2 p-2">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-lg font-bold">我的量表</h1>
      </header>

      {/* 概览 */}
      <section className="px-4 pt-4">
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-2xl bg-primary-soft p-3 text-center">
            <p className="text-2xl font-bold text-primary">{HISTORY.length}</p>
            <p className="text-xs text-muted-foreground">已完成</p>
          </div>
          <div className="rounded-2xl bg-amber-100 p-3 text-center">
            <p className="text-2xl font-bold text-amber-700">{PENDING.length}</p>
            <p className="text-xs text-muted-foreground">待填写</p>
          </div>
          <div className="rounded-2xl bg-accent-soft p-3 text-center">
            <p className="text-2xl font-bold text-accent">良好</p>
            <p className="text-xs text-muted-foreground">综合评估</p>
          </div>
        </div>
      </section>

      {/* 待填写 */}
      <section className="px-4 pt-4">
        <h2 className="mb-2 flex items-center gap-2 text-base font-bold">
          <ClipboardCheck className="h-5 w-5 text-amber-600" />
          待填写量表
        </h2>
        <div className="space-y-2">
          {PENDING.map((p) => (
            <Link
              key={p.id}
              to="/health"
              className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50/50 p-4 active:scale-[0.99]"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100">
                <FileText className="h-6 w-6 text-amber-700" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{p.name}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{p.desc}</p>
                <Badge variant="outline" className="mt-1 text-[10px]">{p.time}</Badge>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </Link>
          ))}
        </div>
      </section>

      {/* 历史 */}
      <section className="px-4 py-4">
        <h2 className="mb-2 flex items-center gap-2 text-base font-bold">
          <TrendingUp className="h-5 w-5 text-primary" />
          历史填写记录
        </h2>
        <div className="overflow-hidden rounded-2xl bg-card shadow-card">
          {HISTORY.map((h, i) => (
            <button
              key={h.id}
              onClick={() =>
                toast.success(`查看《${h.name}》评估报告`, {
                  description: `${h.date} · 评分 ${h.score} · ${h.level}`,
                })
              }
              className={`flex w-full items-center gap-3 px-4 py-3 text-left active:bg-muted ${
                i !== HISTORY.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{h.name}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{h.date}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">{h.score}</p>
                <Badge variant="secondary" className={h.levelColor}>{h.level}</Badge>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>
          ))}
        </div>
      </section>
    </MobileLayout>
  );
}
