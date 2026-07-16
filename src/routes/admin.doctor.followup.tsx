import { createFileRoute } from "@tanstack/react-router";
import { AdminPlaceholder } from "@/admin/AdminLayout";

export const Route = createFileRoute("/admin/doctor/followup")({
  component: Page,
});

function Page() {
  return (
    <AdminPlaceholder
      title='随访计划'
      description='患者随访任务管理'
      features={['创建随访计划', '随访记录', '完成率统计', '异常预警']}
    />
  );
}
