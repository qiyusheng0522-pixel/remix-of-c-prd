import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { MobileLayout } from "@/components/MobileLayout";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/circle")({
  head: () => ({
    meta: [
      { title: "蜻蜓圈 - 邻里健康社群" },
      {
        name: "description",
        content: "蜻蜓圈：和邻居朋友一起分享健康日常、报名活动、参加赛事。",
      },
    ],
  }),
  component: CircleLayout,
});

const subTabs = [
  { to: "/circle/activities", label: "活动", exact: false },
  { to: "/circle/events", label: "赛事", exact: false },
  { to: "/circle/stars", label: "名人", exact: false },
] as const;

function CircleLayout() {
  const location = useLocation();

  return (
    <MobileLayout>
      <div className="min-h-[calc(100vh-96px)] bg-gradient-bg">
        {/* 顶部标题 */}
        <header className="px-6 pb-3 pt-12">
          <h1 className="text-3xl font-bold text-foreground">蜻蜓圈</h1>
          <p className="mt-1 text-base text-muted-foreground">
            邻里相伴，健康同行
          </p>
        </header>

        {/* 子 Tab */}
        <nav
          aria-label="蜻蜓圈分类"
          className="sticky top-0 z-20 border-b border-border bg-card/95 backdrop-blur-md"
        >
          <ul className="flex">
            {subTabs.map((tab) => {
              const active = tab.exact
                ? location.pathname === tab.to
                : location.pathname.startsWith(tab.to);
              return (
                <li key={tab.to} className="flex-1">
                  <Link
                    to={tab.to}
                    className={cn(
                      "relative flex h-14 items-center justify-center text-base font-semibold transition-colors",
                      active ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    {tab.label}
                    {active && (
                      <span className="absolute bottom-0 h-1 w-10 rounded-t-full bg-primary" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="px-4 py-4">
          <Outlet />
        </div>
      </div>
    </MobileLayout>
  );
}
