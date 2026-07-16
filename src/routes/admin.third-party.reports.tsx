import { createFileRoute } from "@tanstack/react-router";
import { AdminPlaceholder } from "@/admin/AdminLayout";

export const Route = createFileRoute("/admin/third-party/reports")({
  component: Page,
});

function Page() {
  return (
    <AdminPlaceholder
      title='合作模块数据'
      description='查看与平台合作模块的运营数据'
      features={['订单数据', '用户数据', '财务分账', '数据导出']}
    />
  );
}
