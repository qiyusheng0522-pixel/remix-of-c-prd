import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { HmLayout, HmHeader } from "@/hm/HmLayout";
import { myUsers } from "@/hm/hmData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Search, Phone, MessageSquare, FileText, ClipboardList, Sparkles, Activity } from "lucide-react";
import type { CUser } from "@/admin/mockData";

export const Route = createFileRoute("/hm/users")({
  head: () => ({ meta: [{ title: "我的用户 - 健康管理师" }] }),
  component: UsersPage,
});

const SORTS = [
  { key: "risk" as const, label: "按风险" },
  { key: "active" as const, label: "按活跃" },
  { key: "name" as const, label: "按姓名" },
];

function UsersPage() {
  const all = myUsers();
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"risk" | "active" | "name">("risk");
  const [active, setActive] = useState<CUser | null>(null);

  const list = useMemo(() => {
    const r = all.filter((u) => !q || u.name.includes(q) || u.healthLabel.includes(q));
    if (sort === "risk") {
      const w = { 高: 0, 中: 1, 低: 2 } as const;
      return r.sort((a, b) => w[a.riskLevel] - w[b.riskLevel]);
    }
    if (sort === "name") return r.sort((a, b) => a.name.localeCompare(b.name));
    return r;
  }, [all, q, sort]);

  return (
    <HmLayout>
      <HmHeader title="我的用户" subtitle={`共 ${all.length} 位用户`} />

      <div className="sticky top-[60px] z-20 space-y-2 border-b bg-card/95 px-4 py-2 backdrop-blur">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="搜姓名 / 病症"
            className="pl-9"
          />
        </div>
        <div className="flex gap-1.5">
          {SORTS.map((s) => (
            <button
              key={s.key}
              onClick={() => setSort(s.key)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs",
                sort === s.key
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground",
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <section className="space-y-2 px-4 py-3">
        {list.map((u) => (
          <button
            key={u.id}
            onClick={() => setActive(u)}
            className="flex w-full items-start gap-3 rounded-2xl bg-card p-3 text-left shadow-card active:scale-[0.99]"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-2xl">
              {u.gender === "男" ? "👴" : "👵"}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="font-semibold">{u.name}</p>
                <span className="text-xs text-muted-foreground">
                  {u.gender} · {u.age} 岁
                </span>
                <Badge
                  variant="secondary"
                  className={cn(
                    "ml-auto shrink-0 text-[10px]",
                    u.riskLevel === "高" && "bg-rose-100 text-rose-700",
                    u.riskLevel === "中" && "bg-amber-100 text-amber-700",
                    u.riskLevel === "低" && "bg-emerald-100 text-emerald-700",
                  )}
                >
                  {u.riskLevel}风险
                </Badge>
              </div>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">{u.healthLabel}</p>
              <div className="mt-1 flex flex-wrap gap-1">
                {u.tags.slice(0, 3).map((t) => (
                  <Badge key={t} variant="outline" className="text-[10px]">
                    {t}
                  </Badge>
                ))}
                <span className="ml-auto text-[10px] text-muted-foreground">{u.lastActiveAt}</span>
              </div>
            </div>
          </button>
        ))}
      </section>

      {/* 用户详情抽屉 */}
      <Sheet open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <SheetContent side="right" className="w-full max-w-md overflow-y-auto sm:max-w-md">
          {active && (
            <>
              <SheetHeader>
                <SheetTitle>{active.name} · 用户档案</SheetTitle>
              </SheetHeader>
              <div className="mt-4">
                <Tabs defaultValue="profile">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="profile">画像</TabsTrigger>
                    <TabsTrigger value="indicator">指标</TabsTrigger>
                    <TabsTrigger value="record">记录</TabsTrigger>
                  </TabsList>

                  <TabsContent value="profile" className="space-y-3 pt-3">
                    <Row k="基本信息" v={`${active.gender} · ${active.age} 岁 · ${active.region}`} />
                    <Row k="联系方式" v={active.phone} />
                    <Row k="健康标签" v={active.healthLabel} />
                    <Row k="风险等级" v={`${active.riskLevel} 风险`} />
                    <Row k="主治医生" v={active.assignedDoctor || "—"} />
                    <Row k="主治营养师" v={active.assignedNutritionist || "—"} />
                    <Row k="注册时间" v={active.registerAt} />
                    <div className="rounded-xl border border-primary/20 bg-primary-soft/40 p-3">
                      <p className="flex items-center gap-1 text-xs font-semibold text-primary">
                        <Sparkles className="h-3.5 w-3.5" />
                        AI 用户画像建议
                      </p>
                      <p className="mt-1 text-xs leading-relaxed">
                        老年高风险用户，建议沟通方式：{active.age >= 60 ? "电话为主，话术口语化" : "微信图文 + 视频咨询"}；
                        重点关注 {active.healthLabel} 相关指标，本周建议至少完成 2 次随访。
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="indicator" className="space-y-2 pt-3">
                    <IndicatorRow icon="❤️" name="血压（最近）" value="142/88 mmHg" trend="近 7 日 ↓" />
                    <IndicatorRow icon="🩸" name="空腹血糖" value="7.2 mmol/L" trend="平稳" />
                    <IndicatorRow icon="⚖️" name="体重" value="72.4 kg" trend="近 30 日 ↓ 1.2" />
                    <IndicatorRow icon="💤" name="睡眠" value="6.5 h / 晚" trend="略低于目标" />
                    <IndicatorRow icon="👟" name="步数" value="4 820 步 / 天" trend="未达 6000 目标" />
                  </TabsContent>

                  <TabsContent value="record" className="space-y-2 pt-3">
                    <Timeline at="今天 09:00" what="电话随访 · 提醒服药" by="孙健康（我）" />
                    <Timeline at="昨天 18:00" what="发送饮食提示话术" by="孙健康（我）" />
                    <Timeline at="3 天前" what="完成 SAS 焦虑量表，得分 38" by="自助填写" />
                    <Timeline at="1 周前" what="李医生在线问诊，调整氨氯地平剂量" by="李医生" />
                  </TabsContent>
                </Tabs>

                {/* 操作按钮 */}
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Button onClick={() => toast.success(`正在呼叫 ${active.name}`)}>
                    <Phone className="mr-1 h-4 w-4" />
                    电话联系
                  </Button>
                  <Button variant="outline" onClick={() => toast.info("打开会话")}>
                    <MessageSquare className="mr-1 h-4 w-4" />
                    发消息
                  </Button>
                  <Button variant="outline" onClick={() => toast.info("跳转健康档案")}>
                    <FileText className="mr-1 h-4 w-4" />
                    健康档案
                  </Button>
                  <Button variant="outline" onClick={() => toast.success("已新增随访任务")}>
                    <ClipboardList className="mr-1 h-4 w-4" />
                    新建随访
                  </Button>
                  <Button variant="outline" onClick={() => toast.success("已派单营养师")} className="col-span-2">
                    <Activity className="mr-1 h-4 w-4" />
                    派单 · 上门服务
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

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b pb-2 text-sm">
      <span className="text-muted-foreground">{k}</span>
      <span className="text-right font-medium">{v}</span>
    </div>
  );
}

function IndicatorRow({ icon, name, value, trend }: { icon: string; name: string; value: string; trend: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-muted/30 p-3">
      <div className="text-2xl">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{name}</p>
        <p className="text-sm font-semibold">{value}</p>
      </div>
      <span className="text-[11px] text-primary">{trend}</span>
    </div>
  );
}

function Timeline({ at, what, by }: { at: string; what: string; by: string }) {
  return (
    <div className="border-l-2 border-primary/40 pl-3">
      <p className="text-[11px] text-muted-foreground">{at}</p>
      <p className="text-sm font-medium">{what}</p>
      <p className="text-[11px] text-muted-foreground">操作人：{by}</p>
    </div>
  );
}
