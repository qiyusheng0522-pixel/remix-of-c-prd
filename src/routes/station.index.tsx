import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  MapPin,
  Phone,
  Navigation,
  ChevronRight,
  Soup,
  Wallet,
  Hospital,
  Check,
  ShoppingBag,
  HeartPulse,
  CalendarCheck,
  Package,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import { MobileLayout } from "@/components/MobileLayout";
import { ShareButton } from "@/components/ShareButton";
import { cn } from "@/lib/utils";

const specialPackages = [
  { id: "diabetes", name: "糖尿病专病套餐", desc: "控糖餐 + 周复诊 + 血糖远程随访", price: "¥1980/月" },
  { id: "hypertension", name: "高血压专病套餐", desc: "低盐 DASH 餐 + 每日血压监测 + 医生周报", price: "¥1680/月" },
  { id: "tumor", name: "肿瘤术后康复套餐", desc: "高蛋白配餐 + 营养师 1v1 + 心理疏导", price: "¥3280/月" },
  { id: "kidney", name: "肾病专病套餐", desc: "低嘌呤低钾配餐 + 透析期随访", price: "¥2680/月" },
  { id: "elder", name: "老年慢病综合套餐", desc: "三高联调 + 跌倒预警 + 家属同步", price: "¥2380/月" },
];

const hospitals = [
  { id: "gulou", name: "鼓楼医院", tag: "三甲 · 综合" },
  { id: "spph", name: "省人民医院", tag: "三甲 · 综合" },
  { id: "tcm", name: "省中医院", tag: "三甲 · 中医" },
  { id: "zhongda", name: "东南大学附属中大医院", tag: "三甲 · 综合" },
  { id: "tumor", name: "省肿瘤医院", tag: "三甲 · 肿瘤" },
];

const nearbyStations = [
  {
    id: "sunshine",
    name: "阳光社区健康驿站",
    distance: "320米",
    address: "朝阳区阳光花园小区南门",
    open: "08:00 - 20:00",
  },
  {
    id: "happy",
    name: "幸福里养生驿站",
    distance: "780米",
    address: "海淀区幸福里小区会所",
    open: "07:30 - 21:00",
  },
  {
    id: "central",
    name: "蜻蜓中央旗舰驿站",
    distance: "1.2公里",
    address: "西城区金融街18号",
    open: "07:00 - 22:00",
  },
];

const myStation = {
  id: "sunshine",
  name: "阳光社区健康驿站",
  balance: 286,
  pickup: 2,
  pickupCode: "8842",
  nextEvent: "明天 09:00 · 太极晨练",
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
  const [pkgOpen, setPkgOpen] = useState(false);
  const [activePkg, setActivePkg] = useState<string | null>(null);
  const [chosenHospital, setChosenHospital] = useState<string | null>(null);
  const navigate = useNavigate();

  const goDetail = (id: string) => navigate({ to: "/station/$id", params: { id } });
  const pkg = specialPackages.find((p) => p.id === activePkg);

  const categories = [
    {
      key: "meal",
      label: "营养餐",
      desc: "控糖 / 低盐 / 高蛋白",
      icon: Soup,
      cls: "from-emerald-500 to-teal-600",
      onClick: () => setPkgOpen(true),
    },
    {
      key: "goods",
      label: "健康商品",
      desc: "血压计 / 血糖仪 / 保健品",
      icon: ShoppingBag,
      cls: "from-amber-500 to-orange-600",
      onClick: () =>
        toast.success("已为您打开健康商品", {
          description: "医疗器械 / 保健品直邮驿站自提",
        }),
    },
    {
      key: "service",
      label: "健康服务",
      desc: "推拿 / 理疗 / 上门问诊",
      icon: HeartPulse,
      cls: "from-primary to-cyan-600",
      onClick: () => goDetail("sunshine"),
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
              <p className="mt-1 text-4xl font-bold">¥ {myStation.balance}</p>
            </div>
            <button
              onClick={() =>
                toast.success("充值成功 +¥100", {
                  description: "微信支付 · 当前余额 ¥386",
                })
              }
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
        <h2 className="mb-3 text-lg font-bold text-foreground">我的驿站</h2>
        <div className="rounded-3xl bg-card p-5 shadow-card">
          <p className="flex items-center gap-1.5 text-base font-bold text-foreground">
            <MapPin className="h-5 w-5 text-primary" />
            {myStation.name}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            下次活动 · {myStation.nextEvent}
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              onClick={() =>
                toast.success(`待自提 ${myStation.pickup} 件`, {
                  description: `凭取件码 ${myStation.pickupCode} 到驿站领取`,
                })
              }
              className="flex items-center gap-3 rounded-2xl bg-primary-soft p-4 text-left active:scale-95"
            >
              <Package className="h-7 w-7 text-primary" />
              <div>
                <p className="text-base font-bold text-foreground">货品自提</p>
                <p className="text-xs text-muted-foreground">{myStation.pickup} 件待取</p>
              </div>
            </button>
            <button
              onClick={() => goDetail(myStation.id)}
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

      {/* 营养餐 · 专病套餐 Sheet */}
      <Sheet
        open={pkgOpen}
        onOpenChange={(v) => {
          setPkgOpen(v);
          if (!v) {
            setActivePkg(null);
            setChosenHospital(null);
          }
        }}
      >
        <SheetContent side="bottom" className="max-h-[88vh] overflow-y-auto rounded-t-3xl p-5">
          {!activePkg ? (
            <>
              <SheetHeader className="text-left">
                <SheetTitle className="flex items-center gap-2 text-xl">
                  <Soup className="h-5 w-5 text-primary" />
                  营养餐 · 专病套餐
                </SheetTitle>
                <SheetDescription>
                  按病种定制 · 营养师审核 · 可配送至各大三甲医院
                </SheetDescription>
              </SheetHeader>
              <div className="mt-3 space-y-2">
                {specialPackages.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setActivePkg(p.id)}
                    className="flex w-full items-center gap-3 rounded-2xl bg-muted/50 p-3 text-left active:scale-[0.99]"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                      <Soup className="h-5 w-5" />
                    </span>
                    <div className="flex-1">
                      <p className="text-base font-bold">{p.name}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{p.desc}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-primary">{p.price}</p>
                      <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
                    </div>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <SheetHeader className="text-left">
                <SheetTitle className="flex items-center gap-2 text-xl">
                  <Hospital className="h-5 w-5 text-primary" />
                  {pkg?.name}
                </SheetTitle>
                <SheetDescription>
                  {pkg?.desc} · 选择您要直送的三甲医院
                </SheetDescription>
              </SheetHeader>
              <div className="mt-3 space-y-2">
                {hospitals.map((h) => {
                  const active = chosenHospital === h.id;
                  return (
                    <button
                      key={h.id}
                      onClick={() => setChosenHospital(h.id)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-2xl border-2 p-3 text-left active:scale-[0.99]",
                        active ? "border-primary bg-primary-soft" : "border-transparent bg-muted/50",
                      )}
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-primary">
                        <Hospital className="h-5 w-5" />
                      </span>
                      <div className="flex-1">
                        <p className="text-base font-bold">{h.name}</p>
                        <p className="text-xs text-muted-foreground">{h.tag}</p>
                      </div>
                      {active && <Check className="h-5 w-5 text-primary" />}
                    </button>
                  );
                })}
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => {
                    setActivePkg(null);
                    setChosenHospital(null);
                  }}
                  className="flex min-h-[48px] flex-1 items-center justify-center rounded-xl border-2 border-muted text-sm font-bold text-muted-foreground"
                >
                  返回
                </button>
                <button
                  disabled={!chosenHospital}
                  onClick={() => {
                    const h = hospitals.find((x) => x.id === chosenHospital);
                    toast.success(`${pkg?.name} · 已预约`, {
                      description: `配送至 ${h?.name} · 营养师 1 小时内联系您`,
                    });
                    setPkgOpen(false);
                    setActivePkg(null);
                    setChosenHospital(null);
                  }}
                  className={cn(
                    "flex min-h-[48px] flex-[2] items-center justify-center rounded-xl text-sm font-bold text-primary-foreground shadow-soft",
                    chosenHospital ? "bg-primary active:scale-[0.98]" : "bg-muted-foreground/40",
                  )}
                >
                  确认预约
                </button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </MobileLayout>
  );
}

// Link is imported for potential future use in "我的驿站" detail navigation
void Link;