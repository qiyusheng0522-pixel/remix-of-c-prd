import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminPage } from "@/admin/AdminLayout";
import { ScopeBanner } from "@/admin/ScopeBanner";
import { C_USERS } from "@/admin/mockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, ClipboardList, MessageSquare, FileText } from "lucide-react";

export const Route = createFileRoute("/admin/platform/c-users/profile")({
  component: UserProfile,
});

function UserProfile() {
  const u = C_USERS[0]; // demo: 王建国
  return (
    <AdminPage
      title="用户/患者档案"
      description={`${u.name} · ${u.id}`}
      actions={
        <>
          <Button asChild variant="outline" size="sm">
            <Link to="/admin/platform/c-users">← 返回列表</Link>
          </Button>
          <Button asChild size="sm">
            <Link to="/admin/platform/c-users/assignment">医护分配</Link>
          </Button>
        </>
      }
    >
      <ScopeBanner
        scope="all"
        description="平台管理员可查看所有患者档案。营养师/医生只能查看分配给自己的患者档案。"
        actions={["查看", "编辑", "导出"]}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {/* 基本信息 */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-card lg:col-span-1">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
              {u.name.slice(0, 1)}
            </div>
            <div>
              <h2 className="text-lg font-semibold">{u.name}</h2>
              <p className="text-sm text-muted-foreground">{u.gender} · {u.age} 岁 · {u.region}</p>
            </div>
          </div>
          <dl className="mt-4 space-y-2 text-sm">
            <Row label="用户 ID" value={u.id} />
            <Row label="手机号" value={u.phone} />
            <Row label="注册时间" value={u.registerAt} />
            <Row label="来源" value={u.source} />
            <Row label="风险等级">
              <Badge variant="secondary" className="bg-rose-100 text-rose-700">{u.riskLevel}</Badge>
            </Row>
            <Row label="服务状态">
              <Badge variant="secondary">{u.status}</Badge>
            </Row>
          </dl>
          <div className="mt-4 border-t pt-4">
            <p className="mb-2 text-xs text-muted-foreground">已分配医护团队</p>
            {(u.assignedDoctors ?? []).length === 0 && (u.assignedNutritionists ?? []).length === 0 && (
              <p className="text-xs text-muted-foreground">暂未分配</p>
            )}
            {(u.assignedDoctors ?? []).map((d) => (
              <div key={d.staffId} className="mb-1.5 text-sm">
                👨‍⚕️ <strong>{d.name}</strong>
                {d.isPrimary && <Badge variant="secondary" className="ml-1 bg-amber-100 text-amber-700 text-xs">主治</Badge>}
                <div className="ml-5 text-xs text-muted-foreground">负责：{d.condition}</div>
              </div>
            ))}
            {(u.assignedNutritionists ?? []).map((d) => (
              <div key={d.staffId} className="mb-1.5 text-sm">
                🥗 <strong>{d.name}</strong>
                {d.isPrimary && <Badge variant="secondary" className="ml-1 bg-amber-100 text-amber-700 text-xs">主营</Badge>}
                <div className="ml-5 text-xs text-muted-foreground">负责：{d.condition}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 详细信息 Tabs */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="health">
            <TabsList>
              <TabsTrigger value="health"><Activity className="mr-1 h-4 w-4" />健康档案</TabsTrigger>
              <TabsTrigger value="service"><ClipboardList className="mr-1 h-4 w-4" />服务记录</TabsTrigger>
              <TabsTrigger value="im"><MessageSquare className="mr-1 h-4 w-4" />沟通记录</TabsTrigger>
              <TabsTrigger value="reports"><FileText className="mr-1 h-4 w-4" />检测报告</TabsTrigger>
            </TabsList>
            <TabsContent value="health" className="mt-4 space-y-3">
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="mb-3 font-semibold">最近体征数据</h3>
                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    { k: "血压", v: "152 / 95", t: "今天 08:30", warn: true },
                    { k: "心率", v: "78 bpm", t: "今天 08:30" },
                    { k: "血糖", v: "6.2 mmol/L", t: "昨天" },
                    { k: "体重", v: "68.5 kg", t: "本周" },
                    { k: "BMI", v: "23.8", t: "本周" },
                    { k: "睡眠", v: "6.5 h", t: "昨晚" },
                  ].map((m) => (
                    <div key={m.k} className={`rounded-lg p-3 ${m.warn ? "bg-rose-50" : "bg-muted/40"}`}>
                      <p className="text-xs text-muted-foreground">{m.k}</p>
                      <p className={`mt-1 text-lg font-bold ${m.warn ? "text-rose-700" : ""}`}>{m.v}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{m.t}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="mb-3 font-semibold">病史与过敏史</h3>
                <p className="text-sm text-muted-foreground">高血压 5 年，规律服用降压药；无食物/药物过敏。</p>
              </div>
            </TabsContent>
            <TabsContent value="service" className="mt-4">
              <div className="rounded-xl border border-border bg-card p-5">
                <ul className="space-y-3 text-sm">
                  {[
                    "2024-11-15 在线问诊（李医生）— 复诊",
                    "2024-11-10 营养方案调整（张营养师）— 减盐方案",
                    "2024-10-28 体检服务（海淀店）— 三高检测",
                  ].map((s) => (
                    <li key={s} className="flex items-center justify-between border-b pb-2 last:border-0">
                      <span>{s}</span>
                      <Button variant="ghost" size="sm">详情</Button>
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>
            <TabsContent value="im" className="mt-4">
              <div className="rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground">
                最近 30 天共 18 条沟通，最近一次 2 小时前与张营养师交流饮食方案。
              </div>
            </TabsContent>
            <TabsContent value="reports" className="mt-4">
              <div className="rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground">
                共 5 份检测报告（体检、血液、心电图）。
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminPage>
  );
}

function Row({ label, value, children }: { label: string; value?: string; children?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium">{children ?? value}</dd>
    </div>
  );
}
