import { createFileRoute } from "@tanstack/react-router";
import { AdminPlaceholder } from "@/admin/AdminLayout";

export const Route = createFileRoute("/admin/nutritionist/appointments")({
  component: Page,
});

function Page() {
  return (
    <AdminPlaceholder
      title='预约管理'
      description='线下服务预约与排期'
      features={['预约日历视图', '确认 / 改期 / 取消', '服务记录回传', '提醒到客户端']}
    />
  );
}
