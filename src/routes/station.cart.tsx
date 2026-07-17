import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ShoppingCart, Minus, Plus, Trash2, MapPin, Clock, Phone } from "lucide-react";
import { toast } from "sonner";
import { StationSubPage, StationCard } from "@/components/StationSubPage";
import { useStationCart } from "@/lib/station-cart";

const pickupStation = {
  name: "阳光社区健康驿站",
  address: "朝阳区阳光花园小区南门",
  open: "08:00 - 20:00",
  phone: "010-8888 8888",
  distance: "320米",
};

export const Route = createFileRoute("/station/cart")({
  head: () => ({
    meta: [
      { title: "购物车 - 蜻蜓健康驿站" },
      { name: "description", content: "查看驿站营养餐购物车，一键下单，到店自提或外送。" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const cart = useStationCart();
  const navigate = useNavigate();

  const checkout = () => {
    toast.success("下单成功", {
      description: `共 ${cart.count} 件 · 请到 ${pickupStation.name} 自提`,
    });
    cart.clear();
    setTimeout(() => navigate({ to: "/station/pickup" }), 800);
  };

  return (
    <StationSubPage
      title="购物车"
      subtitle="驿站营养餐 · 到店自提 / 社区外送"
      Icon={ShoppingCart}
      gradient="from-emerald-500 to-teal-600"
    >
      {cart.items.length === 0 ? (
        <StationCard>
          <div className="flex flex-col items-center py-10 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted text-4xl">
              🛒
            </div>
            <p className="mt-4 text-lg font-bold text-foreground">购物车是空的</p>
            <p className="mt-1 text-sm text-muted-foreground">去营养餐看看今天有什么好吃的吧</p>
            <button
              onClick={() => navigate({ to: "/station/meals" })}
              className="mt-5 min-h-[52px] rounded-2xl bg-primary px-6 text-base font-bold text-primary-foreground shadow-soft active:scale-95"
            >
              去点餐
            </button>
          </div>
        </StationCard>
      ) : (
        <>
          <div className="rounded-2xl bg-primary-soft p-4 shadow-card">
            <div className="flex items-center gap-2 text-primary">
              <MapPin className="h-5 w-5" />
              <p className="text-sm font-bold">自提驿站</p>
              <span className="ml-auto rounded-full bg-white px-2 py-0.5 text-xs font-bold text-primary">
                {pickupStation.distance}
              </span>
            </div>
            <p className="mt-2 text-lg font-bold text-foreground">{pickupStation.name}</p>
            <p className="mt-1 text-sm text-muted-foreground">{pickupStation.address}</p>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                营业 {pickupStation.open}
              </span>
              <a
                href={`tel:${pickupStation.phone.replace(/\s/g, "")}`}
                className="inline-flex items-center gap-1 text-primary"
              >
                <Phone className="h-3.5 w-3.5" />
                {pickupStation.phone}
              </a>
            </div>
          </div>

          <div className="space-y-3">
            {cart.items.map((it) => (
              <article
                key={it.id}
                className="flex items-center gap-3 rounded-2xl bg-card p-4 shadow-card"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-muted text-3xl">
                  {it.emoji ?? "🍱"}
                </div>
                <div className="flex-1">
                  <p className="text-base font-bold text-foreground">{it.name}</p>
                  {it.tag && (
                    <p className="mt-0.5 text-xs text-muted-foreground">{it.tag}</p>
                  )}
                  <p className="mt-1 text-base font-bold text-accent">¥ {it.price}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <button
                    onClick={() => cart.remove(it.id)}
                    aria-label="删除"
                    className="text-muted-foreground active:text-destructive"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => cart.setQty(it.id, it.qty - 1)}
                      className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-muted text-foreground active:scale-95"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="min-w-[24px] text-center text-base font-bold">
                      {it.qty}
                    </span>
                    <button
                      onClick={() => cart.setQty(it.id, it.qty + 1)}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-soft active:scale-95"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="sticky bottom-24 mt-4 flex items-center gap-3 rounded-2xl bg-card p-4 shadow-elevated">
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">合计（{cart.count} 件）</p>
              <p className="text-2xl font-bold text-accent">¥ {cart.total}</p>
            </div>
            <button
              onClick={checkout}
              className="flex min-h-[56px] items-center justify-center rounded-2xl bg-gradient-primary px-8 text-base font-bold text-primary-foreground shadow-elevated active:scale-[0.98]"
            >
              去结算
            </button>
          </div>
        </>
      )}
    </StationSubPage>
  );
}