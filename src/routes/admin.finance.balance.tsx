import { createFileRoute } from "@tanstack/react-router";
import { AdminPlaceholder } from "@/admin/AdminLayout";

export const Route = createFileRoute("/admin/finance/balance")({
  component: Page,
});

function Page() {
  return (
    <AdminPlaceholder
      title='账户余额'
      description='平台与商户账户余额管理'
      features={['余额查询', '充值 / 扣减', '流水']}
    />
  );
}
