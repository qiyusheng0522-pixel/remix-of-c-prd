import { createFileRoute } from "@tanstack/react-router";
import { AdminPage, StatCard } from "@/admin/AdminLayout";
import * as Icons from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/admin/platform/")({
  component: PlatformDashboard,
});

function PlatformDashboard() {
  return (
    <AdminPage title="全局数据大屏" description="平台核心指标实时监控">
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="累计注册用户" value="38,621" hint="今日 +128" icon="Users" tone="primary" />
        <StatCard label="今日 GMV" value="¥86,420" hint="较昨日 +12%" icon="TrendingUp" tone="success" />
        <StatCard label="活跃营养师" value={42} hint="在线 28" icon="UserCheck" tone="accent" />
        <StatCard label="服务订单" value={326} hint="完成率 94%" icon="ShoppingCart" tone="warning" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 shadow-card lg:col-span-2">
          <h2 className="mb-4 font-semibold">业务总览（近 30 天）</h2>
          <div className="flex h-56 items-end gap-1">
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-md bg-gradient-primary"
                style={{ height: `${30 + Math.sin(i / 2) * 30 + Math.random() * 20}%` }}
              />
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <h2 className="mb-4 font-semibold">业务模块占比</h2>
          <div className="space-y-3">
            {[
              { name: "线上咨询", v: 38 },
              { name: "健康商品", v: 26 },
              { name: "线下服务", v: 18 },
              { name: "套餐订阅", v: 12 },
              { name: "其他", v: 6 },
            ].map((m) => (
              <div key={m.name}>
                <div className="mb-1 flex justify-between text-sm">
                  <span>{m.name}</span>
                  <span className="text-muted-foreground">{m.v}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${m.v}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-card">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold">异常告警</h2>
          <Badge variant="destructive">5</Badge>
        </div>
        <div className="space-y-2 text-sm">
          {[
            "供应商 #SP102 库存低于安全水位",
            "门店 #海淀店 今日订单异常下降 35%",
            "营养师 张xx 连续 3 天未登录",
            "营销活动 #618 转化率低于预期",
            "支付通道 微信 出现 2 次超时",
          ].map((s) => (
            <div key={s} className="flex items-center gap-2 rounded-lg bg-amber-50 p-3 text-amber-900">
              <Icons.AlertCircle className="h-4 w-4" />
              {s}
            </div>
          ))}
        </div>
      </div>
    </AdminPage>
  );
}
