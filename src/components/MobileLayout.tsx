import { Link, useLocation } from "@tanstack/react-router";
import { Home, HeartPulse, MapPin, User } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { to: "/", label: "首页", icon: Home },
  { to: "/health", label: "健康", icon: HeartPulse },
  { to: "/station", label: "驿站", icon: MapPin },
  { to: "/me", label: "我的", icon: User },
] as const;

export function MobileLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <div className="mx-auto flex min-h-screen max-w-[480px] flex-col bg-gradient-bg">
      <main className="flex-1 pb-24">{children}</main>

      <nav
        aria-label="主导航"
        className="fixed bottom-0 left-1/2 z-50 w-full max-w-[480px] -translate-x-1/2 border-t border-border bg-card/95 pb-safe backdrop-blur-md"
      >
        <ul className="grid grid-cols-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active =
              tab.to === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(tab.to);
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
