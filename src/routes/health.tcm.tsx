import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, Leaf, Wind, Flame, Droplet, Snowflake, Sun, ScanFace, ClipboardList, MessageCircle } from "lucide-react";
import { ModulePage, Card, FeatureGrid } from "@/components/ModulePage";

export const Route = createFileRoute("/health/tcm")({
  head: () => ({ meta: [{ title: "数字中医人 · 中医体质辨识 - 蜻蜓健康" }] }),
  component: Page,
});

const constitutions = [
  { name: "平和质", icon: Sun, color: "text-amber-500", bg: "bg-amber-100", desc: "阴阳气血调和 · 精力充沛" },
  { name: "气虚质", icon: Wind, color: "text-slate-500", bg: "bg-slate-100", desc: "易疲乏 · 气短懒言" },
  { name: "阳虚质", icon: Snowflake, color: "text-sky-500", bg: "bg-sky-100", desc: "畏寒怕冷 · 手足不温" },
  { name: "阴虚质", icon: Flame, color: "text-rose-500", bg: "bg-rose-100", desc: "口燥咽干 · 手足心热" },
  { name: "痰湿质", icon: Droplet, color: "text-teal-500", bg: "bg-teal-100", desc: "形体肥胖 · 腹部松软" },
  { name: "湿热质", icon: Flame, color: "text-orange-500", bg: "bg-orange-100", desc: "面垢油光 · 口苦口干" },
  { name: "血瘀质", icon: Droplet, color: "text-purple-500", bg: "bg-purple-100", desc: "肤色晦黯 · 易生瘀斑" },
  { name: "气郁质", icon: Wind, color: "text-indigo-500", bg: "bg-indigo-100", desc: "情绪低落 · 易多愁善感" },
  { name: "特禀质", icon: Leaf, color: "text-emerald-500", bg: "bg-emerald-100", desc: "过敏体质 · 遗传倾向" },
];

function Page() {
  return (
    <ModulePage
      title="数字中医人"
      subtitle="AI 中医体质辨识 · 名老中医循证方案"
      gradient="from-emerald-500 to-teal-600"
      Icon={Leaf}
    >
      <Card title="三步辨识 · 找到您的体质" desc="面诊 + 舌诊 + 问卷，AI 综合判定九种体质">
        <FeatureGrid
          items={[
            { icon: ScanFace, label: "AI 面诊", desc: "拍照识别面色气色" },
            { icon: ScanFace, label: "AI 舌诊", desc: "舌苔舌质辨识" },
            { icon: ClipboardList, label: "体质问卷", desc: "中华中医药学会标准" },
            { icon: MessageCircle, label: "名医面诊", desc: "省中医院国医大师" },
          ]}
        />
      </Card>

      <Card title="九种体质速览" desc="点击查看您的体质调理方案">
        <div className="mt-2 grid grid-cols-3 gap-2">
          {constitutions.map((c) => {
            const I = c.icon;
            return (
              <div key={c.name} className="flex flex-col items-center rounded-xl bg-muted/40 p-3 text-center">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${c.bg}`}>
                  <I className={`h-5 w-5 ${c.color}`} />
                </div>
                <p className="mt-1.5 text-sm font-bold">{c.name}</p>
                <p className="mt-0.5 text-[10px] leading-tight text-muted-foreground">{c.desc}</p>
              </div>
            );
          })}
        </div>
      </Card>

      <Card title="您的专属调理方案" desc="辨识后由数字中医人生成">
        <ul className="mt-2 space-y-2 text-sm text-foreground">
          <li className="flex items-start gap-2"><Leaf className="mt-0.5 h-4 w-4 text-emerald-600" />四季养生茶饮 · 江苏省中医院方</li>
          <li className="flex items-start gap-2"><Sparkles className="mt-0.5 h-4 w-4 text-amber-500" />经络穴位按摩视频跟练</li>
          <li className="flex items-start gap-2"><Flame className="mt-0.5 h-4 w-4 text-rose-500" />膏方 / 药膳定制 · 中药代煎到家</li>
          <li className="flex items-start gap-2"><Sun className="mt-0.5 h-4 w-4 text-orange-500" />节气养生提醒 · 二十四节气食养</li>
        </ul>
        <button className="mt-3 w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 py-3 text-sm font-bold text-white active:scale-95">
          开始体质辨识
        </button>
      </Card>
    </ModulePage>
  );
}
