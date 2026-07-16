import { createFileRoute } from "@tanstack/react-router";
import { AdminPlaceholder } from "@/admin/AdminLayout";

export const Route = createFileRoute("/admin/doctor/billing")({
  component: Page,
});

function Page() {
  return (
    <AdminPlaceholder
      title='个人分账'
      description='本人接诊收入分账'
      features={['明细查看', '下载账单', '提现申请']}
    />
  );
}
