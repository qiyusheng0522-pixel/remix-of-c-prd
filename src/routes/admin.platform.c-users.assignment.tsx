import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AdminPage } from "@/admin/AdminLayout";
import { ScopeBanner } from "@/admin/ScopeBanner";
import {
  C_USERS,
  STAFF_CANDIDATES,
  type CUser,
  type StaffCandidate,
  type AssignedStaff,
} from "@/admin/mockData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Sparkles, UserCheck, RefreshCcw, Star, X, Plus, Crown } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/platform/c-users/assignment")({
  component: AssignmentPage,
});

interface PendingAssign extends AssignedStaff {
  role: "医生" | "营养师";
}

function AssignmentPage() {
  const [selectedUser, setSelectedUser] = useState<CUser>(C_USERS[4]); // 默认未分配的孙国安
  const [recommended, setRecommended] = useState<StaffCandidate[] | null>(null);
  /** 已挑选的多个医生/营养师（支持同一用户配置多位） */
  const [picks, setPicks] = useState<PendingAssign[]>([]);

  const unassignedUsers = C_USERS.filter(
    (u) =>
      !u.assignedDoctors?.length ||
      !u.assignedNutritionists?.length ||
      // 多病症但只有 1 位医生时也提示需要加配
      (u.tags.length >= 2 && (u.assignedDoctors?.length ?? 0) < 2),
  );

  const generateRecommend = () => {
    const sorted = [...STAFF_CANDIDATES].sort((a, b) => b.matchScore - a.matchScore);
    const top = [
      ...sorted.filter((s) => s.role === "医生").slice(0, 3),
      ...sorted.filter((s) => s.role === "营养师").slice(0, 3),
    ];
    setRecommended(top);
    toast.success("已生成推荐：支持选择多位医生分管不同病症");
  };

  /** 添加一位医护到待分配清单 */
  const addPick = (s: StaffCandidate) => {
    if (picks.find((p) => p.staffId === s.id)) {
      toast.info(`${s.name} 已在分配清单中`);
      return;
    }
    const sameRoleCount = picks.filter((p) => p.role === s.role).length;
    setPicks((prev) => [
      ...prev,
      {
        role: s.role,
        staffId: s.id,
        name: s.name,
        condition: s.specialty[0] ?? "综合管理",
        isPrimary: sameRoleCount === 0, // 第一位自动设为主治
        assignedAt: new Date().toISOString().slice(0, 10),
      },
    ]);
    toast.success(`已加入：${s.name}`);
  };

  const removePick = (staffId: string) => {
    setPicks((prev) => {
      const next = prev.filter((p) => p.staffId !== staffId);
      // 若被移除的是主治，将同角色的第一位升为主治
      const removed = prev.find((p) => p.staffId === staffId);
      if (removed?.isPrimary) {
        const idx = next.findIndex((p) => p.role === removed.role);
        if (idx >= 0) next[idx] = { ...next[idx], isPrimary: true };
      }
      return next;
    });
  };

  const setPrimary = (staffId: string) => {
    setPicks((prev) => {
      const target = prev.find((p) => p.staffId === staffId);
      if (!target) return prev;
      return prev.map((p) =>
        p.role === target.role ? { ...p, isPrimary: p.staffId === staffId } : p,
      );
    });
  };

  const updateCondition = (staffId: string, condition: string) => {
    setPicks((prev) => prev.map((p) => (p.staffId === staffId ? { ...p, condition } : p)));
  };

  const switchUser = (u: CUser) => {
    setSelectedUser(u);
    setRecommended(null);
    // 预填该用户已有的分配
    const existing: PendingAssign[] = [
      ...(u.assignedDoctors ?? []).map((d) => ({ ...d, role: "医生" as const })),
      ...(u.assignedNutritionists ?? []).map((d) => ({ ...d, role: "营养师" as const })),
    ];
    setPicks(existing);
  };

  const confirm = () => {
    const doctors = picks.filter((p) => p.role === "医生");
    const nutritionists = picks.filter((p) => p.role === "营养师");
    if (!doctors.length && !nutritionists.length) {
      toast.error("请至少选择 1 位医护人员");
      return;
    }
    if (doctors.filter((d) => d.isPrimary).length > 1) {
      toast.error("最多 1 位主治医生");
      return;
    }
    toast.success(
      `已为 ${selectedUser.name} 配置 ${doctors.length} 位医生 + ${nutritionists.length} 位营养师`,
      {
        description: [
          ...doctors.map((d) => `${d.isPrimary ? "★" : "·"} ${d.name}（${d.condition}）`),
          ...nutritionists.map((d) => `${d.isPrimary ? "★" : "·"} ${d.name}（${d.condition}）`),
        ].join("　"),
      },
    );
  };

  const doctorPicks = picks.filter((p) => p.role === "医生");
  const nutritionistPicks = picks.filter((p) => p.role === "营养师");

  return (
    <AdminPage
      title="医护分配"
      description="一个患者可由多位医生协同管理（如「高血压 + 糖尿病」由不同专科医生分管）。每位医护可标注负责的具体病症。"
    >
      <ScopeBanner
        scope="all"
        description="支持「多医生 + 多营养师」分管模式：当用户存在多种慢病或合并症时，可分别由专科医生负责。仅平台管理员可执行。"
        actions={["查看", "新增", "改派", "调整主治", "审核"]}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {/* 左：待分配队列 */}
        <div className="rounded-xl border border-border bg-card p-4 shadow-card">
          <h2 className="mb-3 flex items-center justify-between font-semibold">
            待分配 / 待加配
            <Badge variant="destructive">{unassignedUsers.length}</Badge>
          </h2>
          <p className="mb-2 text-xs text-muted-foreground">
            包含「未分配」和「多病症仅 1 位医生」的用户
          </p>
          <div className="space-y-2">
            {unassignedUsers.map((u) => {
              const active = u.id === selectedUser.id;
              const docCount = u.assignedDoctors?.length ?? 0;
              const nutCount = u.assignedNutritionists?.length ?? 0;
              return (
                <button
                  key={u.id}
                  onClick={() => switchUser(u)}
                  className={cn(
                    "block w-full rounded-lg border p-3 text-left transition-all",
                    active
                      ? "border-primary bg-primary-soft"
                      : "border-border hover:border-primary/50 hover:bg-muted/30",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{u.name}</p>
                    <Badge
                      variant="secondary"
                      className={cn(
                        u.riskLevel === "高" && "bg-rose-100 text-rose-700",
                        u.riskLevel === "中" && "bg-amber-100 text-amber-700",
                      )}
                    >
                      {u.riskLevel}风险
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {u.healthLabel} · {u.region} · {u.age}岁
                  </p>
                  <div className="mt-1 flex flex-wrap gap-1 text-xs">
                    <Badge variant="outline">医生 {docCount}</Badge>
                    <Badge variant="outline">营养师 {nutCount}</Badge>
                    {u.tags.length >= 2 && docCount < 2 && (
                      <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                        建议加配
                      </Badge>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 右：分配工作区 */}
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-xl border border-border bg-card p-5 shadow-card">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">{selectedUser.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {selectedUser.gender} · {selectedUser.age}岁 · {selectedUser.region} ·{" "}
                  {selectedUser.healthLabel} · 风险 {selectedUser.riskLevel}
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {selectedUser.tags.map((t) => (
                    <Badge key={t} variant="outline" className="text-xs">
                      #{t}
                    </Badge>
                  ))}
                </div>
              </div>
              <Button onClick={generateRecommend} className="gap-2 shrink-0">
                <Sparkles className="h-4 w-4" />
                一键智能推荐
              </Button>
            </div>

            {/* 已选清单 */}
            <div className="mb-4 grid gap-3 md:grid-cols-2">
              <PickColumn
                role="医生"
                picks={doctorPicks}
                onRemove={removePick}
                onPrimary={setPrimary}
                onCondition={updateCondition}
              />
              <PickColumn
                role="营养师"
                picks={nutritionistPicks}
                onRemove={removePick}
                onPrimary={setPrimary}
                onCondition={updateCondition}
              />
            </div>

            {recommended && (
              <div className="space-y-4 border-t pt-4">
                <p className="text-sm font-semibold text-muted-foreground">
                  智能推荐 · 点击「+」添加到分配清单（可多选）
                </p>
                {(["医生", "营养师"] as const).map((role) => {
                  const list = recommended.filter((r) => r.role === role);
                  return (
                    <div key={role}>
                      <h3 className="mb-2 text-xs font-medium text-muted-foreground">
                        {role}候选 · Top {list.length}
                      </h3>
                      <div className="grid gap-2 md:grid-cols-3">
                        {list.map((s) => {
                          const added = picks.some((p) => p.staffId === s.id);
                          const load = Math.round((s.currentLoad / s.maxLoad) * 100);
                          return (
                            <div
                              key={s.id}
                              className={cn(
                                "rounded-lg border p-3 transition-all",
                                added
                                  ? "border-emerald-300 bg-emerald-50"
                                  : "border-border hover:border-primary/50",
                              )}
                            >
                              <div className="flex items-center justify-between">
                                <p className="font-medium">{s.name}</p>
                                <Badge
                                  variant="secondary"
                                  className="bg-emerald-100 text-emerald-700"
                                >
                                  匹配 {s.matchScore}
                                </Badge>
                              </div>
                              <div className="mt-1 flex flex-wrap gap-1">
                                {s.specialty.map((sp) => (
                                  <Badge key={sp} variant="outline" className="text-xs">
                                    {sp}
                                  </Badge>
                                ))}
                              </div>
                              <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                  {s.rating}
                                </span>
                                <span>负载 {load}%</span>
                              </div>
                              <p className="mt-1 text-xs text-primary line-clamp-1">
                                💡 {s.matchReason}
                              </p>
                              <Button
                                size="sm"
                                variant={added ? "secondary" : "default"}
                                className="mt-2 w-full"
                                disabled={added}
                                onClick={() => addPick(s)}
                              >
                                <Plus className="mr-1 h-3 w-3" />
                                {added ? "已添加" : "加入分配"}
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {!recommended && picks.length === 0 && (
              <div className="rounded-lg border border-dashed bg-muted/30 p-8 text-center text-sm text-muted-foreground">
                <Sparkles className="mx-auto mb-2 h-8 w-8 text-primary" />
                点击「一键智能推荐」获取候选，或在下方手动选择。
                <br />
                <strong>支持为同一用户配置多位医生</strong>，分别管理不同病症。
              </div>
            )}

            <div className="mt-4 flex items-center justify-end gap-2 border-t pt-4">
              <Button variant="outline" onClick={generateRecommend}>
                <RefreshCcw className="mr-1 h-4 w-4" />
                重新推荐
              </Button>
              <Button onClick={confirm} disabled={picks.length === 0}>
                <UserCheck className="mr-1 h-4 w-4" />
                确认分配（{picks.length}）
              </Button>
            </div>
          </div>

          {/* 全部候选人手动选择 */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-card">
            <h3 className="mb-3 font-semibold">手动选择（全部候选人）</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b text-left text-xs text-muted-foreground">
                  <tr>
                    <th className="px-2 py-2">姓名</th>
                    <th className="px-2 py-2">类型</th>
                    <th className="px-2 py-2">专长</th>
                    <th className="px-2 py-2">负载</th>
                    <th className="px-2 py-2">评分</th>
                    <th className="px-2 py-2 text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {STAFF_CANDIDATES.map((s) => {
                    const added = picks.some((p) => p.staffId === s.id);
                    return (
                      <tr key={s.id} className="hover:bg-muted/30">
                        <td className="px-2 py-2 font-medium">{s.name}</td>
                        <td className="px-2 py-2">
                          <Badge variant="outline">{s.role}</Badge>
                        </td>
                        <td className="px-2 py-2 text-xs">{s.specialty.join(" / ")}</td>
                        <td className="px-2 py-2 text-xs">
                          {Math.round((s.currentLoad / s.maxLoad) * 100)}%
                        </td>
                        <td className="px-2 py-2 text-xs">⭐ {s.rating}</td>
                        <td className="px-2 py-2 text-right">
                          <Button
                            size="sm"
                            variant={added ? "secondary" : "outline"}
                            disabled={added}
                            onClick={() => addPick(s)}
                          >
                            {added ? "已添加" : `加入${s.role}`}
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminPage>
  );
}

function PickColumn({
  role,
  picks,
  onRemove,
  onPrimary,
  onCondition,
}: {
  role: "医生" | "营养师";
  picks: PendingAssign[];
  onRemove: (id: string) => void;
  onPrimary: (id: string) => void;
  onCondition: (id: string, c: string) => void;
}) {
  return (
    <div className="rounded-lg border border-border bg-muted/20 p-3">
      <div className="mb-2 flex items-center justify-between">
        <h4 className="text-sm font-semibold">
          {role}分配 <span className="text-muted-foreground">({picks.length})</span>
        </h4>
        {picks.length > 1 && (
          <Badge variant="secondary" className="bg-amber-100 text-amber-700 text-xs">
            协同管理
          </Badge>
        )}
      </div>
      {picks.length === 0 ? (
        <p className="rounded border border-dashed p-3 text-center text-xs text-muted-foreground">
          暂未分配{role}
        </p>
      ) : (
        <div className="space-y-2">
          {picks.map((p) => (
            <div key={p.staffId} className="rounded-md border bg-card p-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  {p.isPrimary && <Crown className="h-3.5 w-3.5 text-amber-500" />}
                  <span className="text-sm font-medium">{p.name}</span>
                  {p.isPrimary && (
                    <Badge variant="secondary" className="bg-amber-100 text-amber-700 text-xs">
                      主治
                    </Badge>
                  )}
                </div>
                <div className="flex gap-1">
                  {!p.isPrimary && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 px-2 text-xs"
                      onClick={() => onPrimary(p.staffId)}
                    >
                      设为主
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 text-destructive"
                    onClick={() => onRemove(p.staffId)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="mt-1.5 flex items-center gap-1">
                <span className="text-xs text-muted-foreground shrink-0">负责：</span>
                <Input
                  value={p.condition}
                  onChange={(e) => onCondition(p.staffId, e.target.value)}
                  className="h-7 text-xs"
                  placeholder="例：高血压 / 糖尿病"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
