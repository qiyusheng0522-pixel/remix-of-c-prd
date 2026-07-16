import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  MapPin,
  Phone,
  Clock,
  Navigation,
  ShoppingCart,
  CalendarCheck,
  Star,
  Wallet,
  ChevronRight,
  Soup,
} from "lucide-react";
import { toast } from "sonner";
import { ShareButton } from "@/components/ShareButton";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/station/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `驿站详情 - 蜻蜓健康` },
      { name: "description", content: `查看驿站 ${params.id} 的菜单与可预约服务。` },
    ],
  }),
  component: StationDetail,
});

const stationData: Record<
  string,
  {
    name: string;
    role?: string;
    visits?: number;
    address: string;
    open: string;
    phone: string;
    distance: string;
    balance?: number;
    services: { name: string; price: number; desc: string; emoji: string }[];
    menu: { name: string; price: number; cal: number; tag: string; emoji: string }[];
    isMine: boolean;
  }
> = {
  sunshine: {
    name: "阳光社区健康驿站",
    role: "VIP会员",
    visits: 28,
    address: "朝阳区阳光花园小区南门",
    open: "08:00 - 20:00",
    phone: "010-8888 1234",
    distance: "320米",
    balance: 286,
    isMine: true,
    services: [
      { name: "中医推拿（30分钟）", price: 88, desc: "缓解颈椎、肩背僵硬", emoji: "💆" },
      { name: "艾灸理疗（45分钟）", price: 128, desc: "祛湿驱寒，温经通络", emoji: "🌿" },
      { name: "中医问诊", price: 50, desc: "退休主任医师坐诊", emoji: "🩺" },
      { name: "健康检测套餐", price: 30, desc: "血压/血糖/心率/血氧", emoji: "🫀" },
    ],
    menu: [
      { name: "杂粮养生粥", price: 12, cal: 280, tag: "控糖", emoji: "🥣" },
      { name: "清蒸鲈鱼套餐", price: 38, cal: 420, tag: "高蛋白", emoji: "🐟" },
      { name: "时蔬豆腐煲", price: 22, cal: 260, tag: "低脂", emoji: "🥬" },
      { name: "山药排骨汤", price: 28, cal: 320, tag: "养胃", emoji: "🍲" },
      { name: "紫薯小米饭", price: 8, cal: 180, tag: "粗粮", emoji: "🍚" },
      { name: "凉拌木耳", price: 10, cal: 80, tag: "降脂", emoji: "🥗" },
    ],
  },
  happy: {
    name: "幸福里养生驿站",
    address: "海淀区幸福里小区会所",
    open: "07:30 - 21:00",
    phone: "010-8888 5678",
    distance: "780米",
    isMine: false,
    services: [
      { name: "太极入门课（60分钟）", price: 0, desc: "零基础，免费体验", emoji: "🧘" },
      { name: "营养健康讲座", price: 0, desc: "每周三 10:00", emoji: "📖" },
      { name: "中式茶艺体验", price: 30, desc: "学一壶安神茶", emoji: "🍵" },
    ],
    menu: [
      { name: "南瓜小米粥", price: 10, cal: 220, tag: "养胃", emoji: "🥣" },
      { name: "白灼虾", price: 32, cal: 180, tag: "高蛋白", emoji: "🍤" },
      { name: "蒜蓉西兰花", price: 16, cal: 90, tag: "高纤", emoji: "🥦" },
    ],
  },
  central: {
    name: "蜻蜓中央旗舰驿站",
    address: "西城区金融街18号",
    open: "07:00 - 22:00",
    phone: "010-8888 9999",
    distance: "1.2公里",
    isMine: false,
    services: [
      { name: "全科健康体检", price: 580, desc: "20+项指标，含报告解读", emoji: "🏥" },
      { name: "营养餐厅自助", price: 68, desc: "营养师配餐，低盐低油", emoji: "🍽️" },
      { name: "康复理疗套餐", price: 268, desc: "理疗师一对一服务", emoji: "💆" },
      { name: "活动中心日卡", price: 20, desc: "瑜伽/书法/合唱团", emoji: "🎨" },
    ],
    menu: [
      { name: "营养师定制套餐 A", price: 68, cal: 520, tag: "均衡", emoji: "🍱" },
      { name: "营养师定制套餐 B", price: 78, cal: 480, tag: "控糖", emoji: "🥗" },
      { name: "降压养生套餐", price: 88, cal: 450, tag: "低钠", emoji: "🍵" },
    ],
  },
};

function StationDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const s = stationData[id];
  const [tab, setTab] = useState<"menu" | "service" | "review">("menu");

  if (!s) {
    return (
      <div className="mx-auto min-h-screen max-w-[480px] bg-gradient-bg p-8 text-center">
        <p className="text-base text-muted-foreground">驿站不存在</p>
        <Link to="/station" className="mt-4 inline-block text-primary underline">
          返回驿站列表
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-[480px] bg-gradient-bg pb-8">
      <header className="bg-gradient-primary px-5 pb-6 pt-12 text-primary-foreground">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate({ to: "/station" })}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <ShareButton
            variant="pill"
            label="分享驿站"
            title={s.name}
            desc={`${s.address} · ${s.open}`}
            className="bg-white/25 text-white"
          />
        </div>
        <h1 className="mt-3 text-2xl font-bold">{s.name}</h1>
        <p className="mt-1.5 flex items-center gap-1.5 text-sm opacity-90">
          <MapPin className="h-4 w-4" /> {s.address}
        </p>
        <p className="mt-1 flex items-center gap-1.5 text-sm opacity-90">
          <Clock className="h-4 w-4" /> {s.open} · 距您 {s.distance}
        </p>

        {s.isMine && s.balance !== undefined && (
          <div className="mt-4 flex items-center justify-between rounded-2xl bg-white/15 p-4 backdrop-blur-sm">
            <div>
              <p className="text-xs opacity-80">驿站余额</p>
              <p className="mt-0.5 text-2xl font-bold">¥ {s.balance}</p>
              <p className="text-xs opacity-80">{s.role} · 已到访 {s.visits} 次</p>
            </div>
            <button
              onClick={() => toast.success("充值成功 +¥100", { description: "微信支付 · 当前余额 ¥386" })}
              className="flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-bold text-primary shadow-soft active:scale-95"
            >
              <Wallet className="h-4 w-4" />
              充值
            </button>
          </div>
        )}

        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            onClick={() => toast.success(`正在拨打 ${s.phone}`, { description: "请准备好您的会员号方便登记" })}
            className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-white/20 text-base font-semibold text-white backdrop-blur-sm active:scale-[0.98]"
          >
            <Phone className="h-5 w-5" />
            联系驿站
          </button>
          <button
            onClick={() => toast(`导航前往 ${s.name}`, { description: `预计步行 ${s.distance}` })}
            className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-white text-base font-semibold text-primary shadow-soft active:scale-[0.98]"
          >
            <Navigation className="h-5 w-5" />
            导航前往
          </button>
        </div>
      </header>

      {/* 驿站 Banner · 专病营养餐 + 充值活动 */}
      <section className="px-5 pt-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-3 text-white shadow-card">
            <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-white/15" />
            <div className="relative">
              <p className="flex items-center gap-1 text-[11px] font-bold opacity-90">
                <Soup className="h-3.5 w-3.5" /> 专病营养餐
              </p>
              <p className="mt-1.5 text-sm font-bold leading-tight">控糖 / 低盐 / 高蛋白</p>
              <p className="mt-0.5 text-[11px] opacity-90">营养师定制 · 直送病房</p>
              <button
                onClick={() => toast.success("已为您打开专病营养餐菜单")}
                className="mt-2 rounded-full bg-white/25 px-2.5 py-1 text-[11px] font-bold backdrop-blur active:scale-95"
              >
                立即查看 ›
              </button>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 p-3 text-white shadow-card">
            <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-white/15" />
            <div className="relative">
              <p className="flex items-center gap-1 text-[11px] font-bold opacity-90">
                <Wallet className="h-3.5 w-3.5" /> 充值有礼
              </p>
              <p className="mt-1.5 text-sm font-bold leading-tight">充 500 送 100</p>
              <p className="mt-0.5 text-[11px] opacity-90">限时 · 服务 / 餐饮通用</p>
              <button
                onClick={() => toast.success("已为您打开充值页面", { description: "微信支付 · 立享 +¥100" })}
                className="mt-2 rounded-full bg-white/25 px-2.5 py-1 text-[11px] font-bold backdrop-blur active:scale-95"
              >
                马上充值 ›
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Tab */}
      <div className="px-5 pt-4">
        <div className="grid grid-cols-3 gap-1 rounded-2xl bg-card p-1.5 shadow-card">
          {(
            [
              { k: "menu", label: "今日菜单" },
              { k: "service", label: "服务预约" },
              { k: "review", label: "评价" },
            ] as const
          ).map((t) => (
            <button
              key={t.k}
              onClick={() => setTab(t.k)}
              className={cn(
                "rounded-xl py-2.5 text-sm font-bold transition-all",
                tab === t.k
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "text-muted-foreground",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* 菜单 */}
      {tab === "menu" && (
        <section className="space-y-3 px-5 pt-4">
          <p className="text-sm text-muted-foreground">
            👨‍🍳 由营养师定制 · 今日新鲜采购 · 支持外送或到店用餐
          </p>
          {s.menu.map((m) => (
            <article key={m.name} className="flex items-center gap-3 rounded-2xl bg-card p-4 shadow-card">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-muted text-3xl">
                {m.emoji}
              </div>
              <div className="flex-1">
                <p className="text-base font-bold text-foreground">{m.name}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{m.cal} 千卡 · {m.tag}</p>
                <p className="mt-1 text-base font-bold text-accent">¥ {m.price}</p>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => toast(`已加购：${m.name}`, { description: "可在购物车合并下单" })}
                  className="flex h-9 items-center gap-1 rounded-full bg-accent px-3 text-xs font-bold text-accent-foreground shadow-soft active:scale-95"
                >
                  <ShoppingCart className="h-3.5 w-3.5" />
                  外送
                </button>
                <button
                  onClick={() => toast(`已预订到店用餐`, { description: `${m.name} · 今日 12:00 取餐` })}
                  className="flex h-9 items-center gap-1 rounded-full border border-primary px-3 text-xs font-bold text-primary active:scale-95"
                >
                  <CalendarCheck className="h-3.5 w-3.5" />
                  到店
                </button>
              </div>
            </article>
          ))}
        </section>
      )}

      {/* 服务 */}
      {tab === "service" && (
        <section className="space-y-3 px-5 pt-4">
          <p className="text-sm text-muted-foreground">
            选择服务后可指定日期到店体验，预约结果会推送到消息中心。
          </p>
          {s.services.map((srv) => (
            <article key={srv.name} className="rounded-2xl bg-card p-4 shadow-card">
              <div className="flex items-start gap-3">
                <span className="text-3xl">{srv.emoji}</span>
                <div className="flex-1">
                  <p className="text-base font-bold text-foreground">{srv.name}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{srv.desc}</p>
                  <p className="mt-1 text-base font-bold text-accent">
                    {srv.price === 0 ? "免费体验" : `¥ ${srv.price}`}
                  </p>
                </div>
              </div>
              <button
                onClick={() =>
                  toast.success(`已预约：${srv.name}`, {
                    description: "已选明天 10:00 到店，提醒已加入消息中心",
                  })
                }
                className="mt-3 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-primary text-base font-bold text-primary-foreground shadow-soft active:scale-[0.98]"
              >
                <CalendarCheck className="h-5 w-5" />
                在线预约 · 选日期到店
              </button>
            </article>
          ))}
        </section>
      )}

      {/* 评价 */}
      {tab === "review" && (
        <section className="space-y-3 px-5 pt-4">
          {s.isMine ? (
            <>
              <button
                onClick={() => navigate({ to: "/me/records" })}
                className="flex w-full items-center gap-3 rounded-2xl bg-card p-4 shadow-card active:scale-[0.98]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/15 text-2xl">⭐</div>
                <div className="flex-1 text-left">
                  <p className="text-base font-bold text-foreground">写服务评价</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    上次：中医推拿 · 04-12 · 待评价
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </button>
              <button
                onClick={() => navigate({ to: "/me/records" })}
                className="flex w-full items-center gap-3 rounded-2xl bg-card p-4 shadow-card active:scale-[0.98]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/15 text-2xl">🍽️</div>
                <div className="flex-1 text-left">
                  <p className="text-base font-bold text-foreground">写用餐评价</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    上次：清蒸鲈鱼套餐 · 04-15 · 待评价
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </button>
            </>
          ) : null}

          <div className="rounded-2xl bg-card p-4 shadow-card">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 fill-warning text-warning" />
              <p className="text-base font-bold text-foreground">综合评分 4.9</p>
              <span className="text-sm text-muted-foreground">· 共 286 条评价</span>
            </div>
            <ul className="mt-3 space-y-3">
              {[
                { name: "李阿姨", txt: "推拿师傅手法很专业，腰不酸了，下次还来。", star: 5 },
                { name: "张大爷", txt: "驿站环境干净，午餐少油少盐，很合我口味。", star: 5 },
                { name: "陈奶奶", txt: "讲座内容实用，老师讲得通俗易懂。", star: 4 },
              ].map((r) => (
                <li key={r.name} className="border-t border-border pt-3 first:border-0 first:pt-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-foreground">{r.name}</span>
                    <span className="text-xs text-warning">{"★".repeat(r.star)}</span>
                  </div>
                  <p className="mt-1 text-sm text-foreground">{r.txt}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </div>
  );
}
