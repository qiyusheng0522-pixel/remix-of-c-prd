import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { HmLayout, HmHeader } from "@/hm/HmLayout";
import { KPI } from "@/hm/hmData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, FileText, Settings, BookOpen, Bell, ChevronRight, Sparkles } from "lucide-react";
import { logoutAdmin } from "@/admin/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/hm/me")({
  head: () => ({ meta: [{ title: "我的 - 健康管理师" }] }),
  component: MePage,
});

function MePage() {
  const nav = useNavigate();

  const handleLogout = () => {
    logoutAdmin();
    toast.success("已退出登录");
    nav({ to: "/admin/login" });
  };

  return (
    <HmLayout>
      <HmHeader title="我的" />

      {/* 个人卡片 */}
      <section className="px-4 pt-4">
        <div className="rounded-2xl bg-gradient-primary p-4 text-primary-foreground shadow-elevated">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-3xl">
              👩‍⚕️
            </div>
            <div className="flex-1">
              <p className="text-lg font-bold">孙健康</p>
              <p className="text-xs opacity-90">蜻蜓健康管理中心 · 一组 · 工号 HM001</p>
            </div>
            <Badge className="bg-white/20 text-white hover:bg-white/20">健康管理师</Badge>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-xs opacity-80">负责用户</p>
              <p className="text-xl font-bold">{KPI.myUserCount}</p>
            </div>
            <div className="border-x border-white/20">
              <p className="text-xs opacity-80">本月任务</p>
              <p className="text-xl font-bold">
                {KPI.taskDone}/{KPI.taskTotal}
              </p>
            </div>
            <div>
              <p className="text-xs opacity-80">改善率</p>
              <p className="text-xl font-bold">{Math.round(KPI.improvementRate * 100)}%</p>
            </div>
          </div>
        </div>
      </section>

      {/* 工作成果（日报/周报/月报） */}
      <section className="px-4 pt-4">
        <h2 className="mb-2 flex items-center gap-1.5 text-base font-bold">
          <Sparkles className="h-4 w-4 text-primary" />
          工作成果（AI 自动汇总）
        </h2>
        <div className="rounded-2xl bg-card shadow-card">
          <Tabs defaultValue="day">
            <TabsList className="grid w-full grid-cols-3 rounded-t-2xl rounded-b-none">
              <TabsTrigger value="day">日报</TabsTrigger>
              <TabsTrigger value="week">周报</TabsTrigger>
              <TabsTrigger value="month">月报</TabsTrigger>
            </TabsList>
            <TabsContent value="day" className="p-4">
              <ReportItem k="完成随访" v="6 次" />
              <ReportItem k="处理预警" v="4 条（P0 1 / P1 2 / P2 1）" />
              <ReportItem k="新增方案" v="1 份" />
              <ReportItem k="电话时长" v="42 分钟" />
              <p className="mt-3 rounded-lg bg-primary-soft/40 p-2 text-xs">
                AI 评语：今日整体执行高效，建议明日补做 U10005 孙国安的复诊预约。
              </p>
            </TabsContent>
            <TabsContent value="week" className="p-4">
              <ReportItem k="服务用户" v="28 人次" />
              <ReportItem k="任务完成率" v="75%" />
              <ReportItem k="预警及时率" v="92%" />
              <ReportItem k="健康指标改善" v="11 位用户" />
              <Button variant="outline" size="sm" className="mt-3 w-full" onClick={() => toast.success("周报已导出")}>
                <FileText className="mr-1 h-3.5 w-3.5" />
                导出 PDF
              </Button>
            </TabsContent>
            <TabsContent value="month" className="p-4">
              <ReportItem k="累计服务" v="120 人次" />
              <ReportItem k="人均触达" v="3.8 次/月" />
              <ReportItem k="改善率" v="68%（高于组均 +2%）" />
              <ReportItem k="客户满意度" v="4.8 / 5.0" />
              <p className="mt-3 rounded-lg bg-primary-soft/40 p-2 text-xs">
                AI 评语：本月在依从性管理上表现突出，建议下月加强『新用户 30 天激活』模块。
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* 设置入口 */}
      <section className="px-4 pt-4">
        <h2 className="mb-2 text-base font-bold">设置</h2>
        <div className="divide-y rounded-2xl bg-card shadow-card">
          <SettingRow icon={BookOpen} label="服务标准与话术库" hint="公司规范 + 客户分级" />
          <SettingRow icon={Bell} label="提醒设置" hint="超时 / 预警 / 复诊" />
          <SettingRow icon={Settings} label="账号设置" hint="头像 / 密码" />
        </div>
      </section>

      {/* 退出 */}
      <section className="px-4 py-6">
        <Button variant="outline" className="w-full" onClick={handleLogout}>
          <LogOut className="mr-1 h-4 w-4" />
          退出登录
        </Button>
      </section>
    </HmLayout>
  );
}

function ReportItem({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between border-b py-2 text-sm last:border-b-0">
      <span className="text-muted-foreground">{k}</span>
      <span className="font-semibold">{v}</span>
    </div>
  );
}

function SettingRow({ icon: Icon, label, hint }: { icon: React.ElementType; label: string; hint?: string }) {
  return (
    <button
      onClick={() => toast.info(`${label}（演示，敬请期待）`)}
      className="flex w-full items-center gap-3 px-4 py-3 text-left active:bg-muted/40"
    >
      <Icon className="h-5 w-5 text-primary" />
      <div className="flex-1">
        <p className="text-sm font-medium">{label}</p>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </button>
  );
}
