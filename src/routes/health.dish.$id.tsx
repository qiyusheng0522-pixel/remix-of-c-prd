import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, Play, Clock, Flame, Heart, ShoppingCart, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { MobileLayout } from "@/components/MobileLayout";

export const Route = createFileRoute("/health/dish/$id")({
  head: () => ({
    meta: [
      { title: "菜品详情 - 蜻蜓健康" },
      { name: "description", content: "查看做法步骤、营养成分与教学视频。" },
    ],
  }),
  component: DishPage,
});

type Dish = {
  name: string;
  emoji: string;
  calories: number;
  tag: string;
  hasVideo: boolean;
  videoMin?: string;
  cookTime: string;
  difficulty: string;
  ingredients: string[];
  steps: string[];
  nutrition: { label: string; value: string }[];
  tips: string;
};

const dishes: Record<string, Dish> = {
  oatmeal: {
    name: "燕麦牛奶粥", emoji: "🥣", calories: 180, tag: "高纤维", hasVideo: true, videoMin: "03:42",
    cookTime: "10 分钟", difficulty: "简单",
    ingredients: ["燕麦片 40g", "脱脂牛奶 200ml", "蜂蜜 5g", "蓝莓少许"],
    steps: ["牛奶倒入小锅煮至微沸", "加入燕麦片小火煮 5 分钟", "盛入碗中淋蜂蜜,撒蓝莓"],
    nutrition: [{ label: "蛋白质", value: "8g" }, { label: "膳食纤维", value: "4g" }, { label: "钙", value: "240mg" }],
    tips: "糖尿病人可不加蜂蜜,改用 1-2 颗代糖。",
  },
  egg: {
    name: "水煮蛋", emoji: "🥚", calories: 80, tag: "高蛋白", hasVideo: false,
    cookTime: "8 分钟", difficulty: "简单",
    ingredients: ["鸡蛋 1 个"],
    steps: ["鸡蛋冷水下锅", "水开后中火煮 7 分钟", "捞出冷水浸泡 1 分钟即可剥壳"],
    nutrition: [{ label: "蛋白质", value: "6g" }, { label: "脂肪", value: "5g" }, { label: "胆固醇", value: "186mg" }],
    tips: "高血脂人群每周建议 3-4 个全蛋。",
  },
  rice: {
    name: "杂粮饭", emoji: "🍚", calories: 200, tag: "控糖", hasVideo: true, videoMin: "05:18",
    cookTime: "40 分钟", difficulty: "简单",
    ingredients: ["糙米 30g", "黑米 20g", "燕麦米 20g", "藜麦 10g"],
    steps: ["杂粮淘洗后浸泡 1 小时", "按 1:1.3 加水", "电饭煲杂粮饭模式即可"],
    nutrition: [{ label: "碳水", value: "42g" }, { label: "膳食纤维", value: "5g" }, { label: "GI 值", value: "55" }],
    tips: "推荐糖尿病人替代白米饭,GI 值更低。",
  },
  salmon: {
    name: "清蒸三文鱼", emoji: "🐟", calories: 220, tag: "Omega-3", hasVideo: true, videoMin: "06:24",
    cookTime: "15 分钟", difficulty: "中等",
    ingredients: ["三文鱼 100g", "姜丝 3g", "葱花 5g", "蒸鱼豉油 5ml"],
    steps: ["三文鱼擦干表面水分", "铺姜丝大火蒸 6-8 分钟", "撒葱花淋少许豉油"],
    nutrition: [{ label: "蛋白质", value: "22g" }, { label: "Omega-3", value: "1.8g" }, { label: "维生素 D", value: "11μg" }],
    tips: "心脑血管慢病人群每周建议 2-3 次深海鱼。",
  },
};

function DishPage() {
  const navigate = useNavigate();
  const { id } = useParams({ from: "/health/dish/$id" });
  const dish = dishes[id] ?? dishes.oatmeal;

  const goBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      window.history.back();
    } else {
      navigate({ to: "/health/plan" });
    }
  };

  return (
    <MobileLayout>
      <header className="flex items-center gap-3 bg-card px-5 pb-4 pt-12 shadow-soft">
        <button
          onClick={goBack}
          className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted active:scale-95"
          aria-label="返回上一步"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="flex-1 text-lg font-bold">菜品详情</h1>
        <button
          onClick={() => toast("已收藏到我的菜谱")}
          className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted"
          aria-label="收藏"
        >
          <Heart className="h-5 w-5" />
        </button>
      </header>

      {/* 视频 / 静态图 */}
      {dish.hasVideo ? (
        <button
          onClick={() => toast.success(`正在播放《${dish.name}》教学`, { description: `时长 ${dish.videoMin}` })}
          className="relative mt-4 mx-5 flex aspect-video w-[calc(100%-40px)] items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-orange-300 to-rose-400 shadow-elevated"
        >
          <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-black/40 px-2 py-1 text-xs font-bold text-white backdrop-blur-sm">
            <Play className="h-3 w-3 fill-white" /> 教学视频 · {dish.videoMin}
          </span>
          <span className="text-7xl">{dish.emoji}</span>
          <Play className="absolute h-16 w-16 fill-white/90 text-white drop-shadow-lg" />
        </button>
      ) : (
        <div className="mt-4 mx-5 flex aspect-video items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-200 to-teal-200">
          <div className="text-center">
            <span className="text-7xl">{dish.emoji}</span>
            <p className="mt-2 flex items-center justify-center gap-1 text-xs font-semibold text-muted-foreground">
              <BookOpen className="h-3.5 w-3.5" /> 图文菜谱(暂无视频教学)
            </p>
          </div>
        </div>
      )}

      <section className="mt-4 px-5">
        <div className="rounded-2xl bg-card p-4 shadow-card">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">{dish.name}</h2>
            <span className="rounded-full bg-success/15 px-2.5 py-1 text-xs font-bold text-success">
              {dish.tag}
            </span>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-xl bg-muted p-2">
              <Flame className="mx-auto h-4 w-4 text-accent" />
              <p className="mt-1 text-base font-bold">{dish.calories}</p>
              <p className="text-[10px] text-muted-foreground">千卡</p>
            </div>
            <div className="rounded-xl bg-muted p-2">
              <Clock className="mx-auto h-4 w-4 text-primary" />
              <p className="mt-1 text-sm font-bold">{dish.cookTime}</p>
              <p className="text-[10px] text-muted-foreground">耗时</p>
            </div>
            <div className="rounded-xl bg-muted p-2">
              <span className="text-base">⭐</span>
              <p className="mt-1 text-sm font-bold">{dish.difficulty}</p>
              <p className="text-[10px] text-muted-foreground">难度</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-4 px-5">
        <div className="rounded-2xl bg-card p-4 shadow-card">
          <h3 className="text-base font-bold">🥬 食材清单</h3>
          <ul className="mt-2 grid grid-cols-2 gap-1.5 text-sm">
            {dish.ingredients.map((i) => (
              <li key={i} className="text-muted-foreground">· {i}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-4 px-5">
        <div className="rounded-2xl bg-card p-4 shadow-card">
          <h3 className="text-base font-bold">👩‍🍳 做法步骤</h3>
          <ol className="mt-2 space-y-2">
            {dish.steps.map((s, i) => (
              <li key={s} className="flex gap-2 text-sm text-foreground">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{s}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mt-4 px-5">
        <div className="rounded-2xl bg-card p-4 shadow-card">
          <h3 className="text-base font-bold">📊 营养成分</h3>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {dish.nutrition.map((n) => (
              <div key={n.label} className="rounded-xl bg-success/10 p-2 text-center">
                <p className="text-base font-bold text-success">{n.value}</p>
                <p className="text-[10px] text-muted-foreground">{n.label}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 rounded-xl bg-warning/10 p-2 text-xs text-warning">
            💡 {dish.tips}
          </p>
        </div>
      </section>

      <section className="mt-4 px-5">
        <button
          onClick={() => toast.success("食材已加入购物车", { description: "可在「一键购买」选择配送方式" })}
          className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-primary text-base font-bold text-primary-foreground shadow-soft active:scale-[0.98]"
        >
          <ShoppingCart className="h-5 w-5" />
          一键购买食材包
        </button>
      </section>
    </MobileLayout>
  );
}
