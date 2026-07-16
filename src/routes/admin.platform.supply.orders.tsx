import { createFileRoute } from "@tanstack/react-router";
import { AdminPlaceholder } from "@/admin/AdminLayout";

export const Route = createFileRoute("/admin/platform/supply/orders")({
  component: Page,
});

function Page() {
  return (
    <AdminPlaceholder
      title='订单履约'
      description='订单状态跟踪与异常处理'
      features={['支付 / 退款 / 售后', '异常处理', '履约时效']}
    />
  );
}
