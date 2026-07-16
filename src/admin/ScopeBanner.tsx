import { Info } from "lucide-react";
import { DATA_SCOPE_LABEL, type DataScope } from "./roles";
import { cn } from "@/lib/utils";

interface ScopeBannerProps {
  scope: DataScope;
  description: string;
  actions?: string[]; // 可执行操作
  tone?: "info" | "warning";
}

export function ScopeBanner({ scope, description, actions, tone = "info" }: ScopeBannerProps) {
  const tones = {
    info: "border-blue-200 bg-blue-50 text-blue-900",
    warning: "border-amber-200 bg-amber-50 text-amber-900",
  };
  return (
    <div className={cn("flex items-start gap-3 rounded-lg border p-3 text-sm", tones[tone])}>
      <Info className="mt-0.5 h-4 w-4 shrink-0" />
      <div className="space-y-1">
        <p>
          <span className="font-semibold">数据范围：</span>
          <span className="rounded bg-white/70 px-1.5 py-0.5 font-mono text-xs">
            {DATA_SCOPE_LABEL[scope]}
          </span>
          <span className="ml-2 text-muted-foreground">— {description}</span>
        </p>
        {actions && actions.length > 0 && (
          <p className="text-xs">
            <span className="font-semibold">可执行操作：</span>
            {actions.join(" · ")}
          </p>
        )}
      </div>
    </div>
  );
}
