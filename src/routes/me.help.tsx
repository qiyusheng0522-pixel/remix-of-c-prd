import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Phone, MessageCircle, ChevronDown, Send } from "lucide-react";
import { toast } from "sonner";
import { MobileLayout } from "@/components/MobileLayout";

export const Route = createFileRoute("/me/help")({
  head: () => ({
    meta: [
      { title: "帮助与反馈 - 蜻蜓健康" },
      { name: "description", content: "常见问题、客服联系与意见反馈。" },
    ],
  }),
  component: HelpPage,
});

const faqs = [
  { q: "如何上传我的体检报告？", a: "进入「我的 - 健康档案」，点击右上角「+」上传体检报告、化验单、入院单等纸质单据，蜻蜓会自动识别并归档。" },
  { q: "为什么我的血压数据没有同步？", a: "请确认您的血压计电量充足并已开启蓝牙，在「我的 - 智能设备」中点击「立即同步」即可。" },
  { q: "驿站余额怎么充值？", a: "进入「驿站 - 我的驿站」，点击「立即充值」，支持微信/支付宝/家人代付三种方式。" },
  { q: "积分如何获得和使用？", a: "完成每日打卡、上传健康数据、参与社区活动均可获得积分，可在「积分商城」兑换好礼。" },
  { q: "如何取消活动报名？", a: "进入「我的活动」，找到对应活动，点击「取消报名」即可。活动开始前 24 小时内取消会扣除部分积分。" },
  { q: "医生回复多久能收到？", a: "工作日 30 分钟内回复，紧急情况请直接拨打 120 或社区医生电话。" },
];

function HelpPage() {
  const navigate = useNavigate();
  const [open, setOpen] = useState<number | null>(0);
  const [feedback, setFeedback] = useState("");

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
        <h1 className="text-xl font-bold">帮助与反馈</h1>
      </header>

      <section className="grid grid-cols-2 gap-3 px-5 py-4">
        <button
          onClick={() => toast("正在拨打 400-888-6688", { description: "客服 09:00-21:00 在线" })}
          className="flex flex-col items-center gap-2 rounded-2xl bg-gradient-primary p-5 text-white shadow-card active:scale-[0.98]"
        >
          <Phone className="h-7 w-7" />
          <p className="text-base font-bold">客服电话</p>
          <p className="text-xs opacity-90">400-888-6688</p>
        </button>
        <button
          onClick={() => toast("正在连接在线客服…", { description: "平均等待 30 秒" })}
          className="flex flex-col items-center gap-2 rounded-2xl bg-gradient-warm p-5 text-white shadow-card active:scale-[0.98]"
        >
          <MessageCircle className="h-7 w-7" />
          <p className="text-base font-bold">在线客服</p>
          <p className="text-xs opacity-90">7×24 小时响应</p>
        </button>
      </section>

      <section className="px-5 py-2">
        <h2 className="mb-2 px-1 text-base font-bold">常见问题</h2>
        <div className="overflow-hidden rounded-2xl bg-card shadow-card">
          {faqs.map((f, i) => (
            <div key={i} className="border-b border-border last:border-0">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left active:bg-muted"
              >
                <span className="flex-1 text-base font-medium">{f.q}</span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform ${open === i ? "rotate-180" : ""}`}
                />
              </button>
              {open === i && (
                <p className="bg-muted/50 px-4 pb-4 pt-0 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="px-5 py-4">
        <h2 className="mb-2 px-1 text-base font-bold">写下您的建议</h2>
        <div className="rounded-2xl bg-card p-4 shadow-card">
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="哪里用得不顺手？您的建议对蜻蜓很重要～"
            className="min-h-[120px] w-full resize-none rounded-xl bg-muted p-3 text-base outline-none placeholder:text-muted-foreground"
          />
          <button
            onClick={() => {
              if (!feedback.trim()) {
                toast("请先写一点建议吧～");
                return;
              }
              toast.success("反馈已提交", { description: "感谢您！3 个工作日内回复" });
              setFeedback("");
            }}
            className="mt-3 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-primary text-base font-bold text-primary-foreground active:scale-[0.98]"
          >
            <Send className="h-5 w-5" />
            提交反馈
          </button>
        </div>
      </section>
    </MobileLayout>
  );
}
