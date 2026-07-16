import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, FileText, Share2, TrendingUp, Calendar, Award } from "lucide-react";
import { ModulePage, Card, FeatureGrid } from "@/components/ModulePage";
import { ShareButton } from "@/components/ShareButton";

export const Route = createFileRoute("/health/report")({
  head: () => ({ meta: [{ title: "健康叙事报告 - 蜻蜓健康" }] }),
  component: Page,
});

function Page() {
  return (
    <ModulePage
      title="健康叙事报告"
      subtitle="AI 把您的健康写成一个故事 · 可分享朋友圈"
      gradient="from-fuchsia-400 to-purple-600"
      Icon={Sparkles}
    >
      <Card>
        <div className="rounded-2xl bg-gradient-to-br from-fuchsia-500 to-purple-600 p-5 text-white">
          <p className="text-xs opacity-90">2026 年 5 月 · 月度报告</p>
          <p className="mt-2 text-xl font-bold">您是一位健康分稳步提升的「春日散步家」</p>
          <p className="mt-2 text-sm leading-relaxed opacity-95">
            这个月您走了 12.4 万步、坚持打卡 26 天、健康年龄又年轻了 0.3 岁。
            血压控制稳定，睡眠质量提升 8%，是值得为自己鼓掌的一个月。
          </p>
          <div className="mt-4 flex items-center gap-2">
            <button className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-fuchsia-600 active:scale-95">
              <FileText className="h-4 w-4" /> 阅读完整报告
            </button>
            <ShareButton
              variant="pill"
              label="分享朋友圈"
              title="我的蜻蜓月度健康报告"
              desc="您是一位健康分稳步提升的「春日散步家」"
              className="bg-white/25 text-white"
            />
          </div>
        </div>
      </Card>

      <FeatureGrid
        items={[
          { icon: Calendar, label: "月度报告", desc: "每月 1 日生成" },
          { icon: Award, label: "年度大场面", desc: "动画 + 数据故事" },
          { icon: TrendingUp, label: "跨模块洞察", desc: "睡眠↔运动 关联分析" },
          { icon: Share2, label: "生成分享海报", desc: "朋友圈一键分享" },
        ]}
      />

      <Card title="历史报告">
        <ul className="space-y-2 text-sm">
          {["2026 年 4 月 · 「春暖花开的护心人」", "2026 年 3 月 · 「术后归来的坚强者」", "2025 年度回顾 · 「365 天的小确幸」"].map((t) => (
            <li
              key={t}
              className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2"
            >
              <span>{t}</span>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </li>
          ))}
        </ul>
      </Card>
    </ModulePage>
  );
}
