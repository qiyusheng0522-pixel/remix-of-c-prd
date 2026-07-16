import { createFileRoute } from "@tanstack/react-router";
import { AdminPlaceholder } from "@/admin/AdminLayout";

export const Route = createFileRoute("/admin/finance/orders")({
  component: Page,
});

function Page() {
  return (
    <AdminPlaceholder
      title='订单管理'
      description='订单查看与对账入口'
      features={['订单列表', '明细查看', '对账状态', '导出']}
    />
  );
}
