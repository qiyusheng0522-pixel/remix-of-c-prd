import { createFileRoute } from "@tanstack/react-router";
import { AdminPlaceholder } from "@/admin/AdminLayout";

export const Route = createFileRoute("/admin/platform/key-accounts")({
  component: Page,
});

function Page() {
  return (
    <AdminPlaceholder
      title='大客户管理'
      description='企业大客户档案与服务'
      features={['企业信息', '员工健康', '合作档案', '增值服务']}
    />
  );
}
