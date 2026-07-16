import { createFileRoute } from "@tanstack/react-router";
import { AdminPlaceholder } from "@/admin/AdminLayout";

export const Route = createFileRoute("/admin/nutritionist/agent/activities")({
  component: Page,
});

function Page() {
  return (
    <AdminPlaceholder
      title='Agent 活动配置'
      description='为我的客户配置自动化运营活动'
      features={['活动模板', '推送规则', '目标客户分组', '审核流程']}
    />
  );
}
