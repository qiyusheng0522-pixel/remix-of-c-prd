import { createFileRoute } from "@tanstack/react-router";
import { Package, QrCode, MapPin, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { StationSubPage, StationCard } from "@/components/StationSubPage";

export const Route = createFileRoute("/station/pickup")({
  head: () => ({
    meta: [
      { title: "货品自提 - 蜻蜓健康" },
      { name: "description", content: "驿站待自提货品列表与取件码。" },
    ],
  }),
  component: PickupPage,
});

const pending = [
  {
    code: "8842",
    name: "欧姆龙上臂式血压计",
    at: "阳光社区健康驿站",
    time: "今日 10:30 已到货",
    emoji: "🩺",
  },
  {
    code: "3167",
    name: "汤臣倍健蛋白粉 900g",
    at: "阳光社区健康驿站",
    time: "昨日 16:20 已到货",
    emoji: "🥛",
  },
];

const done = [
  { name: "钙镁锌复合片", at: "阳光社区健康驿站", time: "04-14 已自提", emoji: "💊" },
  { name: "远红外颈椎按摩仪", at: "阳光社区健康驿站", time: "04-08 已自提", emoji: "💆" },
];

function PickupPage() {
  return (
    <StationSubPage
      title="货品自提"
      subtitle="出示取件码到驿站 30 秒取件"
      Icon={Package}
      gradient="from-emerald-500 to-teal-600"
    >
      <StationCard title={`待自提 · ${pending.length} 件`} desc="驿站营业时间 08:00 - 20:00">
        <div className="space-y-3">
          {pending.map((p) => (
            <div key={p.code} className="rounded-2xl bg-muted/50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white text-3xl">
                  {p.emoji}
                </div>
                <div className="flex-1">
                  <p className="text-base font-bold text-foreground">{p.name}</p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    {p.at}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{p.time}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-3 rounded-xl bg-white p-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary-soft text-primary">
                  <QrCode className="h-8 w-8" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">取件码</p>
                  <p className="mt-0.5 text-3xl font-bold tracking-widest text-primary">
                    {p.code}
                  </p>
                </div>
                <button
                  onClick={() =>
                    toast.success("二维码已放大", {
                      description: `凭取件码 ${p.code} 到驿站扫码取件`,
                    })
                  }
                  className="flex h-11 items-center justify-center rounded-full bg-primary px-4 text-sm font-bold text-primary-foreground shadow-soft active:scale-95"
                >
                  出示码
                </button>
              </div>
            </div>
          ))}
        </div>
      </StationCard>

      <StationCard title="自提记录">
        <ul className="space-y-3">
          {done.map((d, i) => (
            <li
              key={i}
              className="flex items-center gap-3 border-t border-border pt-3 first:border-0 first:pt-0"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted text-2xl">
                {d.emoji}
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-foreground">{d.name}</p>
                <p className="text-xs text-muted-foreground">{d.at} · {d.time}</p>
              </div>
              <CheckCircle2 className="h-5 w-5 text-success" />
            </li>
          ))}
        </ul>
      </StationCard>
    </StationSubPage>
  );
}