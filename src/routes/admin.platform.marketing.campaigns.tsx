import { createFileRoute } from "@tanstack/react-router";
import { AdminPlaceholder } from "@/admin/AdminLayout";

export const Route = createFileRoute("/admin/platform/marketing/campaigns")({
  component: Page,
});

function Page() {
  return (
    <AdminPlaceholder
      title='营销活动'
      description='活动配置与数据看板'
      features={['活动配置', '数据看板', '效果对比']}
    />
  );
}
