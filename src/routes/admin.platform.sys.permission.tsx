import { createFileRoute } from "@tanstack/react-router";
import { AdminPlaceholder } from "@/admin/AdminLayout";

export const Route = createFileRoute("/admin/platform/sys/permission")({
  component: Page,
});

function Page() {
  return (
    <AdminPlaceholder
      title='权限管理'
      description='模块权限配置'
      features={['权限项管理', '角色绑定', '权限矩阵']}
    />
  );
}
