import { createFileRoute } from "@tanstack/react-router";
import { AdminPlaceholder } from "@/admin/AdminLayout";

export const Route = createFileRoute("/admin/nutritionist/reports")({
  component: Page,
});

function Page() {
  return (
    <AdminPlaceholder
      title='个人业务报表'
      description='营养师个人绩效统计'
      features={['服务客户数趋势', '营收趋势', '客户满意度', '导出绩效报告']}
    />
  );
}
