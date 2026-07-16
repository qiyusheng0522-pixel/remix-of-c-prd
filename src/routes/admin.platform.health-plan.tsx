import { createFileRoute } from "@tanstack/react-router";
import { AdminPlaceholder } from "@/admin/AdminLayout";

export const Route = createFileRoute("/admin/platform/health-plan")({
  component: Page,
});

function Page() {
  return (
    <AdminPlaceholder
      title='健康计划管理'
      description='健康计划跟踪与提醒'
      features={['推送任务提醒', '完成进度跟踪', '执行率统计', '定时提醒配置']}
    />
  );
}
