import { createFileRoute } from "@tanstack/react-router";
import { AdminPage, StatCard } from "@/admin/AdminLayout";

export const Route = createFileRoute("/admin/third-party/")({
  component: ThirdPartyDashboard,
});

function ThirdPartyDashboard() {
  return (
    <AdminPage title="三方合作概览" description="您可查看与平台合作的模块运营数据">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="本月合作订单" value={328} hint="较上月 +18%" icon="ShoppingCart" tone="primary" />
        <StatCard label="分账收入" value="¥18,420" hint="待结算 ¥3,200" icon="Wallet" tone="success" />
        <StatCard label="服务客户数" value={1286} hint="活跃 642" icon="Users" tone="accent" />
      </div>
      <div className="rounded-xl border border-border bg-card p-5 shadow-card">
        <h2 className="mb-4 font-semibold">合作模块表现</h2>
        <div className="space-y-3">
          {[
            { name: "运动课程", v: 78 },
            { name: "营养餐配送", v: 65 },
            { name: "保健品推荐", v: 52 },
          ].map((m) => (
            <div key={m.name}>
              <div className="mb-1 flex justify-between text-sm">
                <span>{m.name}</span>
                <span className="text-muted-foreground">完成率 {m.v}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted">
                <div className="h-full rounded-full bg-violet-500" style={{ width: `${m.v}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminPage>
  );
}
