import { Link, useLocation } from "@tanstack/react-router";
import { Home, HeartPulse, MapPin, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { PhoneFrame } from "@/components/PhoneFrame";

const tabs = [
  { to: "/", label: "首页", icon: Home },
  { to: "/health", label: "健康", icon: HeartPulse },
  { to: "/station", label: "驿站", icon: MapPin },
  { to: "/me", label: "我的", icon: User },
] as const;

export function MobileLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <PhoneFrame>
      <div className="flex min-h-full flex-col bg-gradient-bg">
        <main className="flex-1 pb-4">{children}</main>

        <nav
          aria-label="主导航"
          className={cn(
            "sticky bottom-0 z-50 w-full border-t border-border bg-card pb-safe",
          )}
        >
          <ul className="grid grid-cols-4 items-end">
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
    </PhoneFrame>
  );
}

