import { createFileRoute } from "@tanstack/react-router";
import { Moon, BedDouble, Music2, AlarmClock, Sparkles, Activity } from "lucide-react";
import { ModulePage, Card, FeatureGrid } from "@/components/ModulePage";

export const Route = createFileRoute("/health/sleep")({
  head: () => ({ meta: [{ title: "智慧睡眠 - 蜻蜓健康" }] }),
  component: Page,
});

function Page() {
  return (
    <ModulePage
      title="陪睡 · 智慧睡眠"
      subtitle="睡眠分阶 · 助眠音 · 鼾症筛查"
      gradient="from-indigo-500 to-purple-600"
      Icon={Moon}
    >
      <Card>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm text-muted-foreground">昨夜睡眠</p>
            <p className="mt-1 text-4xl font-bold text-foreground">
              7<span className="text-xl">h</span> 28<span className="text-xl">m</span>
            </p>
            <p className="mt-1 text-sm text-success">睡眠分 82 · 良好</p>
          </div>
          <BedDouble className="h-16 w-16 text-indigo-400/40" strokeWidth={1.6} />
        </div>
        <div className="mt-4 grid grid-cols-4 gap-2 text-center text-xs">
          {[
            { l: "深睡", v: "1h 42m", c: "text-indigo-600" },
            { l: "浅睡", v: "4h 10m", c: "text-blue-500" },
            { l: "REM", v: "1h 20m", c: "text-purple-500" },
            { l: "清醒", v: "16m", c: "text-orange-400" },
          ].map((s) => (
            <div key={s.l} className="rounded-lg bg-muted/40 p-2">
              <p className="text-muted-foreground">{s.l}</p>
              <p className={`mt-0.5 font-bold ${s.c}`}>{s.v}</p>
            </div>
          ))}
        </div>
      </Card>

      <FeatureGrid
        items={[
          { icon: Music2, label: "助眠白噪音", desc: "雨声 / 海浪 / 颂钵" },
          { icon: AlarmClock, label: "智能闹钟", desc: "浅睡区间唤醒" },
          { icon: Sparkles, label: "睡前冥想", desc: "10 分钟引导放松" },
          { icon: Activity, label: "鼾症筛查", desc: "录音分析 AHI 风险" },
        ]}
      />

      <Card title="蜻蜓睡眠建议">
        <p className="text-sm leading-relaxed text-muted-foreground">
          您本周入睡时间平均 23:48，比上周晚 22 分钟。建议 22:30 后调暗灯光、减少屏幕，并尝试睡前 10 分钟呼吸冥想。
        </p>
      </Card>
    </ModulePage>
  );
}
