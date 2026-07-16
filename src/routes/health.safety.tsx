import { createFileRoute } from "@tanstack/react-router";
import { Shield, PhoneCall, MapPin, AlertTriangle, Users, Activity } from "lucide-react";
import { ModulePage, Card, FeatureGrid } from "@/components/ModulePage";

export const Route = createFileRoute("/health/safety")({
  head: () => ({ meta: [{ title: "安全监护 - 蜻蜓健康" }] }),
  component: Page,
});

function Page() {
  return (
    <ModulePage
      title="陪动 · 安全监护"
      subtitle="跌倒检测 · 久未活动预警 · 一键 SOS"
      gradient="from-red-400 to-rose-500"
      Icon={Shield}
    >
      <Card>
        <button className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 py-6 text-white shadow-elevated active:scale-95">
          <PhoneCall className="h-8 w-8" />
          <div className="text-left">
            <p className="text-xl font-bold">一键 SOS 求助</p>
            <p className="text-sm opacity-90">同时通知家人 + 健管师 + 120</p>
          </div>
        </button>
      </Card>

      <Card title="实时状态">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="rounded-xl bg-success/10 p-3">
            <Activity className="mx-auto h-6 w-6 text-success" />
            <p className="mt-1 text-xs text-muted-foreground">活动状态</p>
            <p className="text-sm font-bold text-success">正常</p>
          </div>
          <div className="rounded-xl bg-primary-soft p-3">
            <MapPin className="mx-auto h-6 w-6 text-primary" />
            <p className="mt-1 text-xs text-muted-foreground">位置</p>
            <p className="text-sm font-bold text-foreground">家中</p>
          </div>
          <div className="rounded-xl bg-warning/10 p-3">
            <AlertTriangle className="mx-auto h-6 w-6 text-warning" />
            <p className="mt-1 text-xs text-muted-foreground">本月预警</p>
            <p className="text-sm font-bold text-foreground">1 次</p>
          </div>
        </div>
      </Card>

      <FeatureGrid
        items={[
          { icon: Users, label: "紧急联系人", to: "/me/family", desc: "已设置 3 位" },
          { icon: MapPin, label: "电子围栏", desc: "走出 500m 提醒家人" },
          { icon: AlertTriangle, label: "跌倒检测", desc: "手表自动识别并求救" },
          { icon: Activity, label: "久坐久卧预警", desc: "2 小时未动即提醒" },
        ]}
      />

      <Card title="近期预警记录">
        <ul className="space-y-2 text-sm">
          <li className="flex items-center justify-between">
            <span>清晨血压偏高 148/92</span>
            <span className="text-xs text-muted-foreground">3 天前</span>
          </li>
          <li className="flex items-center justify-between">
            <span>夜间久卧未起身 9h</span>
            <span className="text-xs text-muted-foreground">上周</span>
          </li>
        </ul>
      </Card>
    </ModulePage>
  );
}
