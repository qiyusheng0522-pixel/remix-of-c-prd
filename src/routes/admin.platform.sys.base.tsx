import { createFileRoute } from "@tanstack/react-router";
import { AdminPlaceholder } from "@/admin/AdminLayout";

export const Route = createFileRoute("/admin/platform/sys/base")({
  component: Page,
});

function Page() {
  return (
    <AdminPlaceholder
      title='基础配置'
      description='全局基础配置'
      features={['业务参数', '字典管理', '枚举管理']}
    />
  );
}
