import { createFileRoute } from "@tanstack/react-router";
import { AdminPlaceholder } from "@/admin/AdminLayout";

export const Route = createFileRoute("/admin/nutritionist/plans")({
  component: Page,
});

function Page() {
  return (
    <AdminPlaceholder
      title='方案制定'
      description='为客户制定个性化健康方案'
      features={['饮食方案 / 运动方案 / 复合方案', '方案模板库', '提交医生审核流程', '方案版本管理']}
    />
  );
}
