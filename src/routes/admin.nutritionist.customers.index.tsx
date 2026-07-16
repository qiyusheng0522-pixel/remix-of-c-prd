import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminPage, StatCard } from "@/admin/AdminLayout";
import { ScopeBanner } from "@/admin/ScopeBanner";
import { C_USERS } from "@/admin/mockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MessageSquare } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/nutritionist/customers/")({
  component: MyCustomers,
});

function MyCustomers() {
  const [q, setQ] = useState("");
  const myCustomers = C_USERS.filter((u) => u.assignedNutritionist === "张营养师");
  const list = myCustomers.filter((u) => !q || u.name.includes(q) || u.id.includes(q));

  return (
    <AdminPage title="我的客户" description="您正在服务的客户清单">
      <ScopeBanner
        scope="assigned"
        description="您只能查看平台分配给您的客户。如需查看全平台用户，请联系平台管理员。"
        actions={["查看", "编辑健康档案", "新建方案", "发起沟通"]}
      />
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="服务中" value={myCustomers.length} icon="Users" tone="primary" />
        <StatCard label="高风险" value={myCustomers.filter((u) => u.riskLevel === "高").length} icon="AlertCircle" tone="warning" />
        <StatCard label="本周完成方案" value={4} icon="ClipboardCheck" tone="success" />
      </div>
      <div className="rounded-xl border border-border bg-card p-4 shadow-card">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="搜索客户姓名/ID" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b text-left text-xs text-muted-foreground">
              <tr><th className="px-3 py-2">客户</th><th className="px-3 py-2">健康标签</th><th className="px-3 py-2">风险</th><th className="px-3 py-2">协同医生</th><th className="px-3 py-2 text-right">操作</th></tr>
            </thead>
            <tbody className="divide-y">
              {list.map((u) => (
                <tr key={u.id} className="hover:bg-muted/30">
                  <td className="px-3 py-3"><div className="font-medium">{u.name}</div><div className="text-xs text-muted-foreground">{u.id} · {u.gender}{u.age}岁 · {u.region}</div></td>
                  <td className="px-3 py-3"><Badge variant="secondary">{u.healthLabel}</Badge></td>
                  <td className="px-3 py-3"><Badge className={cn(u.riskLevel === "高" && "bg-rose-100 text-rose-700", u.riskLevel === "中" && "bg-amber-100 text-amber-700", u.riskLevel === "低" && "bg-emerald-100 text-emerald-700")} variant="secondary">{u.riskLevel}</Badge></td>
                  <td className="px-3 py-3 text-xs">{u.assignedDoctor ?? "-"}</td>
                  <td className="px-3 py-3 text-right">
                    <Button asChild size="sm" variant="ghost"><Link to="/admin/platform/c-users/profile">查看档案</Link></Button>
                    <Button size="sm" variant="outline" className="ml-1"><MessageSquare className="mr-1 h-3 w-3" />沟通</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminPage>
  );
}
