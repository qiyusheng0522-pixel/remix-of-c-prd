import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  MapPin,
  Phone,
  Clock,
  Navigation,
  ChevronRight,
  Soup,
  Home,
  Wallet,
  Star,
  Utensils,
  Hospital,
  Check,

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
  { id: "pediatric", name: "儿科生长发育套餐", desc: "儿童营养餐 + 身高骨龄追踪", price: "¥1580/月" },
  { id: "elder", name: "老年慢病综合套餐", desc: "三高联调 + 跌倒预警 + 家属同步", price: "¥2380/月" },
];

const hospitals = [
  { id: "gulou", name: "鼓楼医院", tag: "三甲 · 综合" },
  { id: "spph", name: "省人民医院", tag: "三甲 · 综合" },
  { id: "tcm", name: "省中医院", tag: "三甲 · 中医" },
  { id: "child", name: "儿童医院", tag: "三甲 · 儿科" },
  { id: "zhongda", name: "东南大学附属中大医院", tag: "三甲 · 综合" },
  { id: "tumor", name: "省肿瘤医院", tag: "三甲 · 肿瘤" },
  { id: "stomato", name: "省口腔医院", tag: "三甲 · 口腔" },
];

export const Route = createFileRoute("/station/")({
  head: () => ({
    meta: [
      { title: "驿站 - 蜻蜓健康" },
      { name: "description", content: "查找附近的健康驿站，享受贴心服务。" },
    ],
  }),
  component: StationPage,
});

const nearbyStations = [
  {
    id: "sunshine",
    name: "阳光社区健康驿站",
    distance: "320米",
    address: "朝阳区阳光花园小区南门",
    open: "08:00 - 20:00",
    services: ["健康检测", "康复理疗", "中医问诊"],
  },
  {
    id: "happy",
    name: "幸福里养生驿站",
    distance: "780米",
    address: "海淀区幸福里小区会所",
    open: "07:30 - 21:00",
    services: ["太极课程", "健康讲座", "茶艺"],
  },
  {
    id: "central",
    name: "蜻蜓中央旗舰驿站",
    distance: "1.2公里",
    address: "西城区金融街18号",
    open: "07:00 - 22:00",
    services: ["全科检查", "营养餐厅", "活动中心"],
  },
];

const myStations = [
  {
    id: "sunshine",
    name: "阳光社区健康驿站",
    role: "VIP会员",
    visits: 28,
    balance: 286,
    nextEvent: "明天 09:00 · 太极晨练",
  },
];

function StationPage() {
  const [tab, setTab] = useState<"nearby" | "mine">("nearby");
  const [pkgOpen, setPkgOpen] = useState(false);
  const [activePkg, setActivePkg] = useState<string | null>(null);
  const [chosenHospital, setChosenHospital] = useState<string | null>(null);
  const navigate = useNavigate();

  const goDetail = (id: string) => navigate({ to: "/station/$id", params: { id } });
  const pkg = specialPackages.find((p) => p.id === activePkg);

  return (
    <MobileLayout>
      <header className="bg-gradient-primary px-5 pb-8 pt-12 text-primary-foreground">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">健康驿站</h1>
            <p className="mt-2 text-base opacity-90">家门口的健康守护站</p>
          </div>
          <ShareButton
            variant="pill"
            label="推荐给邻居"
            title="阳光社区健康驿站"
            desc="家门口的健康守护站 · 体检 / 营养餐 / 中医理疗"
            className="bg-white/25 text-white"
          />
        </div>
      </header>

      {/* 专病套餐 · 悬浮按钮（默认收起） */}
      <button
        onClick={() => setPkgOpen(true)}
        aria-label="专病套餐"
        className="fixed bottom-28 right-4 z-40 flex items-center gap-2 rounded-full bg-gradient-to-r from-[oklch(0.65_0.16_150)] to-[oklch(0.7_0.15_180)] py-2.5 pl-3 pr-4 text-white shadow-elevated active:scale-95"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/25 backdrop-blur">
          <Soup className="h-5 w-5" />
        </span>
        <span className="text-sm font-bold">专病套餐</span>
      </button>

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
                  专病套餐
                </SheetTitle>
                <SheetDescription>
                  按病种定制 · 营养师审核 · 可配置至各大三甲医院直送
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


      <div className="mt-4 px-5">
        <div className="grid grid-cols-2 gap-2 rounded-2xl bg-card p-2 shadow-card">

          <button
            onClick={() => setTab("nearby")}
            className={cn(
              "rounded-xl py-3 text-base font-semibold transition-all",
              tab === "nearby" ? "bg-primary text-primary-foreground shadow-soft" : "text-muted-foreground",
            )}
          >
            附近驿站
          </button>
          <button
            onClick={() => setTab("mine")}
            className={cn(
              "rounded-xl py-3 text-base font-semibold transition-all",
              tab === "mine" ? "bg-primary text-primary-foreground shadow-soft" : "text-muted-foreground",
            )}
          >
            我的驿站
          </button>
        </div>
      </div>

      <section className="space-y-4 px-5 pt-6">
        {tab === "nearby" &&
          nearbyStations.map((s) => (
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
              className="cursor-pointer rounded-2xl bg-card p-5 shadow-card transition-transform active:scale-[0.99]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h2 className="flex items-center gap-1 text-xl font-bold text-foreground">
                    {s.name}
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </h2>
                  <p className="mt-1 flex items-center gap-1.5 text-base text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {s.address}
                  </p>
                </div>
                <div className="flex flex-col items-center rounded-xl bg-primary-soft px-3 py-2">
                  <Navigation className="h-5 w-5 text-primary" />
                  <span className="mt-0.5 text-sm font-semibold text-primary">{s.distance}</span>
                </div>
              </div>

              <p className="mt-3 flex items-center gap-1.5 text-base text-foreground">
                <Clock className="h-4 w-4 text-primary" />
                营业时间 {s.open}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {s.services.map((srv) => (
                  <span
                    key={srv}
                    className="rounded-full bg-accent-soft px-3 py-1 text-sm font-medium text-accent"
                  >
                    {srv}
                  </span>
                ))}
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toast(`正在拨打 ${s.name}`, { description: "010-8888 8888" });
                  }}
                  className="flex min-h-[48px] items-center justify-center gap-1 rounded-xl border-2 border-primary text-sm font-semibold text-primary active:scale-[0.98]"
                >
                  <Phone className="h-4 w-4" />
                  电话
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toast(`导航前往 ${s.name}`, { description: `预计步行 ${s.distance}` });
                  }}
                  className="flex min-h-[48px] items-center justify-center gap-1 rounded-xl border-2 border-accent text-sm font-semibold text-accent active:scale-[0.98]"
                >
                  <Navigation className="h-4 w-4" />
                  导航
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goDetail(s.id);
                  }}
                  className="flex min-h-[48px] items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-soft active:scale-[0.98]"
                >
                  查看详情
                </button>
              </div>
            </article>
          ))}

        {tab === "mine" &&
          myStations.map((s) => (
            <article key={s.id} className="rounded-2xl bg-card p-5 shadow-card">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-primary text-white">
                  <Home className="h-7 w-7" />
                </div>

                <div className="flex-1">
                  <h2 className="text-xl font-bold">{s.name}</h2>
                  <p className="mt-0.5 text-sm font-semibold text-accent">
                    {s.role} · 已到访 {s.visits} 次
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-muted p-3">
                <div>
                  <p className="text-xs text-muted-foreground">驿站余额</p>
                  <p className="mt-0.5 text-xl font-bold text-foreground">¥ {s.balance}</p>
                </div>
                <button
                  onClick={() => toast.success("充值成功 +¥100", { description: "微信支付 · 当前余额 ¥386" })}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-accent text-sm font-bold text-accent-foreground shadow-soft active:scale-95"
                >
                  <Wallet className="h-4 w-4" /> 立即充值
                </button>

              </div>

              <div className="mt-3 rounded-xl bg-accent-soft p-4">
                <p className="text-sm font-medium text-muted-foreground">下次活动</p>
                <p className="mt-1 text-base font-bold text-accent">{s.nextEvent}</p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <Link
                  to="/me/records"
                  className="flex min-h-[48px] items-center justify-center gap-1.5 rounded-xl border-2 border-primary text-sm font-bold text-primary active:scale-[0.98]"
                >
                  <Star className="h-4 w-4" /> 服务评价
                </Link>
                <Link
                  to="/me/records"
                  className="flex min-h-[48px] items-center justify-center gap-1.5 rounded-xl border-2 border-accent text-sm font-bold text-accent active:scale-[0.98]"
                >
                  <Utensils className="h-4 w-4" /> 用餐评价
                </Link>

              </div>

              <Link
                to="/station/$id"
                params={{ id: s.id }}
                className="mt-3 flex min-h-[52px] w-full items-center justify-center rounded-xl bg-primary text-base font-semibold text-primary-foreground shadow-soft active:scale-[0.98]"
              >
                查看驿站详情
              </Link>
            </article>
          ))}

        {tab === "mine" && myStations.length === 0 && (
          <div className="rounded-2xl bg-card p-8 text-center shadow-card">
            <p className="text-base text-muted-foreground">您还没有加入驿站</p>
          </div>
        )}
      </section>
    </MobileLayout>
  );
}
