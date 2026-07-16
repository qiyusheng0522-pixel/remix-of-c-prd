import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Calendar, MapPin, Users, Camera, Heart } from "lucide-react";
import { toast } from "sonner";
import coverTaichi from "@/assets/cover-taichi.jpg";
import coverTcm from "@/assets/cover-tcm-lecture.jpg";
import coverKitchen from "@/assets/cover-kitchen.jpg";
import coverDance from "@/assets/cover-square-dance.jpg";

export const Route = createFileRoute("/circle/activities/$id")({
  component: ActivityDetail,
});

const detailMap: Record<
  string,
  {
    title: string;
    date: string;
    place: string;
    joined: number;
    cap: number;
    status: "报名中" | "已结束";
    cover: string;
    desc: string;
    photos?: string[];
    review?: string;
  }
> = {
  "1": {
    title: "周六晨练 · 公园太极",
    date: "本周六 06:30 - 07:30",
    place: "阳光公园南门集合",
    joined: 18,
    cap: 30,
    status: "报名中",
    cover: coverTaichi,
    desc: "由阳光社区驿站组织，专业太极教练带队。准备：宽松衣物、防滑鞋、一瓶温水。报名后驿站会发放免费茶歇。",
  },
  "2": {
    title: "中医养生讲座",
    date: "本周日 15:00 - 16:30",
    place: "阳光社区健康驿站二楼活动厅",
    joined: 24,
    cap: 40,
    status: "报名中",
    cover: coverTcm,
    desc: "三甲医院中医科副主任医师主讲：春季养肝、防过敏、慢性胃炎日常调理。讲座结束后可一对一咨询。",
  },
  "3": {
    title: "邻里厨房 · 低盐家常菜",
    date: "下周二 10:00 - 12:00",
    place: "幸福里养生驿站厨房",
    joined: 12,
    cap: 20,
    status: "报名中",
    cover: coverKitchen,
    desc: "营养师手把手教做 3 道适合三高人群的低盐家常菜，食材现场提供，做完一起品尝。",
  },
  "4": {
    title: "广场舞队迎新表演",
    date: "上周日 19:00",
    place: "中心广场",
    joined: 56,
    cap: 60,
    status: "已结束",
    cover: coverDance,
    desc: "广场舞队迎新春表演，56 位邻居参与，现场氛围热烈。",
    photos: ["📸", "📸", "📸", "📸", "📸", "📸"],
    review: "活动反响热烈，邻居们已自发约定下个月再办一场，敬请期待。",
  },
};

function ActivityDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const a = detailMap[id];

  if (!a) {
    return (
      <div className="mx-auto min-h-screen max-w-[480px] bg-gradient-bg p-8 text-center text-muted-foreground">
        活动不存在
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-[480px] bg-gradient-bg pb-8">
      <header className="relative">
        <img
          src={a.cover}
          alt={a.title}
          width={1024}
          height={576}
          className={`aspect-[16/10] w-full object-cover ${
            a.status === "已结束" ? "grayscale" : ""
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30" />
        <button
          onClick={() => navigate({ to: "/circle/activities" })}
          className="absolute left-5 top-12 flex h-10 w-10 items-center justify-center rounded-full bg-white/30 text-white backdrop-blur-sm"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div className="absolute bottom-4 left-5 right-5 text-primary-foreground">
          <span
            className={`mb-2 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
              a.status === "报名中" ? "bg-white text-primary" : "bg-white/30 text-white"
            }`}
          >
            {a.status}
          </span>
          <h1 className="text-2xl font-bold drop-shadow">{a.title}</h1>
        </div>
      </header>

      <section className="px-5 pt-4">
        <div className="space-y-2 rounded-2xl bg-card p-4 text-base text-foreground shadow-card">
          <p className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" /> {a.date}
          </p>
          <p className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" /> {a.place}
          </p>
          <p className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" /> 已报名 {a.joined}/{a.cap} 人
          </p>
        </div>
      </section>

      <section className="px-5 pt-4">
        <h2 className="mb-2 text-lg font-bold text-foreground">活动介绍</h2>
        <p className="rounded-2xl bg-card p-4 text-base leading-relaxed text-foreground shadow-card">
          {a.desc}
        </p>
      </section>

      {a.photos && (
        <section className="px-5 pt-4">
          <h2 className="mb-2 flex items-center gap-2 text-lg font-bold text-foreground">
            <Camera className="h-5 w-5 text-primary" /> 活动现场
          </h2>
          <div className="grid grid-cols-3 gap-2">
            {a.photos.map((p, i) => (
              <button
                key={i}
                onClick={() => toast.success("已查看大图", { description: "可长按保存到相册" })}
                className="flex aspect-square items-center justify-center rounded-xl bg-muted text-4xl active:scale-95"
              >
                {p}
              </button>
            ))}
          </div>
        </section>
      )}

      {a.review && (
        <section className="px-5 pt-4">
          <h2 className="mb-2 text-lg font-bold text-foreground">活动总结</h2>
          <p className="rounded-2xl bg-success/10 p-4 text-base leading-relaxed text-foreground">
            {a.review}
          </p>
        </section>
      )}

      <div className="mt-6 px-5">
        {a.status === "报名中" ? (
          <button
            onClick={() => toast.success("报名成功！", { description: "活动开始前 1 小时蜻蜓会提醒您" })}
            className="min-h-[56px] w-full rounded-full bg-primary text-lg font-bold text-primary-foreground shadow-elevated active:scale-[0.98]"
          >
            我要报名
          </button>
        ) : (
          <button
            onClick={() => toast("已点赞 ❤️", { description: "感谢您参与这次活动" })}
            className="flex min-h-[56px] w-full items-center justify-center gap-2 rounded-full border-2 border-primary text-lg font-bold text-primary active:scale-[0.98]"
          >
            <Heart className="h-5 w-5" />
            为活动点赞
          </button>
        )}
      </div>
    </div>
  );
}
