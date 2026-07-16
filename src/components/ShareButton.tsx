import { useState } from "react";
import {
  Share2, X, MessageCircle, Users, Link2, Copy,
  Trophy, Flame, Sparkles, Heart, Star, TrendingUp, Award, Crown,
} from "lucide-react";
import { toast } from "sonner";

type Props = {
  title: string;
  desc?: string;
  className?: string;
  label?: string;
  variant?: "icon" | "button" | "pill";
};

/**
 * 通用分享按钮 · 炫耀式成就海报
 */
export function ShareButton({ title, desc, className, label = "分享", variant = "button" }: Props) {
  const [open, setOpen] = useState(false);

  const trigger =
    variant === "icon" ? (
      <button
        aria-label="分享"
        onClick={() => setOpen(true)}
        className={`flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-primary shadow-card active:scale-95 ${className ?? ""}`}
      >
        <Share2 className="h-4 w-4" />
      </button>
    ) : variant === "pill" ? (
      <button
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-1 rounded-full bg-primary-soft px-3 py-1.5 text-xs font-bold text-primary active:scale-95 ${className ?? ""}`}
      >
        <Share2 className="h-3.5 w-3.5" /> {label}
      </button>
    ) : (
      <button
        onClick={() => setOpen(true)}
        className={`inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2 text-sm font-bold text-white shadow-elevated active:scale-95 ${className ?? ""}`}
      >
        <Share2 className="h-4 w-4" /> {label}
      </button>
    );

  const share = (channel: string) => {
    setOpen(false);
    if (channel === "copy") {
      try {
        navigator.clipboard?.writeText(`${title} ${location.href}`);
      } catch {}
      toast.success("链接已复制", { description: "可粘贴到任意应用" });
      return;
    }
    toast.success(`已分享到${channel}`, { description: title });
  };

  // 根据标题智能识别成就类型
  const isStreak = /打卡|连续|坚持/.test(title);
  const isScore = /分|超越|健康分/.test(title);
  const today = new Date();
  const dateStr = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, "0")}.${String(today.getDate()).padStart(2, "0")}`;

  return (
    <>
      {trigger}
      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 backdrop-blur-md"
          onClick={() => setOpen(false)}
        >
          <div
            className="max-h-[92vh] w-full max-w-[480px] overflow-y-auto rounded-t-3xl bg-card pb-8 pt-4 shadow-elevated"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-3 h-1 w-12 rounded-full bg-muted" />
            <div className="flex items-center justify-between px-5">
              <p className="text-base font-bold">炫耀我的成就 🎉</p>
              <button
                onClick={() => setOpen(false)}
                aria-label="关闭"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* 海报预览 · 内容丰富版 */}
            <div className="px-5 pt-3">
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-400 via-rose-500 to-fuchsia-600 p-5 text-white shadow-elevated">
                {/* 装饰光斑 */}
                <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-yellow-300/30 blur-2xl" />
                <div className="absolute -bottom-16 -left-10 h-44 w-44 rounded-full bg-fuchsia-300/30 blur-2xl" />
                <div className="absolute right-6 top-20 h-3 w-3 rotate-45 bg-white/40" />
                <div className="absolute left-8 top-32 h-2 w-2 rounded-full bg-yellow-200" />
                <div className="absolute right-16 bottom-32 h-2 w-2 rounded-full bg-white/60" />

                {/* Header · 品牌 + 日期 */}
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/25">
                      <Sparkles className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-[11px] font-bold tracking-wider">蜻蜓健康</span>
                  </div>
                  <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px]">{dateStr}</span>
                </div>

                {/* 大奖章 */}
                <div className="relative mt-4 flex items-center gap-3">
                  <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-yellow-200 to-yellow-500 shadow-lg ring-4 ring-white/40">
                    {isScore ? (
                      <Crown className="h-10 w-10 text-amber-900" strokeWidth={2.4} />
                    ) : isStreak ? (
                      <Flame className="h-10 w-10 text-orange-700" strokeWidth={2.4} />
                    ) : (
                      <Trophy className="h-10 w-10 text-amber-900" strokeWidth={2.4} />
                    )}
                    <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-white text-[10px] font-black text-rose-600 shadow">
                      NEW
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] uppercase tracking-widest opacity-80">Achievement Unlocked</p>
                    <p className="mt-0.5 text-[22px] font-black leading-tight line-clamp-2">{title}</p>
                  </div>
                </div>

                {/* 数据三宫格 */}
                <div className="relative mt-4 grid grid-cols-3 gap-2">
                  {[
                    { icon: Flame, k: "连续天数", v: "28", u: "天" },
                    { icon: TrendingUp, k: "健康分", v: "85", u: "分" },
                    { icon: Heart, k: "超越同龄", v: "78", u: "%" },
                  ].map((s) => {
                    const I = s.icon;
                    return (
                      <div key={s.k} className="rounded-xl bg-white/15 px-2 py-2 text-center backdrop-blur-sm">
                        <I className="mx-auto h-3.5 w-3.5 opacity-90" />
                        <p className="mt-0.5 text-lg font-black leading-none">
                          {s.v}
                          <span className="ml-0.5 text-[10px] font-bold opacity-90">{s.u}</span>
                        </p>
                        <p className="mt-0.5 text-[9px] opacity-85">{s.k}</p>
                      </div>
                    );
                  })}
                </div>

                {/* 蜻蜓寄语 */}
                {desc && (
                  <div className="relative mt-3 rounded-xl bg-white/15 p-3 backdrop-blur-sm">
                    <p className="mb-1 flex items-center gap-1 text-[10px] font-bold opacity-90">
                      <Sparkles className="h-3 w-3" /> 蜻蜓寄语
                    </p>
                    <p className="text-[12px] leading-relaxed line-clamp-3">{desc}</p>
                  </div>
                )}

                {/* 勋章带 */}
                <div className="relative mt-3 flex items-center gap-1.5">
                  {[Star, Award, Heart, Flame, Trophy].map((I, i) => (
                    <span
                      key={i}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 ring-1 ring-white/30"
                    >
                      <I className="h-3.5 w-3.5" />
                    </span>
                  ))}
                  <span className="ml-auto text-[10px] opacity-90">已解锁 12 / 36</span>
                </div>

                {/* Footer · 二维码 */}
                <div className="relative mt-4 flex items-end justify-between border-t border-white/25 pt-3">
                  <div>
                    <p className="text-[10px] opacity-80">— 来自 王阿姨</p>
                    <p className="mt-0.5 text-[11px] font-bold">和我一起，活力满分 💪</p>
                    <p className="mt-1 text-[9px] opacity-75">长按识别 · 加入蜻蜓健康</p>
                  </div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-white p-1">
                    <div className="grid grid-cols-5 gap-[1.5px]">
                      {Array.from({ length: 25 }).map((_, i) => (
                        <span
                          key={i}
                          className={`h-2 w-2 rounded-[1px] ${
                            [0, 1, 2, 4, 5, 7, 9, 10, 12, 14, 15, 17, 19, 20, 22, 23, 24].includes(i)
                              ? "bg-rose-600"
                              : "bg-white"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 小提示 */}
              <p className="mt-2 text-center text-[10px] text-muted-foreground">
                海报已生成 · 可一键分享到朋友圈炫耀
              </p>
            </div>

            <p className="mt-4 px-5 text-xs text-muted-foreground">选择分享渠道</p>
            <div className="mt-2 grid grid-cols-4 gap-2 px-5">
              {[
                { k: "微信好友", icon: MessageCircle, bg: "bg-[oklch(0.78_0.16_150)]" },
                { k: "朋友圈", icon: Users, bg: "bg-[oklch(0.72_0.18_140)]" },
                { k: "微信收藏", icon: Link2, bg: "bg-[oklch(0.7_0.12_180)]" },
                { k: "copy", icon: Copy, bg: "bg-muted-foreground/70", label: "复制链接" },
              ].map((c) => {
                const Icon = c.icon;
                return (
                  <button
                    key={c.k}
                    onClick={() => share(c.k)}
                    className="flex flex-col items-center gap-1.5 active:scale-95"
                  >
                    <span className={`flex h-12 w-12 items-center justify-center rounded-2xl text-white ${c.bg}`}>
                      <Icon className="h-6 w-6" />
                    </span>
                    <span className="text-[11px] text-foreground">{c.label ?? c.k}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
