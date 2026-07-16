import { createFileRoute } from "@tanstack/react-router";
import { AdminPlaceholder } from "@/admin/AdminLayout";

export const Route = createFileRoute("/admin/doctor/consult")({
  component: Page,
});

function Page() {
  return (
    <AdminPlaceholder
      title='在线接诊'
      description='实时接诊咨询管理'
      features={['接诊队列', '对话窗口', 'AI 辅助回复草稿', '电子处方']}
    />
  );
}
