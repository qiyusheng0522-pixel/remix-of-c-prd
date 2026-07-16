import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { Home, BellRing, Users, UsersRound, User } from "lucide-react";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { getCurrentAdmin } from "@/admin/auth";

const tabs = [
  { to: "/hm", label: "工作台", icon: Home, exact: true },
  { to: "/hm/alerts", label: "预警", icon: BellRing, exact: false },
  { to: "/hm/users", label: "用户", icon: Users, exact: false },
  { to: "/hm/team", label: "团队", icon: UsersRound, exact: false },
  { to: "/hm/me", label: "我的", icon: User, exact: false },
] as const;

export function HmLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const u = getCurrentAdmin();
    if (!u || u.role !== "health_manager") {
      navigate({ to: "/admin/login" });
    }
  }, [navigate]);

  return (
    <div className="mx-auto flex min-h-screen max-w-[480px] flex-col bg-gradient-bg">
      <main className="flex-1 pb-24">{children}</main>

      <nav
        aria-label="健康管理师导航"
        className="fixed bottom-0 left-1/2 z-50 w-full max-w-[480px] -translate-x-1/2 border-t border-border bg-card/95 pb-safe backdrop-blur-md"
      >
        <ul className="grid grid-cols-5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = tab.exact
              ? location.pathname === tab.to
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
                    className={cn("h-6 w-6 transition-transform", active && "scale-110")}
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

export function HmHeader({ title, subtitle, right }: { title: string; subtitle?: string; right?: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/95 px-4 py-3 backdrop-blur">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <h1 className="truncate text-lg font-bold">{title}</h1>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        {right}
      </div>
    </header>
  );
}
