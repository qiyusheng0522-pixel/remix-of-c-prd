import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Watch, Plus, Bluetooth, Battery, Zap, Heart, Activity, Footprints } from "lucide-react";
import { toast } from "sonner";
import { useNavigate, Link } from "@tanstack/react-router";
import { MobileLayout } from "@/components/MobileLayout";

export const Route = createFileRoute("/me/devices")({
  head: () => ({
    meta: [
      { title: "智能设备 - 蜻蜓健康" },
      { name: "description", content: "管理您绑定的智能健康设备。" },
    ],
  }),
  component: DevicesPage,
});

const initialDevices = [
  {
    id: "watch-1",
    name: "蜻蜓健康手表 Pro",
    type: "智能手表",
    icon: Watch,
    battery: 78,
    status: "已连接",
    lastSync: "1 分钟前",
    metrics: [
      { icon: Heart, label: "心率", value: "76 bpm" },
      { icon: Footprints, label: "今日步数", value: "4,892" },
      { icon: Activity, label: "血氧", value: "97%" },
    ],
  },
  {
    id: "bp-1",
    name: "欧姆龙血压计 U30",
    type: "血压计",
    icon: Activity,
    battery: 60,
    status: "已连接",
    lastSync: "今早 07:30",
    metrics: [{ icon: Activity, label: "最近一次", value: "128/82 mmHg" }],
  },
];

const recommended = [
  { name: "蜻蜓血糖仪 G2", desc: "无创检测 · 蓝牙同步" },
  { name: "睡眠监测床垫", desc: "深度睡眠 · 鼾声分析" },
  { name: "智能体脂秤", desc: "16 项身体指标" },
];

function DevicesPage() {
  const navigate = useNavigate();
  const [devices, setDevices] = useState(initialDevices);

  const sync = (id: string) => {
    toast.success("同步成功", { description: "数据已实时上传至健康档案" });
    setDevices((d) => d.map((x) => (x.id === id ? { ...x, lastSync: "刚刚" } : x)));
  };

  const unbind = (id: string) => {
    setDevices((d) => d.filter((x) => x.id !== id));
    toast("已解绑设备");
  };

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
        <h1 className="text-xl font-bold">智能设备</h1>
      </header>

      <section className="space-y-4 px-5 py-5">
        {devices.map((d) => {
          const Icon = d.icon;
          return (
            <article key={d.id} className="rounded-2xl bg-card p-5 shadow-card">
              <Link
                to="/me/devices/$id"
                params={{ id: d.id }}
                className="block active:opacity-80"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-bold">{d.name}</h2>
                    <p className="mt-0.5 text-sm text-muted-foreground">{d.type}</p>
                  </div>
                  <span className="rounded-full bg-success/15 px-3 py-1 text-xs font-bold text-success">
                    ● {d.status}
                  </span>
                </div>

                <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Battery className="h-4 w-4" /> {d.battery}%
                  </span>
                  <span className="flex items-center gap-1">
                    <Bluetooth className="h-4 w-4" /> 上次同步 {d.lastSync}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2 rounded-xl bg-muted p-3">
                  {d.metrics.map((m) => {
                    const MIcon = m.icon;
                    return (
                      <div key={m.label} className="text-center">
                        <MIcon className="mx-auto h-5 w-5 text-primary" />
                        <p className="mt-1 text-xs text-muted-foreground">{m.label}</p>
                        <p className="text-sm font-bold">{m.value}</p>
                      </div>
                    );
                  })}
                </div>
                <p className="mt-2 text-center text-xs font-bold text-primary">
                  查看历史数据与 AI 分析 ›
                </p>
              </Link>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  onClick={() => sync(d.id)}
                  className="flex min-h-[44px] items-center justify-center gap-1 rounded-xl bg-primary text-sm font-bold text-primary-foreground active:scale-[0.98]"
                >
                  <Zap className="h-4 w-4" />
                  立即同步
                </button>
                <button
                  onClick={() => unbind(d.id)}
                  className="min-h-[44px] rounded-xl border-2 border-border text-sm font-bold text-muted-foreground active:scale-[0.98]"
                >
                  解除绑定
                </button>
              </div>
            </article>
          );
        })}

        <button
          onClick={() => toast("扫描中…", { description: "请打开设备蓝牙并靠近手机" })}
          className="flex min-h-[60px] w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-primary bg-primary-soft text-base font-bold text-primary active:scale-[0.99]"
        >
          <Plus className="h-5 w-5" />
          添加新设备
        </button>

        <div className="rounded-2xl bg-card p-5 shadow-card">
          <h2 className="text-lg font-bold">为您推荐</h2>
          <p className="mt-1 text-sm text-muted-foreground">基于您的健康档案智能匹配</p>
          <div className="mt-3 space-y-2">
            {recommended.map((r) => (
              <button
                key={r.name}
                onClick={() => toast(r.name, { description: "正在跳转商城…" })}
                className="flex w-full items-center justify-between rounded-xl bg-muted px-4 py-3 text-left active:scale-[0.99]"
              >
                <div>
                  <p className="text-base font-bold">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.desc}</p>
                </div>
                <span className="text-sm font-bold text-primary">查看 ›</span>
              </button>
            ))}
          </div>
        </div>
      </section>
    </MobileLayout>
  );
}
