import { createFileRoute } from "@tanstack/react-router";
import { AdminPlaceholder } from "@/admin/AdminLayout";

export const Route = createFileRoute("/admin/finance/cost")({
  component: Page,
});

function Page() {
  return (
    <AdminPlaceholder
      title='成本核算'
      description='供应链与运营成本核算'
      features={['成本管理', '成本统计', '毛利分析']}
    />
  );
}
