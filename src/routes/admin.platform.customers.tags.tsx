import { createFileRoute } from "@tanstack/react-router";
import { AdminPlaceholder } from "@/admin/AdminLayout";

export const Route = createFileRoute("/admin/platform/customers/tags")({
  component: Page,
});

function Page() {
  return (
    <AdminPlaceholder
      title='客户标签'
      description='全局标签体系管理'
      features={['标签创建 / 编辑 / 归档', '自动化打标规则', '标签使用统计']}
    />
  );
}
