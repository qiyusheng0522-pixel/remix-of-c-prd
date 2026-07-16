import { createFileRoute } from "@tanstack/react-router";
import { AdminPlaceholder } from "@/admin/AdminLayout";

export const Route = createFileRoute("/admin/platform/agent/monitor")({
  component: Page,
});

function Page() {
  return (
    <AdminPlaceholder
      title='Agent 执行监控'
      description='全局活动监控与效果分析'
      features={['核心指标', '异常处理', '效果分析', '活动报告']}
    />
  );
}
