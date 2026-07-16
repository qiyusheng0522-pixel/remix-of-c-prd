import { createFileRoute } from "@tanstack/react-router";
import { ScanLine, Camera, FileText, AlertTriangle, Sparkles, Clock } from "lucide-react";
import { ModulePage, Card, FeatureGrid } from "@/components/ModulePage";

export const Route = createFileRoute("/health/ocr")({
  head: () => ({ meta: [{ title: "OCR 病历识别 - 蜻蜓健康" }] }),
  component: Page,
});

const recent = [
  { name: "血常规化验单", date: "5 月 18 日", tag: "正常", color: "text-success" },
  { name: "心电图报告", date: "5 月 12 日", tag: "1 项异常", color: "text-warning" },
  { name: "出院小结 · 协和医院", date: "3 月 18 日", tag: "已激活康复", color: "text-primary" },
];

function Page() {
  return (
    <ModulePage
      title="OCR 病历识别"
      subtitle="拍一拍 · 30 秒结构化入档 · 危急值提醒"
      gradient="from-cyan-400 to-blue-500"
      Icon={ScanLine}
    >
      <Card>
        <button className="flex w-full items-center gap-4 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 p-5 text-white active:scale-[0.98]">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
            <Camera className="h-8 w-8" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-lg font-bold">拍照上传病历</p>
            <p className="text-sm opacity-90">化验单 / 处方 / 出院小结 / CT 报告</p>
          </div>
        </button>
      </Card>

      <FeatureGrid
        items={[
          { icon: FileText, label: "从相册选择" },
          { icon: ScanLine, label: "驿站代扫描", desc: "老年纸质病历专属" },
          { icon: Sparkles, label: "AI 深度解读", desc: "化验+病理+影像" },
          { icon: AlertTriangle, label: "危急值提醒", desc: "5 秒紧急推送" },
        ]}
      />

      <Card title="最近上传">
        <ul className="space-y-3">
          {recent.map((r) => (
            <li key={r.name} className="flex items-center gap-3 rounded-xl bg-muted/40 p-3">
              <FileText className="h-6 w-6 text-cyan-600" />
              <div className="flex-1">
                <p className="font-semibold">{r.name}</p>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" /> {r.date}
                </p>
              </div>
              <span className={`text-xs font-bold ${r.color}`}>{r.tag}</span>
            </li>
          ))}
        </ul>
      </Card>
    </ModulePage>
  );
}
