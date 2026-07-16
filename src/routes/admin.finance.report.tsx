import { createFileRoute } from "@tanstack/react-router";
import { AdminPlaceholder } from "@/admin/AdminLayout";

export const Route = createFileRoute("/admin/finance/report")({
  component: Page,
});

function Page() {
  return (
    <AdminPlaceholder
      title='财务报表分析'
      description='财务报表与分析'
      features={['利润表 / 资产负债表', '趋势分析', '自定义报表']}
    />
  );
}
