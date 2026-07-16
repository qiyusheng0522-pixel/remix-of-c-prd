import { createFileRoute } from "@tanstack/react-router";
import { AdminPlaceholder } from "@/admin/AdminLayout";

export const Route = createFileRoute("/admin/platform/agent/reach")({
  component: Page,
});

function Page() {
  return (
    <AdminPlaceholder
      title='自动化触达'
      description='话术 / 频率 / 时间 / 方式配置'
      features={['触达模板', '频次控制', '时段配置', '效果监控']}
    />
  );
}
