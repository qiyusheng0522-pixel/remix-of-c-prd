import { createFileRoute } from "@tanstack/react-router";
import { AdminPlaceholder } from "@/admin/AdminLayout";

export const Route = createFileRoute("/admin/platform/content/community")({
  component: Page,
});

function Page() {
  return (
    <AdminPlaceholder
      title='蜻蜓圈内容管理'
      description='社区内容 / UGC / 运营工具'
      features={['内容发布与审核', '互动管理', '话题管理', '创作者管理', '社区打卡 / 健康挑战']}
    />
  );
}
