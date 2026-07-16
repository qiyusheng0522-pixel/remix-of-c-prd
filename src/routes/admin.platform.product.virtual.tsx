import { createFileRoute } from "@tanstack/react-router";
import { AdminPlaceholder } from "@/admin/AdminLayout";

export const Route = createFileRoute("/admin/platform/product/virtual")({
  component: Page,
});

function Page() {
  return (
    <AdminPlaceholder
      title='虚拟服务'
      description='在线问诊 / 私人订阅 / 运动课程'
      features={['服务配置', '订阅模式', '课程上架']}
    />
  );
}
