import { createFileRoute } from "@tanstack/react-router";
import { AdminPlaceholder } from "@/admin/AdminLayout";

export const Route = createFileRoute("/admin/platform/product/goods")({
  component: Page,
});

function Page() {
  return (
    <AdminPlaceholder
      title='健康商品'
      description='器械 / 智能设备 / 保健品 / 营养餐'
      features={['商品上架', 'SKU 管理', '价格 / 库存', '上下架']}
    />
  );
}
