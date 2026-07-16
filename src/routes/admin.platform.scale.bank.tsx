import { createFileRoute } from "@tanstack/react-router";
import { AdminPage } from "@/admin/AdminLayout";
import { ScopeBanner } from "@/admin/ScopeBanner";
import { QUESTION_BANK, QTYPE_LABEL, DIMENSIONS, type Dimension } from "@/admin/scaleData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMemo, useState } from "react";
import { Plus, Search, Pencil, Trash2, Tag } from "lucide-react";

export const Route = createFileRoute("/admin/platform/scale/bank")({
  component: BankPage,
});

function BankPage() {
  const [keyword, setKeyword] = useState("");
  const [type, setType] = useState<string>("all");
  const [dim, setDim] = useState<string>("all");

  const list = useMemo(() => {
    return QUESTION_BANK.filter((q) => {
      if (type !== "all" && q.type !== type) return false;
      if (dim !== "all" && q.dimension !== dim) return false;
      if (keyword && !q.title.includes(keyword) && !q.code.includes(keyword)) return false;
      return true;
    });
  }, [keyword, type, dim]);

  return (
    <AdminPage
      title="题库管理"
      description="所有题目的中央仓库，支持复用到任意量表。改一处，全平台同步生效。"
      actions={
        <Button size="sm">
          <Plus className="mr-1 h-4 w-4" />
          新建题目
        </Button>
      }
    >
      <ScopeBanner
        scope="all"
        description="题库由平台管理员统一维护。题目修改会同步影响所有引用该题目的量表，请配合版本管理使用。"
        actions={["查看", "新增", "编辑", "删除"]}
      />

      <div className="rounded-xl border border-border bg-card p-4 shadow-card">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              className="w-64 pl-8"
              placeholder="题目内容 / 编码"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="w-[140px]"><SelectValue placeholder="题型" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部题型</SelectItem>
              {Object.entries(QTYPE_LABEL).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={dim} onValueChange={setDim}>
            <SelectTrigger className="w-[140px]"><SelectValue placeholder="维度" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部维度</SelectItem>
              {DIMENSIONS.map((d) => (
                <SelectItem key={d} value={d}>{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="ml-auto text-sm text-muted-foreground">共 {list.length} 题</span>
        </div>

        <Table className="mt-3">
          <TableHeader>
            <TableRow>
              <TableHead>题目</TableHead>
              <TableHead>题型</TableHead>
              <TableHead>维度 / 权重</TableHead>
              <TableHead>选项 / 标签</TableHead>
              <TableHead>跳题</TableHead>
              <TableHead>状态</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.map((q) => (
              <TableRow key={q.id}>
                <TableCell className="max-w-md">
                  <div className="font-medium">{q.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {q.code} {q.required && <span className="ml-1 text-rose-600">必填</span>}
                  </div>
                </TableCell>
                <TableCell><Badge variant="outline">{QTYPE_LABEL[q.type]}</Badge></TableCell>
                <TableCell className="text-sm">
                  {q.dimension ? (
                    <>
                      <Badge variant="secondary">{q.dimension as Dimension}</Badge>
                      {q.weight && q.weight > 1 && (
                        <span className="ml-1 text-xs text-muted-foreground">×{q.weight}</span>
                      )}
                    </>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="text-sm">
                  {q.options ? (
                    <div className="space-y-0.5">
                      <div>{q.options.length} 个选项</div>
                      {q.options.some((o) => o.tags && o.tags.length > 0) && (
                        <div className="flex flex-wrap gap-1">
                          {Array.from(new Set(q.options.flatMap((o) => o.tags ?? []))).slice(0, 3).map((t) => (
                            <Badge key={t} variant="outline" className="text-xs">
                              <Tag className="mr-0.5 h-3 w-3" />{t}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : q.numberRange ? (
                    <span className="text-muted-foreground">{q.numberRange.min}-{q.numberRange.max} {q.numberRange.unit}</span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="text-sm">
                  {q.branches && q.branches.length > 0 ? (
                    <span className="text-primary">{q.branches.length} 条</span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell><Badge variant="secondary">{q.status}</Badge></TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AdminPage>
  );
}
