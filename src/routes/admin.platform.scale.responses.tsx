import { createFileRoute } from "@tanstack/react-router";
import { AdminPage, StatCard } from "@/admin/AdminLayout";
import { ScopeBanner } from "@/admin/ScopeBanner";
import { SCALE_RESPONSES } from "@/admin/scaleData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Search, Eye, Send } from "lucide-react";

export const Route = createFileRoute("/admin/platform/scale/responses")({
  component: ResponsesPage,
});

const LEVEL_TONE: Record<string, string> = {
  正常: "bg-emerald-100 text-emerald-700",
  关注: "bg-yellow-100 text-yellow-700",
  异常: "bg-amber-100 text-amber-700",
  高危: "bg-rose-100 text-rose-700",
};

const STATUS_TONE: Record<string, string> = {
  已派单: "bg-blue-100 text-blue-700",
  已生成方案: "bg-emerald-100 text-emerald-700",
  等待跟进: "bg-amber-100 text-amber-700",
  已闭环: "bg-slate-100 text-slate-700",
};

function ResponsesPage() {
  const total = SCALE_RESPONSES.length;
  const high = SCALE_RESPONSES.filter((r) => r.level === "高危").length;
  const pending = SCALE_RESPONSES.filter((r) => r.followUpStatus === "等待跟进").length;
  const closed = SCALE_RESPONSES.filter((r) => r.followUpStatus === "已闭环").length;

  return (
    <AdminPage
      title="量表答卷记录"
      description="所有用户答卷的统一查看入口，自动回写到健康档案，支持转派/重新评估。"
    >
      <ScopeBanner
        scope="all"
        description="平台管理员可见全平台答卷；医生/营养师只能看到自己接收派单的答卷。所有答卷数据自动同步至患者档案。"
        actions={["查看", "导出", "转派"]}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="本月答卷" value={total} hint="环比 +18%" icon="FileCheck2" tone="primary" />
        <StatCard label="高危用户" value={high} hint="已自动派单" icon="AlertTriangle" tone="warning" />
        <StatCard label="待跟进" value={pending} hint="超 24h 自动提醒" icon="Clock" tone="accent" />
        <StatCard label="已闭环" value={closed} hint="方案完成" icon="CheckCircle2" tone="success" />
      </div>

      <div className="rounded-xl border border-border bg-card p-4 shadow-card">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input className="w-64 pl-8" placeholder="用户姓名 / 量表名称" />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-[140px]"><SelectValue placeholder="等级" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部等级</SelectItem>
              <SelectItem value="正常">正常</SelectItem>
              <SelectItem value="关注">关注</SelectItem>
              <SelectItem value="异常">异常</SelectItem>
              <SelectItem value="高危">高危</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-[140px]"><SelectValue placeholder="跟进状态" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部状态</SelectItem>
              <SelectItem value="等待跟进">等待跟进</SelectItem>
              <SelectItem value="已派单">已派单</SelectItem>
              <SelectItem value="已生成方案">已生成方案</SelectItem>
              <SelectItem value="已闭环">已闭环</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Table className="mt-3">
          <TableHeader>
            <TableRow>
              <TableHead>用户</TableHead>
              <TableHead>量表</TableHead>
              <TableHead>填写时间</TableHead>
              <TableHead>分数 / 等级</TableHead>
              <TableHead>触发标签</TableHead>
              <TableHead>命中路由</TableHead>
              <TableHead>跟进</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {SCALE_RESPONSES.map((r) => (
              <TableRow key={r.id}>
                <TableCell>
                  <div className="font-medium">{r.userName}</div>
                  <div className="text-xs text-muted-foreground">{r.userId}</div>
                </TableCell>
                <TableCell className="text-sm">{r.scaleName}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{r.filledAt}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{r.totalScore}</span>
                    <Badge className={LEVEL_TONE[r.level]} variant="secondary">{r.level}</Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {r.triggeredTags.map((t) => (
                      <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  {r.triggeredRoutes.length > 0 ? (
                    <div className="space-y-0.5 text-xs text-muted-foreground">
                      {r.triggeredRoutes.map((tr, i) => (
                        <div key={i} className="line-clamp-1">• {tr}</div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">无</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge className={STATUS_TONE[r.followUpStatus]} variant="secondary">
                    {r.followUpStatus}
                  </Badge>
                  {r.handler && <div className="mt-0.5 text-xs text-muted-foreground">→ {r.handler}</div>}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" title="查看详情"><Eye className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" title="转派"><Send className="h-4 w-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AdminPage>
  );
}
