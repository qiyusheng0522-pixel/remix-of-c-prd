import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminPage, StatCard } from "@/admin/AdminLayout";
import { ScopeBanner } from "@/admin/ScopeBanner";
import { SCALES, SCALE_RESPONSES, SCALE_AUDITS } from "@/admin/scaleData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useMemo, useState } from "react";
import { Plus, Search, Eye, Pencil, Copy, Power } from "lucide-react";

export const Route = createFileRoute("/admin/platform/scale/")({
  component: ScaleListPage,
});

const STATUS_TONE: Record<string, string> = {
  已发布: "bg-emerald-100 text-emerald-700",
  草稿: "bg-slate-100 text-slate-700",
  审核中: "bg-amber-100 text-amber-700",
  已下线: "bg-rose-100 text-rose-700",
};

function ScaleListPage() {
  const [keyword, setKeyword] = useState("");
  const [cat, setCat] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");

  const list = useMemo(() => {
    return SCALES.filter((s) => {
      if (cat !== "all" && s.category !== cat) return false;
      if (status !== "all" && s.status !== status) return false;
      if (keyword && !s.name.includes(keyword) && !s.code.includes(keyword)) return false;
      return true;
    });
  }, [keyword, cat, status]);

  const total = SCALES.length;
  const published = SCALES.filter((s) => s.status === "已发布").length;
  const responses = SCALE_RESPONSES.length;
  const pending = SCALE_AUDITS.filter((a) => a.status === "待审核").length;

  return (
    <AdminPage
      title="量表（问卷）中心"
      description="题库 + 量表 + 智能路由三层结构。配置一次，复用到分诊、专病、随访等所有场景。"
      actions={
        <>
          <Button asChild variant="outline" size="sm">
            <Link to="/admin/platform/scale/bank">题库管理</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link to="/admin/platform/scale/routing">分诊路由规则</Link>
          </Button>
          <Button asChild size="sm">
            <Link to="/admin/platform/scale/editor">
              <Plus className="mr-1 h-4 w-4" />
              新建量表
            </Link>
          </Button>
        </>
      }
    >
      <ScopeBanner
        scope="all"
        description="平台管理员配置全平台公共量表；医生/营养师可在自己的工作台创建私有量表，提交平台审核后转为公共。"
        actions={["查看", "新增", "编辑", "审核", "下线"]}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="量表总数" value={total} hint={`已发布 ${published} 个`} icon="ClipboardList" tone="primary" />
        <StatCard label="累计答卷" value={SCALES.reduce((s, x) => s + x.filledCount, 0).toLocaleString()} hint="近 30 天 +1,284" icon="FileCheck2" tone="accent" />
        <StatCard label="本月触发派单" value={responses} hint="自动路由命中" icon="Send" tone="success" />
        <StatCard label="待审核量表" value={pending} hint="专家审核队列" icon="ShieldCheck" tone="warning" />
      </div>

      <div className="rounded-xl border border-border bg-card p-4 shadow-card">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              className="w-64 pl-8"
              placeholder="量表名称 / 编码"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
          <Select value={cat} onValueChange={setCat}>
            <SelectTrigger className="w-[140px]"><SelectValue placeholder="分类" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部分类</SelectItem>
              <SelectItem value="分诊">分诊</SelectItem>
              <SelectItem value="专病">专病</SelectItem>
              <SelectItem value="心理">心理</SelectItem>
              <SelectItem value="营养">营养</SelectItem>
              <SelectItem value="生活方式">生活方式</SelectItem>
              <SelectItem value="随访">随访</SelectItem>
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[140px]"><SelectValue placeholder="状态" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部状态</SelectItem>
              <SelectItem value="已发布">已发布</SelectItem>
              <SelectItem value="草稿">草稿</SelectItem>
              <SelectItem value="审核中">审核中</SelectItem>
              <SelectItem value="已下线">已下线</SelectItem>
            </SelectContent>
          </Select>
          <span className="ml-auto text-sm text-muted-foreground">共 {list.length} 个量表</span>
        </div>

        <Table className="mt-3">
          <TableHeader>
            <TableRow>
              <TableHead>量表</TableHead>
              <TableHead>分类</TableHead>
              <TableHead>题量 / 时长</TableHead>
              <TableHead>计分模式</TableHead>
              <TableHead>路由规则</TableHead>
              <TableHead>填写量</TableHead>
              <TableHead>状态</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.map((s) => (
              <TableRow key={s.id}>
                <TableCell>
                  <div className="font-medium">{s.name}</div>
                  <div className="text-xs text-muted-foreground">{s.code} · {s.audience}</div>
                </TableCell>
                <TableCell><Badge variant="secondary">{s.category}</Badge></TableCell>
                <TableCell className="text-sm">{s.questionIds.length} 题 · {s.estimatedMinutes} 分钟</TableCell>
                <TableCell><Badge variant="outline">{s.scoring.mode}</Badge></TableCell>
                <TableCell className="text-sm">
                  {s.routing.length > 0 ? (
                    <span className="text-primary">{s.routing.length} 条规则</span>
                  ) : (
                    <span className="text-muted-foreground">未配置</span>
                  )}
                </TableCell>
                <TableCell className="text-sm">{s.filledCount.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge className={STATUS_TONE[s.status]} variant="secondary">{s.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button asChild variant="ghost" size="icon" title="预览">
                    <Link to="/admin/platform/scale/editor"><Eye className="h-4 w-4" /></Link>
                  </Button>
                  <Button asChild variant="ghost" size="icon" title="编辑">
                    <Link to="/admin/platform/scale/editor"><Pencil className="h-4 w-4" /></Link>
                  </Button>
                  <Button variant="ghost" size="icon" title="复制"><Copy className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" title="下线"><Power className="h-4 w-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* 三层结构说明 */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-card">
        <h3 className="mb-3 text-base font-semibold">兼容性设计 · 三层结构</h3>
        <div className="grid gap-3 md:grid-cols-3">
          <Layer step="1" title="题库" desc="单题独立维护，含题型/选项/分值/标签/跳题。一题可被任意量表复用，避免重复维护。" />
          <Layer step="2" title="量表" desc="选题组卷 + 计分（总分/维度分/公式）+ 结论分级。专家审核后发布。" />
          <Layer step="3" title="智能路由" desc="按评分阈值或健康标签触发：推荐专科量表 → 派单医生 → 营养师跟进 → 自动生成方案。" />
        </div>
      </div>
    </AdminPage>
  );
}

function Layer({ step, title, desc }: { step: string; title: string; desc: string }) {
  return (
    <div className="rounded-lg border border-border bg-muted/30 p-4">
      <div className="mb-2 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{step}</span>
        <span className="font-semibold">{title}</span>
      </div>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}
