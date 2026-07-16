import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Activity, ArrowLeft, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  DEMO_ACCOUNTS,
  ROLE_LABEL,
  ROLE_COLOR,
  ROLE_HOME,
  type AdminRole,
} from "@/admin/roles";
import { getCurrentAdmin, loginAdmin } from "@/admin/auth";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin_/login")({
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const u = getCurrentAdmin();
    if (u) navigate({ to: ROLE_HOME[u.role] });
  }, [navigate]);

  const handleQuick = (role: AdminRole) => {
    setUsername(role);
    setPassword("123456");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const u = loginAdmin(username.trim(), password);
      toast.success(`欢迎，${u.name}`);
      navigate({ to: ROLE_HOME[u.role] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "登录失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-bg">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-6">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          返回 C 端
        </Link>

        <div className="flex flex-1 items-center justify-center">
          <div className="grid w-full gap-8 md:grid-cols-2 md:gap-12">
            {/* Left: Login */}
            <div className="rounded-3xl border border-border bg-card p-8 shadow-elevated">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-primary text-white">
                  <Activity className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">蜻蜓康健家 · 后台管理</h1>
                  <p className="text-xs text-muted-foreground">统一登录入口</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">账号</Label>
                  <Input
                    id="username"
                    placeholder="请输入账号（如 doctor）"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">密码</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="演示密码：123456"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading ? "登录中..." : "登录"}
                </Button>
              </form>

              <div className="mt-6 flex items-center gap-2 rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
                <Shield className="h-4 w-4" />
                所有数据传输 SSL 加密，登录信息仅本地保存。
              </div>
            </div>

            {/* Right: Quick demo accounts */}
            <div className="space-y-4">
              <div>
                <h2 className="text-base font-semibold">演示账号一键填充</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  统一密码 <span className="font-mono font-bold">123456</span>
                  ，点击下方角色快速体验对应工作台。
                </p>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {(Object.keys(DEMO_ACCOUNTS) as AdminRole[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => handleQuick(r)}
                    className={cn(
                      "group flex flex-col gap-1 rounded-xl border border-border bg-card p-4 text-left transition-all hover:border-primary hover:shadow-soft",
                      username === r && "border-primary shadow-soft",
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <Badge className={cn("rounded-md", ROLE_COLOR[r])} variant="secondary">
                        {ROLE_LABEL[r]}
                      </Badge>
                      <span className="font-mono text-xs text-muted-foreground">{r}</span>
                    </div>
                    <p className="mt-1 text-sm font-medium">{DEMO_ACCOUNTS[r].name}</p>
                    <p className="text-xs text-muted-foreground">{DEMO_ACCOUNTS[r].org}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
