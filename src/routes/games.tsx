import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Brain, Puzzle, Dices, Sparkles, Gamepad2, Music, Calculator, BookOpen, Shapes, Hand, Trophy } from "lucide-react";
import { MobileLayout } from "@/components/MobileLayout";
import { toast } from "sonner";

export const Route = createFileRoute("/games")({
  head: () => ({ meta: [{ title: "防痴呆小游戏 - 蜻蜓健康" }] }),
  component: GamesPage,
});

const recommended = [
  { icon: Brain, name: "记忆翻牌", desc: "短期记忆训练 · 延缓记忆衰退", bg: "from-rose-400 to-pink-500", level: "防痴呆" },
  { icon: Puzzle, name: "成语填字", desc: "唤起长期记忆 · 语言中枢激活", bg: "from-emerald-400 to-teal-500", level: "防痴呆" },
  { icon: Calculator, name: "心算闯关", desc: "数字运算 · 锻炼前额叶反应力", bg: "from-sky-400 to-indigo-500", level: "防痴呆" },
  { icon: Sparkles, name: "找不同", desc: "训练专注力与视觉辨识能力", bg: "from-amber-400 to-orange-500", level: "防痴呆" },
  { icon: Music, name: "老歌猜猜看", desc: "音乐记忆唤醒 · 听 5 秒猜歌名", bg: "from-violet-400 to-purple-500", level: "防痴呆" },
  { icon: Shapes, name: "图形配对", desc: "空间辨识训练 · 防认知衰退", bg: "from-green-400 to-emerald-500", level: "防痴呆" },
  { icon: BookOpen, name: "回忆往事", desc: "怀旧疗法 · 老照片讲故事", bg: "from-orange-400 to-rose-500", level: "防痴呆" },
  { icon: Hand, name: "手指操跟练", desc: "手脑协调 · 每日 5 分钟", bg: "from-cyan-400 to-blue-500", level: "防痴呆" },
];

function GamesPage() {
  return (
    <MobileLayout>
      <header className="sticky top-0 z-30 flex items-center gap-2 border-b border-border bg-card/95 px-4 py-3 backdrop-blur">
        <Link to="/" className="-m-2 p-2">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-lg font-bold">解闷小游戏</h1>
      </header>

      <section className="px-4 pt-4">
        <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-violet-600 p-4 text-white shadow-elevated">
          <Brain className="h-10 w-10" />
          <div className="flex-1">
            <p className="text-base font-bold">防痴呆训练 · 适合长辈</p>
            <p className="text-xs opacity-90">每日 10 分钟，刺激大脑 · 延缓认知衰退</p>
          </div>
          <span className="rounded-full bg-white/25 px-3 py-1 text-xs font-bold">{recommended.length} 款</span>
        </div>
      </section>

      <section className="px-4 py-4">
        <div className="grid grid-cols-2 gap-3">
          {recommended.map((g) => {
            const I = g.icon;
            return (
              <button
                key={g.name}
                onClick={() => toast.success(`正在为您打开「${g.name}」`, { description: "演示态：小游戏将上线" })}
                className="flex flex-col rounded-2xl bg-card p-3 text-left shadow-card active:scale-[0.98]"
              >
                <div className="flex items-center justify-between">
                  <span className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${g.bg} text-white`}>
                    <I className="h-6 w-6" />
                  </span>
                  <span className="rounded-full bg-primary-soft px-2 py-0.5 text-[10px] font-bold text-primary">{g.level}</span>
                </div>
                <p className="mt-2 text-sm font-bold text-foreground">{g.name}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground line-clamp-2">{g.desc}</p>
              </button>
            );
          })}
        </div>
      </section>

      <section className="px-4 pb-8">
        <div className="rounded-2xl bg-card p-4 shadow-card">
          <p className="flex items-center gap-2 text-sm font-bold">
            <Trophy className="h-4 w-4 text-amber-500" /> 我的小成就
          </p>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-xl bg-muted/40 py-2">
              <p className="text-lg font-bold text-primary">12</p>
              <p className="text-[11px] text-muted-foreground">通关</p>
            </div>
            <div className="rounded-xl bg-muted/40 py-2">
              <p className="text-lg font-bold text-success">6</p>
              <p className="text-[11px] text-muted-foreground">连胜</p>
            </div>
            <div className="rounded-xl bg-muted/40 py-2">
              <p className="text-lg font-bold text-accent">3</p>
              <p className="text-[11px] text-muted-foreground">奖章</p>
            </div>
          </div>
        </div>
      </section>
    </MobileLayout>
  );
}
