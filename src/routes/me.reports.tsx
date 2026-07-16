import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  FileText,
  Download,
  Printer,
  Phone,
  CheckCircle2,
  Copy,
  Sparkles,
  Calendar,
  Stethoscope,
  Activity,
  Apple,
  Moon,
} from "lucide-react";
import { toast } from "sonner";
import { MobileLayout } from "@/components/MobileLayout";

export const Route = createFileRoute("/me/reports")({
  head: () => ({
    meta: [
      { title: "我的报告 - 蜻蜓健康" },
      { name: "description", content: "下载健康报告，凭验证码或会员手机号到社区驿站打印。" },
    ],
  }),
  component: ReportsPage,
});

type Report = {
  id: string;
  title: string;
  date: string;
  pages: number;
  size: string;
  type: string;
  icon: typeof FileText;
  color: string;
  summary: string;
};

const reports: Report[] = [
  {
    id: "r-monthly-2026-05",
    title: "5 月健康月报 · 春日散步家",
    date: "2026-05-01",
    pages: 12,
    size: "2.3 MB",
    type: "月度报告",
    icon: Sparkles,
    color: "from-fuchsia-500 to-purple-600",
    summary: "走路 12.4 万步，睡眠提升 8%，血压稳定",
  },
  {
    id: "r-checkup-2026-04",
    title: "2026 春季体检综合报告",
    date: "2026-04-18",
    pages: 24,
    size: "5.1 MB",
    type: "体检报告",
    icon: Stethoscope,
    color: "from-primary to-accent",
    summary: "三高指标全部回落到正常区间",
  },
  {
    id: "r-nutrition-2026-q1",
    title: "Q1 营养评估报告",
    date: "2026-04-02",
    pages: 8,
    size: "1.7 MB",
    type: "营养报告",
    icon: Apple,
    color: "from-emerald-500 to-teal-600",
    summary: "蛋白摄入达标 92%，建议补充膳食纤维",
  },
  {
    id: "r-sleep-2026-04",
    title: "4 月睡眠质量分析",
    date: "2026-04-30",
    pages: 6,
    size: "1.1 MB",
    type: "睡眠报告",
    icon: Moon,
    color: "from-indigo-500 to-blue-700",
    summary: "深睡时长 1h32min，建议规律入睡",
  },
  {
    id: "r-rehab-2026-03",
    title: "膝关节术后康复阶段报告",
    date: "2026-03-15",
    pages: 10,
    size: "2.8 MB",
    type: "康复报告",
    icon: Activity,
    color: "from-orange-500 to-rose-600",
    summary: "活动度恢复至 95%，进入第二阶段训练",
  },
];

function randomCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function ReportsPage() {
  const navigate = useNavigate();
  const [active, setActive] = useState<Report | null>(null);
  const [code, setCode] = useState("");
  const [phone, setPhone] = useState("138****8866");
  const [tab, setTab] = useState<"code" | "phone">("code");

  const openPrint = (r: Report) => {
    setActive(r);
    setCode(randomCode());
    setTab("code");
  };

  const download = (r: Report) => {
    toast.success(`${r.title} 下载完成`, {
      description: "已保存至「我的-下载」",
    });
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("验证码已复制");
    } catch {
      toast("请手动记录验证码");
    }
  };

  const sendPrint = () => {
    if (tab === "phone" && !/^1\d{2}\*{4}\d{4}$|^1\d{10}$/.test(phone)) {
      toast.error("请输入有效手机号");
      return;
    }
    toast.success("已发送至社区驿站打印队列", {
      description: tab === "code" ? `凭验证码 ${code} 到驿站取件` : `已绑定手机号 ${phone}`,
    });
    setActive(null);
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
        <h1 className="text-xl font-bold">我的报告</h1>
      </header>

      <section className="space-y-4 px-5 py-5">
        <div className="rounded-2xl bg-gradient-to-br from-primary to-accent p-5 text-primary-foreground shadow-card">
          <div className="flex items-center gap-2">
            <Printer className="h-5 w-5" />
            <p className="text-sm font-bold opacity-95">社区驿站免费打印</p>
          </div>
          <p className="mt-2 text-sm leading-relaxed opacity-95">
            报告下载后会生成 6 位验证码，到社区驿站自助打印机输入验证码或会员手机号即可取件。
          </p>
          <div className="mt-3 grid grid-cols-3 divide-x divide-white/20 rounded-xl bg-white/15 py-3 text-center text-xs">
            <div>
              <p className="text-base font-bold">{reports.length}</p>
              <p className="mt-0.5 opacity-90">可下载</p>
            </div>
            <div>
              <p className="text-base font-bold">3</p>
              <p className="mt-0.5 opacity-90">本月已打印</p>
            </div>
            <div>
              <p className="text-base font-bold">免费</p>
              <p className="mt-0.5 opacity-90">驿站打印</p>
            </div>
          </div>
        </div>

        {reports.map((r) => {
          const Icon = r.icon;
          return (
            <article key={r.id} className="rounded-2xl bg-card p-4 shadow-card">
              <div className="flex items-start gap-3">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${r.color} text-white`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-bold text-muted-foreground">
                      {r.type}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" /> {r.date}
                    </span>
                  </div>
                  <h2 className="mt-1.5 text-base font-bold text-foreground">{r.title}</h2>
                  <p className="mt-1 text-xs text-muted-foreground">{r.summary}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {r.pages} 页 · {r.size}
                  </p>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  onClick={() => download(r)}
                  className="flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border-2 border-primary text-sm font-bold text-primary active:scale-[0.98]"
                >
                  <Download className="h-4 w-4" /> 下载 PDF
                </button>
                <button
                  onClick={() => openPrint(r)}
                  className="flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl bg-primary text-sm font-bold text-primary-foreground active:scale-[0.98]"
                >
                  <Printer className="h-4 w-4" /> 驿站打印
                </button>
              </div>
            </article>
          );
        })}
      </section>

      {active && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/50" onClick={() => setActive(null)}>
          <div
            className="w-full rounded-t-3xl bg-card p-5 pb-8 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-muted" />
            <h3 className="text-lg font-bold">驿站打印 · {active.type}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{active.title}</p>

            <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-muted p-1">
              <button
                onClick={() => setTab("code")}
                className={`min-h-[40px] rounded-lg text-sm font-bold ${
                  tab === "code" ? "bg-card text-foreground shadow" : "text-muted-foreground"
                }`}
              >
                凭验证码取件
              </button>
              <button
                onClick={() => setTab("phone")}
                className={`min-h-[40px] rounded-lg text-sm font-bold ${
                  tab === "phone" ? "bg-card text-foreground shadow" : "text-muted-foreground"
                }`}
              >
                凭会员手机号
              </button>
            </div>

            {tab === "code" ? (
              <div className="mt-4 rounded-2xl bg-primary-soft p-5 text-center">
                <p className="text-xs text-muted-foreground">您的 6 位取件码</p>
                <div className="mt-2 flex items-center justify-center gap-2">
                  {code.split("").map((c, i) => (
                    <span
                      key={i}
                      className="flex h-12 w-10 items-center justify-center rounded-lg bg-card text-2xl font-bold text-primary shadow"
                    >
                      {c}
                    </span>
                  ))}
                </div>
                <button
                  onClick={copyCode}
                  className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-primary"
                >
                  <Copy className="h-3.5 w-3.5" /> 复制验证码
                </button>
                <p className="mt-3 text-[11px] text-muted-foreground">
                  有效期 24 小时 · 全国蜻蜓社区驿站通用
                </p>
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                <label className="block">
                  <span className="text-xs text-muted-foreground">会员手机号</span>
                  <div className="mt-1 flex items-center gap-2 rounded-xl border-2 border-border bg-muted/40 px-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="请输入注册手机号"
                      className="min-h-[44px] flex-1 bg-transparent text-base outline-none"
                    />
                  </div>
                </label>
                <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 text-success" />
                  在驿站打印机输入此手机号即可直接打印，无需验证码。
                </p>
              </div>
            )}

            <button
              onClick={sendPrint}
              className="mt-5 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-primary text-base font-bold text-primary-foreground active:scale-[0.99]"
            >
              <Printer className="h-5 w-5" /> 发送到驿站打印
            </button>
          </div>
        </div>
      )}
    </MobileLayout>
  );
}
