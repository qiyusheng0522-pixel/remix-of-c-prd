import { createFileRoute } from "@tanstack/react-router";
import { AdminPage } from "@/admin/AdminLayout";
import { ScopeBanner } from "@/admin/ScopeBanner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Plus, Sparkles } from "lucide-react";

export const Route = createFileRoute("/admin/platform/c-users/assignment-rules")({
  component: AssignmentRules,
});

const RULES = [
  {
    id: "R001",
    name: "高血压患者 → 北京区医生",
    condition: "健康标签 = 高血压 AND 区域 = 北京",
    action: "推荐医生：擅长高血压 · 北京区，按负载升序",
    enabled: true,
    hits: 128,
  },
  {
    id: "R002",
    name: "糖尿病患者 → 内分泌专科医生",
    condition: "健康标签 = 糖尿病",
    action: "推荐医生：内分泌科，评分 ≥ 4.5",
    enabled: true,
    hits: 86,
  },
  {
    id: "R003",
    name: "三高 → 慢病饮食营养师",
    condition: "健康标签 IN (高血压, 糖尿病, 高血脂)",
    action: "推荐营养师：慢病饮食专长",
    enabled: true,
    hits: 162,
  },
  {
    id: "R004",
    name: "产后调理 → 母婴营养师",
    condition: "标签 包含 产后调理",
    action: "推荐营养师：母婴 / 产后专长",
    enabled: false,
    hits: 0,
  },
  {
    id: "R005",
    name: "高风险用户 → 优先双匹配",
    condition: "风险等级 = 高",
    action: "强制同时分配 1 名医生 + 1 名营养师",
    enabled: true,
    hits: 42,
  },
];

function AssignmentRules() {
  return (
    <AdminPage
      title="分配规则配置"
      description="配置自动/智能推荐规则。规则按优先级匹配，命中后用于「一键智能推荐」候选生成。"
      actions={
        <Button size="sm">
          <Plus className="mr-1 h-4 w-4" />
          新增规则
        </Button>
      }
    >
      <ScopeBanner
        scope="all"
        description="规则仅供平台管理员配置。规则不会自动落库分配，仅用于推荐 Top 候选，最终由调度员确认。"
        actions={["查看", "新增", "编辑", "审核", "删除"]}
      />

      <div className="rounded-xl border border-border bg-blue-50/50 p-4 text-sm">
        <p className="flex items-center gap-2 font-semibold">
          <Sparkles className="h-4 w-4 text-primary" />
          智能推荐评分公式
        </p>
        <p className="mt-1 text-muted-foreground">
          匹配分 = 专长匹配 (40) + 区域匹配 (25) + 负载情况 (20) + 服务评分 (15)
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-4 shadow-card">
        <table className="w-full text-sm">
          <thead className="border-b text-left text-xs text-muted-foreground">
            <tr>
              <th className="px-3 py-2">规则名称</th>
              <th className="px-3 py-2">触发条件</th>
              <th className="px-3 py-2">分配动作</th>
              <th className="px-3 py-2">命中次数</th>
              <th className="px-3 py-2">启用</th>
              <th className="px-3 py-2 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {RULES.map((r) => (
              <tr key={r.id}>
                <td className="px-3 py-3 font-medium">{r.name}</td>
                <td className="px-3 py-3 text-xs">
                  <code className="rounded bg-muted px-2 py-1">{r.condition}</code>
                </td>
                <td className="px-3 py-3 text-xs text-muted-foreground">{r.action}</td>
                <td className="px-3 py-3"><Badge variant="secondary">{r.hits}</Badge></td>
                <td className="px-3 py-3"><Switch defaultChecked={r.enabled} /></td>
                <td className="px-3 py-3 text-right">
                  <Button size="sm" variant="ghost">编辑</Button>
                  <Button size="sm" variant="ghost" className="text-destructive">删除</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminPage>
  );
}
