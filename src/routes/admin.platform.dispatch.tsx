import { createFileRoute } from "@tanstack/react-router";
import { AdminPage, StatCard } from "@/admin/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { Bell, UserPlus, Phone, Clock, AlertTriangle, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/platform/dispatch")({
  component: DispatchConsole,
});

type Queue = {
  id: string;
  user: string;
  type: "新用户分配" | "高优咨询" | "异常体征" | "投诉处理" | "复诊提醒";
  detail: string;
  waited: string;
  sla: "正常" | "临近超时" | "已超时";
  priority: "P0" | "P1" | "P2";
};

const QUEUES: Queue[] = [
  { id: "Q01", user: "新用户 · 138****8821", type: "新用户分配", detail: "刚完成注册，已填写糖尿病量表，需分配医护团队", waited: "12 分钟", sla: "正常", priority: "P1" },
  { id: "Q02", user: "王秀英", type: "异常体征", detail: "今日血压 165/98，连续 3 天偏高", waited: "8 分钟", sla: "临近超时", priority: "P0" },
  { id: "Q03", user: "新用户 · 158****0033", type: "新用户分配", detail: "完成体检，需分配营养师跟进", waited: "32 分钟", sla: "已超时", priority: "P1" },
  { id: "Q04", user: "张大爷", type: "高优咨询", detail: "在线咨询排队 5 分钟无人响应", waited: "5 分钟", sla: "临近超时", priority: "P0" },
  { id: "Q05", user: "李奶奶", type: "投诉处理", detail: "对上次营养方案不满意", waited: "1 小时", sla: "已超时", priority: "P1" },
  { id: "Q06", user: "陈大伯", type: "复诊提醒", detail: "已超过约定复诊时间 2 天", waited: "2 天", sla: "已超时", priority: "P2" },
];

const STAFF = [
  { id: "s1", name: "李医生", role: "医生", load: 12, max: 20, status: "在线" },
  { id: "s2", name: "王医生", role: "医生", load: 18, max: 20, status: "在线" },
  { id: "s3", name: "张营养师", role: "营养师", load: 28, max: 50, status: "在线" },
  { id: "s4", name: "刘营养师", role: "营养师", load: 15, max: 50, status: "在线" },
  { id: "s5", name: "周营养师", role: "营养师", load: 0, max: 50, status: "请假" },
];

function DispatchConsole() {
  const [queues, setQueues] = useState(QUEUES);
  const overdue = queues.filter((q) => q.sla === "已超时").length;
  const p0 = queues.filter((q) => q.priority === "P0").length;

  const dispatch = (q: Queue, staff: string) => {
    setQueues((prev) => prev.filter((x) => x.id !== q.id));
    toast.success(`已分配：${q.user} → ${staff}`);
  };
  const escalate = (q: Queue) => toast.warning(`已升级到主管：${q.user}`);

  return (
    <AdminPage title="运营调度台" description="实时监控待处理队列、SLA 计时与人员负载，统一调度全平台运营事项">
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="待处理队列" value={queues.length} hint={`P0: ${p0}`} icon="ListTodo" tone="primary" />
        <StatCard label="已超时" value={overdue} hint="需立即处理" icon="AlertTriangle" tone="warning" />
        <StatCard label="今日已分配" value={87} hint="平均 4.2 分钟" icon="UserPlus" tone="success" />
        <StatCard label="在线人员" value={`${STAFF.filter(s => s.status === "在线").length} / ${STAFF.length}`} icon="Users" tone="accent" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* 待处理队列 */}
        <div className="lg:col-span-2 rounded-xl border bg-card shadow-card">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <h2 className="font-semibold flex items-center gap-2">
              <Bell className="h-4 w-4 text-primary" />
              待处理队列
            </h2>
            <Button size="sm" variant="outline" onClick={() => toast.success("已刷新")}>
              <Activity className="mr-1 h-3.5 w-3.5" />
              刷新
            </Button>
          </div>
          <div className="divide-y">
            {queues.map((q) => (
              <div key={q.id} className="p-4 hover:bg-muted/30">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="secondary" className={cn(
                        q.priority === "P0" && "bg-rose-100 text-rose-700",
                        q.priority === "P1" && "bg-amber-100 text-amber-700",
                        q.priority === "P2" && "bg-blue-100 text-blue-700",
                      )}>{q.priority}</Badge>
                      <Badge variant="outline">{q.type}</Badge>
                      <span className="font-medium">{q.user}</span>
                      <Badge variant="secondary" className={cn(
                        "ml-auto",
                        q.sla === "已超时" && "bg-rose-100 text-rose-700",
                        q.sla === "临近超时" && "bg-amber-100 text-amber-700",
                        q.sla === "正常" && "bg-emerald-100 text-emerald-700",
                      )}>
                        <Clock className="mr-1 h-3 w-3" />
                        {q.waited}
                      </Badge>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{q.detail}</p>
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" onClick={() => dispatch(q, "李医生")}>
                        <UserPlus className="mr-1 h-3.5 w-3.5" />
                        快速分配
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => toast.info(`正在呼叫 ${q.user}（演示）`)}>
                        <Phone className="mr-1 h-3.5 w-3.5" />
                        电话联系
                      </Button>
                      {q.sla === "已超时" && (
                        <Button size="sm" variant="outline" className="text-amber-700" onClick={() => escalate(q)}>
                          <AlertTriangle className="mr-1 h-3.5 w-3.5" />
                          升级
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 人员负载 */}
        <div className="rounded-xl border bg-card shadow-card">
          <div className="border-b px-4 py-3">
            <h2 className="font-semibold">人员负载</h2>
          </div>
          <div className="space-y-3 p-4">
            {STAFF.map((s) => {
              const pct = (s.load / s.max) * 100;
              return (
                <div key={s.id}>
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <span className="font-medium">{s.name}</span>
                      <Badge variant="outline" className="ml-1 text-xs">{s.role}</Badge>
                    </div>
                    <Badge variant="secondary" className={cn(
                      s.status === "在线" ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"
                    )}>{s.status}</Badge>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                      <div className={cn(
                        "h-full rounded-full",
                        pct > 90 ? "bg-rose-500" : pct > 70 ? "bg-amber-500" : "bg-emerald-500"
                      )} style={{ width: `${pct}%` }} />
                    </div>
                    <span>{s.load}/{s.max}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AdminPage>
  );
}
