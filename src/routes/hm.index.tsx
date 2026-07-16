import { createFileRoute, Link } from "@tanstack/react-router";
import { HmLayout, HmHeader } from "@/hm/HmLayout";
import { ALERTS, TASKS, KPI, myUsers } from "@/hm/hmData";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  BellRing,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Phone,
  Sparkles,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/hm/")({
  head: () => ({
    meta: [{ title: "今日工作台 - 健康管理师" }],
  }),
  component: HmHome,
});

function HmHome() {
  const pendingAlerts = ALERTS.filter((a) => a.status === "pending");
  const p0 = pendingAlerts.filter((a) => a.severity === "P0").length;
  const todayTasks = TASKS.filter((t) => t.status !== "done");
  const userCount = myUsers().length;

  return (
    <HmLayout>
      <HmHeader
        title="今日工作台"
        subtitle="孙健康 · 蜻蜓健康管理中心"
        right={
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
            👩‍⚕️
          </div>
        }
      />

      {/* KPI 卡片 */}
      <section className="grid grid-cols-2 gap-3 px-4 pt-4">
        <KpiCard
          icon={Users}
          label="负责用户"
          value={KPI.myUserCount}
          tone="primary"
          to="/hm/users"
        />
        <KpiCard
          icon={BellRing}
          label="待处理预警"
          value={pendingAlerts.length}
          hint={p0 > 0 ? `P0：${p0}` : "无紧急"}
          tone={p0 > 0 ? "warning" : "success"}
          to="/hm/alerts"
        />
        <KpiCard
          icon={ClipboardList}
          label="今日任务"
          value={`${KPI.taskDone}/${KPI.taskTotal}`}
          hint="完成率 75%"
          tone="accent"
        />
        <KpiCard
          icon={TrendingUp}
          label="改善率"
          value={`${Math.round(KPI.improvementRate * 100)}%`}
          hint="本月用户指标改善"
          tone="success"
        />
      </section>

      {/* AI 推荐处理 */}
      <section className="px-4 pt-4">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="flex items-center gap-1.5 text-base font-bold">
            <Sparkles className="h-4 w-4 text-primary" />
            AI 推荐优先处理
          </h2>
          <Link to="/hm/alerts" className="flex items-center text-xs text-primary">
            全部预警 <ChevronRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="space-y-2">
          {pendingAlerts.slice(0, 2).map((a) => (
            <Link
              key={a.id}
              to="/hm/alerts"
              className="block rounded-2xl bg-card p-4 shadow-card active:scale-[0.99]"
            >
              <div className="flex items-start gap-2">
                <Badge
                  variant="secondary"
                  className={cn(
                    a.severity === "P0" && "bg-rose-100 text-rose-700",
                    a.severity === "P1" && "bg-amber-100 text-amber-700",
                    a.severity === "P2" && "bg-blue-100 text-blue-700",
                  )}
                >
                  {a.severity}
                </Badge>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">
                    {a.userName} · {a.title}
                  </p>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{a.detail}</p>
                  <div className="mt-2 flex items-center gap-1.5 rounded-lg border border-primary/20 bg-primary-soft/50 p-2">
                    <Sparkles className="h-3 w-3 shrink-0 text-primary" />
                    <p className="line-clamp-2 text-[11px] text-foreground/80">
                      {a.aiSuggestion.plan}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 今日任务 */}
      <section className="px-4 pt-4">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-base font-bold">今日任务</h2>
          <span className="text-xs text-muted-foreground">{todayTasks.length} 项待办</span>
        </div>
        <div className="space-y-2">
          {todayTasks.map((t) => (
            <div
              key={t.id}
              className="flex items-center gap-3 rounded-xl bg-card p-3 shadow-card"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
                {t.type === "电话随访" ? (
                  <Phone className="h-4 w-4" />
                ) : t.type === "新用户分诊" ? (
                  <UserPlus className="h-4 w-4" />
                ) : (
                  <ClipboardList className="h-4 w-4" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">
                  {t.type} · {t.userName}
                </p>
                <p className="truncate text-xs text-muted-foreground">{t.detail}</p>
              </div>
              <Badge variant="outline" className="shrink-0 text-[11px]">
                {t.dueAt}
              </Badge>
            </div>
          ))}
        </div>
      </section>

      {/* 快捷入口 */}
      <section className="px-4 py-4">
        <h2 className="mb-2 text-base font-bold">快捷入口</h2>
        <div className="grid grid-cols-4 gap-3 rounded-2xl bg-card p-4 shadow-card">
          <QuickEntry icon={Users} label="负责用户" to="/hm/users" />
          <QuickEntry icon={BellRing} label="预警中心" to="/hm/alerts" />
          <QuickEntry icon={UsersRoundIcon} label="团队协作" to="/hm/team" />
          <QuickEntry icon={CheckCircle2} label="工作成果" to="/hm/me" />
        </div>
      </section>

      <section className="px-4 pb-6">
        <div className="flex items-start gap-2 rounded-xl border border-dashed border-amber-300 bg-amber-50/50 p-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
          <p className="text-xs text-amber-900">
            演示提醒：当前为健康管理师端 Demo，所有数据均为 Mock，操作仅做交互演示。共 {userCount} 位用户。
          </p>
        </div>
      </section>
    </HmLayout>
  );
}

function UsersRoundIcon(props: React.SVGProps<SVGSVGElement>) {
  // re-export to avoid naming clash with <Users> imported above
  return <Users {...props} />;
}

function KpiCard({
  icon: Icon,
  label,
  value,
  hint,
  tone,
  to,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
  hint?: string;
  tone: "primary" | "success" | "warning" | "accent";
  to?: "/hm/users" | "/hm/alerts";
}) {
  const tones = {
    primary: "bg-primary-soft text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-amber-100 text-amber-700",
    accent: "bg-accent-soft text-accent",
  };
  const Inner = (
    <div className="rounded-2xl bg-card p-4 shadow-card">
      <div className={cn("mb-2 inline-flex h-8 w-8 items-center justify-center rounded-lg", tones[tone])}>
        <Icon className="h-4 w-4" />
      </div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-xl font-bold">{value}</p>
      {hint && <p className="mt-0.5 text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
  return to ? <Link to={to}>{Inner}</Link> : Inner;
}

function QuickEntry({ icon: Icon, label, to }: { icon: React.ElementType; label: string; to: "/hm/users" | "/hm/alerts" | "/hm/team" | "/hm/me" }) {
  return (
    <Link to={to} className="flex flex-col items-center gap-1.5 active:scale-95">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <span className="text-xs">{label}</span>
    </Link>
  );
}
