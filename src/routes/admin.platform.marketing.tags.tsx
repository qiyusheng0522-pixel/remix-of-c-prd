import { createFileRoute } from "@tanstack/react-router";
import { AdminPlaceholder } from "@/admin/AdminLayout";

export const Route = createFileRoute("/admin/platform/marketing/tags")({
  component: Page,
});

function Page() {
  return (
    <AdminPlaceholder
      title='标签体系'
      description='全局标签体系维护'
      features={['分类管理', '标签创建', '使用统计']}
    />
  );
}
