import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ShieldCheck, CheckCircle2, UserRound, Building2 } from "lucide-react";
import { MobileLayout } from "@/components/MobileLayout";

export const Route = createFileRoute("/partners/$id")({
  component: PartnerDetail,
});

type Doctor = {
  name: string;
  dept: string;
  hospital: string;
  title?: string;
  expert: string;
};

const doctors: Doctor[] = [
  { name: "王琦", dept: "中医未病学", hospital: "北京中医药大学", title: "中国工程院院士", expert: "中医消化、呼吸、内分泌、免疫及男科常见与疑难杂症" },
  { name: "顾晓松", dept: "神经内科", hospital: "南通大学", title: "中国工程院院士", expert: "组织工程神经与神经再生研究" },
  { name: "陈晓虎", dept: "心血管内科", hospital: "江苏省中医院", title: "主任医师/教授", expert: "高血压、心力衰竭、冠心病中西医结合心血管专业30年" },
  { name: "于雪", dept: "心血管内科", hospital: "北京医院", title: "主任医师", expert: "冠心病急性心梗急危重症、PCI、老年心血管综合治疗" },
  { name: "杨刚", dept: "心血管内科", hospital: "南京医科大学第一附属医院", title: "主任医师", expert: "心力衰竭、冠心病、心律失常、心肌病、高血压" },
  { name: "吕东岭", dept: "心血管内科", hospital: "江苏省人民医院", title: "主任医师", expert: "冠心病、高血压介入治疗15年以上" },
  { name: "陈伟", dept: "临床营养科", hospital: "北京协和医院", title: "主任医师/教授", expert: "老年营养不良、肌少症营养干预、医学营养减重" },
  { name: "毕艳", dept: "内分泌科", hospital: "南京鼓楼医院", title: "主任医师/教授", expert: "1型/2型糖尿病一体化诊治、甲状腺、肾上腺疾病" },
  { name: "张群", dept: "健康管理中心", hospital: "南京医科大学第一附属医院", title: "主任医师/教授", expert: "呼吸系统慢病诊疗与健康管理" },
  { name: "王静", dept: "健康管理中心", hospital: "南京鼓楼医院", title: "主任医师", expert: "非传染性慢病营养与代谢治疗（肥胖、糖尿病、高血压、高尿酸）" },
  { name: "吴超", dept: "感染性疾病科", hospital: "南京鼓楼医院", title: "主任医师/教授", expert: "肝炎、肝硬化、脂肪肝、免疫性肝病、胆道感染" },
  { name: "陆晓", dept: "康复医学科", hospital: "南京医科大学第一附属医院", title: "主任医师/教授", expert: "心脑血管疾病及重症康复、神经康复、疼痛重症康复" },
  { name: "吴文忠", dept: "针灸康复科", hospital: "江苏省中医院", title: "主任医师/医学博士", expert: "中风、面瘫、失眠等神经系统疾病，针灸治疗多年" },
  { name: "蒋青", dept: "运动医学与成人重建外科", hospital: "南京鼓楼医院", title: "主任医师", expert: "关节疾病及运动损伤、髋膝关节置换、韧带重建" },
  { name: "宋纯理", dept: "骨科", hospital: "北京大学第三医院", title: "研究员/教授", expert: "骨质疏松、骨折愈合、骨骼退行性疾病" },
  { name: "陈爱国", dept: "运动心理", hospital: "南京体育学院", title: "二级教授/博导", expert: "体育运动与心理学、居家健身心理一体化平台" },
  { name: "秦学林", dept: "运动康复", hospital: "南京体育学院", title: "硕士研究生导师", expert: "运动康复、老年及慢病居家运动与康复" },
];

const HOSPITAL_INFO: Record<string, { name: string; detail: string; highlights: string[] }> = {
  gulou: { name: "南京鼓楼医院", detail: "全科室陪诊、专家号预约、报告解读、专病营养餐直达病房，会员绿色通道。", highlights: ["陪诊服务", "报告解读", "专病营养餐直达"] },
  jsph: { name: "江苏省人民医院", detail: "心内科、内分泌科专家团队签约，为亚寰会员提供出院后 90 天全病程随访。", highlights: ["心血管随访", "血糖管理", "全病程陪伴"] },
  njtcm: { name: "南京市中医院", detail: "名老中医团队提供体质辨识、针灸康复、中药代煎服务。", highlights: ["体质辨识", "针灸康复", "中药代煎"] },
  jstcm: { name: "江苏省中医院", detail: "名老中医团队提供四季养生茶饮、膏方与中药代煎服务。", highlights: ["养生茶饮", "四季膏方", "中药代煎"] },
  njmu1: { name: "南京医科大学第一附属医院", detail: "呼吸慢病与康复医学专家团队为亚寰会员提供全周期智慧管理方案。", highlights: ["呼吸慢病", "康复医学", "健康管理"] },
};

function PartnerDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();

  if (id === "yahuan") {
    return (
      <MobileLayout>
        <div className="min-h-screen bg-gradient-to-b from-primary-soft/30 to-background pb-8">
          <header className="flex items-center gap-3 px-4 pt-10 pb-4">
            <button onClick={() => navigate({ to: "/partners" })} aria-label="返回" className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-card">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-xl font-bold">江苏亚寰健康</h1>
          </header>

          <div className="mx-4 rounded-2xl bg-white p-5 shadow-card">
            <div className="mb-2 flex items-center gap-2 text-primary">
              <ShieldCheck className="h-5 w-5" />
              <span className="text-xs font-bold">蜻蜓康健 · 科研合作专家名单</span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              江苏亚寰健康与南京三甲医院及全国权威专家团队建立循证合作，联合开展慢病管理、专病营养、康复运动等课题研究。
            </p>
          </div>

          <div className="mx-4 mt-4 mb-2 flex items-center gap-2 text-sm font-bold">
            <Building2 className="h-4 w-4 text-primary" /> 合作三甲医院
          </div>
          <div className="mx-4 flex flex-wrap gap-2">
            {Object.entries(HOSPITAL_INFO).map(([hid, h]) => (
              <button key={hid} onClick={() => navigate({ to: "/partners/$id", params: { id: hid } })} className="rounded-full bg-white px-3 py-1.5 text-xs shadow-card active:scale-95">
                {h.name}
              </button>
            ))}
          </div>

          <div className="mx-4 mt-5 mb-2 flex items-center gap-2 text-sm font-bold">
            <UserRound className="h-4 w-4 text-primary" /> 合作专家（部分名单）
          </div>
          <div className="space-y-2 px-4">
            {doctors.map((d) => (
              <div key={d.name} className="rounded-2xl bg-white p-4 shadow-card">
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold">{d.name}</span>
                  <span className="rounded-full bg-primary-soft px-2 py-0.5 text-[10px] text-primary">{d.dept}</span>
                  {d.title && <span className="text-[10px] text-muted-foreground">{d.title}</span>}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{d.hospital}</p>
                <p className="mt-1 text-xs leading-relaxed">擅长：{d.expert}</p>
              </div>
            ))}
          </div>
        </div>
      </MobileLayout>
    );
  }

  const info = HOSPITAL_INFO[id] ?? HOSPITAL_INFO.gulou;
  const hospitalDoctors = doctors.filter((d) => d.hospital === info.name);

  return (
    <MobileLayout>
      <div className="min-h-screen bg-gradient-to-b from-primary-soft/30 to-background pb-8">
        <header className="flex items-center gap-3 px-4 pt-10 pb-4">
          <button onClick={() => navigate({ to: "/partners" })} aria-label="返回" className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-card">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-bold">合作介绍</h1>
        </header>

        <div className="mx-4 rounded-2xl bg-white p-5 shadow-card">
          <div className="mb-2 flex items-center gap-2 text-primary">
            <ShieldCheck className="h-5 w-5" />
            <span className="text-xs font-bold">江苏亚寰健康 · 循证合作</span>
          </div>
          <h2 className="mb-3 text-xl font-bold">{info.name}</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">{info.detail}</p>
          <div className="mt-5 space-y-2">
            {info.highlights.map((h) => (
              <div key={h} className="flex items-center gap-2 rounded-xl bg-primary-soft/40 px-3 py-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold">{h}</span>
              </div>
            ))}
          </div>
        </div>

        {hospitalDoctors.length > 0 && (
          <>
            <div className="mx-4 mt-5 mb-2 flex items-center gap-2 text-sm font-bold">
              <UserRound className="h-4 w-4 text-primary" /> 合作专家
            </div>
            <div className="space-y-2 px-4">
              {hospitalDoctors.map((d) => (
                <div key={d.name} className="rounded-2xl bg-white p-4 shadow-card">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold">{d.name}</span>
                    <span className="rounded-full bg-primary-soft px-2 py-0.5 text-[10px] text-primary">{d.dept}</span>
                    {d.title && <span className="text-[10px] text-muted-foreground">{d.title}</span>}
                  </div>
                  <p className="mt-1 text-xs leading-relaxed">擅长：{d.expert}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </MobileLayout>
  );
}
