import { createFileRoute } from "@tanstack/react-router";
import { AdminPlaceholder } from "@/admin/AdminLayout";

export const Route = createFileRoute("/admin/platform/store/info")({
  component: Page,
});

function Page() {
  return (
    <AdminPlaceholder
      title='门店信息配置'
      description='自营门店基础信息'
      features={['门店列表', '营业时间', '服务项目', '员工配置']}
    />
  );
}
