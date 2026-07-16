import { createFileRoute } from "@tanstack/react-router";
import { AdminPage } from "@/admin/AdminLayout";
import { ScopeBanner } from "@/admin/ScopeBanner";
import { SCALES } from "@/admin/scaleData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Plus } from "lucide-react";

export const Route = createFileRoute("/admin/platform/scale/routing")({
  component: RoutingPage,
});

function RoutingPage() {
  // 全平台所有路由规则汇总
  const allRoutes = SCALES.flatMap((s) =>
    s.routing.map((r) => ({ ...r, scaleName: s.name, scaleId: s.id })),
  );

  return (
    <AdminPage
      title="分诊路由规则"
      description="所有量表答卷后的智能跳转规则。一图看清「答完哪道量表 → 触发什么动作」。"
      actions={<Button size="sm"><Plus className="mr-1 h-4 w-4" />新增全局规则</Button>}
    >
      <ScopeBanner
        scope="all"
        description="平台管理员可配置「评分阈值 + 标签触发」双轨规则。规则按优先级顺序执行，命中后立即触发动作。"
        actions={["查看", "新增", "编辑", "审核"]}
      />

      {/* 流程图 */}
      <div className="rounded-xl border border-border bg-gradient-to-br from-primary-soft to-card p-6 shadow-card">
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">智能分诊流程</h3>
        </div>
        <div className="grid items-center gap-3 md:grid-cols-9">
          <FlowNode color="bg-blue-100 text-blue-700" title="C 端用户" desc="App / 小程序" />
          <Arrow />
          <FlowNode color="bg-violet-100 text-violet-700" title="分诊量表" desc="必填 5 题" />
          <Arrow />
          <FlowNode color="bg-amber-100 text-amber-700" title="计分 + 标签" desc="维度评分 / 健康标签" />
          <Arrow />
          <FlowNode color="bg-emerald-100 text-emerald-700" title="路由引擎" desc="阈值/标签匹配" />
          <Arrow />
          <FlowNode color="bg-rose-100 text-rose-700" title="后续动作" desc="专科量表/派单/方案" />
        </div>
      </div>

      {/* 路由规则列表 */}
      <div className="space-y-3">
        {SCALES.filter((s) => s.routing.length > 0).map((s) => (
          <div key={s.id} className="rounded-xl border border-border bg-card p-5 shadow-card">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h4 className="font-semibold">{s.name}</h4>
                <p className="text-xs text-muted-foreground">{s.code} · {s.routing.length} 条规则</p>
              </div>
              <Button variant="outline" size="sm">编辑</Button>
            </div>
            <div className="space-y-2">
              {s.routing.map((r) => (
                <div key={r.id} className="grid gap-3 rounded-lg border border-border bg-muted/30 p-3 md:grid-cols-12 md:items-center">
                  <div className="md:col-span-4">
                    <div className="text-sm font-medium">{r.name}</div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 md:col-span-4">
                    {r.byScore && (
                      <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                        🎯 {r.byScore.dimension ?? "总分"} ≥ {r.byScore.min}
                      </Badge>
                    )}
                    {r.byTags && (
                      <Badge variant="secondary" className="bg-rose-100 text-rose-700">
                        🏷 {r.byTags.join(" / ")}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1 md:col-span-3">
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <Badge className="bg-primary text-primary-foreground">
                      {r.recommend.type}
                    </Badge>
                    <span className="truncate text-xs text-muted-foreground">{r.recommend.targetLabel}</span>
                  </div>
                  <div className="text-right md:col-span-1">
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700">已启用</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-card">
        <h3 className="mb-2 font-semibold">兜底规则</h3>
        <p className="text-sm text-muted-foreground">
          若用户答卷未命中任何路由规则：默认进入 <Badge variant="secondary">观察队列</Badge>，由健康调度员人工跟进；
          7 天后自动推送 <Badge variant="secondary">7 日饮食习惯评估</Badge> 作为兜底量表。
        </p>
        <div className="mt-2 text-xs text-muted-foreground">共 {allRoutes.length} 条全平台规则在运行。</div>
      </div>
    </AdminPage>
  );
}

function FlowNode({ color, title, desc }: { color: string; title: string; desc: string }) {
  return (
    <div className={`rounded-lg ${color} p-3 text-center md:col-span-1`}>
      <div className="text-sm font-bold">{title}</div>
      <div className="mt-0.5 text-xs opacity-75">{desc}</div>
    </div>
  );
}

function Arrow() {
  return (
    <div className="hidden justify-center md:flex md:col-span-1">
      <ArrowRight className="h-5 w-5 text-muted-foreground" />
    </div>
  );
}
