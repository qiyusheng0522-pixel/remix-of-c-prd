import { createFileRoute } from "@tanstack/react-router";
import { AdminPlaceholder } from "@/admin/AdminLayout";

export const Route = createFileRoute("/admin/platform/store/data")({
  component: Page,
});

function Page() {
  return (
    <AdminPlaceholder
      title='门店运营数据'
      description='门店运营数据看板'
      features={['客流量', '营收趋势', '热门服务', '员工绩效']}
    />
  );
}
