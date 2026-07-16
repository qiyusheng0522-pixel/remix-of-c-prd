import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { UserCog, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { switchRole, logoutAdmin } from "@/admin/auth";
import type { AdminRole } from "@/admin/roles";
import { ROLE_HOME, ROLE_LABEL, ROLE_COLOR } from "@/admin/roles";
import { toast } from "sonner";

type Entry =
  | { kind: "c-user"; label: string; desc: string; to: string }
  | { kind: "admin"; label: string; desc: string; role: AdminRole };

const ENTRIES: Entry[] = [
  { kind: "c-user", label: "C 端用户", desc: "中老年用户 App", to: "/" },
  { kind: "admin", label: "健康管理师", desc: "移动端工作台 /hm", role: "health_manager" },
  { kind: "admin", label: "医生", desc: "/admin/doctor", role: "doctor" },
  { kind: "admin", label: "营养师", desc: "/admin/nutritionist", role: "nutritionist" },
  { kind: "admin", label: "平台管理员", desc: "/admin/platform", role: "platform_admin" },
  { kind: "admin", label: "财务", desc: "/admin/finance", role: "finance" },
  { kind: "admin", label: "三方运营", desc: "/admin/third-party", role: "third_party" },
];

export function RoleSwitcher() {
  const [open, setOpen] = useState(false);
  const nav = useNavigate();

  const go = (e: Entry) => {
    if (e.kind === "c-user") {
      logoutAdmin();
      nav({ to: e.to as "/" });
      toast.success("已切换到 C 端用户");
    } else {
      const u = switchRole(e.role);
      nav({ to: ROLE_HOME[e.role] });
      toast.success(`已切换：${u.name}`);
    }
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        title="一键切换演示角色"
        className="fixed bottom-28 right-3 z-[60] flex h-11 w-11 items-center justify-center rounded-full bg-foreground text-background shadow-elevated transition-transform active:scale-95 sm:bottom-6 sm:right-6"
      >
        {open ? <X className="h-5 w-5" /> : <UserCog className="h-5 w-5" />}
      </button>

      {open && (
        <div className="fixed bottom-44 right-3 z-[60] w-72 overflow-hidden rounded-2xl border border-border bg-card shadow-elevated sm:bottom-20 sm:right-6">
          <div className="border-b bg-muted/40 px-3 py-2">
            <p className="text-sm font-bold">切换演示角色</p>
            <p className="text-[11px] text-muted-foreground">
              点击下方任意角色一键登录并跳转对应工作台
            </p>
          </div>
          <ul className="max-h-[60vh] divide-y overflow-y-auto">
            {ENTRIES.map((e) => (
              <li key={e.label}>
                <button
                  onClick={() => go(e)}
                  className="flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-muted/40"
                >
                  <span
                    className={cn(
                      "inline-flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold",
                      e.kind === "c-user"
                        ? "bg-primary-soft text-primary"
                        : ROLE_COLOR[e.role],
                    )}
                  >
                    {e.label.slice(0, 1)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{e.label}</p>
                    <p className="truncate text-[11px] text-muted-foreground">{e.desc}</p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
          <div className="border-t bg-muted/30 px-3 py-2 text-[11px] text-muted-foreground">
            演示密码统一：<span className="font-mono font-bold">123456</span>
          </div>
        </div>
      )}
    </>
  );
}
