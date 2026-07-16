import { createFileRoute } from "@tanstack/react-router";
import { AdminPlaceholder } from "@/admin/AdminLayout";

export const Route = createFileRoute("/admin/platform/supply/canteen")({
  component: Page,
});

function Page() {
  return (
    <AdminPlaceholder
      title='食堂管理'
      description='食堂餐品 / 营养规则 / 就餐管理'
      features={['餐品管理', '营养餐知识库', '就餐记录', '备菜预估']}
    />
  );
}
