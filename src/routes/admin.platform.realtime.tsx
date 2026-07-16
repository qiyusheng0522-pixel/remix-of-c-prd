import { createFileRoute } from "@tanstack/react-router";
import { AdminPlaceholder } from "@/admin/AdminLayout";

export const Route = createFileRoute("/admin/platform/realtime")({
  component: Page,
});

function Page() {
  return (
    <AdminPlaceholder
      title='实时数据'
      description='平台核心指标实时监控大屏'
      features={['在线用户数', '实时订单数', '实时 GMV', '系统资源监控']}
    />
  );
}
