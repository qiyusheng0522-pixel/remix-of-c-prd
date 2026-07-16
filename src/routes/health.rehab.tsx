import { createFileRoute } from "@tanstack/react-router";
import { Activity, Target, TrendingUp, Video, Watch, Trophy } from "lucide-react";
import { ModulePage, Card, FeatureGrid } from "@/components/ModulePage";

export const Route = createFileRoute("/health/rehab")({
  head: () => ({ meta: [{ title: "康复跟踪 - 蜻蜓健康" }] }),
  component: Page,
});

const milestones = [
  { d: "Day 7", t: "康复启动 · 床上抬腿", done: true },
  { d: "Day 14", t: "助行器站立 30s", done: true },
  { d: "Day 35", t: "独立行走 15 步", done: true, highlight: true },
  { d: "Day 90", t: "上下楼梯", done: false },
  { d: "Day 180", t: "康复毕业", done: false },
];

function Page() {
  return (
    <ModulePage
      title="康复全病程"
      subtitle="术后康复 · 里程碑追踪 · 设备联动"
      gradient="from-teal-400 to-emerald-500"
      Icon={Activity}
    >
      <Card>
        <p className="text-sm text-muted-foreground">当前康复</p>
        <p className="mt-1 text-xl font-bold">右膝关节置换术 · 第 42 天</p>
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-muted">
          <div className="h-full w-[23%] rounded-full bg-gradient-to-r from-teal-400 to-emerald-500" />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">距毕业 138 天 · 进度 23%</p>
      </Card>

      <Card title="康复里程碑">
        <ul className="space-y-3">
          {milestones.map((m) => (
            <li key={m.d} className="flex items-center gap-3">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ${
                  m.done ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground"
                }`}
              >
                {m.done ? "✓" : "·"}
              </div>
              <div className="flex-1">
                <p className={`text-sm font-semibold ${m.highlight ? "text-emerald-600" : ""}`}>
                  {m.t}
                </p>
                <p className="text-xs text-muted-foreground">{m.d}</p>
              </div>
              {m.highlight && <Trophy className="h-5 w-5 text-amber-500" />}
            </li>
          ))}
        </ul>
      </Card>

      <FeatureGrid
        items={[
          { icon: Video, label: "今日康复操", to: "/health/workout" },
          { icon: Watch, label: "可穿戴数据", to: "/me/devices" },
          { icon: Target, label: "PT 任务", desc: "本周 5/7 已完成" },
          { icon: TrendingUp, label: "进步报告", to: "/health/report" },
        ]}
      />
    </ModulePage>
  );
}
