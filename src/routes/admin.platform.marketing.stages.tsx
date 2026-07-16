import { createFileRoute } from "@tanstack/react-router";
import { AdminPlaceholder } from "@/admin/AdminLayout";

export const Route = createFileRoute("/admin/platform/marketing/stages")({
  component: Page,
});

function Page() {
  return (
    <AdminPlaceholder
      title='用户阶段管理'
      description='阶段创建与分组'
      features={['阶段定义', '阶段分组', '迁移规则']}
    />
  );
}
