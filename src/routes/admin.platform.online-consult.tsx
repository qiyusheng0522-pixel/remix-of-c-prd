import { createFileRoute } from "@tanstack/react-router";
import { AdminPlaceholder } from "@/admin/AdminLayout";

export const Route = createFileRoute("/admin/platform/online-consult")({
  component: Page,
});

function Page() {
  return (
    <AdminPlaceholder
      title='线上咨询管理'
      description='全平台咨询订单与记录'
      features={['咨询订单', '咨询记录', '随访计划']}
    />
  );
}
