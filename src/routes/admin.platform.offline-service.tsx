import { createFileRoute } from "@tanstack/react-router";
import { AdminPlaceholder } from "@/admin/AdminLayout";

export const Route = createFileRoute("/admin/platform/offline-service")({
  component: Page,
});

function Page() {
  return (
    <AdminPlaceholder
      title='线下服务管理'
      description='线下服务预约 / 核销 / 体检'
      features={['服务预约与核销', '服务记录管理', '体检服务管理']}
    />
  );
}
