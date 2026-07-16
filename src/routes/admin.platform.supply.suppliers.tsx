import { createFileRoute } from "@tanstack/react-router";
import { AdminPlaceholder } from "@/admin/AdminLayout";

export const Route = createFileRoute("/admin/platform/supply/suppliers")({
  component: Page,
});

function Page() {
  return (
    <AdminPlaceholder
      title='供应商管理'
      description='合作方与采购管理'
      features={['供应商档案', '合作合同', '采购订单', '评级']}
    />
  );
}
