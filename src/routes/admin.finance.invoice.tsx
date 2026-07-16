import { createFileRoute } from "@tanstack/react-router";
import { AdminPlaceholder } from "@/admin/AdminLayout";

export const Route = createFileRoute("/admin/finance/invoice")({
  component: Page,
});

function Page() {
  return (
    <AdminPlaceholder
      title='发票管理'
      description='发票申请与开具'
      features={['申请记录', '开票队列', '电子发票', '对账']}
    />
  );
}
