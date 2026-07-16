import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  Plus,
  Bell,
  Footprints,
  Pill,
  HeartPulse,
  ShoppingCart,
  CheckCircle2,
  Phone,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/me/family")({
  head: () => ({
    meta: [
      { title: "家庭代管 - 蜻蜓健康" },
      { name: "description", content: "替家人记录健康、提醒打卡运动、一键代买。" },
    ],
  }),
  component: FamilyPage,
});

type Member = {
  id: string;
  name: string;
  relation: string;
  age: number;
  avatar: string;
  status: "good" | "warn" | "alert";
  statusText: string;
  todayStep: number;
  stepGoal: number;
  checkedIn: boolean;
  nextMed?: { name: string; time: string; taken: boolean };
  vitals: { label: string; value: string; tone: "ok" | "warn" }[];
  buyList: { name: string; desc: string; price: number }[];
};

const initialMembers: Member[] = [
  {
    id: "mom",
    name: "妈妈 · 李秀兰",
    relation: "母亲",
    age: 68,
    avatar: "👩‍🦳",
    status: "warn",
    statusText: "今日血压偏高，建议关注",
    todayStep: 2400,
    stepGoal: 5000,
    checkedIn: false,
    nextMed: { name: "苯磺酸氨氯地平 5mg", time: "今天 19:00", taken: false },
    vitals: [
      { label: "血压", value: "148/92", tone: "warn" },
      { label: "心率", value: "78", tone: "ok" },
      { label: "睡眠", value: "6.2h", tone: "ok" },
    ],
    buyList: [
      { name: "降压药 · 一个月装", desc: "已绑定社区药房", price: 86 },
      { name: "电子血压计耗材", desc: "袖带 + 电池", price: 32 },
    ],
  },
  {
    id: "dad",
    name: "爸爸 · 王建国",
    relation: "父亲",
    age: 72,
    avatar: "👴",
    status: "good",
    statusText: "今日各项指标平稳",
    todayStep: 5800,
    stepGoal: 5000,
    checkedIn: true,
    nextMed: { name: "二甲双胍 0.5g", time: "明天 08:00", taken: true },
    vitals: [
      { label: "血糖", value: "5.6", tone: "ok" },
      { label: "血压", value: "128/82", tone: "ok" },
      { label: "睡眠", value: "7.1h", tone: "ok" },
    ],
    buyList: [
      { name: "无糖燕麦 · 月卡", desc: "驿站直送", price: 128 },
    ],
  },
  {
    id: "auntie",
    name: "婆婆 · 陈淑芬",
    relation: "婆婆",
    age: 75,
    avatar: "👵",
    status: "alert",
    statusText: "今天还没打卡，建议视频问候",
    todayStep: 0,
    stepGoal: 4000,
    checkedIn: false,
    vitals: [
      { label: "心率", value: "—", tone: "warn" },
      { label: "血压", value: "—", tone: "warn" },
      { label: "睡眠", value: "—", tone: "warn" },
    ],
    buyList: [
      { name: "钙片 + 维 D", desc: "营养师推荐", price: 68 },
    ],
  },
];

const statusStyle: Record<Member["status"], { dot: string; chip: string; label: string }> = {
  good: { dot: "bg-success", chip: "bg-success/15 text-success", label: "状态良好" },
  warn: { dot: "bg-warning", chip: "bg-warning/15 text-warning", label: "需关注" },
  alert: { dot: "bg-destructive", chip: "bg-destructive/15 text-destructive", label: "请联系" },
};

function FamilyPage() {
  const navigate = useNavigate();
  const [members, setMembers] = useState<Member[]>(initialMembers);

  const remind = (m: Member, kind: "checkin" | "exercise" | "med") => {
    const titles = {
      checkin: `已提醒 ${m.name} 健康打卡`,
      exercise: `已提醒 ${m.name} 出门散步`,
      med: `已提醒 ${m.name} 按时服药`,
    };
    toast.success(titles[kind], { description: "短信 + 微信 + 智能音箱 同时通知" });
  };

  const markMed = (id: string) => {
    setMembers((ms) =>
      ms.map((m) =>
        m.id === id && m.nextMed ? { ...m, nextMed: { ...m.nextMed, taken: true } } : m,
      ),
    );
    toast.success("已代为记录服药", { description: "档案同步更新" });
  };

  const buy = (item: { name: string; price: number }) => {
    toast.success(`已下单：${item.name}`, {
      description: `¥${item.price} · 预计明日驿站直送，到货后家人会收到提醒`,
    });
  };

  return (
    <div className="mx-auto min-h-screen max-w-[480px] bg-gradient-bg pb-8">
      <header className="bg-gradient-primary px-5 pb-6 pt-12 text-primary-foreground">
        <button
          onClick={() => navigate({ to: "/me" })}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm"
          aria-label="返回"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="mt-3 text-2xl font-bold">家庭代管</h1>
        <p className="mt-1 text-sm opacity-90">
          替家人记录健康 · 一键提醒打卡运动 · 帮他们代买必需品
        </p>

        <div className="mt-4 grid grid-cols-3 divide-x divide-white/20 rounded-2xl bg-white/15 py-3 backdrop-blur-sm">
          <div className="text-center">
            <div className="text-xl font-bold">{members.length}</div>
            <div className="mt-0.5 text-xs opacity-90">代管家人</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold">
              {members.filter((m) => m.status !== "good").length}
            </div>
            <div className="mt-0.5 text-xs opacity-90">待关注</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold">
              {members.filter((m) => m.checkedIn).length}/{members.length}
            </div>
            <div className="mt-0.5 text-xs opacity-90">今日打卡</div>
          </div>
        </div>
      </header>

      <section className="space-y-4 px-5 pt-4">
        {members.map((m) => {
          const s = statusStyle[m.status];
          const stepPct = Math.min(100, Math.round((m.todayStep / m.stepGoal) * 100));
          return (
            <article key={m.id} className="space-y-3 rounded-2xl bg-card p-4 shadow-card">
              {/* 头部 */}
              <header className="flex items-center gap-3">
                <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-muted text-3xl">
                  {m.avatar}
                  <span
                    className={cn(
                      "absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full ring-2 ring-card",
                      s.dot,
                    )}
                  />
                </div>
                <div className="flex-1">
                  <p className="text-base font-bold text-foreground">{m.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {m.relation} · {m.age}岁
                  </p>
                </div>
                <span className={cn("rounded-full px-2.5 py-1 text-xs font-bold", s.chip)}>
                  {s.label}
                </span>
              </header>

              <p className="rounded-xl bg-muted/60 px-3 py-2 text-sm text-foreground">
                💬 {m.statusText}
              </p>

              {/* 指标 */}
              <div className="grid grid-cols-3 gap-2">
                {m.vitals.map((v) => (
                  <div
                    key={v.label}
                    className={cn(
                      "rounded-xl p-2 text-center",
                      v.tone === "warn" ? "bg-warning/10" : "bg-primary-soft/60",
                    )}
                  >
                    <p className="text-xs text-muted-foreground">{v.label}</p>
                    <p
                      className={cn(
                        "mt-0.5 text-base font-bold",
                        v.tone === "warn" ? "text-warning" : "text-primary",
                      )}
                    >
                      {v.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* 步数进度 */}
              <div className="rounded-xl bg-muted/60 p-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1.5 font-semibold text-foreground">
                    <Footprints className="h-4 w-4 text-primary" />
                    今日步数
                  </span>
                  <span className="font-bold text-foreground">
                    {m.todayStep.toLocaleString()}{" "}
                    <span className="text-xs text-muted-foreground">/ {m.stepGoal}</span>
                  </span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-card">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      stepPct >= 100 ? "bg-success" : "bg-primary",
                    )}
                    style={{ width: `${stepPct}%` }}
                  />
                </div>
              </div>

              {/* 服药提醒 */}
              {m.nextMed && (
                <div className="flex items-center gap-3 rounded-xl bg-accent-soft/60 p-3">
                  <Pill className="h-5 w-5 text-accent" />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-foreground">{m.nextMed.name}</p>
                    <p className="text-xs text-muted-foreground">{m.nextMed.time}</p>
                  </div>
                  {m.nextMed.taken ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-success">
                      <CheckCircle2 className="h-4 w-4" /> 已服
                    </span>
                  ) : (
                    <button
                      onClick={() => markMed(m.id)}
                      className="rounded-full bg-accent px-3 py-1.5 text-xs font-bold text-accent-foreground active:scale-95"
                    >
                      代记录
                    </button>
                  )}
                </div>
              )}

              {/* 提醒动作 */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => remind(m, "checkin")}
                  className="flex min-h-[44px] items-center justify-center gap-1 rounded-xl border-2 border-primary text-xs font-bold text-primary active:scale-[0.98]"
                >
                  <Bell className="h-4 w-4" />
                  催打卡
                </button>
                <button
                  onClick={() => remind(m, "exercise")}
                  className="flex min-h-[44px] items-center justify-center gap-1 rounded-xl border-2 border-success text-xs font-bold text-success active:scale-[0.98]"
                >
                  <Footprints className="h-4 w-4" />
                  催运动
                </button>
                <button
                  onClick={() =>
                    toast(`正在拨打 ${m.name}`, { description: "亲情免费通话" })
                  }
                  className="flex min-h-[44px] items-center justify-center gap-1 rounded-xl border-2 border-accent text-xs font-bold text-accent active:scale-[0.98]"
                >
                  <Phone className="h-4 w-4" />
                  视频
                </button>
              </div>

              {/* 代买清单 */}
              {m.buyList.length > 0 && (
                <div className="rounded-xl border border-dashed border-primary/30 p-3">
                  <p className="mb-2 flex items-center gap-1.5 text-sm font-bold text-foreground">
                    <ShoppingCart className="h-4 w-4 text-primary" />
                    代买清单 · 帮 ta 一键下单
                  </p>
                  <ul className="space-y-2">
                    {m.buyList.map((item) => (
                      <li
                        key={item.name}
                        className="flex items-center gap-2 rounded-lg bg-muted/40 p-2"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-foreground">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{item.desc}</p>
                        </div>
                        <span className="text-sm font-bold text-accent">¥{item.price}</span>
                        <button
                          onClick={() => buy(item)}
                          className="rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground active:scale-95"
                        >
                          代买
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                onClick={() => navigate({ to: "/health/records" })}
                className="flex w-full items-center justify-center gap-1 text-sm font-semibold text-primary active:opacity-70"
              >
                查看 ta 的完整档案 <ChevronRight className="h-4 w-4" />
              </button>
            </article>
          );
        })}

        {/* 添加家人 */}
        <button
          onClick={() =>
            toast.success("已发送绑定邀请", {
              description: "家人微信确认即可加入代管，家人也能随时取消授权",
            })
          }
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-primary bg-primary/5 py-5 text-base font-bold text-primary active:scale-[0.98]"
        >
          <Plus className="h-5 w-5" />
          添加家人到代管
        </button>

        <p className="px-2 pt-2 text-center text-xs text-muted-foreground">
          <HeartPulse className="mr-1 inline h-3 w-3" />
          家人授权后，您才能查看健康数据，所有操作家人可随时撤回
        </p>
      </section>
    </div>
  );
}
