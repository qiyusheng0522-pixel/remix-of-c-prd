import { useEffect, useMemo, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import * as Icons from "lucide-react";
import {
  ROLE_LABEL,
  ROLE_COLOR,
  ROLE_MENU,
  ROLE_HOME,
  DEMO_ACCOUNTS,
  type AdminRole,
  type AdminUser,
} from "./roles";
import { getCurrentAdmin, logoutAdmin, switchRole } from "./auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

function Icon({ name, className }: { name: string; className?: string }) {
  const C = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[name];
  return C ? <C className={className} /> : null;
}

export function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const u = getCurrentAdmin();
    if (!u) {
      navigate({ to: "/admin/login" });
      return;
    }
    setUser(u);
  }, [navigate]);

  const groups = useMemo(() => (user ? ROLE_MENU[user.role] : []), [user]);

  // 自动展开当前激活路由所在分组
  useEffect(() => {
    if (!user) return;
    const next: Record<string, boolean> = { ...openGroups };
    let changed = false;
    for (const g of groups) {
      const active = g.children.some((c) =>
        c.to === ROLE_HOME[user.role]
          ? location.pathname === c.to
          : location.pathname.startsWith(c.to),
      );
      if (active && !next[g.key]) {
        next[g.key] = true;
        changed = true;
      }
    }
    // 默认展开第一个分组
    if (Object.keys(openGroups).length === 0 && groups[0]) {
      next[groups[0].key] = true;
      changed = true;
    }
    if (changed) setOpenGroups(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, location.pathname, groups]);

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30">
        <p className="text-muted-foreground">正在加载...</p>
      </div>
    );
  }

  const toggleGroup = (key: string) =>
    setOpenGroups((s) => ({ ...s, [key]: !s[key] }));

  const handleSwitch = (role: AdminRole) => {
    const next = switchRole(role);
    setUser(next);
    setOpenGroups({});
    navigate({ to: ROLE_HOME[role] });
  };

  const handleLogout = () => {
    logoutAdmin();
    navigate({ to: "/admin/login" });
  };

  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Sidebar */}
      <aside className="sticky top-0 flex h-screen w-64 flex-col border-r border-border bg-card">
        <div className="flex h-16 items-center gap-2 border-b border-border px-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-primary text-white">
            <Icons.Activity className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold leading-tight">蜻蜓康健家</p>
            <p className="truncate text-xs text-muted-foreground">后台管理系统</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {groups.map((g) => {
            const open = openGroups[g.key] ?? false;
            const hasActive = g.children.some((c) =>
              c.to === ROLE_HOME[user.role]
                ? location.pathname === c.to
                : location.pathname.startsWith(c.to),
            );
            return (
              <div key={g.key}>
                <button
                  type="button"
                  onClick={() => toggleGroup(g.key)}
                  className={cn(
                    "flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    hasActive
                      ? "bg-primary-soft text-primary"
                      : "text-foreground hover:bg-muted",
                  )}
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <Icon name={g.icon} className="h-5 w-5 shrink-0" />
                    <span className="truncate">{g.label}</span>
                  </span>
                  <Icons.ChevronDown
                    className={cn(
                      "h-4 w-4 shrink-0 transition-transform",
                      open ? "rotate-0" : "-rotate-90",
                    )}
                  />
                </button>
                {open && (
                  <div className="ml-4 mt-1 space-y-0.5 border-l border-border/60 pl-3">
                    {g.children.map((c) => {
                      const active =
                        c.to === ROLE_HOME[user.role]
                          ? location.pathname === c.to
                          : location.pathname.startsWith(c.to);
                      return (
                        <Link
                          key={c.to}
                          to={c.to}
                          className={cn(
                            "block rounded-md px-3 py-1.5 text-sm transition-colors",
                            active
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground",
                          )}
                        >
                          {c.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card/80 px-6 backdrop-blur">
          <div className="flex items-center gap-3">
            <Badge className={cn("rounded-md", ROLE_COLOR[user.role])} variant="secondary">
              {ROLE_LABEL[user.role]}
            </Badge>
            <p className="text-sm text-muted-foreground">{user.org}</p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild title="返回 C 端">
              <Link to="/">
                <Icons.Smartphone className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon">
              <Icons.Bell className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 px-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                      {user.name.slice(0, 1)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{user.name}</span>
                  <Icons.ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>切换角色（演示）</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {(Object.keys(DEMO_ACCOUNTS) as AdminRole[]).map((r) => (
                  <DropdownMenuItem key={r} onClick={() => handleSwitch(r)}>
                    <Badge className={cn("mr-2 rounded-md", ROLE_COLOR[r])} variant="secondary">
                      {ROLE_LABEL[r]}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {DEMO_ACCOUNTS[r].name}
                    </span>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <Icons.LogOut className="mr-2 h-4 w-4" />
                  退出登录
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

// 通用页面外壳
export function AdminPage({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      {children}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  icon,
  tone = "primary",
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon: string;
  tone?: "primary" | "accent" | "success" | "warning";
}) {
  const tones = {
    primary: "bg-primary-soft text-primary",
    accent: "bg-accent-soft text-accent",
    success: "bg-emerald-100 text-emerald-700",
    warning: "bg-amber-100 text-amber-700",
  };
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
          {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
        </div>
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", tones[tone])}>
          <Icon name={icon} className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

// 通用「可交互」模块骨架：自带搜索、筛选、Mock 列表、CRUD 操作弹窗
// 任何尚未深度实现的二级模块都可直接复用，呈现真实操作手感。
type Row = Record<string, string>;

export function AdminPlaceholder({
  title,
  description,
  features,
  entityName = "记录",
  columns,
  sampleRows,
}: {
  title: string;
  description?: string;
  features?: string[];
  entityName?: string;
  columns?: string[];
  sampleRows?: Array<Row>;
}) {
  const cols = columns ?? ["编号", "名称", "状态", "负责人", "更新时间"];
  const initialRows: Row[] =
    sampleRows ??
    Array.from({ length: 8 }).map((_, i) => ({
      编号: `${title.slice(0, 2).toUpperCase()}${String(1001 + i)}`,
      名称: `${entityName} 示例 ${i + 1}`,
      状态: ["进行中", "已完成", "待处理", "已暂停"][i % 4],
      负责人: ["李平台", "王营销", "张营养师", "李医生"][i % 4],
      更新时间: `2025-04-${String(18 - (i % 12)).padStart(2, "0")} 10:${String(10 + i).padStart(2, "0")}`,
    }));

  const [rows, setRows] = useState<Row[]>(initialRows);
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [createOpen, setCreateOpen] = useState(false);
  const [editRow, setEditRow] = useState<Row | null>(null);
  const [viewRow, setViewRow] = useState<Row | null>(null);
  const [deleteRow, setDeleteRow] = useState<Row | null>(null);
  const [exportOpen, setExportOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  const blankDraft = (): Row =>
    cols.reduce((acc, c) => {
      acc[c] =
        c === "状态"
          ? "待处理"
          : c === "更新时间"
            ? new Date().toISOString().slice(0, 16).replace("T", " ")
            : "";
      return acc;
    }, {} as Row);
  const [draft, setDraft] = useState<Row>(blankDraft());

  const filtered = rows.filter((r) => {
    if (statusFilter !== "all" && r["状态"] !== statusFilter) return false;
    if (!keyword) return true;
    const k = keyword.toLowerCase();
    return Object.values(r).some((v) => v.toLowerCase().includes(k));
  });

  const toneOf = (s: string) =>
    s === "已完成"
      ? "bg-emerald-100 text-emerald-700"
      : s === "待处理"
        ? "bg-amber-100 text-amber-700"
        : s === "已暂停"
          ? "bg-rose-100 text-rose-700"
          : "bg-primary-soft text-primary";

  const openCreate = () => {
    setDraft({
      ...blankDraft(),
      编号: `${title.slice(0, 2).toUpperCase()}${String(1001 + rows.length)}`,
    });
    setCreateOpen(true);
  };
  const submitCreate = () => {
    if (!draft["名称"]?.trim()) {
      toast.error("请填写名称");
      return;
    }
    setRows((prev) => [{ ...draft }, ...prev]);
    setCreateOpen(false);
    toast.success(`已新增${entityName}：${draft["名称"]}`);
  };
  const openEdit = (r: Row) => {
    setDraft({ ...r });
    setEditRow(r);
  };
  const submitEdit = () => {
    if (!editRow) return;
    setRows((prev) => prev.map((r) => (r === editRow ? { ...draft } : r)));
    setEditRow(null);
    toast.success(`已保存修改：${draft["名称"] ?? draft["编号"]}`);
  };
  const confirmDelete = () => {
    if (!deleteRow) return;
    setRows((prev) => prev.filter((r) => r !== deleteRow));
    toast.success(`已删除：${deleteRow["名称"] ?? deleteRow["编号"]}`);
    setDeleteRow(null);
  };
  const doExport = (fmt: string) => {
    setExportOpen(false);
    toast.success(`已导出 ${filtered.length} 条记录为 ${fmt}`, {
      description: "演示环境，文件未实际下载",
    });
  };

  const statusOptions = ["进行中", "已完成", "待处理", "已暂停"];

  return (
    <AdminPage
      title={title}
      description={description}
      actions={
        <>
          <Button variant="outline" size="sm" onClick={() => setExportOpen(true)}>
            <Icons.Download className="mr-1 h-4 w-4" />
            导出
          </Button>
          <Button size="sm" onClick={openCreate}>
            <Icons.Plus className="mr-1 h-4 w-4" />
            新增{entityName}
          </Button>
        </>
      }
    >
      {features && features.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-4 shadow-card">
          <p className="mb-2 text-xs font-semibold text-muted-foreground">本模块能力</p>
          <div className="flex flex-wrap gap-2">
            {features.map((f) => (
              <Badge key={f} variant="secondary" className="bg-primary-soft text-primary">
                {f}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-xl border border-border bg-card p-4 shadow-card">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Icons.Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder={`搜索${entityName}名称 / 编号`}
              className="pl-9"
            />
          </div>
          <Button variant="outline" size="sm" onClick={() => setFilterOpen(true)}>
            <Icons.Filter className="mr-1 h-4 w-4" />
            筛选
            {statusFilter !== "all" && (
              <Badge variant="secondary" className="ml-1 h-4 px-1 text-[10px]">
                1
              </Badge>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.info("时间范围筛选：近 7 天 / 近 30 天 / 自定义（演示）")}
          >
            <Icons.Calendar className="mr-1 h-4 w-4" />
            时间范围
          </Button>
          <div className="ml-auto text-xs text-muted-foreground">
            共 {filtered.length} 条 · 演示数据
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b text-left text-xs text-muted-foreground">
              <tr>
                {cols.map((c) => (
                  <th key={c} className="px-3 py-2">
                    {c}
                  </th>
                ))}
                <th className="px-3 py-2 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={cols.length + 1}
                    className="px-3 py-12 text-center text-sm text-muted-foreground"
                  >
                    暂无匹配数据
                  </td>
                </tr>
              ) : (
                filtered.map((r, idx) => (
                  <tr key={idx} className="hover:bg-muted/30">
                    {cols.map((c) => (
                      <td key={c} className="px-3 py-3">
                        {c === "状态" ? (
                          <Badge variant="secondary" className={toneOf(r[c] ?? "")}>
                            {r[c]}
                          </Badge>
                        ) : (
                          <span className={c === "编号" ? "font-mono text-xs" : ""}>{r[c]}</span>
                        )}
                      </td>
                    ))}
                    <td className="px-3 py-3 text-right">
                      <Button size="sm" variant="ghost" onClick={() => setViewRow(r)}>
                        查看
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => openEdit(r)}>
                        编辑
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive"
                        onClick={() => setDeleteRow(r)}
                      >
                        删除
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          <span>第 1 页 / 共 1 页</span>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" disabled>
              上一页
            </Button>
            <Button variant="outline" size="sm" disabled>
              下一页
            </Button>
          </div>
        </div>
      </div>

      {/* 新增（右侧抽屉） */}
      <Sheet open={createOpen} onOpenChange={setCreateOpen}>
        <SheetContent className="w-full sm:max-w-2xl flex flex-col p-0">
          <SheetHeader className="border-b px-6 py-4">
            <SheetTitle className="flex items-center gap-2">
              <Icons.PlusCircle className="h-5 w-5 text-primary" />
              新增{entityName}
            </SheetTitle>
            <SheetDescription>
              填写下方表单后提交，系统将创建一条新记录并写入操作日志。
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="rounded-lg border border-dashed border-primary/30 bg-primary-soft/30 p-3 mb-4 text-xs text-primary">
              💡 提交后可在列表中点击「编辑」继续修改，所有变更都会记录到操作日志。
            </div>
            <RowForm cols={cols} draft={draft} setDraft={setDraft} statusOptions={statusOptions} />
          </div>
          <SheetFooter className="border-t px-6 py-4 bg-muted/20">
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              取消
            </Button>
            <Button onClick={submitCreate}>
              <Icons.Check className="mr-1 h-4 w-4" />
              确认创建
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* 编辑（右侧抽屉） */}
      <Sheet open={!!editRow} onOpenChange={(o) => !o && setEditRow(null)}>
        <SheetContent className="w-full sm:max-w-2xl flex flex-col p-0">
          <SheetHeader className="border-b px-6 py-4">
            <SheetTitle className="flex items-center gap-2">
              <Icons.Pencil className="h-5 w-5 text-primary" />
              编辑 {editRow?.["名称"] ?? entityName}
            </SheetTitle>
            <SheetDescription>
              <span className="font-mono">{editRow?.["编号"]}</span> · 修改后点击保存立即生效
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <RowForm cols={cols} draft={draft} setDraft={setDraft} statusOptions={statusOptions} />
            <div className="mt-6 rounded-lg border bg-muted/20 p-3">
              <p className="text-xs font-semibold text-muted-foreground mb-2">最近修改记录</p>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li>· 2025-04-18 10:24 平台管理员 修改了「状态」</li>
                <li>· 2025-04-15 16:02 张营养师 修改了「备注」</li>
              </ul>
            </div>
          </div>
          <SheetFooter className="border-t px-6 py-4 bg-muted/20">
            <Button variant="outline" onClick={() => setEditRow(null)}>
              取消
            </Button>
            <Button onClick={submitEdit}>
              <Icons.Save className="mr-1 h-4 w-4" />
              保存修改
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* 详情（右侧抽屉，含 Tab） */}
      <Sheet open={!!viewRow} onOpenChange={(o) => !o && setViewRow(null)}>
        <SheetContent className="w-full sm:max-w-2xl flex flex-col p-0">
          <SheetHeader className="border-b px-6 py-4">
            <SheetTitle className="flex items-center gap-2">
              <Icons.FileText className="h-5 w-5 text-primary" />
              {viewRow?.["名称"] ?? entityName + "详情"}
            </SheetTitle>
            <SheetDescription>
              <span className="font-mono">{viewRow?.["编号"]}</span>
              {viewRow?.["状态"] && (
                <Badge variant="secondary" className={cn("ml-2", toneOf(viewRow["状态"]))}>
                  {viewRow["状态"]}
                </Badge>
              )}
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <Tabs defaultValue="detail">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="detail">基本信息</TabsTrigger>
                <TabsTrigger value="logs">操作日志</TabsTrigger>
                <TabsTrigger value="related">关联数据</TabsTrigger>
              </TabsList>

              <TabsContent value="detail" className="mt-4 space-y-3">
                {viewRow &&
                  cols.map((c) => (
                    <div key={c} className="grid grid-cols-3 items-start gap-2 border-b pb-3">
                      <span className="text-sm text-muted-foreground">{c}</span>
                      <span className="col-span-2 text-sm">
                        {c === "状态" ? (
                          <Badge variant="secondary" className={toneOf(viewRow[c] ?? "")}>
                            {viewRow[c]}
                          </Badge>
                        ) : (
                          (viewRow[c] ?? "—")
                        )}
                      </span>
                    </div>
                  ))}
                <div className="grid grid-cols-3 items-start gap-2 border-b pb-3">
                  <span className="text-sm text-muted-foreground">创建时间</span>
                  <span className="col-span-2 text-sm">2025-04-10 09:30</span>
                </div>
                <div className="grid grid-cols-3 items-start gap-2 border-b pb-3">
                  <span className="text-sm text-muted-foreground">创建人</span>
                  <span className="col-span-2 text-sm">平台管理员</span>
                </div>
              </TabsContent>

              <TabsContent value="logs" className="mt-4">
                <div className="space-y-3">
                  {[
                    { t: "2025-04-18 10:24", op: "平台管理员", action: "修改状态", from: "待处理", to: "进行中" },
                    { t: "2025-04-15 16:02", op: "张营养师", action: "修改备注", from: "—", to: "已联系客户" },
                    { t: "2025-04-10 09:30", op: "平台管理员", action: "创建", from: "", to: "" },
                  ].map((l) => (
                    <div key={l.t} className="flex gap-3 rounded-lg border p-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-soft">
                        <Icons.History className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 text-sm">
                        <div className="flex justify-between">
                          <span className="font-medium">{l.action}</span>
                          <span className="text-xs text-muted-foreground">{l.t}</span>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          操作人：{l.op}
                          {l.from && ` · ${l.from} → ${l.to}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="related" className="mt-4 space-y-2">
                {[
                  { type: "关联订单", count: 3, icon: "ShoppingCart" },
                  { type: "关联用户", count: 12, icon: "Users" },
                  { type: "关联消息", count: 5, icon: "MessageSquare" },
                  { type: "关联附件", count: 2, icon: "Paperclip" },
                ].map((r) => (
                  <button
                    key={r.type}
                    onClick={() => toast.info(`跳转到「${r.type}」列表（演示）`)}
                    className="flex w-full items-center justify-between rounded-lg border p-3 text-left transition-colors hover:border-primary hover:bg-primary-soft/30"
                  >
                    <div className="flex items-center gap-3">
                      <Icon name={r.icon} className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium">{r.type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{r.count}</Badge>
                      <Icons.ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </button>
                ))}
              </TabsContent>
            </Tabs>
          </div>
          <SheetFooter className="border-t px-6 py-4 bg-muted/20">
            <Button variant="outline" onClick={() => setViewRow(null)}>
              关闭
            </Button>
            <Button
              onClick={() => {
                if (viewRow) openEdit(viewRow);
                setViewRow(null);
              }}
            >
              <Icons.Pencil className="mr-1 h-4 w-4" />
              编辑此{entityName}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* 删除 */}
      <AlertDialog open={!!deleteRow} onOpenChange={(o) => !o && setDeleteRow(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除？</AlertDialogTitle>
            <AlertDialogDescription>
              即将删除 <strong>{deleteRow?.["名称"] ?? deleteRow?.["编号"]}</strong>
              ，此操作不可撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              确认删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 筛选 */}
      <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>筛选条件</DialogTitle>
            <DialogDescription>选择条件后点击应用。</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="text-xs">状态</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  {statusOptions.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setStatusFilter("all");
                setFilterOpen(false);
                toast.success("已清除筛选");
              }}
            >
              清除
            </Button>
            <Button
              onClick={() => {
                setFilterOpen(false);
                toast.success("筛选已应用");
              }}
            >
              应用筛选
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 导出 */}
      <Dialog open={exportOpen} onOpenChange={setExportOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>导出数据</DialogTitle>
            <DialogDescription>
              当前筛选结果共 <strong>{filtered.length}</strong> 条，请选择导出格式。
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-2">
            {[
              { fmt: "Excel", icon: "FileSpreadsheet" },
              { fmt: "CSV", icon: "FileText" },
              { fmt: "PDF", icon: "FileType" },
            ].map((o) => (
              <button
                key={o.fmt}
                onClick={() => doExport(o.fmt)}
                className="flex flex-col items-center gap-2 rounded-lg border border-border p-4 transition-colors hover:border-primary hover:bg-primary-soft"
              >
                <Icon name={o.icon} className="h-6 w-6 text-primary" />
                <span className="text-sm font-medium">{o.fmt}</span>
              </button>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setExportOpen(false)}>
              取消
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminPage>
  );
}

/** 通用单行表单（按 cols 自动生成字段） */
function RowForm({
  cols,
  draft,
  setDraft,
  statusOptions,
}: {
  cols: string[];
  draft: Row;
  setDraft: (r: Row) => void;
  statusOptions: string[];
}) {
  const update = (k: string, v: string) => setDraft({ ...draft, [k]: v });
  return (
    <div className="grid gap-3 py-2 max-h-[60vh] overflow-y-auto pr-1">
      {cols.map((c) => (
        <div key={c} className="grid gap-1.5">
          <Label className="text-xs text-muted-foreground">{c}</Label>
          {c === "状态" ? (
            <Select value={draft[c] ?? ""} onValueChange={(v) => update(c, v)}>
              <SelectTrigger>
                <SelectValue placeholder="请选择状态" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : c === "编号" ? (
            <Input value={draft[c] ?? ""} disabled className="font-mono text-xs" />
          ) : c === "备注" || c === "描述" || c === "说明" ? (
            <Textarea
              value={draft[c] ?? ""}
              onChange={(e) => update(c, e.target.value)}
              placeholder={`请输入${c}`}
              rows={3}
            />
          ) : (
            <Input
              value={draft[c] ?? ""}
              onChange={(e) => update(c, e.target.value)}
              placeholder={`请输入${c}`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
