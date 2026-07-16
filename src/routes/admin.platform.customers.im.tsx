import { createFileRoute } from "@tanstack/react-router";
import { AdminPlaceholder } from "@/admin/AdminLayout";

export const Route = createFileRoute("/admin/platform/customers/im")({
  component: Page,
});

function Page() {
  return (
    <AdminPlaceholder
      title='IM 互动'
      description='客服与客户即时沟通'
      features={['会话列表', '消息推送', '服务预约入口']}
    />
  );
}
