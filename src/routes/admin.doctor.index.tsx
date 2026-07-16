import { createFileRoute } from "@tanstack/react-router";
import { AdminPage, StatCard } from "@/admin/AdminLayout";
import * as Icons from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/doctor/")({
  component: DoctorDashboard,
});

function DoctorDashboard() {
  const todos = [
    { type: "待接诊咨询", count: 6, color: "bg-blue-100 text-blue-700" },
    { type: "方案审核", count: 4, color: "bg-amber-100 text-amber-700" },
    { type: "异常指标复核", count: 2, color: "bg-rose-100 text-rose-700" },
  ];
  const alerts = [
    { name: "陈阿姨", msg: "血压 165/98 异常升高", level: "高" },
    { name: "刘大爷", msg: "高风险关怀提醒", level: "高" },
  ];

  return (
    <AdminPage
      title="医生工作台"
      description="今日接诊、方案审核、异常指标实时把控"
      actions={
        <>
          <Button variant="outline" size="sm">
            <Icons.MessageSquarePlus className="mr-1 h-4 w-4" />
            快速发起会话
          </Button>
          <Button size="sm">
            <Icons.User className="mr-1 h-4 w-4" />
            查看患者
          </Button>
        </>
      }
    >
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="管理患者数" value={126} hint="较上月 +15" icon="Users" tone="primary" />
        <StatCard label="待接待咨询" value={6} hint="紧急 2" icon="MessageSquare" tone="warning" />
        <StatCard label="待审核方案" value={4} hint="平均 2h 内" icon="ClipboardCheck" tone="accent" />
        <StatCard label="今日营收" value="¥3,280" hint="抽成已计入" icon="Wallet" tone="success" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <h2 className="mb-4 font-semibold">待办清单</h2>
          <div className="space-y-3">
            {todos.map((t) => (
              <div key={t.type} className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                <span className="text-sm font-medium">{t.type}</span>
                <Badge className={t.color} variant="secondary">{t.count}</Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <h2 className="mb-4 flex items-center justify-between font-semibold">
            紧急预警 <Badge variant="destructive">{alerts.length}</Badge>
          </h2>
          <div className="space-y-3">
            {alerts.map((a) => (
              <div key={a.name} className="flex items-center justify-between rounded-lg border border-rose-200 bg-rose-50 p-3">
                <div className="flex items-center gap-3">
                  <Icons.AlertTriangle className="h-5 w-5 text-rose-600" />
                  <div>
                    <p className="text-sm font-medium">{a.name}</p>
                    <p className="text-xs text-muted-foreground">{a.msg}</p>
                  </div>
                </div>
                <Button size="sm" variant="outline">立即处理</Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-card">
        <h2 className="mb-4 font-semibold">咨询接诊量趋势（近 7 天）</h2>
        <div className="flex h-40 items-end gap-2">
          {[12, 18, 15, 22, 19, 25, 21].map((v, i) => (
            <div key={i} className="flex-1 rounded-t-md bg-blue-500" style={{ height: `${v * 4}%` }} />
          ))}
        </div>
      </div>
    </AdminPage>
  );
}
