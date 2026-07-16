import { createFileRoute } from "@tanstack/react-router";
import { AdminPlaceholder } from "@/admin/AdminLayout";

export const Route = createFileRoute("/admin/doctor/patients/records")({
  component: Page,
});

function Page() {
  return (
    <AdminPlaceholder
      title='健康/服务记录'
      description='患者健康数据与服务历史'
      features={['体征数据时间线', '历史问诊记录', '用药记录', '随访记录']}
    />
  );
}
