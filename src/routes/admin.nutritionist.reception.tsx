import { createFileRoute } from "@tanstack/react-router";
import { AdminPlaceholder } from "@/admin/AdminLayout";

export const Route = createFileRoute("/admin/nutritionist/reception")({
  component: Page,
});

function Page() {
  return (
    <AdminPlaceholder
      title='接待记录'
      description='门店客户接待全流程记录'
      features={['接待签到', '服务项目记录', '满意度反馈', '导出对账']}
    />
  );
}
