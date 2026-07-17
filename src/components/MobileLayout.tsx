import { Link, useLocation } from "@tanstack/react-router";
import { Home, HeartPulse, MapPin, User, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { to: "/", label: "首页", icon: Home },
  { to: "/health", label: "健康", icon: HeartPulse },
  { to: "/chat/xiaoqing", label: "蜻蜓", icon: Sparkles, isCenter: true },
  { to: "/station", label: "驿站", icon: MapPin },
  { to: "/me", label: "我的", icon: User },
] as const;

export function MobileLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <div className="mx-auto flex min-h-screen max-w-[480px] flex-col bg-gradient-bg">
      <main className="flex-1 pb-28">{children}</main>

      <nav
        aria-label="主导航"
        className="fixed bottom-0 left-1/2 z-50 w-full max-w-[480px] -translate-x-1/2 border-t border-border bg-card/95 pb-safe backdrop-blur-md"
      >
        <ul className="grid grid-cols-5 items-end">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active =
              tab.to === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(tab.to);
            const isCenter = "isCenter" in tab && tab.isCenter;

            if (isCenter) {
              return (
                <li key={tab.to} className="relative flex justify-center">
                  <Link
                    to={tab.to}
                    aria-label="和蜻蜓聊聊"
                    className={cn(
                      "relative -top-5 flex h-16 w-16 flex-col items-center justify-center rounded-full bg-gradient-primary text-white shadow-elevated transition-transform active:scale-95",
                      active && "ring-4 ring-primary/20",
                    )}
                  >
                    <Icon className="h-7 w-7" strokeWidth={2.5} />
                    <span className="mt-0.5 text-[11px] font-bold">{tab.label}</span>
                    <span className="absolute right-2 top-2 h-2.5 w-2.5 animate-pulse rounded-full bg-success ring-2 ring-white" />
                  </Link>
                </li>
              );
            }

            return (
              <li key={tab.to}>
                <Link
                  to={tab.to}
                  className={cn(
                    "flex min-h-[60px] flex-col items-center justify-center gap-0.5 px-1 pt-2 text-xs font-medium transition-colors",
                    active ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-6 w-6 transition-transform",
                      active && "scale-110",
                    )}
                    strokeWidth={active ? 2.5 : 2}
                  />
                  <span className="text-[13px]">{tab.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

