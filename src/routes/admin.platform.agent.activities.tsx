import { createFileRoute } from "@tanstack/react-router";
import { AdminPlaceholder } from "@/admin/AdminLayout";

export const Route = createFileRoute("/admin/platform/agent/activities")({
  component: Page,
});

function Page() {
  return (
    <AdminPlaceholder
      title='Agent 活动配置'
      description='全平台运营活动配置'
      features={['活动模板', '目标人群', '推送规则', 'AB 测试']}
    />
  );
}
