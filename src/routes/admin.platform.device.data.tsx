import { createFileRoute } from "@tanstack/react-router";
import { AdminPlaceholder } from "@/admin/AdminLayout";

export const Route = createFileRoute("/admin/platform/device/data")({
  component: Page,
});

function Page() {
  return (
    <AdminPlaceholder
      title='数据接入与质控'
      description='设备数据接入与分析模型'
      features={['数据接入与质控', '数据分析模型管理']}
    />
  );
}
