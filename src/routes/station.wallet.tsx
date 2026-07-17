import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Wallet, Gift, CreditCard, Clock } from "lucide-react";
import { toast } from "sonner";
import { StationSubPage, StationCard } from "@/components/StationSubPage";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/station/wallet")({
  head: () => ({
    meta: [
      { title: "驿站钱包充值 - 蜻蜓健康" },
      { name: "description", content: "驿站钱包充值：营养餐、健康服务、健康商品通用。" },
    ],
  }),
  component: WalletPage,
});

const amounts = [
  { v: 100, bonus: 0 },
  { v: 200, bonus: 10 },
  { v: 500, bonus: 100, hot: true },
  { v: 1000, bonus: 250 },
  { v: 2000, bonus: 600 },
  { v: 5000, bonus: 1800 },
];

const history = [
  { d: "04-16", t: "中医推拿", v: -88 },
  { d: "04-15", t: "清蒸鲈鱼套餐", v: -38 },
  { d: "04-12", t: "钱包充值", v: 500 },
  { d: "04-08", t: "健康检测", v: -30 },
];

function WalletPage() {
  const [amt, setAmt] = useState(500);
  const [pay, setPay] = useState<"wechat" | "alipay">("wechat");
  const navigate = useNavigate();
  const bonus = amounts.find((a) => a.v === amt)?.bonus ?? 0;

  return (
    <StationSubPage
      title="钱包充值"
      subtitle="服务 / 餐饮 / 商品通用 · 充值即享赠额"
      Icon={Wallet}
      gradient="from-primary to-cyan-600"
    >
      <StationCard>
        <p className="text-sm text-muted-foreground">当前余额</p>
        <p className="mt-1 text-4xl font-bold text-primary">¥ 286</p>
        <p className="mt-1 text-xs text-muted-foreground">含赠额 ¥42 · 有效期至 2027-12-31</p>
      </StationCard>

      <StationCard title="选择充值金额" desc="充得越多，赠得越多">
        <div className="grid grid-cols-2 gap-3">
          {amounts.map((a) => {
            const active = amt === a.v;
            return (
              <button
                key={a.v}
                onClick={() => setAmt(a.v)}
                className={cn(
                  "relative rounded-2xl border-2 p-4 text-left transition active:scale-[0.98]",
                  active
                    ? "border-primary bg-primary-soft"
                    : "border-transparent bg-muted/50",
                )}
              >
                {a.hot && (
                  <span className="absolute -right-1 -top-1 rounded-full bg-destructive px-2 py-0.5 text-[10px] font-bold text-white">
                    最划算
                  </span>
                )}
                <p className="text-2xl font-bold text-foreground">¥ {a.v}</p>
                <p className="mt-1 flex items-center gap-1 text-xs font-bold text-accent">
                  <Gift className="h-3.5 w-3.5" />
                  {a.bonus > 0 ? `送 ¥${a.bonus}` : "无赠额"}
                </p>
              </button>
            );
          })}
        </div>
      </StationCard>

      <StationCard title="支付方式">
        <div className="space-y-2">
          {[
            { k: "wechat" as const, label: "微信支付", desc: "推荐 · 已绑定" },
            { k: "alipay" as const, label: "支付宝", desc: "使用花呗可分期" },
          ].map((p) => {
            const active = pay === p.k;
            return (
              <button
                key={p.k}
                onClick={() => setPay(p.k)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-2xl border-2 p-3 text-left active:scale-[0.99]",
                  active ? "border-primary bg-primary-soft" : "border-transparent bg-muted/50",
                )}
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-primary">
                  <CreditCard className="h-5 w-5" />
                </span>
                <div className="flex-1">
                  <p className="text-base font-bold">{p.label}</p>
                  <p className="text-xs text-muted-foreground">{p.desc}</p>
                </div>
                <span
                  className={cn(
                    "h-5 w-5 rounded-full border-2",
                    active ? "border-primary bg-primary" : "border-muted-foreground/40",
                  )}
                />
              </button>
            );
          })}
        </div>
      </StationCard>

      <StationCard title="最近流水">
        <ul className="space-y-3">
          {history.map((h, i) => (
            <li key={i} className="flex items-center gap-3 border-t border-border pt-3 first:border-0 first:pt-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                <Clock className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-foreground">{h.t}</p>
                <p className="text-xs text-muted-foreground">{h.d}</p>
              </div>
              <p
                className={cn(
                  "text-base font-bold",
                  h.v > 0 ? "text-success" : "text-foreground",
                )}
              >
                {h.v > 0 ? "+" : ""}
                {h.v}
              </p>
            </li>
          ))}
        </ul>
      </StationCard>

      <div className="sticky bottom-24 mt-4">
        <button
          onClick={() => {
            toast.success(`充值成功 +¥${amt}${bonus ? ` 送 ¥${bonus}` : ""}`, {
              description: `${pay === "wechat" ? "微信" : "支付宝"}支付 · 已到账`,
            });
            setTimeout(() => navigate({ to: "/station" }), 600);
          }}
          className="flex min-h-[56px] w-full items-center justify-center rounded-2xl bg-gradient-primary text-lg font-bold text-primary-foreground shadow-elevated active:scale-[0.98]"
        >
          确认支付 ¥ {amt}
          {bonus > 0 && <span className="ml-2 text-sm opacity-90">送 ¥{bonus}</span>}
        </button>
      </div>
    </StationSubPage>
  );
}