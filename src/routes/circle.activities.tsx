import { createFileRoute, Link } from "@tanstack/react-router";
import { Calendar, MapPin, Users, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { ShareButton } from "@/components/ShareButton";
import coverTaichi from "@/assets/cover-taichi.jpg";
import coverTcm from "@/assets/cover-tcm-lecture.jpg";
import coverKitchen from "@/assets/cover-kitchen.jpg";
import coverDance from "@/assets/cover-square-dance.jpg";

export const Route = createFileRoute("/circle/activities")({
  component: CircleActivities,
});

const activities = [
  {
    id: "1",
    title: "周六晨练 · 公园太极",
    date: "本周六 06:30",
    place: "阳光公园南门",
    joined: 18,
    cap: 30,
    status: "报名中",
    color: "bg-primary",
    cover: coverTaichi,
  },
  {
    id: "2",
    title: "中医养生讲座",
    date: "本周日 15:00",
    place: "阳光社区健康驿站",
    joined: 24,
    cap: 40,
    status: "报名中",
    color: "bg-secondary",
    cover: coverTcm,
  },
  {
    id: "3",
    title: "邻里厨房 · 低盐家常菜",
    date: "下周二 10:00",
    place: "幸福里养生驿站",
    joined: 12,
    cap: 20,
    status: "报名中",
    color: "bg-success",
    cover: coverKitchen,
  },
  {
    id: "4",
    title: "广场舞队迎新表演",
    date: "上周日",
    place: "中心广场",
    joined: 56,
    cap: 60,
    status: "已结束",
    color: "bg-muted-foreground",
    cover: coverDance,
  },
];

function CircleActivities() {
  return (
    <div className="space-y-3">
      {activities.map((a) => (
        <Link
          key={a.id}
          to="/circle/activities/$id"
          params={{ id: a.id }}
          className="block rounded-2xl bg-card p-4 shadow-card active:scale-[0.99]"
        >
          <div className="relative mb-3 overflow-hidden rounded-xl">
            <img
              src={a.cover}
              alt={a.title}
              loading="lazy"
              width={1024}
              height={576}
              className={`aspect-[16/9] w-full object-cover ${
                a.status === "已结束" ? "grayscale" : ""
              }`}
            />
            <span
              className={`absolute right-2 top-2 rounded-full px-3 py-1 text-xs font-semibold text-white shadow-card ${a.color}`}
            >
              {a.status}
            </span>
          </div>

          <header className="mb-3 flex items-start justify-between gap-3">
            <h2 className="flex items-center gap-1 text-lg font-bold text-foreground">
              {a.title}
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </h2>
            <span onClick={(e) => e.preventDefault()}>
              <ShareButton variant="icon" title={`一起来：${a.title}`} desc={`${a.date} · ${a.place}`} />
            </span>
          </header>

          <div className="space-y-1.5 text-base text-foreground">
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

          {a.status === "报名中" ? (
            <button
              onClick={(e) => {
                e.preventDefault();
                toast.success("报名成功！", { description: "活动开始前 1 小时蜻蜓会提醒您" });
              }}
              className="mt-3 min-h-[52px] w-full rounded-full bg-primary text-base font-bold text-primary-foreground shadow-card active:scale-[0.98]"
            >
              我要报名
            </button>
          ) : (
            <p className="mt-3 text-center text-sm text-muted-foreground">点击查看活动回顾</p>
          )}
        </Link>
      ))}
    </div>
  );
}
