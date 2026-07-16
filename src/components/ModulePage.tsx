import { ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ChevronLeft, type LucideIcon } from "lucide-react";
import { MobileLayout } from "@/components/MobileLayout";

export function ModulePage({
  title,
  subtitle,
  gradient = "from-primary to-accent",
  Icon,
  children,
}: {
  title: string;
  subtitle: string;
  gradient?: string;
  Icon: LucideIcon;
  children: ReactNode;
}) {
  const navigate = useNavigate();
  return (
    <MobileLayout>
      <header
        className={`relative bg-gradient-to-br ${gradient} px-5 pb-10 pt-12 text-white`}
      >
        <button
          onClick={() => navigate({ to: "/health" })}
          className="mb-3 inline-flex items-center gap-1 text-sm opacity-90 active:opacity-70"
        >
          <ChevronLeft className="h-4 w-4" /> 返回健康中心
        </button>
        <div className="flex items-start gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
            <Icon className="h-7 w-7" strokeWidth={2.2} />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="mt-1 text-sm opacity-90">{subtitle}</p>
          </div>
        </div>
      </header>
      <div className="-mt-6 space-y-4 px-5 pb-8">{children}</div>
    </MobileLayout>
  );
}

export function Card({
  title,
  desc,
  children,
}: {
  title?: string;
  desc?: string;
  children?: ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-card p-5 shadow-card">
      {title && <h2 className="text-lg font-bold text-foreground">{title}</h2>}
      {desc && <p className="mt-1 text-sm text-muted-foreground">{desc}</p>}
      {children && <div className={title ? "mt-3" : ""}>{children}</div>}
    </div>
  );
}

export function FeatureGrid({
  items,
}: {
  items: { icon: LucideIcon; label: string; to?: string; desc?: string }[];
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {items.map((it) => {
        const I = it.icon;
        const body = (
          <div className="flex h-full flex-col items-start gap-2 rounded-2xl bg-card p-4 shadow-card transition active:scale-[0.98]">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <I className="h-5 w-5" />
            </div>
            <p className="text-base font-bold text-foreground">{it.label}</p>
            {it.desc && (
              <p className="text-xs leading-relaxed text-muted-foreground">{it.desc}</p>
            )}
          </div>
        );
        return it.to ? (
          <Link key={it.label} to={it.to}>
            {body}
          </Link>
        ) : (
          <div key={it.label}>{body}</div>
        );
      })}
    </div>
  );
}
