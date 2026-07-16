import { createFileRoute } from "@tanstack/react-router";
import { AdminPlaceholder } from "@/admin/AdminLayout";

export const Route = createFileRoute("/admin/platform/sys/roles")({
  component: Page,
});

function Page() {
  return (
    <AdminPlaceholder
      title='角色与账号'
      description='角色与账号管理'
      features={['角色列表', '账号管理', '绑定关系', '操作日志']}
    />
  );
}
