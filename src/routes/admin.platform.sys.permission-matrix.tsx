import { createFileRoute } from "@tanstack/react-router";
import { AdminPage } from "@/admin/AdminLayout";
import {
  RESOURCE_MATRIX,
  ROLE_LABEL,
  ROLE_COLOR,
  DATA_SCOPE_LABEL,
  ACTION_LABEL,
  type AdminRole,
  type Action,
} from "@/admin/roles";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/platform/sys/permission-matrix")({
  component: PermissionMatrix,
});

const ROLES: AdminRole[] = ["platform_admin", "doctor", "nutritionist", "third_party", "finance"];

function PermissionMatrix() {
  // 按 category 分组
  const grouped = RESOURCE_MATRIX.reduce<Record<string, typeof RESOURCE_MATRIX>>((acc, r) => {
    (acc[r.category] = acc[r.category] || []).push(r);
    return acc;
  }, {});

  return (
    <AdminPage
      title="权限矩阵"
      description="一张图看清「哪些角色能看哪些菜单 / 数据范围 / 可执行操作」 — 三维权限可视化"
    >
      <Tabs defaultValue="data">
        <TabsList>
          <TabsTrigger value="data">数据范围矩阵</TabsTrigger>
          <TabsTrigger value="action">操作权限矩阵</TabsTrigger>
        </TabsList>

        {/* 数据范围矩阵 */}
        <TabsContent value="data" className="mt-4 space-y-4">
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900">
            <strong>数据范围</strong>说明每个角色对该资源「能看到的数据广度」：
            <span className="ml-2 inline-flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">全平台</Badge>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">本机构</Badge>
              <Badge variant="secondary" className="bg-amber-100 text-amber-700">分配给我的</Badge>
              <Badge variant="secondary" className="bg-violet-100 text-violet-700">仅本人</Badge>
              <Badge variant="outline">无权限</Badge>
            </span>
          </div>

          {Object.entries(grouped).map(([cat, items]) => (
            <div key={cat} className="rounded-xl border border-border bg-card p-4 shadow-card">
              <h2 className="mb-3 text-sm font-semibold text-muted-foreground">{cat}</h2>
              <table className="w-full text-sm">
                <thead className="border-b text-left text-xs text-muted-foreground">
                  <tr>
                    <th className="w-1/3 px-3 py-2">资源</th>
                    {ROLES.map((r) => (
                      <th key={r} className="px-3 py-2 text-center">
                        <Badge className={cn("rounded-md", ROLE_COLOR[r])} variant="secondary">
                          {ROLE_LABEL[r]}
                        </Badge>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {items.map((res) => (
                    <tr key={res.key} className="hover:bg-muted/30">
                      <td className="px-3 py-3 font-medium">{res.label}</td>
                      {ROLES.map((r) => {
                        const s = res.scope[r];
                        return (
                          <td key={r} className="px-3 py-3 text-center">
                            {s === "none" ? (
                              <Badge variant="outline" className="text-muted-foreground">无</Badge>
                            ) : (
                              <Badge
                                variant="secondary"
                                className={cn(
                                  s === "all" && "bg-emerald-100 text-emerald-700",
                                  s === "own_org" && "bg-blue-100 text-blue-700",
                                  s === "assigned" && "bg-amber-100 text-amber-700",
                                  s === "self" && "bg-violet-100 text-violet-700",
                                )}
                              >
                                {DATA_SCOPE_LABEL[s]}
                              </Badge>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </TabsContent>

        {/* 操作权限矩阵 */}
        <TabsContent value="action" className="mt-4 space-y-4">
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            <strong>操作权限</strong>说明每个角色对该资源「能执行哪些动作」。✓ 表示有该权限。
          </div>

          {Object.entries(grouped).map(([cat, items]) => (
            <div key={cat} className="rounded-xl border border-border bg-card p-4 shadow-card">
              <h2 className="mb-3 text-sm font-semibold text-muted-foreground">{cat}</h2>
              {items.map((res) => (
                <div key={res.key} className="mb-4 last:mb-0">
                  <h3 className="mb-2 font-medium">{res.label}</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/40 text-xs text-muted-foreground">
                        <tr>
                          <th className="px-3 py-2 text-left">角色</th>
                          {(Object.keys(ACTION_LABEL) as Action[]).map((a) => (
                            <th key={a} className="px-3 py-2 text-center">{ACTION_LABEL[a]}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {ROLES.map((r) => {
                          const acts = res.actions[r];
                          return (
                            <tr key={r}>
                              <td className="px-3 py-2">
                                <Badge className={cn("rounded-md", ROLE_COLOR[r])} variant="secondary">
                                  {ROLE_LABEL[r]}
                                </Badge>
                              </td>
                              {(Object.keys(ACTION_LABEL) as Action[]).map((a) => (
                                <td key={a} className="px-3 py-2 text-center">
                                  {acts.includes(a) ? (
                                    <Check className="mx-auto h-4 w-4 text-emerald-600" />
                                  ) : (
                                    <Minus className="mx-auto h-4 w-4 text-muted-foreground/40" />
                                  )}
                                </td>
                              ))}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </AdminPage>
  );
}
