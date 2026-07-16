import { createFileRoute } from "@tanstack/react-router";
import { AdminPage, StatCard } from "@/admin/AdminLayout";
import * as Icons from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/nutritionist/")({
  component: NutritionistDashboard,
});

function NutritionistDashboard() {
  const todos = [
    { type: "待确认预约", count: 8, color: "bg-blue-100 text-blue-700" },
    { type: "待回复咨询", count: 12, color: "bg-amber-100 text-amber-700" },
    { type: "方案审核通知", count: 3, color: "bg-rose-100 text-rose-700" },
  ];
  const alerts = [
    { name: "王大爷", msg: "血糖持续偏高 3 天", level: "高" },
    { name: "李阿姨", msg: "连续 2 天未打卡", level: "中" },
    { name: "张先生", msg: "服务到期还有 3 天", level: "低" },
  ];

  return (
    <AdminPage
      title="营养师工作台"
      description="今日数据看板、待办、紧急预警一站式查看"
      actions={
        <>
          <Button variant="outline" size="sm">
            <Icons.MessageSquarePlus className="mr-1 h-4 w-4" />
            发起沟通
          </Button>
          <Button size="sm">
            <Icons.BarChart3 className="mr-1 h-4 w-4" />
            服务统计
          </Button>
        </>
      }
    >
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="服务中客户数" value={48} hint="较上周 +6" icon="Users" tone="primary" />
        <StatCard label="今日新增咨询" value={12} hint="待回复 8" icon="MessageSquare" tone="accent" />
        <StatCard label="本周服务完成率" value="92%" hint="目标 ≥ 90%" icon="Target" tone="success" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">待办清单</h2>
            <Button variant="ghost" size="sm">查看全部</Button>
          </div>
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
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">紧急预警</h2>
            <Badge variant="destructive">3</Badge>
          </div>
          <div className="space-y-3">
            {alerts.map((a) => (
              <div key={a.name} className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 p-3">
                <div className="flex items-center gap-3">
                  <Icons.AlertTriangle className="h-5 w-5 text-amber-600" />
                  <div>
                    <p className="text-sm font-medium">{a.name}</p>
                    <p className="text-xs text-muted-foreground">{a.msg}</p>
                  </div>
                </div>
                <Badge variant="outline">{a.level}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-card">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold">数据趋势</h2>
          <div className="flex gap-2 text-xs">
            <Badge variant="secondary">近 7 天打卡率 86%</Badge>
            <Badge variant="secondary">服务完成趋势 ↑</Badge>
          </div>
        </div>
        <div className="flex h-40 items-end gap-2">
          {[60, 72, 68, 80, 75, 88, 86].map((v, i) => (
            <div key={i} className="flex-1 rounded-t-md bg-gradient-primary" style={{ height: `${v}%` }} />
          ))}
        </div>
      </div>
    </AdminPage>
  );
}
