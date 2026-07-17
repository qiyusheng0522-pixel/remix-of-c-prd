import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  MapPin,
  Phone,
  Navigation,
  ChevronRight,
  Soup,
  Wallet,
  ShoppingBag,
  HeartPulse,
  CalendarCheck,
  Package,
  Check,
  Repeat,
} from "lucide-react";
import { toast } from "sonner";
import { MobileLayout } from "@/components/MobileLayout";
import { ShareButton } from "@/components/ShareButton";
import { cn } from "@/lib/utils";
import { allStations, useMyStation, setMyStation } from "@/lib/my-station";

const nearbyStations = allStations;

const stationExtras: Record<string, { balance: number; pickup: number; nextEvent: string }> = {
  sunshine: { balance: 286, pickup: 2, nextEvent: "明天 09:00 · 太极晨练" },
  happy: { balance: 0, pickup: 0, nextEvent: "本周三 10:00 · 营养讲座" },
  central: { balance: 0, pickup: 0, nextEvent: "本周六 15:00 · 康复体验课" },
};

export const Route = createFileRoute("/station/")({
  head: () => ({
    meta: [
      { title: "驿站 - 蜻蜓健康" },
      { name: "description", content: "家门口的健康驿站：营养餐、健康商品、健康服务，一站搞定。" },
    ],
  }),
  component: StationPage,
});

function StationPage() {
  const navigate = useNavigate();
  const { id: myId, station: myStation } = useMyStation();
  const extras = stationExtras[myId] ?? { balance: 0, pickup: 0, nextEvent: "暂无活动" };
  const [pickerOpen, setPickerOpen] = useState(false);

  const goDetail = (id: string) => navigate({ to: "/station/$id", params: { id } });

  const categories = [
    {
      key: "meal",
      label: "营养餐",
      desc: "控糖 / 低盐 / 高蛋白",
      icon: Soup,
      cls: "from-emerald-500 to-teal-600",
      onClick: () => navigate({ to: "/station/meals" }),
    },
    {
      key: "goods",
      label: "健康商品",
      desc: "血压计 / 血糖仪 / 保健品",
      icon: ShoppingBag,
      cls: "from-amber-500 to-orange-600",
      onClick: () => navigate({ to: "/station/goods" }),
    },
    {
      key: "service",
      label: "健康服务",
      desc: "推拿 / 理疗 / 上门问诊",
      icon: HeartPulse,
      cls: "from-primary to-cyan-600",
      onClick: () => navigate({ to: "/station/booking" }),
    },
  ];

  return (
    <MobileLayout>
      {/* 头部 · 钱包卡片 */}
      <header className="bg-gradient-primary px-5 pb-10 pt-12 text-primary-foreground">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">健康驿站</h1>
            <p className="mt-2 text-base opacity-90">家门口的健康守护站</p>
          </div>
          <ShareButton
            variant="pill"
            label="推荐邻居"
            title="阳光社区健康驿站"
            desc="家门口的健康守护站 · 体检 / 营养餐 / 中医理疗"
            className="bg-white/25 text-white"
          />
        </div>

        <div className="mt-5 rounded-2xl bg-white/20 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">驿站钱包余额</p>
              <p className="mt-1 text-4xl font-bold">¥ {extras.balance}</p>
            </div>
            <button
              onClick={() => navigate({ to: "/station/wallet" })}
              className="flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-primary shadow-soft active:scale-95"
            >
              <Wallet className="h-6 w-6" />
              <span className="text-lg font-bold">充值</span>
            </button>
          </div>
        </div>
      </header>

      {/* 三大服务 · 主要入口 · 大号卡片 */}
      <section className="-mt-6 px-5">
        <div className="space-y-3">
          {categories.map((c) => {
            const Icon = c.icon;
            return (
              <button
                key={c.key}
                onClick={c.onClick}
                className="flex w-full items-center gap-4 rounded-3xl bg-card p-5 shadow-elevated active:scale-[0.99]"
              >
                <span
                  className={cn(
                    "flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-soft",
                    c.cls,
                  )}
                >
                  <Icon className="h-8 w-8" strokeWidth={2.4} />
                </span>
                <div className="flex-1 text-left">
                  <p className="text-xl font-bold text-foreground">{c.label}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{c.desc}</p>
                </div>
                <ChevronRight className="h-6 w-6 text-muted-foreground" />
              </button>
            );
          })}
        </div>
      </section>

      {/* 我的驿站 · 待办 */}
      <section className="mt-6 px-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">我的驿站</h2>
          <button
            onClick={() => setPickerOpen(true)}
            className="flex items-center gap-1 rounded-full bg-primary-soft px-3 py-1.5 text-sm font-bold text-primary active:scale-95"
          >
            <Repeat className="h-4 w-4" />
            更换驿站
          </button>
        </div>
        <div className="rounded-3xl bg-card p-5 shadow-card">
          <button
            onClick={() => goDetail(myStation.id)}
            className="flex w-full items-start justify-between gap-2 text-left"
          >
            <div className="flex-1">
              <p className="flex items-center gap-1.5 text-base font-bold text-foreground">
                <MapPin className="h-5 w-5 text-primary" />
                {myStation.name}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {myStation.address} · {myStation.distance}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                下次活动 · {extras.nextEvent}
              </p>
            </div>
            <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-muted-foreground" />
          </button>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate({ to: "/station/pickup" })}
              className="flex items-center gap-3 rounded-2xl bg-primary-soft p-4 text-left active:scale-95"
            >
              <Package className="h-7 w-7 text-primary" />
              <div>
                <p className="text-base font-bold text-foreground">货品自提</p>
                <p className="text-xs text-muted-foreground">{extras.pickup} 件待取</p>
              </div>
            </button>
            <button
              onClick={() => navigate({ to: "/station/booking" })}
              className="flex items-center gap-3 rounded-2xl bg-accent-soft p-4 text-left active:scale-95"
            >
              <CalendarCheck className="h-7 w-7 text-accent" />
              <div>
                <p className="text-base font-bold text-foreground">服务预约</p>
                <p className="text-xs text-muted-foreground">在线选时</p>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* 附近驿站 */}
      <section className="mt-6 px-5 pb-6">
        <h2 className="mb-3 text-lg font-bold text-foreground">附近驿站</h2>
        <div className="space-y-3">
          {nearbyStations.map((s) => (
            <article
              key={s.id}
              role="button"
              tabIndex={0}
              onClick={() => goDetail(s.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  goDetail(s.id);
                }
              }}
              className="cursor-pointer rounded-2xl bg-card p-4 shadow-card active:scale-[0.99]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-foreground">{s.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {s.address} · 营业 {s.open}
                  </p>
                </div>
                <div className="flex flex-col items-center rounded-xl bg-primary-soft px-3 py-2">
                  <Navigation className="h-5 w-5 text-primary" />
                  <span className="mt-0.5 text-sm font-semibold text-primary">
                    {s.distance}
                  </span>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toast(`正在拨打 ${s.name}`, { description: "010-8888 8888" });
                  }}
                  className="flex min-h-[48px] items-center justify-center gap-1.5 rounded-xl border-2 border-primary text-base font-bold text-primary active:scale-[0.98]"
                >
                  <Phone className="h-4 w-4" />
                  电话
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goDetail(s.id);
                  }}
                  className="flex min-h-[48px] items-center justify-center rounded-xl bg-primary text-base font-bold text-primary-foreground shadow-soft active:scale-[0.98]"
                >
                  查看详情
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {pickerOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40"
          onClick={() => setPickerOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[480px] rounded-t-3xl bg-card p-5 pb-8 shadow-elevated"
          >
            <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-muted" />
            <h3 className="text-lg font-bold text-foreground">选择我的驿站</h3>
            <p className="mt-1 text-sm text-muted-foreground">选定后可享钱包、自提、专属活动</p>
            <ul className="mt-4 space-y-2">
              {allStations.map((st) => {
                const active = st.id === myId;
                return (
                  <li key={st.id}>
                    <button
                      onClick={() => {
                        setMyStation(st.id);
                        setPickerOpen(false);
                        toast.success("已切换我的驿站", { description: st.name });
                      }}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-2xl border-2 p-4 text-left active:scale-[0.99]",
                        active
                          ? "border-primary bg-primary-soft"
                          : "border-transparent bg-muted/50",
                      )}
                    >
                      <MapPin className={cn("h-6 w-6", active ? "text-primary" : "text-muted-foreground")} />
                      <div className="flex-1">
                        <p className="text-base font-bold text-foreground">{st.name}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {st.address} · {st.distance}
                        </p>
                      </div>
                      {active && <Check className="h-5 w-5 text-primary" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </MobileLayout>
  );
}
