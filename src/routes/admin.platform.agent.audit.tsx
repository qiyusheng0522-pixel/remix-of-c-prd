import { createFileRoute } from "@tanstack/react-router";
import { AdminPlaceholder } from "@/admin/AdminLayout";

export const Route = createFileRoute("/admin/platform/agent/audit")({
  component: Page,
});

function Page() {
  return (
    <AdminPlaceholder
      title='活动审核'
      description='审核营养师 / 医生提交的活动'
      features={['待审列表', '审核记录', '驳回原因模板']}
    />
  );
}
