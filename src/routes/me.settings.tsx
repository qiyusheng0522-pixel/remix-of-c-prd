import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  ChevronRight,
  Lock,
  Smartphone,
  Bell,
  Shield,
  Eye,
  Type,
  LogOut,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { MobileLayout } from "@/components/MobileLayout";

export const Route = createFileRoute("/me/settings")({
  head: () => ({
    meta: [
      { title: "账号与安全 - 蜻蜓健康" },
      { name: "description", content: "管理账号、隐私和通知设置。" },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const navigate = useNavigate();
  const [bigFont, setBigFont] = useState(true);
  const [pushOn, setPushOn] = useState(true);
  const [shareData, setShareData] = useState(false);

  return (
    <MobileLayout>
      <header className="flex items-center gap-3 bg-card px-5 pb-4 pt-12 shadow-soft">
        <button
          onClick={() => navigate({ to: "/me" })}
          className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted"
          aria-label="返回"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-bold">账号与安全</h1>
      </header>

      <section className="px-5 py-4">
        <div className="rounded-2xl bg-card p-5 shadow-card">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-soft text-primary">
              <User className="h-8 w-8" strokeWidth={1.8} />
            </div>
            <div className="flex-1">
              <p className="text-lg font-bold">王秀英</p>
              <p className="text-sm text-muted-foreground">手机号 138****8888</p>
            </div>
            <button
              onClick={() => toast("跳转编辑资料")}
              className="rounded-full border border-border px-3 py-1 text-xs font-bold text-muted-foreground"
            >
              编辑
            </button>
          </div>
        </div>
      </section>

      <Group title="账号安全">
        <Row icon={Smartphone} label="绑定手机号" value="138****8888" onClick={() => toast("更换手机号", { description: "需要短信验证" })} />
        <Row icon={Lock} label="登录密码" value="已设置" onClick={() => toast("修改密码", { description: "请输入旧密码后设置新密码" })} />
        <Row icon={Shield} label="紧急联系人" value="女儿 · 139****6666" onClick={() => toast("管理紧急联系人")} />
      </Group>

      <Group title="隐私与数据">
        <Row icon={Eye} label="健康数据可见范围" value="仅家人" onClick={() => toast("设置可见范围", { description: "仅自己 / 仅家人 / 我的医生" })} />
        <Toggle
          icon={Shield}
          label="允许医生查看档案"
          desc="便于在线问诊获得更精准建议"
          checked={shareData}
          onChange={(v) => {
            setShareData(v);
            toast(v ? "已允许" : "已关闭");
          }}
        />
      </Group>

      <Group title="通知">
        <Toggle
          icon={Bell}
          label="打卡/服药提醒"
          desc="按健康方案准点提醒"
          checked={pushOn}
          onChange={(v) => {
            setPushOn(v);
            toast(v ? "已开启提醒" : "已关闭提醒");
          }}
        />
      </Group>

      <Group title="无障碍">
        <Toggle
          icon={Type}
          label="超大字号模式"
          desc="老年友好显示"
          checked={bigFont}
          onChange={(v) => {
            setBigFont(v);
            toast(v ? "已切换为大字模式" : "已恢复标准字号");
          }}
        />
      </Group>

      <section className="px-5 py-4">
        <button
          onClick={() => toast("已退出登录", { description: "再次进入需重新登录" })}
          className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-card text-base font-bold text-destructive shadow-card active:scale-[0.99]"
        >
          <LogOut className="h-5 w-5" />
          退出登录
        </button>
        <p className="mt-3 text-center text-xs text-muted-foreground">蜻蜓健康 v1.0.0</p>
      </section>
    </MobileLayout>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="px-5 py-2">
      <h2 className="mb-2 px-1 text-xs font-bold text-muted-foreground">{title}</h2>
      <div className="overflow-hidden rounded-2xl bg-card shadow-card">{children}</div>
    </section>
  );
}

function Row({
  icon: Icon,
  label,
  value,
  onClick,
}: {
  icon: typeof Lock;
  label: string;
  value?: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 border-b border-border px-4 py-4 text-left last:border-0 active:bg-muted"
    >
      <Icon className="h-5 w-5 text-muted-foreground" />
      <span className="flex-1 text-base font-medium">{label}</span>
      {value && <span className="text-sm text-muted-foreground">{value}</span>}
      <ChevronRight className="h-5 w-5 text-muted-foreground" />
    </button>
  );
}

function Toggle({
  icon: Icon,
  label,
  desc,
  checked,
  onChange,
}: {
  icon: typeof Lock;
  label: string;
  desc: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-border px-4 py-4 last:border-0">
      <Icon className="h-5 w-5 text-muted-foreground" />
      <div className="flex-1">
        <p className="text-base font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 rounded-full transition-colors ${checked ? "bg-primary" : "bg-muted"}`}
        aria-label={label}
      >
        <span
          className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all ${checked ? "left-[22px]" : "left-0.5"}`}
        />
      </button>
    </div>
  );
}
