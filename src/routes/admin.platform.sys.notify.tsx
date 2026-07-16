import { createFileRoute } from "@tanstack/react-router";
import { AdminPlaceholder } from "@/admin/AdminLayout";

export const Route = createFileRoute("/admin/platform/sys/notify")({
  component: Page,
});

function Page() {
  return (
    <AdminPlaceholder
      title='通知模板'
      description='全局通知模板配置'
      features={['短信 / 站内信 / 邮件 / 微信', '变量管理', '审批']}
    />
  );
}
