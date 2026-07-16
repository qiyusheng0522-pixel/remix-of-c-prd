import { createFileRoute } from "@tanstack/react-router";
import { AdminPlaceholder } from "@/admin/AdminLayout";

export const Route = createFileRoute("/admin/platform/supply/inventory")({
  component: Page,
});

function Page() {
  return (
    <AdminPlaceholder
      title='库存管理'
      description='商品库与耗材库'
      features={['商品库存管理', '耗材库管理', '盘点', '预警']}
    />
  );
}
