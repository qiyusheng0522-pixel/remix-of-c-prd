import { createFileRoute } from "@tanstack/react-router";
import { AdminPage, StatCard } from "@/admin/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, XCircle, Clock, FileSearch, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/platform/approval")({
  component: ApprovalCenter,
});

type ApprovalItem = {
  id: string;
  type: "方案审核" | "活动审核" | "退款审批" | "分账规则" | "量表发布" | "处方审核";
  title: string;
  submitter: string;
  submitterRole: string;
  submittedAt: string;
  priority: "高" | "中" | "低";
  status: "待审核" | "已通过" | "已驳回";
  detail: string;
};

const ITEMS: ApprovalItem[] = [
  { id: "AP2025041801", type: "方案审核", title: "王秀英 - 高血压综合管理方案 v3", submitter: "张营养师", submitterRole: "营养师", submittedAt: "2025-04-18 09:12", priority: "高", status: "待审核", detail: "包含饮食方案 + 运动方案 + 复合方案，需医生审核签字。" },
  { id: "AP2025041802", type: "活动审核", title: "5 月糖尿病健康月运营活动", submitter: "李运营", submitterRole: "营养师", submittedAt: "2025-04-18 08:30", priority: "中", status: "待审核", detail: "覆盖 1200 名糖尿病用户，5 次推送 + 1 场线上讲座。" },
  { id: "AP2025041803", type: "退款审批", title: "订单 #ORD20250410-022 全额退款", submitter: "客服小王", submitterRole: "客服", submittedAt: "2025-04-18 07:45", priority: "高", status: "待审核", detail: "客户体检后未实际服务，申请全额退款 ¥298。" },
  { id: "AP2025041702", type: "量表发布", title: "「老年人跌倒风险评估量表 v2」发布申请", submitter: "李医生", submitterRole: "医生", submittedAt: "2025-04-17 16:20", priority: "中", status: "待审核", detail: "新增 8 道题，调整 3 道题分值，需平台量表审核员复核。" },
  { id: "AP2025041701", type: "分账规则", title: "三方机构「阳光社区」分账比例调整", submitter: "刘财务", submitterRole: "财务", submittedAt: "2025-04-17 14:00", priority: "中", status: "待审核", detail: "由 70/30 调整为 60/40，自 2025-05-01 起生效。" },
  { id: "AP2025041501", type: "处方审核", title: "李医生 - 张大爷高血压处方", submitter: "李医生", submitterRole: "医生", submittedAt: "2025-04-15 10:30", priority: "高", status: "已通过", detail: "已由药师审核通过。" },
  { id: "AP2025041401", type: "活动审核", title: "「春日健走打卡」活动", submitter: "王营养师", submitterRole: "营养师", submittedAt: "2025-04-14 11:00", priority: "低", status: "已驳回", detail: "驳回原因：奖品池未与财务确认。" },
];

function ApprovalCenter() {
  const [items, setItems] = useState(ITEMS);
  const [tab, setTab] = useState<"待审核" | "已通过" | "已驳回">("待审核");
  const [picked, setPicked] = useState<ApprovalItem | null>(null);
  const [reason, setReason] = useState("");

  const filtered = items.filter((i) => i.status === tab);
  const pending = items.filter((i) => i.status === "待审核").length;
  const approved = items.filter((i) => i.status === "已通过").length;
  const rejected = items.filter((i) => i.status === "已驳回").length;

  const decide = (next: "已通过" | "已驳回") => {
    if (!picked) return;
    if (next === "已驳回" && !reason.trim()) {
      toast.error("驳回需填写理由");
      return;
    }
    setItems((prev) => prev.map((i) => (i.id === picked.id ? { ...i, status: next } : i)));
    toast.success(`已${next === "已通过" ? "通过" : "驳回"}：${picked.title}`);
    setPicked(null);
    setReason("");
  };

  return (
    <AdminPage title="审批中心" description="集中处理方案审核、活动审核、退款审批、分账规则、量表发布等所有待审事项">
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="待审批" value={pending} hint="超 24h: 1" icon="Clock" tone="warning" />
        <StatCard label="今日已通过" value={approved} icon="CheckCircle2" tone="success" />
        <StatCard label="今日已驳回" value={rejected} icon="XCircle" tone="accent" />
        <StatCard label="平均处理时长" value="1.2h" hint="本周平均" icon="Activity" tone="primary" />
      </div>

      <div className="rounded-xl border border-border bg-card shadow-card">
        <Tabs value={tab} onValueChange={(v) => setTab(v as "待审核" | "已通过" | "已驳回")}>
          <div className="border-b px-4 pt-4">
            <TabsList>
              <TabsTrigger value="待审核">
                待审核 <Badge variant="secondary" className="ml-2">{pending}</Badge>
              </TabsTrigger>
              <TabsTrigger value="已通过">已通过</TabsTrigger>
              <TabsTrigger value="已驳回">已驳回</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={tab} className="m-0">
            <table className="w-full text-sm">
              <thead className="border-b text-left text-xs text-muted-foreground">
                <tr>
                  <th className="px-4 py-2">编号</th>
                  <th className="px-4 py-2">类型</th>
                  <th className="px-4 py-2">事项</th>
                  <th className="px-4 py-2">提交人</th>
                  <th className="px-4 py-2">优先级</th>
                  <th className="px-4 py-2">提交时间</th>
                  <th className="px-4 py-2 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                      暂无{tab}的审批
                    </td>
                  </tr>
                ) : (
                  filtered.map((it) => (
                    <tr key={it.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3 font-mono text-xs">{it.id}</td>
                      <td className="px-4 py-3"><Badge variant="outline">{it.type}</Badge></td>
                      <td className="px-4 py-3">{it.title}</td>
                      <td className="px-4 py-3 text-xs">
                        {it.submitter}
                        <span className="ml-1 text-muted-foreground">({it.submitterRole})</span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="secondary" className={cn(
                          it.priority === "高" && "bg-rose-100 text-rose-700",
                          it.priority === "中" && "bg-amber-100 text-amber-700",
                          it.priority === "低" && "bg-emerald-100 text-emerald-700",
                        )}>{it.priority}</Badge>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{it.submittedAt}</td>
                      <td className="px-4 py-3 text-right">
                        <Button size="sm" variant="ghost" onClick={() => setPicked(it)}>
                          <FileSearch className="mr-1 h-3.5 w-3.5" />
                          审阅
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </TabsContent>
        </Tabs>
      </div>

      {/* 审阅抽屉 */}
      <Sheet open={!!picked} onOpenChange={(o) => !o && setPicked(null)}>
        <SheetContent className="w-full sm:max-w-2xl flex flex-col p-0">
          <SheetHeader className="border-b px-6 py-4">
            <SheetTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              审阅 - {picked?.type}
            </SheetTitle>
            <SheetDescription className="font-mono">{picked?.id}</SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            <div className="rounded-lg border bg-card p-4">
              <h3 className="font-semibold">{picked?.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{picked?.detail}</p>
              <div className="mt-3 flex flex-wrap gap-3 text-xs">
                <span><strong>提交人：</strong>{picked?.submitter} ({picked?.submitterRole})</span>
                <span><strong>提交时间：</strong>{picked?.submittedAt}</span>
                <span><strong>优先级：</strong>{picked?.priority}</span>
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <p className="mb-2 text-sm font-semibold">审批流程</p>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>提交申请 · {picked?.submittedAt} · {picked?.submitter}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-600" />
                  <span>等待平台管理员审核中...</span>
                </div>
              </div>
            </div>

            {picked?.status === "待审核" && (
              <div className="rounded-lg border p-4">
                <label className="mb-2 block text-sm font-semibold">驳回理由（驳回时必填）</label>
                <Textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="请说明驳回原因，将通知到提交人..."
                  rows={3}
                />
              </div>
            )}
          </div>

          {picked?.status === "待审核" && (
            <SheetFooter className="border-t px-6 py-4 bg-muted/20">
              <Button variant="outline" onClick={() => setPicked(null)}>取消</Button>
              <Button variant="outline" className="text-destructive" onClick={() => decide("已驳回")}>
                <XCircle className="mr-1 h-4 w-4" />
                驳回
              </Button>
              <Button onClick={() => decide("已通过")}>
                <CheckCircle2 className="mr-1 h-4 w-4" />
                通过
              </Button>
            </SheetFooter>
          )}
        </SheetContent>
      </Sheet>
    </AdminPage>
  );
}
