import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Package, Truck, CheckCircle2, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { MobileLayout } from "@/components/MobileLayout";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/me/orders")({
  head: () => ({
    meta: [
      { title: "我的订单 - 蜻蜓健康" },
      { name: "description", content: "查看您在驿站和商城的订单记录。" },
    ],
  }),
  component: OrdersPage,
});

type Order = {
  id: string;
  title: string;
  desc: string;
  amount: number;
  date: string;
  status: "待付款" | "待发货" | "待收货" | "已完成";
  emoji: string;
};

const orders: Order[] = [
  { id: "20260417-01", title: "驿站营养午餐 · 控糖套餐", desc: "阳光社区驿站 · 到店取餐", amount: 28, date: "今天 11:30", status: "待付款", emoji: "🍱" },
  { id: "20260416-03", title: "蜻蜓健康手表 Pro", desc: "顺丰快递 SF1234567890", amount: 1280, date: "昨天 14:22", status: "待发货", emoji: "⌚" },
  { id: "20260415-07", title: "推拿理疗 60 分钟 ×2", desc: "中央旗舰驿站 · 服务卡", amount: 360, date: "4 月 15 日", status: "待收货", emoji: "💆" },
  { id: "20260410-02", title: "葡萄籽胶囊 ×3 瓶", desc: "已签收", amount: 458, date: "4 月 10 日", status: "已完成", emoji: "💊" },
  { id: "20260405-01", title: "驿站营养晚餐 ×7", desc: "周套餐 · 已使用 7 次", amount: 196, date: "4 月 5 日", status: "已完成", emoji: "🥗" },
];

const tabs = ["全部", "待付款", "待发货", "待收货", "已完成"] as const;

function OrdersPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<(typeof tabs)[number]>("全部");
  const list = tab === "全部" ? orders : orders.filter((o) => o.status === tab);

  return (
    <MobileLayout>
      <header className="flex items-center gap-3 bg-card px-5 pb-4 pt-12 shadow-soft">
        <button
          onClick={() => navigate({ to: "/me" })}
          className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted"
          aria-label="返回"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-bold">我的订单</h1>
      </header>

      <div className="sticky top-0 z-10 flex gap-1 overflow-x-auto bg-card px-3 py-3 shadow-soft">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors",
              tab === t ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <section className="space-y-3 px-5 py-4">
        {list.length === 0 && (
          <div className="rounded-2xl bg-card p-10 text-center shadow-card">
            <Package className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-3 text-base text-muted-foreground">暂无{tab}订单</p>
          </div>
        )}

        {list.map((o) => (
          <article
            key={o.id}
            role="button"
            tabIndex={0}
            onClick={() =>
              toast(`订单 ${o.id}`, {
                description: `${o.title} · ${o.status} · ¥${o.amount}`,
              })
            }
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toast(`订单 ${o.id}`, {
                  description: `${o.title} · ${o.status} · ¥${o.amount}`,
                });
              }
            }}
            className="cursor-pointer rounded-2xl bg-card p-4 shadow-card transition-transform active:scale-[0.99]"
          >
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>订单号 {o.id}</span>
              <span
                className={cn(
                  "rounded-full px-2.5 py-0.5 text-xs font-bold",
                  o.status === "待付款" && "bg-warning/15 text-warning",
                  o.status === "待发货" && "bg-primary-soft text-primary",
                  o.status === "待收货" && "bg-accent-soft text-accent",
                  o.status === "已完成" && "bg-muted text-muted-foreground",
                )}
              >
                {o.status}
              </span>
            </div>

            <div className="mt-3 flex gap-3">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-muted text-3xl">
                {o.emoji}
              </div>
              <div className="flex-1">
                <h2 className="text-base font-bold leading-tight">{o.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{o.desc}</p>
                <div className="mt-1.5 flex items-end justify-between">
                  <span className="text-xs text-muted-foreground">{o.date}</span>
                  <span className="text-lg font-bold text-foreground">¥{o.amount}</span>
                </div>
              </div>
            </div>

            <div className="mt-3 flex justify-end gap-2">
              {o.status === "待付款" && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toast("订单已取消");
                    }}
                    className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-muted-foreground active:scale-95"
                  >
                    取消订单
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toast.success("支付成功", { description: `已扣款 ¥${o.amount}` });
                    }}
                    className="rounded-full bg-primary px-5 py-2 text-sm font-bold text-primary-foreground active:scale-95"
                  >
                    去付款
                  </button>
                </>
              )}
              {o.status === "待发货" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toast("商家催发已提交", { description: "客服将在 2 小时内联系您" });
                  }}
                  className="flex items-center gap-1 rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground active:scale-95"
                >
                  <Truck className="h-4 w-4" /> 提醒发货
                </button>
              )}
              {o.status === "待收货" && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toast("查看物流", { description: "顺丰 · 派送中，预计今晚 18:00 到达" });
                    }}
                    className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-muted-foreground active:scale-95"
                  >
                    查看物流
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toast.success("收货确认成功", { description: "+10 健康积分" });
                    }}
                    className="flex items-center gap-1 rounded-full bg-success px-4 py-2 text-sm font-bold text-white active:scale-95"
                  >
                    <CheckCircle2 className="h-4 w-4" /> 确认收货
                  </button>
                </>
              )}
              {o.status === "已完成" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toast("已加入购物车");
                  }}
                  className="flex items-center gap-1 rounded-full border border-border px-4 py-2 text-sm font-semibold text-muted-foreground active:scale-95"
                >
                  <RotateCcw className="h-4 w-4" /> 再来一单
                </button>
              )}
            </div>
          </article>
        ))}
      </section>
    </MobileLayout>
  );
}
