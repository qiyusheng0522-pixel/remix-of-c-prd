import { createFileRoute } from "@tanstack/react-router";
import { AdminPlaceholder } from "@/admin/AdminLayout";

export const Route = createFileRoute("/admin/platform/device/list")({
  component: Page,
});

function Page() {
  return (
    <AdminPlaceholder
      title='设备管理'
      description='智能设备统一管理'
      features={['设备列表', '绑定关系', '在线状态', '固件版本']}
    />
  );
}
