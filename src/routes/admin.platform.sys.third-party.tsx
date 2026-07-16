import { createFileRoute } from "@tanstack/react-router";
import { AdminPlaceholder } from "@/admin/AdminLayout";

export const Route = createFileRoute("/admin/platform/sys/third-party")({
  component: Page,
});

function Page() {
  return (
    <AdminPlaceholder
      title='三方合作权限'
      description='三方合作模块查看权限'
      features={['授权配置', '数据范围', '查看记录审计']}
    />
  );
}
