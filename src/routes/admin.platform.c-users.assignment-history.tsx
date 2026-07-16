import { createFileRoute } from "@tanstack/react-router";
import { AdminPage } from "@/admin/AdminLayout";
import { ScopeBanner } from "@/admin/ScopeBanner";
import { ASSIGNMENT_LOGS } from "@/admin/mockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/platform/c-users/assignment-history")({
  component: AssignmentHistory,
});

function AssignmentHistory() {
  return (
    <AdminPage
      title="分配历史"
      description="所有医护分配 / 改派 / 解除操作的完整审计日志"
      actions={
        <Button size="sm" variant="outline">
          <Download className="mr-1 h-4 w-4" />
          导出
        </Button>
      }
    >
      <ScopeBanner
        scope="all"
        description="审计日志仅平台管理员可查看，用于追溯所有医护分配操作的责任人与时间。"
      />

      <div className="rounded-xl border border-border bg-card p-4 shadow-card">
        <table className="w-full text-sm">
          <thead className="border-b text-left text-xs text-muted-foreground">
            <tr>
              <th className="px-3 py-2">日志 ID</th>
              <th className="px-3 py-2">用户</th>
              <th className="px-3 py-2">分配对象</th>
              <th className="px-3 py-2">类型</th>
              <th className="px-3 py-2">方式</th>
              <th className="px-3 py-2">操作人</th>
              <th className="px-3 py-2">原因/备注</th>
              <th className="px-3 py-2">时间</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {ASSIGNMENT_LOGS.map((l) => (
              <tr key={l.id} className="hover:bg-muted/30">
                <td className="px-3 py-3 font-mono text-xs">{l.id}</td>
                <td className="px-3 py-3">
                  <div className="font-medium">{l.userName}</div>
                  <div className="text-xs text-muted-foreground">{l.userId}</div>
                </td>
                <td className="px-3 py-3">
                  <Badge variant="outline">{l.staffRole}</Badge>
                  <span className="ml-1">{l.staffName}</span>
                </td>
                <td className="px-3 py-3">
                  <Badge className={cn(
                    l.type === "首次分配" && "bg-blue-100 text-blue-700",
                    l.type === "改派" && "bg-amber-100 text-amber-700",
                    l.type === "增派" && "bg-emerald-100 text-emerald-700",
                    l.type === "解除" && "bg-rose-100 text-rose-700",
                  )} variant="secondary">{l.type}</Badge>
                </td>
                <td className="px-3 py-3"><Badge variant="secondary">{l.mode}</Badge></td>
                <td className="px-3 py-3 text-xs">{l.operator}</td>
                <td className="px-3 py-3 text-xs text-muted-foreground">{l.reason ?? "-"}</td>
                <td className="px-3 py-3 text-xs text-muted-foreground">{l.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminPage>
  );
}
