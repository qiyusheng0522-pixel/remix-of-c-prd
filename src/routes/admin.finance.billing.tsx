import { createFileRoute } from "@tanstack/react-router";
import { AdminPlaceholder } from "@/admin/AdminLayout";

export const Route = createFileRoute("/admin/finance/billing")({
  component: Page,
});

function Page() {
  return (
    <AdminPlaceholder
      title='账单管理'
      description='全平台账单管理'
      features={['按周期 / 按角色 / 按机构', '结算单生成', '下载']}
    />
  );
}
