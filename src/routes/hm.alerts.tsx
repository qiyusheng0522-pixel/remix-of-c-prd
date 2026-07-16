import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { HmLayout, HmHeader } from "@/hm/HmLayout";
import { ALERTS, ALERT_CATEGORY_LABEL, type AlertCategory, type HealthAlert } from "@/hm/hmData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  BellRing,
  Phone,
  MessageSquare,
  Send,
  Sparkles,
  UserPlus,
  CheckCheck,
  Clock,
  ArrowRightLeft,
  Filter,
} from "lucide-react";

export const Route = createFileRoute("/hm/alerts")({
  head: () => ({ meta: [{ title: "健康预警 - 健康管理师" }] }),
  component: AlertsPage,
});

const FILTERS: { key: "all" | AlertCategory; label: string }[] = [
  { key: "all", label: "全部" },
  { key: "indicator", label: "指标异常" },
  { key: "behavior", label: "行为依从" },
  { key: "risk", label: "风险升级" },
  { key: "device", label: "设备数据" },
  { key: "service", label: "服务任务" },
];

function AlertsPage() {
  const [list, setList] = useState(ALERTS);
  const [filter, setFilter] = useState<"all" | AlertCategory>("all");
  const [sevFilter, setSevFilter] = useState<"all" | "P0" | "P1" | "P2">("all");
  const [active, setActive] = useState<HealthAlert | null>(null);
  const [scriptDraft, setScriptDraft] = useState("");

  const filtered = useMemo(() => {
    return list.filter((a) => {
      if (filter !== "all" && a.category !== filter) return false;
      if (sevFilter !== "all" && a.severity !== sevFilter) return false;
      return true;
    });
  }, [list, filter, sevFilter]);

  const counts = {
    all: list.length,
    pending: list.filter((a) => a.status === "pending").length,
    p0: list.filter((a) => a.severity === "P0" && a.status === "pending").length,
  };

  const openAlert = (a: HealthAlert) => {
    setActive(a);
    setScriptDraft(a.aiSuggestion.script);
  };

  const execute = (a: HealthAlert, action: string) => {
    setList((prev) => prev.map((x) => (x.id === a.id ? { ...x, status: "done" } : x)));
    toast.success(`已执行：${action} → ${a.userName}`);
    setActive(null);
  };

  const transfer = (a: HealthAlert) => {
    setList((prev) => prev.map((x) => (x.id === a.id ? { ...x, status: "processing" } : x)));
    toast.info(`已转单到主治医生：${a.userName}`);
    setActive(null);
  };

  return (
    <HmLayout>
      <HmHeader
        title="健康预警"
        subtitle={`${counts.pending} 待处理 · P0 ${counts.p0}`}
        right={
          <Badge variant="secondary" className="bg-primary-soft text-primary">
            <Sparkles className="mr-1 h-3 w-3" />
            AI 助手
          </Badge>
        }
      />

      {/* 过滤 */}
      <div className="sticky top-[60px] z-20 border-b bg-card/95 px-4 py-2 backdrop-blur">
        <div className="-mx-1 flex gap-1.5 overflow-x-auto pb-1">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                "shrink-0 rounded-full border px-3 py-1 text-xs font-medium",
                filter === f.key
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="mt-1.5 flex items-center gap-1.5">
          <Filter className="h-3 w-3 text-muted-foreground" />
          {(["all", "P0", "P1", "P2"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSevFilter(s)}
              className={cn(
                "rounded-md px-2 py-0.5 text-[11px]",
                sevFilter === s ? "bg-foreground/10 font-semibold" : "text-muted-foreground",
              )}
            >
              {s === "all" ? "全部级别" : s}
            </button>
          ))}
        </div>
      </div>

      <section className="space-y-3 px-4 py-4">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed py-12 text-center text-sm text-muted-foreground">
            <BellRing className="mx-auto mb-2 h-8 w-8 opacity-40" />
            暂无符合条件的预警
          </div>
        ) : (
          filtered.map((a) => (
            <button
              key={a.id}
              onClick={() => openAlert(a)}
              className="block w-full rounded-2xl bg-card p-4 text-left shadow-card active:scale-[0.99]"
            >
              <div className="flex items-start gap-2">
                <Badge
                  variant="secondary"
                  className={cn(
                    "shrink-0",
                    a.severity === "P0" && "bg-rose-100 text-rose-700",
                    a.severity === "P1" && "bg-amber-100 text-amber-700",
                    a.severity === "P2" && "bg-blue-100 text-blue-700",
                  )}
                >
                  {a.severity}
                </Badge>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold">
                      {a.userName} · {a.title}
                    </p>
                    <Badge
                      variant="secondary"
                      className={cn(
                        "shrink-0 text-[10px]",
                        a.status === "done" && "bg-emerald-100 text-emerald-700",
                        a.status === "processing" && "bg-blue-100 text-blue-700",
                        a.status === "pending" && "bg-amber-100 text-amber-700",
                      )}
                    >
                      {a.status === "done" ? "已处理" : a.status === "processing" ? "处理中" : "待处理"}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{a.detail}</p>
                  {a.data && (
                    <p className="mt-1 inline-block rounded bg-muted/60 px-1.5 py-0.5 font-mono text-[11px]">
                      {a.data}
                    </p>
                  )}
                  <div className="mt-2 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {a.triggeredAt}
                    </span>
                    <span className="text-[11px] text-primary">
                      {ALERT_CATEGORY_LABEL[a.category]} · {a.subType}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))
        )}
      </section>

      {/* 详情抽屉 */}
      <Sheet open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <SheetContent side="right" className="w-full max-w-md overflow-y-auto sm:max-w-md">
          {active && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className={cn(
                      active.severity === "P0" && "bg-rose-100 text-rose-700",
                      active.severity === "P1" && "bg-amber-100 text-amber-700",
                      active.severity === "P2" && "bg-blue-100 text-blue-700",
                    )}
                  >
                    {active.severity}
                  </Badge>
                  {active.title}
                </SheetTitle>
              </SheetHeader>

              <div className="mt-4 space-y-4">
                <div className="rounded-xl border bg-muted/30 p-3 text-sm">
                  <p className="font-semibold">{active.userName}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{active.detail}</p>
                  {active.data && (
                    <p className="mt-2 font-mono text-xs">{active.data}</p>
                  )}
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    触发时间：{active.triggeredAt}
                  </p>
                </div>

                {/* AI 建议方案 */}
                <div className="rounded-xl border border-primary/30 bg-primary-soft/40 p-3">
                  <p className="mb-1 flex items-center gap-1 text-xs font-semibold text-primary">
                    <Sparkles className="h-3.5 w-3.5" />
                    AI 推荐处理方案
                  </p>
                  <p className="text-sm leading-relaxed">{active.aiSuggestion.plan}</p>
                </div>

                {/* 一键话术 */}
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <p className="text-xs font-semibold">推荐话术（可编辑后发送）</p>
                    <button
                      onClick={() => {
                        setScriptDraft(active.aiSuggestion.script);
                        toast.success("已重置为 AI 推荐话术");
                      }}
                      className="text-[11px] text-primary"
                    >
                      重置
                    </button>
                  </div>
                  <Textarea
                    value={scriptDraft}
                    onChange={(e) => setScriptDraft(e.target.value)}
                    className="min-h-[120px] text-sm"
                  />
                </div>

                {/* 操作按钮 */}
                <div className="grid grid-cols-2 gap-2">
                  <Button onClick={() => execute(active, "电话回访")}>
                    <Phone className="mr-1 h-4 w-4" />
                    电话回访
                  </Button>
                  <Button variant="outline" onClick={() => execute(active, "发送话术")}>
                    <Send className="mr-1 h-4 w-4" />
                    一键发送
                  </Button>
                  <Button variant="outline" onClick={() => execute(active, "在线沟通")}>
                    <MessageSquare className="mr-1 h-4 w-4" />
                    在线沟通
                  </Button>
                  <Button variant="outline" onClick={() => transfer(active)}>
                    <ArrowRightLeft className="mr-1 h-4 w-4" />
                    转主治医生
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => execute(active, "派单营养师上门")}
                    className="col-span-2"
                  >
                    <UserPlus className="mr-1 h-4 w-4" />
                    派单 · 营养师上门
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => execute(active, "已读忽略")}
                    className="col-span-2 text-muted-foreground"
                  >
                    <CheckCheck className="mr-1 h-4 w-4" />
                    已知悉，标记为已处理
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </HmLayout>
  );
}
