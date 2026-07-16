import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminPage } from "@/admin/AdminLayout";
import { ScopeBanner } from "@/admin/ScopeBanner";
import { SCALES, QUESTION_BANK, QTYPE_LABEL } from "@/admin/scaleData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { ArrowLeft, GripVertical, Plus, X, Save, Send, Sparkles } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/admin/platform/scale/editor")({
  component: EditorPage,
});

function EditorPage() {
  const scale = SCALES[0]; // demo: 通用健康分诊量表
  const [selectedQ] = useState<string[]>(scale.questionIds);
  const selectedItems = QUESTION_BANK.filter((q) => selectedQ.includes(q.id));

  return (
    <AdminPage
      title="量表编辑器"
      description={`${scale.name} · ${scale.code}`}
      actions={
        <>
          <Button asChild variant="outline" size="sm">
            <Link to="/admin/platform/scale"><ArrowLeft className="mr-1 h-4 w-4" />返回</Link>
          </Button>
          <Button variant="outline" size="sm">
            <Save className="mr-1 h-4 w-4" />保存草稿
          </Button>
          <Button size="sm">
            <Send className="mr-1 h-4 w-4" />提交审核
          </Button>
        </>
      }
    >
      <ScopeBanner
        scope="all"
        description="编辑器分三步：① 基本信息 ② 选题组卷（从题库拖拽） ③ 计分与智能路由。所有量表均需通过专家审核后才能发布。"
        actions={["编辑", "提交审核"]}
      />

      <Tabs defaultValue="basic">
        <TabsList>
          <TabsTrigger value="basic">① 基本信息</TabsTrigger>
          <TabsTrigger value="questions">② 选题组卷 ({selectedItems.length})</TabsTrigger>
          <TabsTrigger value="scoring">③ 计分配置</TabsTrigger>
          <TabsTrigger value="routing">④ 智能路由</TabsTrigger>
          <TabsTrigger value="preview">预览</TabsTrigger>
        </TabsList>

        {/* ① 基本信息 */}
        <TabsContent value="basic" className="mt-4">
          <div className="grid gap-4 rounded-xl border border-border bg-card p-5 shadow-card md:grid-cols-2">
            <Field label="量表名称"><Input defaultValue={scale.name} /></Field>
            <Field label="编码"><Input defaultValue={scale.code} /></Field>
            <Field label="分类">
              <Select defaultValue={scale.category}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["分诊", "专病", "心理", "营养", "生活方式", "随访"].map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="预计完成时长（分钟）"><Input type="number" defaultValue={scale.estimatedMinutes} /></Field>
            <Field label="适用人群"><Input defaultValue={scale.audience} /></Field>
            <Field label="审核专家"><Input defaultValue={scale.reviewer ?? ""} placeholder="选择临床/营养专家" /></Field>
            <div className="md:col-span-2">
              <Field label="量表说明"><Textarea defaultValue={scale.description} rows={3} /></Field>
            </div>
          </div>
        </TabsContent>

        {/* ② 选题组卷 */}
        <TabsContent value="questions" className="mt-4 grid gap-4 lg:grid-cols-3">
          {/* 左：已选题目 */}
          <div className="rounded-xl border border-border bg-card p-4 shadow-card lg:col-span-2">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold">已选题目（拖拽排序）</h3>
              <Badge variant="secondary">{selectedItems.length} 题</Badge>
            </div>
            <div className="space-y-2">
              {selectedItems.map((q, i) => (
                <div key={q.id} className="flex items-start gap-2 rounded-lg border border-border bg-muted/30 p-3">
                  <GripVertical className="mt-1 h-4 w-4 shrink-0 cursor-grab text-muted-foreground" />
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-primary text-xs font-bold text-primary-foreground">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{q.title}</div>
                    <div className="mt-1 flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
                      <Badge variant="outline" className="text-xs">{QTYPE_LABEL[q.type]}</Badge>
                      {q.dimension && <Badge variant="secondary" className="text-xs">{q.dimension}</Badge>}
                      {q.required && <span className="text-rose-600">必填</span>}
                      {q.branches && q.branches.length > 0 && (
                        <span className="text-primary">含跳题逻辑</span>
                      )}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon"><X className="h-4 w-4" /></Button>
                </div>
              ))}
            </div>
          </div>

          {/* 右：题库选择 */}
          <div className="rounded-xl border border-border bg-card p-4 shadow-card">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold">题库</h3>
              <Button variant="outline" size="sm">
                <Plus className="mr-1 h-4 w-4" />自建题
              </Button>
            </div>
            <Input placeholder="搜索题库..." className="mb-3" />
            <div className="max-h-[420px] space-y-1.5 overflow-y-auto">
              {QUESTION_BANK.map((q) => {
                const used = selectedQ.includes(q.id);
                return (
                  <div
                    key={q.id}
                    className={`rounded-lg border p-2.5 text-sm ${
                      used ? "border-primary bg-primary-soft" : "border-border bg-card hover:bg-muted/40"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="line-clamp-1 text-xs text-muted-foreground">{q.code}</span>
                      <Button variant={used ? "secondary" : "outline"} size="sm" disabled={used}>
                        {used ? "已添加" : "+ 添加"}
                      </Button>
                    </div>
                    <div className="mt-1 text-sm">{q.title}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </TabsContent>

        {/* ③ 计分 */}
        <TabsContent value="scoring" className="mt-4 space-y-4">
          <div className="rounded-xl border border-border bg-card p-5 shadow-card">
            <h3 className="mb-3 font-semibold">计分模式</h3>
            <div className="grid gap-3 md:grid-cols-3">
              <ModeCard
                title="总分"
                desc="所有题目得分相加，按区间出结论。最简单。"
                active={scale.scoring.mode === "总分"}
              />
              <ModeCard
                title="维度分"
                desc="按题目维度分别计分，输出多维雷达图。适合多维度筛查。"
                active={scale.scoring.mode === "维度分"}
              />
              <ModeCard
                title="公式"
                desc="自定义计算公式（如 BMI、血脂指数）。最灵活，支持临床决策。"
                active={scale.scoring.mode === "公式"}
              />
            </div>
            {scale.scoring.formula && (
              <div className="mt-4">
                <Label className="text-sm text-muted-foreground">自定义公式</Label>
                <code className="mt-1 block rounded bg-muted/50 p-3 font-mono text-sm">{scale.scoring.formula}</code>
              </div>
            )}
          </div>

          <div className="rounded-xl border border-border bg-card p-5 shadow-card">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold">分级结论</h3>
              <Button variant="outline" size="sm"><Plus className="mr-1 h-4 w-4" />新增分级</Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>分数区间</TableHead>
                  <TableHead>等级</TableHead>
                  <TableHead>建议</TableHead>
                  <TableHead>触发标签</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scale.scoring.ranges.map((r, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-mono">{r.min} - {r.max}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={
                        r.level === "高危" ? "bg-rose-100 text-rose-700" :
                        r.level === "异常" ? "bg-amber-100 text-amber-700" :
                        r.level === "关注" ? "bg-yellow-100 text-yellow-700" :
                        "bg-emerald-100 text-emerald-700"
                      }>{r.level}</Badge>
                    </TableCell>
                    <TableCell className="text-sm">{r.advice}</TableCell>
                    <TableCell>
                      {r.triggerTags?.map((t) => (
                        <Badge key={t} variant="outline" className="mr-1">{t}</Badge>
                      ))}
                    </TableCell>
                    <TableCell><Button variant="ghost" size="icon"><X className="h-4 w-4" /></Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* ④ 路由 */}
        <TabsContent value="routing" className="mt-4 space-y-4">
          <div className="flex items-start gap-2 rounded-lg border border-primary/30 bg-primary-soft p-4 text-sm">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <div>
              <p className="font-semibold text-primary">智能路由 = 用户答完即触发后续动作</p>
              <p className="mt-0.5 text-muted-foreground">
                两种触发方式可叠加：① 评分阈值（按维度或总分）② 健康标签命中。命中后自动推荐专科量表 / 派单医生 / 营养师跟进 / 生成方案。
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 shadow-card">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold">路由规则</h3>
              <Button size="sm"><Plus className="mr-1 h-4 w-4" />新增规则</Button>
            </div>
            <div className="space-y-3">
              {scale.routing.map((r) => (
                <div key={r.id} className="rounded-lg border border-border bg-muted/30 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium">{r.name}</div>
                      <div className="mt-2 flex flex-wrap gap-2 text-sm">
                        {r.byScore && (
                          <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                            评分: {r.byScore.dimension ?? "总分"} ≥ {r.byScore.min}
                          </Badge>
                        )}
                        {r.byTags && r.byTags.length > 0 && (
                          <Badge variant="secondary" className="bg-rose-100 text-rose-700">
                            标签: {r.byTags.join(" / ")}
                          </Badge>
                        )}
                        <span className="text-muted-foreground">→</span>
                        <Badge className="bg-primary text-primary-foreground">
                          {r.recommend.type}: {r.recommend.targetLabel}
                        </Badge>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon"><X className="h-4 w-4" /></Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* 预览 */}
        <TabsContent value="preview" className="mt-4">
          <div className="mx-auto max-w-md rounded-xl border border-border bg-card p-5 shadow-card">
            <div className="text-center">
              <h3 className="text-lg font-bold">{scale.name}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{scale.description}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                共 {selectedItems.length} 题 · 约 {scale.estimatedMinutes} 分钟
              </p>
            </div>
            <div className="mt-4 space-y-3">
              {selectedItems.slice(0, 3).map((q, i) => (
                <div key={q.id} className="rounded-lg border border-border p-3">
                  <p className="text-sm font-medium">{i + 1}. {q.title}</p>
                  {q.options && (
                    <div className="mt-2 space-y-1.5">
                      {q.options.map((o) => (
                        <button
                          key={o.key}
                          className="block w-full rounded border border-border bg-card px-3 py-2 text-left text-sm hover:bg-muted"
                        >
                          {o.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <p className="text-center text-xs text-muted-foreground">— 仅展示前 3 题 —</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </AdminPage>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="text-sm">{label}</Label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

function ModeCard({ title, desc, active }: { title: string; desc: string; active: boolean }) {
  return (
    <div className={`cursor-pointer rounded-lg border-2 p-3 ${active ? "border-primary bg-primary-soft" : "border-border bg-card hover:border-primary/50"}`}>
      <div className="flex items-center justify-between">
        <span className="font-semibold">{title}</span>
        {active && <Badge className="bg-primary text-primary-foreground">已选</Badge>}
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
    </div>
  );
}
