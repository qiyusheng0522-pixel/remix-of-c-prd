import { createFileRoute } from "@tanstack/react-router";
import { AdminPlaceholder } from "@/admin/AdminLayout";

export const Route = createFileRoute("/admin/platform/content/health")({
  component: Page,
});

function Page() {
  return (
    <AdminPlaceholder
      title='健康内容管理'
      description='AI 内容创作 / 推送 / 报告分析'
      features={['内容创作（AI）', '内容推送', '报告分析（模板与解读规则）']}
    />
  );
}
