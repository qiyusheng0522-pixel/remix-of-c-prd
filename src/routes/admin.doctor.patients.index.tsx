import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminPage, StatCard } from "@/admin/AdminLayout";
import { ScopeBanner } from "@/admin/ScopeBanner";
import { C_USERS } from "@/admin/mockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MessageSquare, Stethoscope } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/doctor/patients/")({
  component: MyPatients,
});

function MyPatients() {
  const [q, setQ] = useState("");
  const myPatients = C_USERS.filter((u) => u.assignedDoctor === "李医生");
  const list = myPatients.filter((u) => !q || u.name.includes(q) || u.id.includes(q));

  return (
    <AdminPage title="我的患者" description="您正在管理的患者清单">
      <ScopeBanner
        scope="assigned"
        description="您只能查看平台分配给您的患者。如需新增患者或申请改派，请联系平台管理员。"
        actions={["查看", "编辑医疗档案", "在线接诊", "开方案", "随访"]}
      />
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="管理患者" value={myPatients.length} icon="Users" tone="primary" />
        <StatCard label="高风险" value={myPatients.filter((u) => u.riskLevel === "高").length} icon="AlertTriangle" tone="warning" />
        <StatCard label="本周接诊" value={28} icon="Stethoscope" tone="accent" />
        <StatCard label="待复诊" value={5} icon="CalendarClock" tone="success" />
      </div>
      <div className="rounded-xl border border-border bg-card p-4 shadow-card">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="搜索患者姓名/ID" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b text-left text-xs text-muted-foreground">
              <tr><th className="px-3 py-2">患者</th><th className="px-3 py-2">主要诊断</th><th className="px-3 py-2">风险</th><th className="px-3 py-2">协同营养师</th><th className="px-3 py-2 text-right">操作</th></tr>
            </thead>
            <tbody className="divide-y">
              {list.map((u) => (
                <tr key={u.id} className="hover:bg-muted/30">
                  <td className="px-3 py-3"><div className="font-medium">{u.name}</div><div className="text-xs text-muted-foreground">{u.id} · {u.gender}{u.age}岁 · {u.region}</div></td>
                  <td className="px-3 py-3"><Badge variant="secondary">{u.healthLabel}</Badge></td>
                  <td className="px-3 py-3"><Badge className={cn(u.riskLevel === "高" && "bg-rose-100 text-rose-700", u.riskLevel === "中" && "bg-amber-100 text-amber-700", u.riskLevel === "低" && "bg-emerald-100 text-emerald-700")} variant="secondary">{u.riskLevel}</Badge></td>
                  <td className="px-3 py-3 text-xs">{u.assignedNutritionist ?? "-"}</td>
                  <td className="px-3 py-3 text-right">
                    <Button asChild size="sm" variant="ghost"><Link to="/admin/platform/c-users/profile">病历</Link></Button>
                    <Button size="sm" variant="outline" className="ml-1"><Stethoscope className="mr-1 h-3 w-3" />接诊</Button>
                    <Button size="sm" variant="ghost" className="ml-1"><MessageSquare className="h-3 w-3" /></Button>
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
