import { cn } from "@/lib/utils";

export function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-0 flex justify-center",
        "bg-[#f0f0f2] dark:bg-[#0c0c0e]"
      )}
    >
      {/* 手机机身 */}
      <div
        className={cn(
          "relative flex h-full w-full max-w-[480px] flex-col overflow-hidden",
          "bg-[#1c1c1e] shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_28px_70px_-18px_rgba(0,0,0,0.45)]",
          "sm:rounded-[52px]"
        )}
      >
        {/* 侧边按键 */}
        <div className="absolute -left-[3px] top-[22%] hidden h-16 w-[3px] rounded-l-md bg-[#2c2c2e] sm:block" />
        <div className="absolute -left-[3px] top-[30%] hidden h-10 w-[3px] rounded-l-md bg-[#2c2c2e] sm:block" />
        <div className="absolute -right-[3px] top-[26%] hidden h-20 w-[3px] rounded-r-md bg-[#2c2c2e] sm:block" />

        {/* 顶部刘海 / 灵动岛 */}
        <div className="pointer-events-none absolute left-1/2 top-3 z-[60] hidden h-[26px] w-[110px] -translate-x-1/2 items-center justify-center rounded-full bg-[#1c1c1e] sm:flex">
          <div className="h-[10px] w-16 rounded-full bg-[#0a0a0a]" />
        </div>

        {/* 屏幕区域 */}
        <div
          className={cn(
            "relative flex h-full flex-col overflow-hidden bg-background",
            "sm:rounded-[48px]"
          )}
        >
          {children}
        </div>

        {/* 底部 Home 指示条 */}
        <div className="pointer-events-none absolute bottom-2 left-1/2 z-[60] hidden h-[5px] w-28 -translate-x-1/2 rounded-full bg-white/25 sm:block" />
      </div>
    </div>
  );
}
