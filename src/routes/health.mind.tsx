import { createFileRoute, Link } from "@tanstack/react-router";
import { HeartHandshake, Smile, ClipboardList, MessageCircle, Headphones, BookOpen } from "lucide-react";
import { ModulePage, Card, FeatureGrid } from "@/components/ModulePage";

export const Route = createFileRoute("/health/mind")({
  head: () => ({ meta: [{ title: "心理健康 - 蜻蜓健康" }] }),
  component: Page,
});

const moods = ["😄", "🙂", "😐", "😟", "😢"];

function Page() {
  return (
    <ModulePage
      title="陪心 · 心理健康"
      subtitle="情绪打卡 · CBT 练习 · 危机预警"
      gradient="from-pink-400 to-fuchsia-500"
      Icon={HeartHandshake}
    >
      <Card title="今天感觉如何？">
        <div className="flex items-center justify-between">
          {moods.map((m, i) => (
            <button
              key={i}
              className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/40 text-3xl transition active:scale-90 hover:bg-primary-soft"
            >
              {m}
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          连续打卡 12 天 · 本周情绪以平静为主
        </p>
      </Card>

      <FeatureGrid
        items={[
          {
            icon: ClipboardList,
            label: "心理量表",
            to: "/me/scales",
            desc: "PHQ-9 / GAD-7 等",
          },
          { icon: MessageCircle, label: "蜻蜓心理对话", to: "/chat/xiaoqing" },
          { icon: Headphones, label: "正念冥想", desc: "5/10/20 分钟" },
          { icon: BookOpen, label: "CBT 课程", desc: "认知行为练习" },
        ]}
      />

      <Card title="本周情绪曲线">
        <div className="flex h-24 items-end gap-2">
          {[60, 75, 70, 50, 80, 85, 78].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-lg bg-gradient-to-t from-pink-300 to-fuchsia-500"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          周一至周日 · 一周整体上升 ↑ 12%
        </p>
      </Card>

      <Card>
        <Link
          to="/messages"
          className="flex items-center gap-3 rounded-xl bg-pink-50 p-3 active:scale-[0.99]"
        >
          <Smile className="h-6 w-6 text-pink-500" />
          <div className="flex-1">
            <p className="font-semibold">需要倾诉？</p>
            <p className="text-xs text-muted-foreground">7×24 心理热线 + 持证心理咨询师</p>
          </div>
        </Link>
      </Card>
    </ModulePage>
  );
}
