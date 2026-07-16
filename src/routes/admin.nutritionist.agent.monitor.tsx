import { createFileRoute } from "@tanstack/react-router";
import { AdminPlaceholder } from "@/admin/AdminLayout";

export const Route = createFileRoute("/admin/nutritionist/agent/monitor")({
  component: Page,
});

function Page() {
  return (
    <AdminPlaceholder
      title='Agent 执行监控'
      description='查看运营活动的实时数据'
      features={['参与率 / 转化率 / 完成率', '异常告警', '效果分析', '活动报告导出']}
    />
  );
}
