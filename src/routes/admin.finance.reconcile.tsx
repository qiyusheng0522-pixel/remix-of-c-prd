import { createFileRoute } from "@tanstack/react-router";
import { AdminPlaceholder } from "@/admin/AdminLayout";

export const Route = createFileRoute("/admin/finance/reconcile")({
  component: Page,
});

function Page() {
  return (
    <AdminPlaceholder
      title='订单对账'
      description='订单与支付通道对账'
      features={['待对账', '异常订单', '差异处理']}
    />
  );
}
