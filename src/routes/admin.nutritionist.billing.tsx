import { createFileRoute } from "@tanstack/react-router";
import { AdminPlaceholder } from "@/admin/AdminLayout";

export const Route = createFileRoute("/admin/nutritionist/billing")({
  component: Page,
});

function Page() {
  return (
    <AdminPlaceholder
      title='个人分账账单'
      description='查看本人服务的分账明细'
      features={['按月查看', '按订单查看', '账单下载', '提现状态']}
    />
  );
}
