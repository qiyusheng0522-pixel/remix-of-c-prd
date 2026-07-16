import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Pill, Bell, Calendar, AlertCircle, Check, ShoppingCart, MessageCircle, Sunrise, Sun, Moon, UtensilsCrossed, Ban, OctagonAlert } from "lucide-react";
import { MobileLayout } from "@/components/MobileLayout";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/me/prescriptions")({
  head: () => ({
    meta: [
      { title: "处方与用药提醒 - 蜻蜓健康" },
      { name: "description", content: "查看电子处方、按时用药提醒、复诊安排。" },
    ],
  }),
  component: Prescriptions,
});

const RX = [
  {
    id: "RX20250410-007",
    doctor: "李医生",
    issuedAt: "2025-04-10",
    diagnosis: "原发性高血压 II 期",
    drugs: [
      { name: "氨氯地平片 5mg", dose: "1 片 / 次", freq: "每日 1 次（早餐后）", days: 30 },
      { name: "缬沙坦胶囊 80mg", dose: "1 粒 / 次", freq: "每日 1 次（早餐后）", days: 30 },
    ],
    nextVisit: "2025-05-10",
    status: "执行中",
  },
  {
    id: "RX20250320-005",
    doctor: "王医生",
    issuedAt: "2025-03-20",
    diagnosis: "2 型糖尿病",
    drugs: [
      { name: "二甲双胍片 0.5g", dose: "1 片 / 次", freq: "每日 2 次（早晚餐后）", days: 30 },
    ],
    nextVisit: "2025-04-20",
    status: "已完成",
  },
];

const TODAY_REMINDERS = [
  {
    time: "07:30",
    period: "晨起 · 餐前 30 分钟",
    icon: Sunrise,
    method: "温水送服 · 空腹",
    drug: "兰索拉唑 30mg × 1 粒",
    taboo: "服药期间禁酒；勿与抗酸药同服",
    taken: true,
  },
  {
    time: "08:00",
    period: "早餐后 · 随餐",
    icon: UtensilsCrossed,
    method: "随早餐第一口同服 · 温水",
    drug: "氨氯地平 5mg + 缬沙坦 80mg",
    taboo: "服药期间避免葡萄柚汁 · 易致血压骤降",
    taken: true,
    mealCombined: true,
  },
  {
    time: "12:00",
    period: "午餐后 · 半小时内",
    icon: Sun,
    method: "餐后温水送服",
    drug: "二甲双胍 0.5g × 1 片",
    taboo: "禁酒 · 出现乏力恶心立即停药并联系医生",
    taken: true,
    mealCombined: true,
  },
  {
    time: "19:00",
    period: "晚餐后 · 半小时内",
    icon: Moon,
    method: "餐后温水送服",
    drug: "二甲双胍 0.5g × 1 片",
    taboo: "禁酒；与降压药间隔 30 分钟以上",
    taken: false,
    mealCombined: true,
  },
  {
    time: "21:00",
    period: "睡前 · 停药提醒",
    icon: Moon,
    method: "今晚起停服",
    drug: "阿司匹林肠溶片 100mg",
    taboo: "已遵医嘱停药 · 如有头晕胸闷请立即就诊",
    taken: false,
    stop: true,
  },
];

function Prescriptions() {
  const navigate = useNavigate();
  const [reminders, setReminders] = useState(TODAY_REMINDERS);
  const [smsOn, setSmsOn] = useState(true);

  const markTaken = (idx: number) => {
    setReminders((prev) => prev.map((r, i) => (i === idx ? { ...r, taken: !r.taken } : r)));
    toast.success("已标记");
  };

  return (
    <MobileLayout>
      <header className="sticky top-0 z-30 flex items-center gap-2 border-b border-border bg-card/95 px-4 py-3 backdrop-blur">
        <Link to="/me" className="-m-2 p-2">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-lg font-bold">处方与用药提醒</h1>
      </header>

      {/* 今日服药 */}
      <section className="px-4 pt-4">
        <div className="rounded-2xl bg-card p-4 shadow-card">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-base font-bold">
              <Bell className="h-5 w-5 text-primary" />
              今日服药安排
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              短信提醒 <Switch checked={smsOn} onCheckedChange={setSmsOn} />
            </div>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            完成 {reminders.filter((r) => r.taken).length} / {reminders.length} 次 · 按时间 / 方式 / 药品排序
          </p>

          {/* 停药提前一天提醒 */}
          <div className="mt-3 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3">
            <OctagonAlert className="h-5 w-5 shrink-0 text-rose-600" />
            <div className="flex-1 text-xs text-rose-900">
              <p className="font-bold">明日起停服「阿司匹林肠溶片」</p>
              <p className="mt-0.5 leading-relaxed">
                医生已开具停药医嘱 · 今晚 21:00 还需再吃一次，明日起停 · 蜻蜓将在停药当天再次提醒
              </p>
            </div>
          </div>

          <div className="mt-3 space-y-2">
            {reminders.map((r, idx) => {
              const TI = r.icon;
              return (
                <button
                  key={idx}
                  onClick={() => markTaken(idx)}
                  className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left active:scale-[0.99] ${
                    r.stop
                      ? "border-rose-300 bg-rose-50/60"
                      : r.taken
                        ? "border-success/30 bg-success/5"
                        : "border-border bg-card"
                  }`}
                >
                  <div className={`flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl text-xs font-bold ${
                    r.stop ? "bg-rose-100 text-rose-700" : r.taken ? "bg-success/20 text-success" : "bg-primary-soft text-primary"
                  }`}>
                    <TI className="h-4 w-4" />
                    <span className="mt-0.5 text-sm">{r.time}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] font-bold text-primary">{r.period}</span>
                      {r.mealCombined && (
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-700">
                          <UtensilsCrossed className="h-2.5 w-2.5" /> 已合并随餐
                        </span>
                      )}
                      {r.stop && (
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-rose-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                          停药
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm font-semibold leading-snug">{r.drug}</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">{r.method}</p>
                    <p className="mt-1 flex items-start gap-1 rounded-md bg-rose-50/80 px-2 py-1 text-[11px] font-medium text-rose-700">
                      <Ban className="mt-0.5 h-3 w-3 shrink-0" /> 禁忌：{r.taboo}
                    </p>
                  </div>
                  <div className={`mt-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                    r.taken ? "border-success bg-success" : "border-muted-foreground/40"
                  }`}>
                    {r.taken && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 处方列表 */}
      <section className="px-4 py-4">
        <h2 className="mb-3 text-base font-bold">我的处方</h2>
        <div className="space-y-3">
          {RX.map((r) => (
            <div key={r.id} className="rounded-2xl bg-card p-4 shadow-card">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-mono text-xs text-muted-foreground">{r.id}</p>
                  <h3 className="mt-1 text-base font-bold">{r.diagnosis}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {r.doctor} · {r.issuedAt} 开具
                  </p>
                </div>
                <Badge
                  variant="secondary"
                  className={r.status === "执行中" ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"}
                >
                  {r.status}
                </Badge>
              </div>

              <div className="mt-3 space-y-2">
                {r.drugs.map((d, i) => (
                  <div key={i} className="flex items-start gap-2 rounded-lg bg-muted/40 p-2.5">
                    <Pill className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium">{d.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {d.dose} · {d.freq} · 用 {d.days} 天
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {r.status === "执行中" && (
                <div className="mt-3 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 p-2.5">
                  <Calendar className="h-4 w-4 text-amber-700" />
                  <p className="text-xs text-amber-900">
                    复诊提醒：<strong>{r.nextVisit}</strong>，记得提前预约
                  </p>
                </div>
              )}

              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  onClick={() => navigate({ to: "/messages/doctor/$id", params: { id: r.doctor === "李医生" ? "d1" : "d2" } })}
                  className="flex min-h-[40px] items-center justify-center gap-1.5 rounded-xl border border-primary text-xs font-bold text-primary active:scale-[0.98]"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  联系{r.doctor}
                </button>
                <button
                  onClick={() => navigate({ to: "/me/orders" })}
                  className="flex min-h-[40px] items-center justify-center gap-1.5 rounded-xl bg-primary text-xs font-bold text-primary-foreground active:scale-[0.98]"
                >
                  <ShoppingCart className="h-3.5 w-3.5" />
                  在线购药
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 pb-8">
        <div className="flex items-start gap-2 rounded-xl border border-dashed border-amber-300 bg-amber-50/50 p-3">
          <AlertCircle className="h-4 w-4 shrink-0 text-amber-700 mt-0.5" />
          <p className="text-xs text-amber-900">
            处方为电子凭证，可前往合作药房或线上购药使用。如有不适请立即联系医生。
          </p>
        </div>
      </section>
    </MobileLayout>
  );
}
