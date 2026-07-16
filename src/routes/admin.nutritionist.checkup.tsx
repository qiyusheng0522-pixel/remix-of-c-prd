import { createFileRoute } from "@tanstack/react-router";
import { AdminPlaceholder } from "@/admin/AdminLayout";

export const Route = createFileRoute("/admin/nutritionist/checkup")({
  component: Page,
});

function Page() {
  return (
    <AdminPlaceholder
      title='体检服务'
      description='门店内体检服务全流程'
      features={['体检套餐配置', '客户预约管理', '报告上传与解读']}
    />
  );
}
