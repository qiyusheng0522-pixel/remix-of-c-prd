import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarCheck, Clock, MapPin } from "lucide-react";
import { toast } from "sonner";
import { StationSubPage, StationCard } from "@/components/StationSubPage";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/station/booking")({
  head: () => ({
    meta: [
      { title: "服务预约 - 蜻蜓健康" },
      { name: "description", content: "驿站健康服务在线预约：推拿、理疗、上门问诊。" },
    ],
  }),
  component: BookingPage,
});

const services = [
  { id: "tuina", name: "中医推拿（30分钟）", price: 88, emoji: "💆" },
  { id: "moxi", name: "艾灸理疗（45分钟）", price: 128, emoji: "🌿" },
  { id: "consult", name: "中医问诊", price: 50, emoji: "🩺" },
  { id: "check", name: "健康检测套餐", price: 30, emoji: "🫀" },
  { id: "home", name: "上门问诊（30分钟）", price: 188, emoji: "🏠" },
];

const days = [
  { d: "今日", date: "04-17", wd: "周三" },
  { d: "明日", date: "04-18", wd: "周四" },
  { d: "后天", date: "04-19", wd: "周五" },
  { d: "周六", date: "04-20", wd: "周六" },
  { d: "周日", date: "04-21", wd: "周日" },
];

const slots = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"];

const upcoming = [
  { name: "中医推拿", when: "明日 10:00", at: "阳光社区健康驿站" },
];

function BookingPage() {
  const [svc, setSvc] = useState(services[0].id);
  const [day, setDay] = useState(days[1].date);
  const [slot, setSlot] = useState("10:00");
  const navigate = useNavigate();
  const chosenSvc = services.find((s) => s.id === svc)!;
  const chosenDay = days.find((d) => d.date === day)!;

  return (
    <StationSubPage
      title="服务预约"
      subtitle="选服务 · 选时间 · 到店 / 上门"
      Icon={CalendarCheck}
      gradient="from-primary to-cyan-600"
    >
      {upcoming.length > 0 && (
        <StationCard title="我的预约">
          {upcoming.map((u, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl bg-primary-soft p-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-primary">
                <CalendarCheck className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <p className="text-base font-bold text-foreground">{u.name}</p>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" /> {u.when}
                </p>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" /> {u.at}
                </p>
              </div>
              <button
                onClick={() =>
                  toast.success("已发起改期", { description: "客服 5 分钟内联系您" })
                }
                className="rounded-full border-2 border-primary px-3 py-1.5 text-xs font-bold text-primary active:scale-95"
              >
                改期
              </button>
            </div>
          ))}
        </StationCard>
      )}

      <StationCard title="选择服务">
        <div className="grid grid-cols-2 gap-3">
          {services.map((s) => {
            const active = svc === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setSvc(s.id)}
                className={cn(
                  "rounded-2xl border-2 p-3 text-left active:scale-[0.98]",
                  active ? "border-primary bg-primary-soft" : "border-transparent bg-muted/50",
                )}
              >
                <p className="text-3xl">{s.emoji}</p>
                <p className="mt-1 text-sm font-bold text-foreground">{s.name}</p>
                <p className="mt-0.5 text-sm font-bold text-accent">¥ {s.price}</p>
              </button>
            );
          })}
        </div>
      </StationCard>

      <StationCard title="选择日期">
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1">
          {days.map((d) => {
            const active = day === d.date;
            return (
              <button
                key={d.date}
                onClick={() => setDay(d.date)}
                className={cn(
                  "shrink-0 rounded-2xl border-2 px-4 py-3 text-center transition active:scale-[0.98]",
                  active ? "border-primary bg-primary-soft" : "border-transparent bg-muted/50",
                )}
              >
                <p className="text-sm font-bold text-foreground">{d.d}</p>
                <p className="text-xs text-muted-foreground">{d.wd}</p>
              </button>
            );
          })}
        </div>
      </StationCard>

      <StationCard title="选择时段">
        <div className="grid grid-cols-4 gap-2">
          {slots.map((s) => {
            const active = slot === s;
            return (
              <button
                key={s}
                onClick={() => setSlot(s)}
                className={cn(
                  "rounded-xl border-2 py-2.5 text-sm font-bold transition active:scale-[0.98]",
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-transparent bg-muted/50 text-foreground",
                )}
              >
                {s}
              </button>
            );
          })}
        </div>
      </StationCard>

      <div className="sticky bottom-24 mt-4">
        <button
          onClick={() => {
            toast.success(`已预约：${chosenSvc.name}`, {
              description: `${chosenDay.d} ${slot} · 阳光社区健康驿站 · 提醒已加入消息中心`,
            });
            setTimeout(() => navigate({ to: "/station" }), 600);
          }}
          className="flex min-h-[56px] w-full items-center justify-center rounded-2xl bg-gradient-primary text-lg font-bold text-primary-foreground shadow-elevated active:scale-[0.98]"
        >
          确认预约 · ¥ {chosenSvc.price}
        </button>
      </div>
    </StationSubPage>
  );
}