import { createFileRoute } from "@tanstack/react-router";
import { AdminPlaceholder } from "@/admin/AdminLayout";

export const Route = createFileRoute("/admin/platform/product/services")({
  component: Page,
});

function Page() {
  return (
    <AdminPlaceholder
      title='服务项目'
      description='线下报告解读 / 食谱 / 服务包等'
      features={['服务配置', '服务组合 / 套餐搭配', '开启/关闭']}
    />
  );
}
