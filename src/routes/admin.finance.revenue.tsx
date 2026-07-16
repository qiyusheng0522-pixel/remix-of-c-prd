import { createFileRoute } from "@tanstack/react-router";
import { AdminPlaceholder } from "@/admin/AdminLayout";

export const Route = createFileRoute("/admin/finance/revenue")({
  component: Page,
});

function Page() {
  return (
    <AdminPlaceholder
      title='营收统计'
      description='营收多维统计分析'
      features={['按业务 / 按区域 / 按时段', '趋势图', '导出']}
    />
  );
}
