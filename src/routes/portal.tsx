import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  Smartphone,
  Stethoscope,
  Apple,
  HeartPulse,
  Shield,
  Wallet,
  Handshake,
  ExternalLink,
  KeyRound,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logoutAdmin, switchRole } from "@/admin/auth";
import { ROLE_HOME, ROLE_LABEL, ROLE_COLOR, type AdminRole } from "@/admin/roles";
import { toast } from "sonner";

export const Route = createFileRoute("/portal")({
  head: () => ({
    meta: [
      { title: "蜻蜓康健家 · 演示入口（前台 + 后台一站式）" },
      {
        name: "description",
        content:
          "一个页面集成 C 端用户、健康管理师移动端、医生/营养师/平台/财务/三方运营 后台 7 个角色入口，一键体验整套系统。",
      },
    ],
  }),
  component: PortalPage,
});

type Entry = {
  key: string;
  title: string;
  subtitle: string;
  desc: string;
  bullets: string[];
  icon: typeof Stethoscope;
  accent: string; // tailwind gradient/bg utility class
  badge: string;
  badgeClass: string;
  cta: string;
  // either a c-end entry or admin entry
  kind: "c-user" | "admin";
  to?: string;
  role?: AdminRole;
  account?: string;
};

const ENTRIES: Entry[] = [
  {
    key: "c-user",
    title: "C 端用户 App",
    subtitle: "中老年用户端",
    desc: "AI 健康管家「蜻蜓」陪伴式提醒、社群、商城、家庭关怀。",
    bullets: ["首页对话式提醒", "健康/方案/打卡", "社群活动 / 我的"],
    icon: Smartphone,
    accent: "from-[oklch(0.94_0.04_180)] to-[oklch(0.99_0.01_60)]",
    badge: "前台",
    badgeClass: "bg-primary-soft text-primary",
    cta: "进入用户端",
    kind: "c-user",
    to: "/",
    account: "无需登录",
  },
  {
    key: "hm",
    title: "健康管理师 移动端",
    subtitle: "/hm 工作台",
    desc: "一线健康管理师专用移动工作台，AI 预警卡片流 + 一键执行话术/方案。",
    bullets: ["今日工作台", "我的用户 / 团队", "AI 预警与处理"],
    icon: HeartPulse,
    accent: "from-teal-50 to-cyan-50",
    badge: "移动后台",
    badgeClass: "bg-teal-100 text-teal-700",
    cta: "以健康管理师进入",
    kind: "admin",
    role: "health_manager",
    account: "hm / 123456",
  },
  {
    key: "doctor",
    title: "医生 工作台",
    subtitle: "/admin/doctor",
    desc: "互联网医院侧 — 在线接诊、医疗方案、随访计划、个人分账。",
    bullets: ["我的患者", "在线接诊 / 方案", "随访 / 财务"],
    icon: Stethoscope,
    accent: "from-blue-50 to-sky-50",
    badge: "桌面后台",
    badgeClass: "bg-blue-100 text-blue-700",
    cta: "以医生进入",
    kind: "admin",
    role: "doctor",
    account: "doctor / 123456",
  },
  {
    key: "nutritionist",
    title: "营养师 工作台",
    subtitle: "/admin/nutritionist",
    desc: "客户管理、方案制定、Agent 运营、量表（公共+私有）、个人分账。",
    bullets: ["我的客户 / 标签", "方案 / 预约 / 量表", "Agent 活动配置"],
    icon: Apple,
    accent: "from-emerald-50 to-lime-50",
    badge: "桌面后台",
    badgeClass: "bg-emerald-100 text-emerald-700",
    cta: "以营养师进入",
    kind: "admin",
    role: "nutritionist",
    account: "nutritionist / 123456",
  },
  {
    key: "platform_admin",
    title: "平台管理员",
    subtitle: "/admin/platform",
    desc: "全平台数据 — C 端用户中心、商品/供应链、量表、Agent、系统权限矩阵。",
    bullets: ["C 端用户 / 分配", "商品 · 供应链 · 量表", "权限矩阵 · 审核"],
    icon: Shield,
    accent: "from-rose-50 to-pink-50",
    badge: "桌面后台",
    badgeClass: "bg-rose-100 text-rose-700",
    cta: "以平台管理员进入",
    kind: "admin",
    role: "platform_admin",
    account: "platform_admin / 123456",
  },
  {
    key: "finance",
    title: "财务中心",
    subtitle: "/admin/finance",
    desc: "全平台账单、收入/成本、分账规则、对账、发票、报表。",
    bullets: ["收入 / 成本 / 利润", "分账 · 对账", "发票 · 报表"],
    icon: Wallet,
    accent: "from-amber-50 to-yellow-50",
    badge: "桌面后台",
    badgeClass: "bg-amber-100 text-amber-700",
    cta: "以财务进入",
    kind: "admin",
    role: "finance",
    account: "finance / 123456",
  },
  {
    key: "third_party",
    title: "三方运营",
    subtitle: "/admin/third-party",
    desc: "合作机构数据看板与对账报表（仅本机构数据范围）。",
    bullets: ["机构看板", "对账报表"],
    icon: Handshake,
    accent: "from-violet-50 to-purple-50",
    badge: "桌面后台",
    badgeClass: "bg-violet-100 text-violet-700",
    cta: "以三方运营进入",
    kind: "admin",
    role: "third_party",
    account: "third_party / 123456",
  },
];

function PortalPage() {
  const navigate = useNavigate();

  const enter = (e: Entry) => {
    if (e.kind === "c-user") {
      logoutAdmin();
      navigate({ to: "/" });
      toast.success("已进入 C 端用户");
      return;
    }
    if (!e.role) return;
    const u = switchRole(e.role);
    navigate({ to: ROLE_HOME[e.role] });
    toast.success(`已登录：${u.name}（${ROLE_LABEL[e.role]}）`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[oklch(0.97_0.02_185)] via-background to-[oklch(0.98_0.015_60)]">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
        {/* Header */}
        <header className="mb-10 flex flex-col gap-4 sm:mb-14 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-primary text-white shadow-elevated">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold sm:text-2xl">蜻蜓康健家 · 演示总入口</h1>
              <p className="text-xs text-muted-foreground sm:text-sm">
                一个页面集成「前台 C 端 + 6 个后台角色」，一键切换体验
              </p>
            </div>
          </div>
          <Link
            to="/admin/login"
            className="inline-flex items-center gap-1.5 self-start rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium shadow-soft transition-colors hover:border-primary hover:text-primary sm:self-auto"
          >
            <KeyRound className="h-4 w-4" />
            手动账号登录
          </Link>
        </header>

        {/* Notice */}
        <div className="mb-8 flex flex-col items-start gap-3 rounded-2xl border border-border bg-card/70 p-4 shadow-soft sm:flex-row sm:items-center">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
            <Layers className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">演示模式说明</p>
            <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
              点击下方任意卡片的「进入」按钮即可一键登录对应角色并跳转工作台。
              所有演示账号统一密码 <span className="font-mono font-bold">123456</span>。
              页面右下角的 <span className="font-bold">⚙️ 角色浮窗</span> 也可在任意页面随时切换。
            </p>
          </div>
        </div>

        {/* Section: 前台 */}
        <SectionTitle index="01" title="前台 · C 端用户" desc="中老年用户日常使用的主 App" />
        <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ENTRIES.filter((e) => e.kind === "c-user").map((e) => (
            <EntryCard key={e.key} entry={e} onEnter={enter} />
          ))}
        </div>

        {/* Section: 移动后台 */}
        <SectionTitle
          index="02"
          title="移动后台 · 一线工作台"
          desc="健康管理师专用，按手机端形态优化"
        />
        <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ENTRIES.filter((e) => e.kind === "admin" && e.role === "health_manager").map((e) => (
            <EntryCard key={e.key} entry={e} onEnter={enter} />
          ))}
        </div>

        {/* Section: 桌面后台 */}
        <SectionTitle
          index="03"
          title="桌面后台 · 多角色管理系统"
          desc="桌面端二级菜单，按角色权限差异化"
        />
        <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ENTRIES.filter(
            (e) => e.kind === "admin" && e.role !== "health_manager",
          ).map((e) => (
            <EntryCard key={e.key} entry={e} onEnter={enter} />
          ))}
        </div>

        <footer className="mt-8 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          蜻蜓康健家 · Demo · 所有数据均为演示用 mock 数据
        </footer>
      </div>
    </div>
  );
}

function SectionTitle({
  index,
  title,
  desc,
}: {
  index: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-3">
      <div className="flex items-center gap-3">
        <span className="font-mono text-xs font-bold text-primary">{index}</span>
        <div>
          <h2 className="text-base font-bold sm:text-lg">{title}</h2>
          <p className="text-[11px] text-muted-foreground sm:text-xs">{desc}</p>
        </div>
      </div>
      <div className="hidden h-px flex-1 bg-border sm:block" />
    </div>
  );
}

function EntryCard({ entry, onEnter }: { entry: Entry; onEnter: (e: Entry) => void }) {
  const Icon = entry.icon;
  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-elevated",
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 -z-0 bg-gradient-to-br opacity-60",
          entry.accent,
        )}
      />
      <div className="relative z-10 flex flex-1 flex-col">
        <div className="mb-3 flex items-start justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/80 text-foreground shadow-soft backdrop-blur">
            <Icon className="h-6 w-6" />
          </div>
          <span
            className={cn(
              "rounded-full px-2.5 py-0.5 text-[11px] font-bold",
              entry.badgeClass,
            )}
          >
            {entry.badge}
          </span>
        </div>

        <h3 className="text-base font-bold">{entry.title}</h3>
        <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">{entry.subtitle}</p>
        <p className="mt-2 text-xs leading-relaxed text-foreground/80">{entry.desc}</p>

        <ul className="mt-3 space-y-1">
          {entry.bullets.map((b) => (
            <li
              key={b}
              className="flex items-start gap-1.5 text-[11px] text-muted-foreground"
            >
              <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-primary" />
              {b}
            </li>
          ))}
        </ul>

        <div className="mt-4 flex items-center gap-2 rounded-lg bg-white/70 px-2.5 py-1.5 text-[11px] backdrop-blur">
          <KeyRound className="h-3 w-3 text-muted-foreground" />
          <span className="font-mono text-foreground/80">{entry.account}</span>
        </div>

        <button
          onClick={() => onEnter(entry)}
          className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-foreground px-4 py-2.5 text-sm font-bold text-background shadow-soft transition-transform active:scale-[0.98] group-hover:bg-primary"
        >
          {entry.cta}
          <ArrowRight className="h-4 w-4" />
        </button>

        {entry.kind === "admin" && entry.role && (
          <Link
            to={ROLE_HOME[entry.role]}
            className="mt-2 inline-flex items-center justify-center gap-1 text-[11px] text-muted-foreground hover:text-primary"
          >
            <ExternalLink className="h-3 w-3" />
            直接打开路径（不切换登录态）
          </Link>
        )}
      </div>
    </div>
  );
}
