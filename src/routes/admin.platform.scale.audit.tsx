import { createFileRoute } from "@tanstack/react-router";
import { AdminPage } from "@/admin/AdminLayout";
import { ScopeBanner } from "@/admin/ScopeBanner";
import { SCALE_AUDITS } from "@/admin/scaleData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { CheckCircle, XCircle, Eye } from "lucide-react";

export const Route = createFileRoute("/admin/platform/scale/audit")({
  component: AuditPage,
});

const STATUS_TONE: Record<string, string> = {
  待审核: "bg-amber-100 text-amber-700",
  已通过: "bg-emerald-100 text-emerald-700",
  已驳回: "bg-rose-100 text-rose-700",
};

function AuditPage() {
  return (
    <AdminPage
      title="量表审核工作台"
      description="所有由医生/营养师提交的私有量表，须经临床/营养专家审核后方可发布为公共量表。"
    >
      <ScopeBanner
        scope="all"
        description="审核员需具备「临床/营养专家」身份。审核通过后量表自动转入公共题库，所有用户可使用。"
        actions={["查看", "审核", "驳回"]}
      />

      <div className="rounded-xl border border-border bg-card p-4 shadow-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>量表</TableHead>
              <TableHead>提交人</TableHead>
              <TableHead>分类</TableHead>
              <TableHead>题量</TableHead>
              <TableHead>提交时间</TableHead>
              <TableHead>状态 / 审核员</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {SCALE_AUDITS.map((a) => (
              <TableRow key={a.id}>
                <TableCell>
                  <div className="font-medium">{a.scaleName}</div>
                  {a.comment && <div className="mt-0.5 text-xs text-muted-foreground">审批意见: {a.comment}</div>}
                </TableCell>
                <TableCell className="text-sm">{a.submittedBy}</TableCell>
                <TableCell><Badge variant="secondary">{a.category}</Badge></TableCell>
                <TableCell className="text-sm">{a.questionCount} 题</TableCell>
                <TableCell className="text-xs text-muted-foreground">{a.submittedAt}</TableCell>
                <TableCell>
                  <Badge className={STATUS_TONE[a.status]} variant="secondary">{a.status}</Badge>
                  {a.reviewer && <div className="mt-0.5 text-xs text-muted-foreground">审核: {a.reviewer}</div>}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" title="预览"><Eye className="h-4 w-4" /></Button>
                  {a.status === "待审核" && (
                    <>
                      <Button variant="ghost" size="icon" title="通过" className="text-emerald-600">
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="驳回" className="text-rose-600">
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-card">
        <h3 className="mb-2 font-semibold">审核要点</h3>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>✓ 临床合理性：题目与结论符合临床规范，引用权威量表（PHQ-9 / GAD-7 等）</li>
          <li>✓ 计分逻辑：分级阈值与建议一致，避免误诊</li>
          <li>✓ 路由设置：高危等级必须配置医生派单路由</li>
          <li>✓ 隐私合规：题目不涉及超出业务范围的敏感信息</li>
        </ul>
      </div>
    </AdminPage>
  );
}
