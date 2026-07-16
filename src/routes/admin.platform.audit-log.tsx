import { createFileRoute } from "@tanstack/react-router";
import { AdminPage, StatCard } from "@/admin/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useState } from "react";
import { toast } from "sonner";
import { Download, FileSearch, Search, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/platform/audit-log")({
  component: AuditLog,
});

type Log = {
  id: string;
  time: string;
  operator: string;
  role: string;
  action: "登录" | "新增" | "编辑" | "删除" | "导出" | "审核" | "分配" | "登出";
  resource: string;
  target: string;
  ip: string;
  result: "成功" | "失败";
  detail: string;
};

const LOGS: Log[] = [
  { id: "L20250418001", time: "2025-04-18 10:42:18", operator: "平台管理员", role: "platform_admin", action: "审核", resource: "方案审核", target: "AP2025041801 王秀英方案", ip: "10.10.0.12", result: "成功", detail: "通过张营养师提交的高血压方案 v3" },
  { id: "L20250418002", time: "2025-04-18 10:24:05", operator: "张营养师", role: "nutritionist", action: "编辑", resource: "客户档案", target: "王秀英 (CU2025001)", ip: "180.158.22.31", result: "成功", detail: "修改了「最近血压」字段：145/92 → 138/85" },
  { id: "L20250418003", time: "2025-04-18 09:55:33", operator: "李医生", role: "doctor", action: "新增", resource: "电子处方", target: "RX20250418-007", ip: "180.158.22.45", result: "成功", detail: "为张大爷开具高血压处方（5 项用药）" },
  { id: "L20250418004", time: "2025-04-18 09:32:01", operator: "刘财务", role: "finance", action: "导出", resource: "财务账单", target: "2025年3月分账明细", ip: "10.10.0.18", result: "成功", detail: "导出 286 条记录为 Excel" },
  { id: "L20250418005", time: "2025-04-18 09:12:44", operator: "未知", role: "—", action: "登录", resource: "后台登录", target: "用户名 admin1", ip: "59.108.33.91", result: "失败", detail: "密码错误（连续 3 次）" },
  { id: "L20250418006", time: "2025-04-18 08:45:22", operator: "平台管理员", role: "platform_admin", action: "分配", resource: "医护分配", target: "新用户 138****8821", ip: "10.10.0.12", result: "成功", detail: "分配李医生（主治）+ 张营养师" },
  { id: "L20250417015", time: "2025-04-17 22:10:08", operator: "陈合伙人", role: "third_party", action: "登录", resource: "后台登录", target: "陈合伙人", ip: "121.40.18.8", result: "成功", detail: "三方运营登录" },
  { id: "L20250417014", time: "2025-04-17 18:33:45", operator: "平台管理员", role: "platform_admin", action: "删除", resource: "营销活动", target: "AC202504-15 春日健走", ip: "10.10.0.12", result: "成功", detail: "活动已驳回，删除草稿" },
  { id: "L20250417013", time: "2025-04-17 16:20:11", operator: "李医生", role: "doctor", action: "新增", resource: "量表发布申请", target: "AP2025041702", ip: "180.158.22.45", result: "成功", detail: "提交「老年人跌倒风险评估量表 v2」发布申请" },
  { id: "L20250417012", time: "2025-04-17 14:00:18", operator: "刘财务", role: "finance", action: "编辑", resource: "分账规则", target: "阳光社区分账规则", ip: "10.10.0.18", result: "成功", detail: "70/30 → 60/40，提交审批 AP2025041701" },
];

const ROLE_COLOR: Record<string, string> = {
  platform_admin: "bg-rose-100 text-rose-700",
  nutritionist: "bg-emerald-100 text-emerald-700",
  doctor: "bg-blue-100 text-blue-700",
  finance: "bg-amber-100 text-amber-700",
  third_party: "bg-violet-100 text-violet-700",
  "—": "bg-muted text-muted-foreground",
};

function AuditLog() {
  const [keyword, setKeyword] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [resultFilter, setResultFilter] = useState("all");
  const [picked, setPicked] = useState<Log | null>(null);

  const filtered = LOGS.filter((l) => {
    if (actionFilter !== "all" && l.action !== actionFilter) return false;
    if (resultFilter !== "all" && l.result !== resultFilter) return false;
    if (keyword) {
      const k = keyword.toLowerCase();
      return [l.operator, l.target, l.detail, l.ip, l.id].some((v) => v.toLowerCase().includes(k));
    }
    return true;
  });

  return (
    <AdminPage
      title="操作审计日志"
      description="全平台所有用户的操作行为审计 · 满足合规审计与责任追溯"
      actions={
        <Button size="sm" variant="outline" onClick={() => toast.success(`已导出 ${filtered.length} 条审计日志`)}>
          <Download className="mr-1 h-4 w-4" />
          导出
        </Button>
      }
    >
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="今日操作" value={156} icon="Activity" tone="primary" />
        <StatCard label="登录失败" value={3} hint="今日" icon="ShieldAlert" tone="warning" />
        <StatCard label="数据导出" value={12} hint="今日" icon="Download" tone="accent" />
        <StatCard label="高敏感操作" value={5} hint="删除/审核/分账" icon="Shield" tone="success" />
      </div>

      <div className="rounded-xl border bg-card p-4 shadow-card">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="搜索操作人 / IP / 资源 / 详情"
              className="pl-9"
            />
          </div>
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部操作</SelectItem>
              {["登录", "新增", "编辑", "删除", "导出", "审核", "分配"].map((a) => (
                <SelectItem key={a} value={a}>{a}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={resultFilter} onValueChange={setResultFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部结果</SelectItem>
              <SelectItem value="成功">成功</SelectItem>
              <SelectItem value="失败">失败</SelectItem>
            </SelectContent>
          </Select>
          <div className="ml-auto text-xs text-muted-foreground">共 {filtered.length} 条</div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b text-left text-xs text-muted-foreground">
              <tr>
                <th className="px-3 py-2">日志 ID</th>
                <th className="px-3 py-2">时间</th>
                <th className="px-3 py-2">操作人</th>
                <th className="px-3 py-2">操作</th>
                <th className="px-3 py-2">资源 / 目标</th>
                <th className="px-3 py-2">IP</th>
                <th className="px-3 py-2">结果</th>
                <th className="px-3 py-2 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((l) => (
                <tr key={l.id} className="hover:bg-muted/30">
                  <td className="px-3 py-3 font-mono text-xs">{l.id}</td>
                  <td className="px-3 py-3 text-xs">{l.time}</td>
                  <td className="px-3 py-3">
                    <div className="font-medium text-sm">{l.operator}</div>
                    <Badge variant="secondary" className={cn("mt-0.5 text-[10px]", ROLE_COLOR[l.role])}>{l.role}</Badge>
                  </td>
                  <td className="px-3 py-3">
                    <Badge variant="outline">{l.action}</Badge>
                  </td>
                  <td className="px-3 py-3 text-xs">
                    <div className="font-medium">{l.resource}</div>
                    <div className="text-muted-foreground">{l.target}</div>
                  </td>
                  <td className="px-3 py-3 font-mono text-xs">{l.ip}</td>
                  <td className="px-3 py-3">
                    <Badge variant="secondary" className={cn(
                      l.result === "成功" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                    )}>{l.result}</Badge>
                  </td>
                  <td className="px-3 py-3 text-right">
                    <Button size="sm" variant="ghost" onClick={() => setPicked(l)}>
                      <FileSearch className="mr-1 h-3.5 w-3.5" />
                      详情
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Sheet open={!!picked} onOpenChange={(o) => !o && setPicked(null)}>
        <SheetContent className="w-full sm:max-w-xl flex flex-col p-0">
          <SheetHeader className="border-b px-6 py-4">
            <SheetTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              审计日志详情
            </SheetTitle>
            <SheetDescription className="font-mono">{picked?.id}</SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3 text-sm">
            {picked && Object.entries({
              "时间": picked.time,
              "操作人": `${picked.operator} (${picked.role})`,
              "操作类型": picked.action,
              "资源": picked.resource,
              "目标": picked.target,
              "IP 地址": picked.ip,
              "结果": picked.result,
              "详情": picked.detail,
            }).map(([k, v]) => (
              <div key={k} className="grid grid-cols-3 gap-2 border-b pb-2">
                <span className="text-muted-foreground">{k}</span>
                <span className="col-span-2">{v}</span>
              </div>
            ))}
            <div className="rounded-lg bg-muted/40 p-3 text-xs text-muted-foreground">
              💡 审计日志只读，不可篡改。如需归档导出请联系信息安全部门。
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </AdminPage>
  );
}
