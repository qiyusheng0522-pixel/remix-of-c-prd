import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { AdminPage, StatCard } from "@/admin/AdminLayout";
import { ScopeBanner } from "@/admin/ScopeBanner";
import { C_USERS } from "@/admin/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, UserPlus, Download, UserCheck, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/platform/c-users/")({
  component: CUsersList,
});

function CUsersList() {
  const [q, setQ] = useState("");
  const [risk, setRisk] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [assigned, setAssigned] = useState<string>("all");

  const list = useMemo(() => {
    return C_USERS.filter((u) => {
      if (q && !(u.name.includes(q) || u.id.includes(q) || u.phone.includes(q))) return false;
      if (risk !== "all" && u.riskLevel !== risk) return false;
      if (status !== "all" && u.status !== status) return false;
      if (assigned === "yes" && !u.assignedDoctor && !u.assignedNutritionist) return false;
      if (assigned === "no" && (u.assignedDoctor || u.assignedNutritionist)) return false;
      return true;
    });
  }, [q, risk, status, assigned]);

  const unassigned = C_USERS.filter((u) => !u.assignedDoctor && !u.assignedNutritionist).length;
  const highRisk = C_USERS.filter((u) => u.riskLevel === "高").length;

  return (
    <AdminPage
      title="C 端用户列表"
      description="平台所有注册用户/患者的统一管理入口"
      actions={
        <>
          <Button variant="outline" size="sm">
            <Download className="mr-1 h-4 w-4" />
            导出
          </Button>
          <Button size="sm">
            <UserPlus className="mr-1 h-4 w-4" />
            新增用户
          </Button>
        </>
      }
    >
      <ScopeBanner
        scope="all"
        description="平台管理员可见全部 C 端用户。营养师/医生只能在自己工作台看到分配给本人的用户。"
        actions={["查看", "新增", "编辑", "导出", "分配医护"]}
      />

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="总用户数" value={C_USERS.length.toLocaleString()} icon="Users" tone="primary" />
        <StatCard label="服务中" value={C_USERS.filter((u) => u.status === "服务中").length} icon="UserCheck" tone="success" />
        <StatCard label="未分配医护" value={unassigned} hint="点击下方按钮分配" icon="UserMinus" tone="warning" />
        <StatCard label="高风险" value={highRisk} hint="需重点关怀" icon="AlertCircle" tone="accent" />
      </div>

      {unassigned > 0 && (
        <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          <AlertCircle className="h-5 w-5" />
          <span>
            有 <strong>{unassigned}</strong> 名用户尚未分配医生/营养师，建议尽快处理。
          </span>
          <Button asChild size="sm" variant="outline" className="ml-auto">
            <Link to="/admin/platform/c-users/assignment">前往医护分配</Link>
          </Button>
        </div>
      )}

      <div className="rounded-xl border border-border bg-card p-4 shadow-card">
        <div className="grid gap-3 md:grid-cols-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="姓名/手机号/ID"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={risk} onValueChange={setRisk}>
            <SelectTrigger><SelectValue placeholder="风险等级" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部风险</SelectItem>
              <SelectItem value="高">高风险</SelectItem>
              <SelectItem value="中">中风险</SelectItem>
              <SelectItem value="低">低风险</SelectItem>
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger><SelectValue placeholder="服务状态" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部状态</SelectItem>
              <SelectItem value="服务中">服务中</SelectItem>
              <SelectItem value="活跃">活跃</SelectItem>
              <SelectItem value="流失风险">流失风险</SelectItem>
              <SelectItem value="已流失">已流失</SelectItem>
            </SelectContent>
          </Select>
          <Select value={assigned} onValueChange={setAssigned}>
            <SelectTrigger><SelectValue placeholder="分配状态" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              <SelectItem value="yes">已分配医护</SelectItem>
              <SelectItem value="no">未分配医护</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b text-left text-xs text-muted-foreground">
              <tr>
                <th className="px-3 py-2">用户信息</th>
                <th className="px-3 py-2">健康标签</th>
                <th className="px-3 py-2">风险</th>
                <th className="px-3 py-2">已分配医护</th>
                <th className="px-3 py-2">来源</th>
                <th className="px-3 py-2">状态</th>
                <th className="px-3 py-2">最近活跃</th>
                <th className="px-3 py-2 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {list.map((u) => (
                <tr key={u.id} className="hover:bg-muted/30">
                  <td className="px-3 py-3">
                    <div className="font-medium">{u.name} <span className="text-xs text-muted-foreground">· {u.gender} · {u.age}岁</span></div>
                    <div className="text-xs text-muted-foreground">{u.id} · {u.phone} · {u.region}</div>
                  </td>
                  <td className="px-3 py-3">
                    <Badge variant="secondary">{u.healthLabel}</Badge>
                    {u.tags.slice(0, 2).map((t) => (
                      <Badge key={t} variant="outline" className="ml-1">{t}</Badge>
                    ))}
                  </td>
                  <td className="px-3 py-3">
                    <Badge className={cn(
                      u.riskLevel === "高" && "bg-rose-100 text-rose-700",
                      u.riskLevel === "中" && "bg-amber-100 text-amber-700",
                      u.riskLevel === "低" && "bg-emerald-100 text-emerald-700",
                    )} variant="secondary">
                      {u.riskLevel}
                    </Badge>
                  </td>
                  <td className="px-3 py-3 text-xs">
                    {u.assignedDoctor && <div>👨‍⚕️ {u.assignedDoctor}</div>}
                    {u.assignedNutritionist && <div>🥗 {u.assignedNutritionist}</div>}
                    {!u.assignedDoctor && !u.assignedNutritionist && (
                      <span className="text-amber-600">未分配</span>
                    )}
                  </td>
                  <td className="px-3 py-3 text-xs text-muted-foreground">{u.source}</td>
                  <td className="px-3 py-3">
                    <Badge variant={u.status === "已流失" ? "outline" : "secondary"}>{u.status}</Badge>
                  </td>
                  <td className="px-3 py-3 text-xs text-muted-foreground">{u.lastActiveAt}</td>
                  <td className="px-3 py-3 text-right">
                    <Button asChild size="sm" variant="ghost">
                      <Link to="/admin/platform/c-users/profile">档案</Link>
                    </Button>
                    <Button asChild size="sm" variant="outline" className="ml-1">
                      <Link to="/admin/platform/c-users/assignment">
                        <UserCheck className="mr-1 h-3 w-3" />
                        分配
                      </Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {list.length === 0 && (
            <div className="py-8 text-center text-sm text-muted-foreground">无符合条件的用户</div>
          )}
        </div>
      </div>
    </AdminPage>
  );
}
