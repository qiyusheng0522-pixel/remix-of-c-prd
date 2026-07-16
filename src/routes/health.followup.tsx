import { createFileRoute, Link } from "@tanstack/react-router";
import { ClipboardCheck, Pill, CalendarClock, FileSearch, Repeat, BellRing } from "lucide-react";
import { ModulePage, Card, FeatureGrid } from "@/components/ModulePage";

export const Route = createFileRoute("/health/followup")({
  head: () => ({ meta: [{ title: "全病程复诊 - 蜻蜓健康" }] }),
  component: Page,
});

const queue = [
  { name: "高血压 · 月度随访", date: "2026-05-25", doc: "李建华医师", status: "待预约" },
  { name: "糖尿病 · 季度复查", date: "2026-06-10", doc: "王志刚医师", status: "已预约" },
  { name: "膝置换 · 半年复查", date: "2026-09-18", doc: "骨科 · 协和", status: "排程中" },
];

function Page() {
  return (
    <ModulePage
      title="全病程 · 药事与复诊"
      subtitle="慢病 SOP · 用药提醒 · 复诊管理"
      gradient="from-violet-400 to-indigo-600"
      Icon={ClipboardCheck}
    >
      <Card title="您的专病队列" desc="2 个慢病专病管理中">
        <div className="mt-2 flex gap-2">
          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-600">
            高血压 · 已管理 18 个月
          </span>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-600">
            2 型糖尿病 · 8 个月
          </span>
        </div>
      </Card>

      <FeatureGrid
        items={[
          { icon: Pill, label: "处方与用药", to: "/me/prescriptions" },
          { icon: Repeat, label: "续方申请", desc: "电子处方 1 日达" },
          { icon: BellRing, label: "服药提醒", desc: "今日 3/4 已完成" },
          { icon: FileSearch, label: "化验单解读", to: "/health/ocr" },
        ]}
      />

      <Card title="复诊计划">
        <div className="space-y-3">
          {queue.map((q) => (
            <div key={q.name} className="flex items-center gap-3 rounded-xl bg-muted/40 p-3">
              <CalendarClock className="h-6 w-6 text-primary" />
              <div className="flex-1">
                <p className="font-semibold">{q.name}</p>
                <p className="text-xs text-muted-foreground">
                  {q.date} · {q.doc}
                </p>
              </div>
              <span className="rounded-full bg-primary-soft px-2.5 py-1 text-xs font-bold text-primary">
                {q.status}
              </span>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <Link
          to="/health/consult"
          className="flex items-center justify-center rounded-xl bg-primary py-3 font-bold text-primary-foreground active:scale-[0.98]"
        >
          立即开始复诊
        </Link>
      </Card>
    </ModulePage>
  );
}
