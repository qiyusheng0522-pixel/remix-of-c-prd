import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  FileText,
  ChevronRight,
  FileHeart,
  ShoppingBag,
  Calendar,
  Watch,
  Settings,
  HelpCircle,
  Gift,
  Users,
  ClipboardList,
  HeartHandshake,
  Stethoscope,
  Pill,
  ClipboardCheck,
  User,
  Crown,
  X,
} from "lucide-react";
import { MobileLayout } from "@/components/MobileLayout";

export const Route = createFileRoute("/me/")({
  head: () => ({
    meta: [
      { title: "我的 - 蜻蜓健康" },
      { name: "description", content: "管理我的健康档案、活动和服务。" },
    ],
  }),
  component: MePage,
});

const services = [
  { icon: FileHeart, label: "健康档案", color: "text-primary", bg: "bg-primary-soft", to: "/health/records" as const },
  { icon: FileText, label: "我的报告", color: "text-primary", bg: "bg-primary-soft", to: "/me/reports" as const },
  { icon: Stethoscope, label: "医护团队", color: "text-destructive", bg: "bg-destructive/10", to: "/me/team" as const },
  { icon: Pill, label: "处方用药", color: "text-success", bg: "bg-success/10", to: "/me/prescriptions" as const },
  { icon: ClipboardCheck, label: "我的量表", color: "text-accent", bg: "bg-accent-soft", to: "/me/scales" as const },
  { icon: HeartHandshake, label: "家庭代管", color: "text-destructive", bg: "bg-destructive/10", to: "/me/family" as const },
  { icon: ClipboardList, label: "服务记录", color: "text-accent", bg: "bg-accent-soft", to: "/me/records" as const },
  { icon: Calendar, label: "我的活动", color: "text-success", bg: "bg-success/10", to: "/circle/activities" as const },
  { icon: Users, label: "我的驿站", color: "text-primary", bg: "bg-primary-soft", to: "/station" as const },
  { icon: Watch, label: "智能设备", color: "text-accent", bg: "bg-accent-soft", to: "/me/devices" as const },
  { icon: ShoppingBag, label: "我的订单", color: "text-warning", bg: "bg-warning/10", to: "/me/orders" as const },
  { icon: Gift, label: "积分商城", color: "text-accent", bg: "bg-accent-soft", to: "/me/points" as const },
];

const settings = [
  { icon: Settings, label: "账号与安全", to: "/me/settings" as const },
  { icon: HelpCircle, label: "帮助与反馈", to: "/me/help" as const },
];

function MePage() {
  const [vipOpen, setVipOpen] = useState(false);
  return (
    <MobileLayout>
      <header className="bg-gradient-primary px-5 pb-16 pt-12 text-primary-foreground">
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white/30 bg-white text-primary">
            <User className="h-10 w-10" strokeWidth={1.8} />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">王秀英</h1>
            <p className="mt-1 text-base opacity-90">68岁 · 阳光社区</p>
            <button
              onClick={() => setVipOpen(true)}
              className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-sm font-semibold backdrop-blur-sm active:scale-95"
            >
              <Crown className="h-3.5 w-3.5" /> 金牌会员 · 查看权益 ›
            </button>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 divide-x divide-white/20 rounded-2xl bg-white/15 py-4 backdrop-blur-sm">
          <div className="text-center">
            <div className="text-2xl font-bold">¥328.50</div>
            <div className="mt-0.5 text-sm opacity-90">账户余额</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">2680</div>
            <div className="mt-0.5 text-sm opacity-90">积分</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">15</div>
            <div className="mt-0.5 text-sm opacity-90">活动</div>
          </div>
        </div>
      </header>

      <section className="-mt-8 px-5">
        <div className="rounded-2xl bg-card p-5 shadow-card">
          <h2 className="mb-4 text-lg font-bold">常用服务</h2>
          <div className="grid grid-cols-4 gap-3">
            {services.map((s) => {
              const Icon = s.icon;
              return (
                <Link
                  key={s.label}
                  to={s.to}
                  className="flex flex-col items-center gap-2 rounded-xl py-2 transition-colors hover:bg-muted"
                >
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${s.bg}`}>
                    <Icon className={`h-7 w-7 ${s.color}`} strokeWidth={2} />
                  </div>
                  <span className="text-sm font-medium text-foreground">{s.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>


      <section className="mt-4 px-5">
        <div className="overflow-hidden rounded-2xl bg-card shadow-card">
          {settings.map((item, i) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                to={item.to}
                className={`flex w-full items-center gap-3 px-5 py-5 text-left transition-colors hover:bg-muted ${
                  i !== settings.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <Icon className="h-6 w-6 text-muted-foreground" />
                <span className="flex-1 text-base font-medium text-foreground">{item.label}</span>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </Link>
            );
          })}
        </div>
      </section>

      {/* 金牌会员权益弹窗 */}
      {vipOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setVipOpen(false)}
        >
          <div
            className="w-full max-w-[480px] rounded-t-3xl bg-card pb-8 shadow-elevated"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative rounded-t-3xl bg-gradient-to-br from-[oklch(0.7_0.15_70)] to-[oklch(0.6_0.18_30)] px-5 pb-6 pt-5 text-white">
              <button
                onClick={() => setVipOpen(false)}
                aria-label="关闭"
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/20"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-2">
                <Crown className="h-6 w-6" />
                <p className="text-lg font-bold">金牌会员 · 专享权益</p>
              </div>
              <p className="mt-1 text-xs opacity-90">有效期至 2026-12-31 · 已享 32 项权益</p>
            </div>

            <div className="grid grid-cols-2 gap-3 p-5">
              {[
                { icon: "🏥", name: "驿站体检", desc: "每年 2 次免费基础体检" },
                { icon: "📄", name: "报告解读", desc: "三甲医生 24h 内一对一" },
                { icon: "🍲", name: "营养餐", desc: "专病配餐 8 折 · 月省 ¥120" },
                { icon: "🍵", name: "养生茶水", desc: "驿站自助茶水免费续杯" },
                { icon: "🧘", name: "课程畅享", desc: "太极 / 八段锦 / 健康讲座" },
                { icon: "💊", name: "用药提醒", desc: "智能药盒 + 健管师巡查" },
                { icon: "🚑", name: "陪诊预约", desc: "每季 1 次免费半日陪诊" },
                { icon: "🎁", name: "积分加倍", desc: "打卡 / 消费积分 2 倍" },
              ].map((b) => (
                <div key={b.name} className="rounded-2xl bg-muted/50 p-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{b.icon}</span>
                    <p className="text-sm font-bold text-foreground">{b.name}</p>
                  </div>
                  <p className="mt-1 text-xs leading-snug text-muted-foreground">{b.desc}</p>
                </div>
              ))}
            </div>

            <div className="px-5">
              <Link
                to="/me/points"
                onClick={() => setVipOpen(false)}
                className="flex min-h-[48px] w-full items-center justify-center rounded-2xl bg-gradient-to-r from-[oklch(0.7_0.15_70)] to-[oklch(0.6_0.18_30)] text-base font-bold text-white shadow-elevated active:scale-[0.99]"
              >
                查看全部权益 ›
              </Link>
            </div>
          </div>
        </div>
      )}
    </MobileLayout>
  );
}
