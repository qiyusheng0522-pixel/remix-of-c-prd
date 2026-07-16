import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Upload,
  Plus,
  TrendingUp,
  TrendingDown,
  Pill,
  Activity,
  AlertCircle,
  Users,
  Scissors,
  FileText,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { IndicatorEntryModal } from "@/components/IndicatorEntryModal";
import avatarFull from "@/assets/avatar-fullbody.png";

export const Route = createFileRoute("/health/records")({
  head: () => ({
    meta: [
      { title: "健康档案 - 蜻蜓健康" },
      { name: "description", content: "查看您的健康分、关键指标、病史和用药记录。" },
    ],
  }),
  component: HealthRecords,
});

const dimensions = [
  { label: "饮食均衡", score: 90, color: "bg-success", text: "text-success" },
  { label: "运动强度", score: 75, color: "bg-warning", text: "text-warning" },
  { label: "生活习惯", score: 85, color: "bg-success", text: "text-success" },
];

const indicators = [
  { label: "血压", value: "120/80", unit: "mmHg", status: "正常", trend: "down" },
  { label: "血糖", value: "5.6", unit: "mmol/L", status: "正常", trend: "up" },
  { label: "心率", value: "72", unit: "次/分", status: "正常", trend: "up" },
  { label: "体重", value: "65", unit: "kg", status: "正常", trend: "down" },
];

const diseases = [
  { name: "2 型糖尿病", since: "2018 年确诊", status: "控制中" },
  { name: "高血压（轻度）", since: "2020 年确诊", status: "控制中" },
];

const medications = [
  { name: "二甲双胍片", dose: "0.5g × 3 次/日", time: "餐后服用", remaining: 18 },
  { name: "缬沙坦胶囊", dose: "80mg × 1 次/日", time: "晨起服用", remaining: 24 },
];

const allergies = ["青霉素", "海鲜（轻度）"];

const familyHistory = [
  { relation: "父亲", disease: "高血压、冠心病" },
  { relation: "母亲", disease: "2 型糖尿病" },
];

const surgeries = [
  { name: "胆囊切除术", year: "2015 年", hospital: "市第一人民医院" },
];

const reports = [
  { title: "2024 年度体检报告", date: "2024-09-12", from: "阳光体检中心" },
  { title: "心电图检查", date: "2024-06-08", from: "社区医院" },
];

const badHabits = [
  "在外就餐频繁",
  "不按时就餐",
  "奶制品摄入不足",
  "饮水量不足",
  "进餐速度快",
];

function HealthRecords() {
  const [entryOpen, setEntryOpen] = useState(false);
  const [entryMode, setEntryMode] = useState<"bp" | "bg">("bp");
  return (
    <div className="mx-auto min-h-screen max-w-[480px] bg-gradient-bg pb-8">
      {/* 顶部 */}
      <header className="bg-gradient-primary px-5 pb-16 pt-12 text-primary-foreground">
        <Link
          to="/health"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm"
        >
          <ArrowLeft className="h-6 w-6" />
        </Link>

        <div className="mt-4">
          <h1 className="text-2xl font-bold">王秀英 的健康档案</h1>
          <p className="mt-1 text-base opacity-90">女 · 68岁 · 阳光社区</p>
        </div>
      </header>

      {/* 健康分主卡 */}
      <section className="-mt-10 px-5">
        <div className="rounded-3xl bg-card p-6 shadow-elevated">
          <div className="flex items-center gap-5">
            <div className="relative flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-success">
              <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-card">
                <span className="text-4xl font-bold text-primary">85</span>
                <span className="text-xs font-medium text-muted-foreground">分</span>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-base text-muted-foreground">健康评分</p>
              <p className="mt-1 text-xl font-bold text-success">良好</p>
              <p className="mt-1 text-sm text-muted-foreground">
                饮食规律作息均衡
                <br />
                较上周 +3 分
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {dimensions.map((d) => (
              <div key={d.label}>
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-base font-semibold text-foreground">
                    {d.label}
                  </span>
                  <span className={`text-lg font-bold ${d.text}`}>
                    {d.score}分
                  </span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full ${d.color}`}
                    style={{ width: `${d.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2 text-center text-sm">
            <div className="rounded-xl bg-destructive/10 py-2">
              <div className="font-bold text-destructive">60-</div>
              <div className="text-xs text-muted-foreground">风险偏高</div>
            </div>
            <div className="rounded-xl bg-warning/15 py-2">
              <div className="font-bold text-warning">70-79</div>
              <div className="text-xs text-muted-foreground">良好区间</div>
            </div>
            <div className="rounded-xl bg-success/15 py-2">
              <div className="font-bold text-success">80+</div>
              <div className="text-xs text-muted-foreground">优秀区间</div>
            </div>
          </div>
        </div>
      </section>

      {/* 关键指标 */}
      <section className="mt-5 px-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">关键指标</h2>
          <button
            onClick={() => {
              setEntryMode("bp");
              setEntryOpen(true);
            }}
            className="flex items-center gap-1 text-sm font-semibold text-primary"
          >
            <Plus className="h-4 w-4" /> 录入数据
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {indicators.map((i) => {
            const TrendIcon = i.trend === "up" ? TrendingUp : TrendingDown;
            return (
              <button
                key={i.label}
                onClick={() => {
                  if (i.label === "血压") {
                    setEntryMode("bp");
                    setEntryOpen(true);
                  } else if (i.label === "血糖") {
                    setEntryMode("bg");
                    setEntryOpen(true);
                  } else {
                    toast.success(`${i.label} 近 30 天趋势`, {
                      description: `当前 ${i.value}${i.unit} · ${i.status}，整体平稳`,
                    });
                  }
                }}
                className="rounded-2xl bg-card p-4 text-left shadow-card active:scale-[0.98]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-base font-medium text-muted-foreground">
                    {i.label}
                  </span>
                  <TrendIcon
                    className={`h-4 w-4 ${
                      i.trend === "up" ? "text-success" : "text-primary"
                    }`}
                  />
                </div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-foreground">
                    {i.value}
                  </span>
                  <span className="text-sm text-muted-foreground">{i.unit}</span>
                </div>
                <div className="mt-1 inline-block rounded-full bg-success/15 px-2 py-0.5 text-xs font-semibold text-success">
                  {i.status}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 病史记录 */}
      <section className="mt-5 px-5">
        <SectionHeader
          icon={Activity}
          title="病史记录"
          onAdd={() => toast.success("已添加病史 · 高血脂", { description: "已并入档案，方案将自动调整" })}
        />
        <div className="mt-3 space-y-2 rounded-2xl bg-card p-4 shadow-card">
          {diseases.map((d) => (
            <div
              key={d.name}
              className="flex items-center justify-between border-b border-border py-2 last:border-0"
            >
              <div>
                <p className="text-base font-bold text-foreground">{d.name}</p>
                <p className="text-sm text-muted-foreground">{d.since}</p>
              </div>
              <span className="rounded-full bg-warning/15 px-3 py-1 text-sm font-semibold text-warning">
                {d.status}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 用药管理 */}
      <section className="mt-5 px-5">
        <SectionHeader
          icon={Pill}
          title="用药管理"
          onAdd={() => toast.success("已添加用药 · 阿司匹林", { description: "服药提醒已设置：每日 8:00" })}
        />
        <div className="mt-3 space-y-3">
          {medications.map((m) => (
            <div key={m.name} className="rounded-2xl bg-card p-4 shadow-card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-lg font-bold text-foreground">{m.name}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {m.dose} · {m.time}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-sm font-semibold ${
                    m.remaining < 20
                      ? "bg-destructive/10 text-destructive"
                      : "bg-success/15 text-success"
                  }`}
                >
                  剩余 {m.remaining} 天
                </span>
              </div>
              <button
                onClick={() => toast(`已为 ${m.name} 设置提醒`, { description: "我们会按时间提醒您服药" })}
                className="mt-3 min-h-[44px] w-full rounded-xl bg-primary-soft text-sm font-bold text-primary"
              >
                设置服药提醒
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 过敏史 */}
      <section className="mt-5 px-5">
        <SectionHeader
          icon={AlertCircle}
          title="过敏史"
          onAdd={() => toast.success("已添加过敏源", { description: "用药与饮食方案将自动规避" })}
        />
        <div className="mt-3 flex flex-wrap gap-2 rounded-2xl bg-card p-4 shadow-card">
          {allergies.map((a) => (
            <span
              key={a}
              className="rounded-full bg-destructive/10 px-3 py-1.5 text-sm font-semibold text-destructive"
            >
              ⚠️ {a}
            </span>
          ))}
        </div>
      </section>

      {/* 家族病史 */}
      <section className="mt-5 px-5">
        <SectionHeader
          icon={Users}
          title="家族病史"
          onAdd={() => toast.success("已添加家族病史", { description: "已用于风险评估与体检建议" })}
        />
        <div className="mt-3 rounded-2xl bg-card p-4 shadow-card">
          {familyHistory.map((f) => (
            <div
              key={f.relation}
              className="flex items-center justify-between border-b border-border py-2 last:border-0"
            >
              <span className="text-base font-bold text-foreground">{f.relation}</span>
              <span className="text-sm text-muted-foreground">{f.disease}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 手术史 */}
      <section className="mt-5 px-5">
        <SectionHeader
          icon={Scissors}
          title="手术史"
          onAdd={() => toast.success("已添加手术记录", { description: "如需上传出院小结，可前往体检报告区" })}
        />
        <div className="mt-3 rounded-2xl bg-card p-4 shadow-card">
          {surgeries.map((s) => (
            <div key={s.name}>
              <p className="text-base font-bold text-foreground">{s.name}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {s.year} · {s.hospital}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 体检报告 */}
      <section className="mt-5 px-5">
        <SectionHeader icon={FileText} title="体检报告" />
        <div className="mt-3 space-y-2">
          {reports.map((r) => (
            <button
              key={r.title}
              onClick={() => toast.success(`已打开 ${r.title}`, { description: "AI 解读：各项指标基本正常，详情请见档案" })}
              className="flex w-full items-center gap-3 rounded-2xl bg-card p-4 text-left shadow-card active:scale-[0.98]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-base font-bold text-foreground">{r.title}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {r.date} · {r.from}
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>
          ))}
          <button
            onClick={() => toast("上传体检报告", { description: "请选择电子病历或入院出院单" })}
            className="flex w-full items-center gap-3 rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 p-4 text-left active:scale-[0.98]"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-base font-bold text-primary">上传体检报告</p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                电子病历 / 入院出院单
              </p>
            </div>
          </button>
        </div>
      </section>

      {/* 健康目标 */}
      <section className="mt-5 px-5">
        <div className="rounded-2xl bg-card p-5 shadow-card">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">健康目标</h2>
            <button
              onClick={() => toast.success("已添加新目标", { description: "「每天 6000 步」已加入打卡列表" })}
              className="flex items-center gap-1 text-sm font-semibold text-primary"
            >
              <Plus className="h-4 w-4" />
              添加目标
            </button>
          </div>

          <div className="mt-4 inline-block rounded-lg bg-primary-soft px-3 py-1 text-sm font-semibold text-primary">
            体重管理
          </div>

          <div className="mt-4 grid grid-cols-3 divide-x divide-border text-center">
            <div>
              <div className="text-xs text-muted-foreground">目标值</div>
              <div className="mt-1 text-2xl font-bold text-foreground">60</div>
              <div className="text-xs text-muted-foreground">kg</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">达标率</div>
              <div className="mt-1 text-2xl font-bold text-warning">75%</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">坚持天数</div>
              <div className="mt-1 text-2xl font-bold text-success">28</div>
            </div>
          </div>
        </div>
      </section>

      {/* 不良生活方式 */}
      <section className="mt-5 px-5">
        <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 p-5 shadow-card">
          <h2 className="text-xl font-bold text-foreground">健康评估</h2>
          <p className="mt-1 text-sm text-muted-foreground">需要关注的生活方式</p>

          <div className="mt-4 flex items-center gap-2">
            <img
              src={avatarFull}
              alt="健康评估"
              width={768}
              height={1536}
              loading="lazy"
              className="h-56 w-auto object-contain"
            />
            <div className="flex-1 space-y-2">
              {badHabits.map((h) => (
                <div
                  key={h}
                  className="rounded-full bg-accent px-3 py-1.5 text-center text-sm font-semibold text-accent-foreground shadow-soft"
                >
                  {h}
                </div>
              ))}
            </div>
          </div>
          <Link
            to="/health/plan"
            className="mt-4 flex min-h-[52px] w-full items-center justify-center rounded-xl bg-primary text-base font-bold text-primary-foreground shadow-soft active:scale-[0.98]"
          >
            查看蜻蜓为您定制的方案
          </Link>
        </div>
      </section>

      <IndicatorEntryModal
        open={entryOpen}
        onOpenChange={setEntryOpen}
        initialMode={entryMode}
      />
    </div>
  );
}

function SectionHeader({
  icon: Icon,
  title,
  onAdd,
}: {
  icon: typeof Pill;
  title: string;
  onAdd?: () => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="flex items-center gap-2 text-xl font-bold text-foreground">
        <Icon className="h-6 w-6 text-primary" />
        {title}
      </h2>
      {onAdd && (
        <button
          onClick={onAdd}
          className="flex items-center gap-1 text-sm font-semibold text-primary"
        >
          <Plus className="h-4 w-4" /> 添加
        </button>
      )}
    </div>
  );
}
