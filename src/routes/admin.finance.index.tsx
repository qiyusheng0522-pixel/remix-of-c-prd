import { createFileRoute } from "@tanstack/react-router";
import { AdminPage, StatCard } from "@/admin/AdminLayout";

export const Route = createFileRoute("/admin/finance/")({
  component: FinanceDashboard,
});

function FinanceDashboard() {
  return (
    <AdminPage title="财务概览" description="实时跟踪平台收入、结算、对账状态">
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="本月营收" value="¥1,286,420" hint="较上月 +9.2%" icon="TrendingUp" tone="success" />
        <StatCard label="待分账" value="¥86,200" hint="38 笔" icon="Wallet" tone="warning" />
        <StatCard label="待对账订单" value={42} hint="超 24h: 3" icon="FileSearch" tone="accent" />
        <StatCard label="本月发票" value={186} hint="待开 12" icon="Receipt" tone="primary" />
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-card">
        <h2 className="mb-4 font-semibold">最近财务动态</h2>
        <div className="divide-y">
          {[
            { t: "10:42", msg: "完成对营养师 张xx 的本月分账 ¥8,420" },
            { t: "09:15", msg: "新增 18 笔订单待对账" },
            { t: "昨日 18:30", msg: "门店 #海淀店 上月成本核算完成" },
            { t: "昨日 10:00", msg: "供应链结算单 #SC202410 已审批" },
          ].map((it) => (
            <div key={it.t} className="flex justify-between py-3 text-sm">
              <span className="text-muted-foreground">{it.t}</span>
              <span>{it.msg}</span>
            </div>
          ))}
        </div>
      </div>
    </AdminPage>
  );
}
