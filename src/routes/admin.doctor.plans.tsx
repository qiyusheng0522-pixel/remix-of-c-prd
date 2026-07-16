import { createFileRoute } from "@tanstack/react-router";
import { AdminPlaceholder } from "@/admin/AdminLayout";

export const Route = createFileRoute("/admin/doctor/plans")({
  component: Page,
});

function Page() {
  return (
    <AdminPlaceholder
      title='医疗方案'
      description='医疗方案制定与审核'
      features={['方案模板', '用药建议', '复诊计划', '审核工作流']}
    />
  );
}
