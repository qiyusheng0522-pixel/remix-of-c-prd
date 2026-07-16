import { createFileRoute } from "@tanstack/react-router";
import { AdminPlaceholder } from "@/admin/AdminLayout";

export const Route = createFileRoute("/admin/finance/payment")({
  component: Page,
});

function Page() {
  return (
    <AdminPlaceholder
      title='支付管理'
      description='支付通道与交易管理'
      features={['支付通道', '交易明细', '退款记录']}
    />
  );
}
