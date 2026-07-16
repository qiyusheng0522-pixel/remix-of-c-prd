import { createFileRoute } from "@tanstack/react-router";
import { AdminPlaceholder } from "@/admin/AdminLayout";

export const Route = createFileRoute("/admin/platform/finance/split-rules")({
  component: Page,
});

function Page() {
  return (
    <AdminPlaceholder
      title='分账规则审核'
      description='财务结算分账规则审批'
      features={['规则列表', '审批流', '历史变更', '影响范围']}
    />
  );
}
