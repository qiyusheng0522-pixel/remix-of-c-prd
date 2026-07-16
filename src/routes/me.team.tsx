import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, MessageCircle, Video, Crown, Stethoscope, Apple, User, Utensils } from "lucide-react";
import { toast } from "sonner";
import { MobileLayout } from "@/components/MobileLayout";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/me/team")({
  head: () => ({
    meta: [
      { title: "我的医护团队 - 蜻蜓健康" },
      { name: "description", content: "查看我的专属医生与营养师团队及各自负责的健康问题。" },
    ],
  }),
  component: MyTeam,
});

const TEAM: {
  id: string;
  name: string;
  role: "医生" | "营养师";
  title: string;
  icon: typeof User;
  iconBg: string;
  iconColor: string;
  isPrimary: boolean;
  condition: string;
  yearsOnDuty: string;
  online: boolean;
}[] = [
  {
    id: "d1",
    name: "李医生",
    role: "医生",
    title: "主任医师 · 心血管内科",
    icon: Stethoscope,
    iconBg: "bg-primary-soft",
    iconColor: "text-primary",
    isPrimary: true,
    condition: "高血压综合管理",
    yearsOnDuty: "已服务 3 年 · 86 次咨询",
    online: true,
  },
  {
    id: "d2",
    name: "王医生",
    role: "医生",
    title: "副主任医师 · 内分泌科",
    icon: Stethoscope,
    iconBg: "bg-primary-soft",
    iconColor: "text-primary",
    isPrimary: false,
    condition: "糖尿病用药与监测",
    yearsOnDuty: "已服务 1 年 · 22 次咨询",
    online: false,
  },
  {
    id: "n1",
    name: "张营养师",
    role: "营养师",
    title: "国家二级公共营养师",
    icon: Utensils,
    iconBg: "bg-success/15",
    iconColor: "text-success",
    isPrimary: true,
    condition: "饮食方案 · 餐食搭配",
    yearsOnDuty: "已服务 2 年 · 156 次互动",
    online: true,
  },
];

function MyTeam() {
  const navigate = useNavigate();
  return (
    <MobileLayout>
      <header className="sticky top-0 z-30 flex items-center gap-2 border-b border-border bg-card/95 px-4 py-3 backdrop-blur">
        <Link to="/me" className="-m-2 p-2">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-lg font-bold">我的医护团队</h1>
      </header>

      <section className="px-4 pt-4">
        <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 p-4">
          <p className="text-sm text-foreground">
            您的健康由 <strong className="text-primary">{TEAM.length} 位</strong> 专业医护人员协同管理，
            每位负责不同的健康问题。点击成员可直接发起咨询。
          </p>
        </div>
      </section>

      <section className="space-y-3 px-4 py-4">
        {TEAM.map((m) => {
          const Icon = m.icon;
          return (
          <div key={m.id} className="rounded-2xl bg-card p-4 shadow-card">
            <div className="flex items-start gap-3">
              <div className="relative">
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${m.iconBg}`}>
                  <Icon className={`h-7 w-7 ${m.iconColor}`} strokeWidth={2} />
                </div>
                {m.online && (
                  <span className="absolute -right-0.5 -bottom-0.5 h-3.5 w-3.5 rounded-full border-2 border-card bg-success" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-bold">{m.name}</h3>
                  {m.isPrimary && (
                    <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
                      <Crown className="mr-1 h-3 w-3" />
                      主治
                    </Badge>
                  )}
                  <Badge variant="outline">
                    {m.role === "医生" ? <Stethoscope className="mr-1 h-3 w-3" /> : <Apple className="mr-1 h-3 w-3" />}
                    {m.role}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{m.title}</p>
                <div className="mt-3 rounded-lg bg-muted/40 p-2.5">
                  <p className="text-xs text-muted-foreground">负责健康问题</p>
                  <p className="mt-0.5 text-sm font-medium">{m.condition}</p>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{m.yearsOnDuty}</p>
              </div>
            </div>

            <div className="mt-3 flex gap-2 border-t pt-3">
              <button
                onClick={() => navigate({ to: "/messages/doctor/$id", params: { id: m.id } })}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground active:scale-95"
              >
                <MessageCircle className="h-4 w-4" />
                发消息
              </button>
              <button
                onClick={() =>
                  toast.success(`正在呼叫 ${m.name}`, {
                    description: m.online ? "对方在线，请稍候接通" : "对方暂未在线，已留言",
                  })
                }
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-border bg-card py-2.5 text-sm font-semibold active:scale-95"
              >
                <Video className="h-4 w-4" />
                视频咨询
              </button>
            </div>
          </div>
          );
        })}
      </section>

      <section className="px-4 pb-8">
        <div className="rounded-2xl border border-dashed border-border p-4 text-center">
          <p className="text-sm text-muted-foreground">如需调整医护团队</p>
          <Link to="/chat/xiaoqing" className="mt-2 inline-block text-sm font-semibold text-primary">
            联系健康管家 →
          </Link>
        </div>
      </section>
    </MobileLayout>
  );
}
