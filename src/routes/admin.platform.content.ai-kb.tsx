import { createFileRoute } from "@tanstack/react-router";
import { AdminPlaceholder } from "@/admin/AdminLayout";

export const Route = createFileRoute("/admin/platform/content/ai-kb")({
  component: Page,
});

function Page() {
  return (
    <AdminPlaceholder
      title='AI 知识库管理'
      description='问答库维护'
      features={['问答库录入', '审核', '版本管理', '调用统计']}
    />
  );
}
