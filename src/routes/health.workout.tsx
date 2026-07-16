import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PlayCircle, Timer, Flame, Award, Video, HeartPulse, Zap, Footprints, Bike, Dumbbell, Check, Plus } from "lucide-react";
import { toast } from "sonner";
import { ModulePage, Card, FeatureGrid } from "@/components/ModulePage";

export const Route = createFileRoute("/health/workout")({
  head: () => ({ meta: [{ title: "视频跟练 - 蜻蜓健康" }] }),
  component: Page,
});

const courses = [
  { name: "八段锦完整版", coach: "李教练", min: 18, level: "入门", kcal: 90 },
  { name: "椅子操 · 久坐缓解", coach: "王教练", min: 12, level: "入门", kcal: 60 },
  { name: "膝关节康复体操", coach: "协和康复科", min: 15, level: "康复", kcal: 70 },
  { name: "太极二十四式", coach: "张师傅", min: 25, level: "进阶", kcal: 120 },
];

const quickItems = [
  { key: "walk", label: "健步走", icon: Footprints, kcal: 90, color: "text-emerald-600", bg: "bg-emerald-100" },
  { key: "taichi", label: "太极", icon: Zap, kcal: 70, color: "text-teal-600", bg: "bg-teal-100" },
  { key: "square", label: "广场舞", icon: Award, kcal: 110, color: "text-rose-500", bg: "bg-rose-100" },
  { key: "bike", label: "骑行", icon: Bike, kcal: 130, color: "text-sky-600", bg: "bg-sky-100" },
  { key: "stretch", label: "拉伸", icon: Dumbbell, kcal: 40, color: "text-violet-600", bg: "bg-violet-100" },
  { key: "custom", label: "自定义", icon: Plus, kcal: 0, color: "text-muted-foreground", bg: "bg-muted" },
];

function Page() {
  const [done, setDone] = useState<Record<string, number>>({});
  const [duration, setDuration] = useState(20);

  const tick = (key: string, label: string, kcal: number) => {
    setDone((d) => ({ ...d, [key]: (d[key] || 0) + 1 }));
    toast.success(`${label} 打卡成功`, {
      description: `本次约 ${duration} 分钟 · 消耗 ${Math.round((kcal * duration) / 30)} kcal`,
    });
  };

  return (
    <ModulePage
      title="陪动 · 视频跟练"
      subtitle="AI 镜像纠错 · 真人教练 · 室内安全运动"
      gradient="from-emerald-400 to-teal-500"
      Icon={Video}
    >
      <Card title="快捷打卡">
        <div className="mb-3 flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">时长</span>
          {[10, 20, 30, 45].map((m) => (
            <button
              key={m}
              onClick={() => setDuration(m)}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                duration === m ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              {m} 分钟
            </button>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-3">
          {quickItems.map((q) => {
            const I = q.icon;
            const n = done[q.key] || 0;
            return (
              <button
                key={q.key}
                onClick={() => tick(q.key, q.label, q.kcal)}
                className="relative flex flex-col items-center gap-1 rounded-xl bg-muted/40 p-3 active:scale-95"
              >
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${q.bg}`}>
                  <I className={`h-6 w-6 ${q.color}`} />
                </div>
                <span className="text-sm font-semibold">{q.label}</span>
                {n > 0 && (
                  <span className="absolute right-1 top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-success px-1 text-[10px] font-bold text-white">
                    <Check className="h-3 w-3" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          一键打卡将自动同步至「每日打卡」及健康分。
        </p>
      </Card>


      <Card>
        <div className="relative aspect-video overflow-hidden rounded-xl bg-gradient-to-br from-emerald-300 to-teal-500">
          <div className="absolute inset-0 flex items-center justify-center">
            <PlayCircle className="h-20 w-20 text-white drop-shadow-lg" strokeWidth={1.5} />
          </div>
          <span className="absolute left-3 top-3 rounded-full bg-black/40 px-2 py-1 text-xs font-bold text-white">
            今日推荐 · 八段锦
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="flex items-center gap-1 text-muted-foreground">
            <Timer className="h-4 w-4" /> 18 分钟
          </span>
          <span className="flex items-center gap-1 text-muted-foreground">
            <Flame className="h-4 w-4" /> 约 90 kcal
          </span>
          <span className="flex items-center gap-1 text-success font-semibold">
            <HeartPulse className="h-4 w-4" /> 安全心率
          </span>
        </div>
      </Card>

      <Card title="为您推荐">
        <div className="space-y-3">
          {courses.map((c) => (
            <div key={c.name} className="flex items-center gap-3 rounded-xl bg-muted/40 p-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                <PlayCircle className="h-7 w-7" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">{c.name}</p>
                <p className="text-xs text-muted-foreground">
                  {c.coach} · {c.min} 分钟 · {c.level}
                </p>
              </div>
              <span className="text-xs text-muted-foreground">{c.kcal} kcal</span>
            </div>
          ))}
        </div>
      </Card>

      <FeatureGrid
        items={[
          { icon: Award, label: "我的进度", desc: "本周已跟练 3 次" },
          { icon: Timer, label: "运动处方", to: "/health/plan" },
          { icon: HeartPulse, label: "心率监护", to: "/me/devices" },
          { icon: Flame, label: "卡路里日历", to: "/health/records" },
        ]}
      />
    </ModulePage>
  );
}
