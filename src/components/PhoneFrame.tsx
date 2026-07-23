import { cn } from "@/lib/utils";

export function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* 移动端：直接渲染，使用浏览器原生滚动，不做外框 */}
      <div className="relative sm:hidden">{children}</div>

      {/* 桌面端：显示手机外框预览 */}
      <div
        className={cn(
          "hidden sm:flex",
          "fixed inset-0 z-0 items-center justify-center",
          "bg-[#f0f0f2] dark:bg-[#0c0c0e] p-6"
        )}
      >
        <div
          className={cn(
            "relative flex w-full max-w-[420px] flex-col overflow-hidden rounded-[52px]",
            "h-[min(900px,calc(100vh-48px))]",
            "bg-[#1c1c1e] shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_28px_70px_-18px_rgba(0,0,0,0.45)]"
          )}
        >
          {/* 侧边按键 */}
          <div className="pointer-events-none absolute -left-[3px] top-[22%] h-16 w-[3px] rounded-l-md bg-[#2c2c2e]" />
          <div className="pointer-events-none absolute -left-[3px] top-[30%] h-10 w-[3px] rounded-l-md bg-[#2c2c2e]" />
          <div className="pointer-events-none absolute -right-[3px] top-[26%] h-20 w-[3px] rounded-r-md bg-[#2c2c2e]" />

          {/* 顶部灵动岛 */}
          <div className="pointer-events-none absolute left-1/2 top-3 z-[60] flex h-[26px] w-[110px] -translate-x-1/2 items-center justify-center rounded-full bg-[#1c1c1e]">
            <div className="h-[10px] w-16 rounded-full bg-[#0a0a0a]" />
          </div>

          {/* 屏幕：可滚动 */}
          <div className="relative flex-1 overflow-y-auto overscroll-contain rounded-[48px] bg-background">
            {children}
          </div>

          {/* 底部 Home 指示条 */}
          <div className="pointer-events-none absolute bottom-2 left-1/2 z-[60] h-[5px] w-28 -translate-x-1/2 rounded-full bg-white/25" />
        </div>
      </div>
    </>
  );
}
