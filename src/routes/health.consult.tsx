import { createFileRoute, Link } from "@tanstack/react-router";
import { Stethoscope, Video, FileText, Calendar, ChevronRight, BadgeCheck, HeartHandshake } from "lucide-react";
import { ModulePage, Card, FeatureGrid } from "@/components/ModulePage";

export const Route = createFileRoute("/health/consult")({
  head: () => ({ meta: [{ title: "在线问诊 - 蜻蜓健康" }] }),
  component: Page,
});

const doctors = [
  { id: "li", name: "李建华", title: "副主任医师", dept: "心血管内科 · 协和", price: 49, online: true },
  { id: "zhang", name: "张静怡", title: "主治医师", dept: "全科 · 北医三院", price: 29, online: true },
  { id: "wang", name: "王志刚", title: "主任医师", dept: "内分泌 · 中日友好", price: 89, online: false },
];

function Page() {
  return (
    <ModulePage
      title="陪看病 · 在线问诊"
      subtitle="三甲医生图文 / 视频 · 慢病随访"
      gradient="from-sky-400 to-blue-600"
      Icon={Stethoscope}
    >
      <FeatureGrid
        items={[
          { icon: Video, label: "视频问诊", desc: "15 分钟即时接诊" },
          { icon: FileText, label: "图文问诊", desc: "上传报告 + 描述" },
          { icon: HeartHandshake, label: "陪诊服务", desc: "专人陪同就医 · 取报告代办" },
          { icon: Calendar, label: "专家预约", desc: "三甲名医排班" },
          { icon: BadgeCheck, label: "复诊续方", to: "/health/followup" },
        ]}
      />

      <Card title="陪诊服务 · 让看病不再孤单" desc="专业陪诊师全程陪同：挂号 / 排队 / 取药 / 沟通医生 / 复述医嘱 · 适合独居老人与异地就医">
        <div className="mt-2 grid grid-cols-3 gap-2 text-center text-xs">
          {[
            { name: "半日陪诊", price: "¥199" },
            { name: "全日陪诊", price: "¥359" },
            { name: "取报告代办", price: "¥59" },
          ].map((s) => (
            <div key={s.name} className="rounded-xl bg-muted/50 p-2">
              <p className="font-bold text-foreground">{s.name}</p>
              <p className="mt-0.5 font-bold text-primary">{s.price}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card title="您的家庭医生团队" desc="健管师 + 全科医师 + 营养师 + 心理咨询师">
        <Link
          to="/me/team"
          className="mt-2 flex items-center justify-between text-sm font-semibold text-primary"
        >
          查看完整团队 <ChevronRight className="h-4 w-4" />
        </Link>
      </Card>

      <Card title="今日在线医师">
        <div className="space-y-3">
          {doctors.map((d) => (
            <Link
              key={d.id}
              to="/messages/doctor/$id"
              params={{ id: d.id }}
              className="flex items-center gap-3 rounded-xl bg-muted/40 p-3 active:scale-[0.99]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 text-sky-600 font-bold">
                {d.name[0]}
              </div>
              <div className="flex-1">
                <p className="font-semibold">
                  {d.name} <span className="text-xs text-muted-foreground">{d.title}</span>
                </p>
                <p className="text-xs text-muted-foreground">{d.dept}</p>
              </div>
              <div className="text-right">
                <p className="text-base font-bold text-primary">¥{d.price}</p>
                <span
                  className={`text-[11px] font-semibold ${d.online ? "text-success" : "text-muted-foreground"}`}
                >
                  {d.online ? "● 在线" : "○ 离线"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Card>
    </ModulePage>
  );
}
