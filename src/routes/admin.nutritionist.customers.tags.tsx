import { createFileRoute } from "@tanstack/react-router";
import { AdminPlaceholder } from "@/admin/AdminLayout";

export const Route = createFileRoute("/admin/nutritionist/customers/tags")({
  component: Page,
});

function Page() {
  return (
    <AdminPlaceholder
      title='客户标签'
      description='通过标签精准管理客户分群'
      features={['阶段标签 / 健康标签 / 偏好标签', '标签自动化打标规则', '按标签批量推送/触达']}
    />
  );
}
