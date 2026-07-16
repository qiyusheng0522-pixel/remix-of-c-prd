// 健康管理师端 - Mock 数据
// 复用 admin/mockData 的 C_USERS 作为基础，并补充本端专属的预警、任务、绩效数据

import { C_USERS, type CUser } from "@/admin/mockData";

// 我（孙健康）负责的用户 ID 列表（从 C_USERS 中挑选）
export const MY_USER_IDS = ["U10001", "U10002", "U10005", "U10006", "U10008"];

export function myUsers(): CUser[] {
  return C_USERS.filter((u) => MY_USER_IDS.includes(u.id));
}

// ============= 预警 =============
export type AlertCategory = "indicator" | "behavior" | "risk" | "device" | "service";
export type AlertSeverity = "P0" | "P1" | "P2";

export interface HealthAlert {
  id: string;
  userId: string;
  userName: string;
  category: AlertCategory;
  subType: string; // 血糖/血压/用药/复诊/设备离线...
  severity: AlertSeverity;
  title: string;
  detail: string;
  data?: string; // 异常具体数值
  triggeredAt: string;
  status: "pending" | "processing" | "done";
  // AI 推荐
  aiSuggestion: {
    plan: string; // 建议方案
    script: string; // 一键话术
    nextAction: "call" | "message" | "dispatch" | "visit";
  };
}

export const ALERT_CATEGORY_LABEL: Record<AlertCategory, string> = {
  indicator: "健康指标异常",
  behavior: "行为依从性",
  risk: "风险等级预警",
  device: "设备与数据",
  service: "服务与任务",
};

export const ALERTS: HealthAlert[] = [
  {
    id: "AL2001", userId: "U10001", userName: "王建国",
    category: "indicator", subType: "血压",
    severity: "P0",
    title: "血压连续 3 天偏高",
    detail: "近 3 日晨起血压均高于 160/100，超出目标值 140/90",
    data: "今日 165/102 mmHg",
    triggeredAt: "今天 07:32",
    status: "pending",
    aiSuggestion: {
      plan: "建议：① 立即电话回访确认服药情况；② 提醒今晚加测一次；③ 若持续，预约李医生在线复诊调整剂量",
      script: "王叔叔早，我是您的健康管理师小孙。注意到您最近 3 天血压都比较高，今天 165/102。请问您氨氯地平昨晚有按时服用吗？最近有没有头晕、乏力的情况？我建议今晚再测一次，如果还是高，我帮您约李医生明天在线看一下，您看可以吗？",
      nextAction: "call",
    },
  },
  {
    id: "AL2002", userId: "U10002", userName: "陈秀英",
    category: "indicator", subType: "血糖",
    severity: "P1",
    title: "餐后血糖偏高",
    detail: "今日午餐后 2 小时血糖 12.8 mmol/L（目标 ≤ 10）",
    data: "12.8 mmol/L",
    triggeredAt: "今天 14:15",
    status: "pending",
    aiSuggestion: {
      plan: "建议：发送饮食提醒话术，附《糖友外食指南》；3 天内监测餐后血糖趋势，连续高需升级",
      script: "陈阿姨好，注意到您今天餐后血糖有点高（12.8）。是不是中午吃了什么主食类比较多？我给您发一份《糖友外食小卡片》，下次外出可以参考。今晚和明天再监测两次餐后血糖，我会一直关注～",
      nextAction: "message",
    },
  },
  {
    id: "AL2003", userId: "U10005", userName: "孙国安",
    category: "behavior", subType: "用药",
    severity: "P1",
    title: "连续 2 天未打卡服药",
    detail: "降压药用药打卡缺失 2 天",
    triggeredAt: "今天 09:00",
    status: "pending",
    aiSuggestion: {
      plan: "建议：电话提醒并询问原因；如老人独居，建议同步家属代管账号开启提醒",
      script: "孙叔叔好，最近两天没看到您打卡吃药，是忘记打卡还是没吃？高血压药一定要按时吃哦。需要我帮您把儿子加进家庭代管，让他也提醒您一下吗？",
      nextAction: "call",
    },
  },
  {
    id: "AL2004", userId: "U10001", userName: "王建国",
    category: "behavior", subType: "复诊",
    severity: "P2",
    title: "已超预约复诊时间 2 天",
    detail: "原定 4 月 16 日李医生复诊，未到诊未改约",
    triggeredAt: "昨天 18:00",
    status: "processing",
    aiSuggestion: {
      plan: "建议：发送改约链接，提供周末时段",
      script: "王叔叔，您和李医生 16 号的复诊还没完成，方便重新约一下吗？我看到本周六上午 9-11 点李医生有空，需要我直接帮您约上吗？",
      nextAction: "message",
    },
  },
  {
    id: "AL2005", userId: "U10008", userName: "黄丽华",
    category: "risk", subType: "风险等级升级",
    severity: "P0",
    title: "风险等级由 中 升至 高",
    detail: "近 7 日血糖 + 血压综合评估，AI 模型判定风险升级",
    triggeredAt: "今天 06:00",
    status: "pending",
    aiSuggestion: {
      plan: "建议：① 立即更新用户标签为「重点关怀」；② 转 P0 队列，约王医生 24h 内介入；③ 同步通知主治营养师调整方案",
      script: "（内部协作话术）@王医生 黄丽华今日风险升级为高，主要是血糖+血压双指标恶化，建议您今天内安排一次在线问诊。",
      nextAction: "dispatch",
    },
  },
  {
    id: "AL2006", userId: "U10006", userName: "周敏",
    category: "device", subType: "设备离线",
    severity: "P2",
    title: "智能手环离线 5 天",
    detail: "未上传心率/睡眠数据",
    triggeredAt: "今天 08:00",
    status: "pending",
    aiSuggestion: {
      plan: "建议：发送设备使用提示卡片，附蓝牙连接教程",
      script: "周姐好～发现您的手环最近 5 天没有数据上传。是不是没充电或者没戴呀？我把连接教程发给您，按步骤试试就好啦。",
      nextAction: "message",
    },
  },
  {
    id: "AL2007", userId: "U10005", userName: "孙国安",
    category: "service", subType: "随访超时",
    severity: "P1",
    title: "本周随访任务已超时 1 天",
    detail: "周三应完成的电话随访未执行",
    triggeredAt: "今天 09:30",
    status: "pending",
    aiSuggestion: {
      plan: "建议：今日内补做一次电话随访并补齐记录",
      script: "（操作提醒）请尽快完成本次随访并在工作台「待处理服务」中提交结果。",
      nextAction: "call",
    },
  },
];

// ============= 任务 =============
export interface HmTask {
  id: string;
  userName: string;
  type: "电话随访" | "方案调整" | "服务派单" | "新用户分诊" | "复诊提醒";
  detail: string;
  dueAt: string;
  status: "todo" | "doing" | "done";
}

export const TASKS: HmTask[] = [
  { id: "T01", userName: "王建国", type: "电话随访", detail: "确认本周血压用药执行情况", dueAt: "今天 17:00", status: "todo" },
  { id: "T02", userName: "陈秀英", type: "方案调整", detail: "更新糖尿病饮食方案 v2", dueAt: "今天 18:00", status: "doing" },
  { id: "T03", userName: "新用户·138****0921", type: "新用户分诊", detail: "完成首次量表后建立健康档案", dueAt: "明天", status: "todo" },
  { id: "T04", userName: "黄丽华", type: "服务派单", detail: "派单营养师上门评估", dueAt: "今天", status: "todo" },
  { id: "T05", userName: "周敏", type: "复诊提醒", detail: "下周一复诊提醒已发送", dueAt: "已完成", status: "done" },
];

// ============= 绩效 =============
export const KPI = {
  myUserCount: 32,
  taskDone: 18,
  taskTotal: 24,
  alertHandledOnTime: 0.92, // 92%
  improvementRate: 0.68, // 用户健康指标改善率
};

export const TEAM_MEMBERS = [
  { id: "M1", name: "孙健康", isMe: true, users: 32, taskDone: "75%", improve: "68%", quality: "A" },
  { id: "M2", name: "李红", isMe: false, users: 28, taskDone: "82%", improve: "71%", quality: "A+" },
  { id: "M3", name: "陈芳", isMe: false, users: 30, taskDone: "70%", improve: "65%", quality: "B" },
  { id: "M4", name: "刘洋", isMe: false, users: 35, taskDone: "65%", improve: "60%", quality: "B" },
];

export const FOLLOWUP_QC = [
  { id: "Q1", member: "孙健康", user: "王建国", at: "本周二", score: 95, comment: "话术规范，记录详细" },
  { id: "Q2", member: "李红", user: "刘建", at: "本周一", score: 88, comment: "缺少健康教育内容" },
];
