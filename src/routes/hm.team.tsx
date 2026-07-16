import { createFileRoute } from "@tanstack/react-router";
import { HmLayout, HmHeader } from "@/hm/HmLayout";
import { TEAM_MEMBERS, FOLLOWUP_QC } from "@/hm/hmData";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Crown, TrendingUp, ClipboardCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/hm/team")({
  head: () => ({ meta: [{ title: "团队协作 - 健康管理师" }] }),
  component: TeamPage,
});

function TeamPage() {
  return (
    <HmLayout>
      <HmHeader title="团队协作" subtitle="蜻蜓健康管理中心 · 一组" />

      <Tabs defaultValue="members" className="px-4 pt-3">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="members">组员</TabsTrigger>
          <TabsTrigger value="quality">质量抽查</TabsTrigger>
          <TabsTrigger value="rank">绩效对比</TabsTrigger>
        </TabsList>

        {/* 组员列表 */}
        <TabsContent value="members" className="space-y-2 pt-3">
          {TEAM_MEMBERS.map((m) => (
            <div key={m.id} className="rounded-2xl bg-card p-3 shadow-card">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-xl">
                  {m.isMe ? "🙋" : "👤"}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="font-semibold">{m.name}</p>
                    {m.isMe && (
                      <Badge className="bg-primary/10 text-primary hover:bg-primary/10">我</Badge>
                    )}
                    {m.quality === "A+" && (
                      <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
                        <Crown className="mr-0.5 h-3 w-3" />
                        本月之星
                      </Badge>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    负责 {m.users} 用户 · 完成率 {m.taskDone}
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {m.quality}
                </Badge>
              </div>
            </div>
          ))}
        </TabsContent>

        {/* 随访质量抽查 */}
        <TabsContent value="quality" className="space-y-2 pt-3">
          <p className="text-xs text-muted-foreground">主管对随访工单的抽样评分</p>
          {FOLLOWUP_QC.map((q) => (
            <div key={q.id} className="rounded-2xl bg-card p-3 shadow-card">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold">
                    {q.member} → {q.user}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{q.at}</p>
                </div>
                <div className="text-right">
                  <p className={cn("text-lg font-bold", q.score >= 90 ? "text-success" : "text-amber-600")}>
                    {q.score}
                  </p>
                  <p className="text-[10px] text-muted-foreground">/100</p>
                </div>
              </div>
              <div className="mt-2 flex items-start gap-1.5 rounded-lg bg-muted/40 p-2">
                <ClipboardCheck className="h-3.5 w-3.5 shrink-0 text-primary" />
                <p className="text-xs">{q.comment}</p>
              </div>
            </div>
          ))}
        </TabsContent>

        {/* 绩效对比 */}
        <TabsContent value="rank" className="space-y-2 pt-3">
          <div className="rounded-2xl bg-card p-3 shadow-card">
            <div className="mb-2 flex items-center gap-1 text-sm font-semibold">
              <TrendingUp className="h-4 w-4 text-primary" />
              本月组内排名（按改善率）
            </div>
            <div className="space-y-2">
              {[...TEAM_MEMBERS]
                .sort((a, b) => parseInt(b.improve) - parseInt(a.improve))
                .map((m, idx) => (
                  <div key={m.id} className="flex items-center gap-3">
                    <span
                      className={cn(
                        "flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold",
                        idx === 0 && "bg-amber-100 text-amber-700",
                        idx === 1 && "bg-slate-100 text-slate-700",
                        idx === 2 && "bg-orange-100 text-orange-700",
                        idx > 2 && "bg-muted text-muted-foreground",
                      )}
                    >
                      {idx + 1}
                    </span>
                    <span className={cn("flex-1 text-sm", m.isMe && "font-bold text-primary")}>
                      {m.name}
                      {m.isMe && " (我)"}
                    </span>
                    <div className="flex-1">
                      <div className="h-2 rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: m.improve }}
                        />
                      </div>
                    </div>
                    <span className="w-10 text-right text-xs font-mono">{m.improve}</span>
                  </div>
                ))}
            </div>
          </div>

          <div className="rounded-2xl bg-card p-3 shadow-card">
            <p className="mb-2 text-sm font-semibold">关键指标对比</p>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <Stat label="任务完成率" you="75%" team="73%" />
              <Stat label="预警及时率" you="92%" team="89%" />
              <Stat label="改善率" you="68%" team="66%" />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </HmLayout>
  );
}

function Stat({ label, you, team }: { label: string; you: string; team: string }) {
  return (
    <div className="rounded-xl bg-muted/30 p-2">
      <p className="text-[10px] text-muted-foreground">{label}</p>
      <p className="mt-1 text-base font-bold text-primary">{you}</p>
      <p className="text-[10px] text-muted-foreground">组均 {team}</p>
    </div>
  );
}
