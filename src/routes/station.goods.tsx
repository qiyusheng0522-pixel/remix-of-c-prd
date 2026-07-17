import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ShoppingBag, Search, Package, Truck } from "lucide-react";
import { toast } from "sonner";
import { StationSubPage, StationCard } from "@/components/StationSubPage";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/station/goods")({
  head: () => ({
    meta: [
      { title: "健康商品 - 蜻蜓健康" },
      { name: "description", content: "血压计、血糖仪、保健品驿站自提，医疗器械正品直邮。" },
    ],
  }),
  component: GoodsPage,
});

const cats = ["全部", "血压计", "血糖仪", "保健品", "康复辅具", "家用理疗"];

const goods = [
  { cat: "血压计", name: "欧姆龙上臂式血压计 U30", price: 399, tag: "驿站自提", emoji: "🩺", stock: "现货" },
  { cat: "血糖仪", name: "罗氏卓越型血糖仪 + 50 试纸", price: 288, tag: "医保刷卡", emoji: "🩸", stock: "现货" },
  { cat: "保健品", name: "汤臣倍健蛋白粉 900g", price: 328, tag: "营养师推荐", emoji: "🥛", stock: "现货" },
  { cat: "保健品", name: "钙镁锌复合片 200 粒", price: 158, tag: "老年友好", emoji: "💊", stock: "现货" },
  { cat: "康复辅具", name: "适老助行器 · 可折叠", price: 268, tag: "包安装", emoji: "🦯", stock: "补货中" },
  { cat: "家用理疗", name: "远红外颈椎按摩仪", price: 499, tag: "以旧换新", emoji: "💆", stock: "现货" },
];

function GoodsPage() {
  const [cat, setCat] = useState("全部");
  const list = cat === "全部" ? goods : goods.filter((g) => g.cat === cat);

  return (
    <StationSubPage
      title="健康商品"
      subtitle="正品直邮 · 驿站自提 · 支持医保刷卡"
      Icon={ShoppingBag}
      gradient="from-amber-500 to-orange-600"
    >
      <StationCard>
        <div className="flex items-center gap-2 rounded-2xl bg-muted/60 px-4 py-3">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input
            placeholder="搜索商品，如：血压计"
            className="flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
          />
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 rounded-xl bg-primary-soft p-3">
            <Truck className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-bold text-foreground">送货上门</p>
              <p className="text-xs text-muted-foreground">24 小时达</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-accent-soft p-3">
            <Package className="h-5 w-5 text-accent" />
            <div>
              <p className="text-sm font-bold text-foreground">驿站自提</p>
              <p className="text-xs text-muted-foreground">节省 ¥8</p>
            </div>
          </div>
        </div>
      </StationCard>

      <div className="-mx-5 overflow-x-auto px-5">
        <div className="flex gap-2 pb-1">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-sm font-bold transition",
                cat === c
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "bg-card text-muted-foreground",
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {list.map((g) => (
          <article key={g.name} className="flex items-center gap-3 rounded-2xl bg-card p-4 shadow-card">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-muted text-4xl">
              {g.emoji}
            </div>
            <div className="flex-1">
              <p className="text-base font-bold text-foreground">{g.name}</p>
              <p className="mt-1 inline-block rounded bg-primary-soft px-1.5 py-0.5 text-xs font-bold text-primary">
                {g.tag}
              </p>
              <div className="mt-1 flex items-baseline gap-2">
                <p className="text-lg font-bold text-accent">¥ {g.price}</p>
                <span className="text-xs text-muted-foreground">{g.stock}</span>
              </div>
            </div>
            <button
              onClick={() =>
                toast.success(`已下单：${g.name}`, {
                  description: "48 小时内送达驿站，凭取件码自提",
                })
              }
              className="flex h-11 items-center justify-center rounded-full bg-primary px-4 text-sm font-bold text-primary-foreground shadow-soft active:scale-95"
            >
              购买
            </button>
          </article>
        ))}
      </div>
    </StationSubPage>
  );
}