import { createFileRoute } from "@tanstack/react-router";
import { AdminPlaceholder } from "@/admin/AdminLayout";

export const Route = createFileRoute("/admin/finance/split")({
  component: Page,
});

function Page() {
  return (
    <AdminPlaceholder
      title='分账管理'
      description='分账规则配置与执行'
      features={['规则配置', '执行记录', '异常处理']}
    />
  );
}
