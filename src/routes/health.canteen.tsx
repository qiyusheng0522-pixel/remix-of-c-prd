import { createFileRoute } from "@tanstack/react-router";
import { UtensilsCrossed, MapPin, QrCode, Calendar, Sparkles, ShoppingBag } from "lucide-react";
import { ModulePage, Card, FeatureGrid } from "@/components/ModulePage";

export const Route = createFileRoute("/health/canteen")({
  head: () => ({ meta: [{ title: "智慧食堂 - 蜻蜓健康" }] }),
  component: Page,
});

const menu = [
  { name: "蒸鲈鱼 + 杂粮饭", tag: "糖友友好", kcal: 420, price: 18, hot: true },
  { name: "番茄牛腩 + 西兰花", tag: "高血压友好", kcal: 510, price: 22 },
  { name: "豆腐羹 + 软米饭", tag: "易咀嚼", kcal: 380, price: 15 },
  { name: "藜麦虾仁沙拉", tag: "低 GI", kcal: 360, price: 24 },
];

function Page() {
  return (
    <ModulePage
      title="智慧食堂"
      subtitle="社区食堂线上点餐 · 按健康档案智能配餐"
      gradient="from-amber-400 to-orange-500"
      Icon={UtensilsCrossed}
    >
      <Card>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
            <MapPin className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <p className="text-base font-bold">阳光社区中央厨房</p>
            <p className="text-xs text-muted-foreground">距您 320 米 · 营业中 · 11:00-13:30</p>
          </div>
          <span className="rounded-full bg-success/15 px-2 py-1 text-xs font-bold text-success">
            可预订
          </span>
        </div>
      </Card>

      <Card title="今日推荐 · 蜻蜓为您挑" desc="基于您的低盐+控糖偏好">
        <div className="space-y-3">
          {menu.map((m) => (
            <div key={m.name} className="flex items-center gap-3 rounded-xl bg-muted/40 p-3">
              <div className="h-14 w-14 rounded-lg bg-gradient-to-br from-orange-200 to-amber-300" />
              <div className="flex-1">
                <p className="font-semibold text-foreground">
                  {m.name}
                  {m.hot && <span className="ml-2 rounded bg-destructive/15 px-1.5 text-[10px] font-bold text-destructive">热销</span>}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {m.tag} · {m.kcal} kcal
                </p>
              </div>
              <div className="text-right">
                <p className="text-base font-bold text-primary">¥{m.price}</p>
                <button className="mt-1 rounded-full bg-primary px-3 py-1 text-xs font-bold text-white">加餐</button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <FeatureGrid
        items={[
          { icon: QrCode, label: "到店扫码取餐", desc: "出示二维码 30 秒取餐" },
          { icon: Calendar, label: "一周套餐预订", desc: "工作日午餐自动配" },
          { icon: Sparkles, label: "营养师远程评估", desc: "上传食堂菜单即评估" },
          { icon: ShoppingBag, label: "我的订单", to: "/me/orders" },
        ]}
      />

      <Card title="健康提醒">
        <p className="text-sm leading-relaxed text-muted-foreground">
          您今日已摄入 1180 kcal/盐 5.2g，建议晚餐控制在 600 kcal 以内，盐 ≤ 2g。
        </p>
      </Card>
    </ModulePage>
  );
}
