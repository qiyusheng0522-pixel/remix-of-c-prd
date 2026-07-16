// Mock 数据 —— 供后台演示使用

export interface CUser {
  id: string;
  name: string;
  phone: string;
  age: number;
  gender: "男" | "女";
  region: string;
  registerAt: string;
  lastActiveAt: string;
  tags: string[];
  healthLabel: string; // 高血压/糖尿病/亚健康/健康
  riskLevel: "高" | "中" | "低";
  /** 主治医生（兼容旧字段，等同 assignedDoctors 中 isPrimary=true 那位的 name） */
  assignedDoctor?: string;
  /** 主营养师（兼容旧字段） */
  assignedNutritionist?: string;
  /** 多医生分配：一个用户可同时由多位医生协同管理（如「高血压 + 糖尿病」由不同医生负责） */
  assignedDoctors?: AssignedStaff[];
  /** 多营养师分配 */
  assignedNutritionists?: AssignedStaff[];
  source: "App 注册" | "门店转化" | "企业导入" | "活动拉新";
  status: "活跃" | "服务中" | "流失风险" | "已流失";
}

/** 分配关系：谁负责该用户的哪个病症 */
export interface AssignedStaff {
  staffId: string;
  name: string;
  /** 该医护负责的病症/方向，例如「高血压」「糖尿病」「术后康复」 */
  condition: string;
  /** 是否主治（每类角色仅 1 位为主） */
  isPrimary: boolean;
  assignedAt: string;
}

export const C_USERS: CUser[] = [
  { id: "U10001", name: "王建国", phone: "138****2341", age: 62, gender: "男", region: "北京·海淀", registerAt: "2024-08-12", lastActiveAt: "2 小时前", tags: ["高血压", "糖尿病", "重点关怀"], healthLabel: "高血压合并糖尿病", riskLevel: "高",
    assignedDoctor: "李医生", assignedNutritionist: "张营养师",
    assignedDoctors: [
      { staffId: "S001", name: "李医生", condition: "高血压 / 心血管", isPrimary: true, assignedAt: "2024-08-12" },
      { staffId: "S002", name: "王医生", condition: "糖尿病 / 内分泌", isPrimary: false, assignedAt: "2024-09-05" },
    ],
    assignedNutritionists: [
      { staffId: "N001", name: "张营养师", condition: "三高综合调理", isPrimary: true, assignedAt: "2024-08-12" },
    ],
    source: "App 注册", status: "服务中" },
  { id: "U10002", name: "陈秀英", phone: "139****8821", age: 58, gender: "女", region: "上海·浦东", registerAt: "2024-09-03", lastActiveAt: "今天", tags: ["糖尿病"], healthLabel: "糖尿病", riskLevel: "高",
    assignedDoctor: "李医生",
    assignedDoctors: [{ staffId: "S001", name: "李医生", condition: "糖尿病", isPrimary: true, assignedAt: "2024-09-03" }],
    source: "门店转化", status: "服务中" },
  { id: "U10003", name: "刘志强", phone: "186****5532", age: 45, gender: "男", region: "广州·天河", registerAt: "2024-10-15", lastActiveAt: "昨天", tags: ["亚健康"], healthLabel: "亚健康", riskLevel: "中",
    assignedNutritionist: "张营养师",
    assignedNutritionists: [{ staffId: "N001", name: "张营养师", condition: "亚健康调理", isPrimary: true, assignedAt: "2024-10-15" }],
    source: "活动拉新", status: "活跃" },
  { id: "U10004", name: "赵丽", phone: "150****3324", age: 36, gender: "女", region: "深圳·南山", registerAt: "2024-11-01", lastActiveAt: "今天", tags: ["产后调理"], healthLabel: "亚健康", riskLevel: "中", source: "App 注册", status: "活跃" },
  { id: "U10005", name: "孙国安", phone: "133****1198", age: 70, gender: "男", region: "北京·朝阳", registerAt: "2024-07-21", lastActiveAt: "3 天前", tags: ["心脑血管", "重点关怀"], healthLabel: "高血压", riskLevel: "高", source: "企业导入", status: "流失风险" },
  { id: "U10006", name: "周敏", phone: "176****6677", age: 41, gender: "女", region: "杭州·西湖", registerAt: "2024-09-18", lastActiveAt: "今天", tags: ["体重管理"], healthLabel: "健康", riskLevel: "低",
    assignedNutritionist: "张营养师",
    assignedNutritionists: [{ staffId: "N001", name: "张营养师", condition: "体重管理", isPrimary: true, assignedAt: "2024-09-18" }],
    source: "App 注册", status: "服务中" },
  { id: "U10007", name: "吴天明", phone: "188****0033", age: 55, gender: "男", region: "成都·武侯", registerAt: "2024-10-22", lastActiveAt: "1 周前", tags: [], healthLabel: "亚健康", riskLevel: "中", source: "活动拉新", status: "已流失" },
  { id: "U10008", name: "黄丽华", phone: "159****7788", age: 67, gender: "女", region: "南京·鼓楼", registerAt: "2024-08-30", lastActiveAt: "今天", tags: ["糖尿病", "高血压"], healthLabel: "糖尿病合并高血压", riskLevel: "高",
    assignedDoctor: "李医生", assignedNutritionist: "张营养师",
    assignedDoctors: [
      { staffId: "S001", name: "李医生", condition: "高血压", isPrimary: true, assignedAt: "2024-08-30" },
      { staffId: "S002", name: "王医生", condition: "糖尿病", isPrimary: false, assignedAt: "2024-08-30" },
    ],
    assignedNutritionists: [{ staffId: "N001", name: "张营养师", condition: "三高调理", isPrimary: true, assignedAt: "2024-08-30" }],
    source: "门店转化", status: "服务中" },
];

export interface StaffCandidate {
  id: string;
  name: string;
  role: "医生" | "营养师";
  specialty: string[];
  region: string;
  currentLoad: number;
  maxLoad: number;
  rating: number; // 0-5
  matchScore: number; // 智能推荐评分 0-100
  matchReason: string;
}

export const STAFF_CANDIDATES: StaffCandidate[] = [
  { id: "S001", name: "李医生", role: "医生", specialty: ["心血管", "高血压"], region: "北京", currentLoad: 126, maxLoad: 150, rating: 4.8, matchScore: 96, matchReason: "擅长高血压 · 同区域 · 负载 84%" },
  { id: "S002", name: "王医生", role: "医生", specialty: ["内分泌", "糖尿病"], region: "北京", currentLoad: 88, maxLoad: 150, rating: 4.6, matchScore: 78, matchReason: "同区域 · 负载较低 58%" },
  { id: "S003", name: "陈医生", role: "医生", specialty: ["心血管"], region: "上海", currentLoad: 145, maxLoad: 150, rating: 4.9, matchScore: 62, matchReason: "评分高 · 但负载已 97%" },
  { id: "N001", name: "张营养师", role: "营养师", specialty: ["慢病饮食", "三高调理"], region: "北京", currentLoad: 48, maxLoad: 60, rating: 4.7, matchScore: 92, matchReason: "擅长三高 · 同区域 · 负载 80%" },
  { id: "N002", name: "刘营养师", role: "营养师", specialty: ["体重管理", "运动营养"], region: "北京", currentLoad: 32, maxLoad: 60, rating: 4.5, matchScore: 65, matchReason: "同区域 · 但专长偏体重管理" },
  { id: "N003", name: "周营养师", role: "营养师", specialty: ["慢病饮食"], region: "上海", currentLoad: 22, maxLoad: 60, rating: 4.6, matchScore: 58, matchReason: "专长匹配 · 但跨区域" },
];

export interface AssignmentLog {
  id: string;
  userId: string;
  userName: string;
  staffName: string;
  staffRole: "医生" | "营养师";
  type: "首次分配" | "改派" | "增派" | "解除";
  mode: "手动" | "智能推荐" | "自动规则";
  operator: string;
  reason?: string;
  createdAt: string;
}

export const ASSIGNMENT_LOGS: AssignmentLog[] = [
  { id: "L0001", userId: "U10001", userName: "王建国", staffName: "李医生", staffRole: "医生", type: "首次分配", mode: "智能推荐", operator: "平台管理员", reason: "高血压重点关怀", createdAt: "2024-08-12 14:23" },
  { id: "L0002", userId: "U10001", userName: "王建国", staffName: "张营养师", staffRole: "营养师", type: "首次分配", mode: "智能推荐", operator: "平台管理员", createdAt: "2024-08-12 14:23" },
  { id: "L0003", userId: "U10005", userName: "孙国安", staffName: "李医生", staffRole: "医生", type: "改派", mode: "手动", operator: "平台管理员", reason: "原医生休假", createdAt: "2024-10-22 10:11" },
  { id: "L0004", userId: "U10008", userName: "黄丽华", staffName: "李医生", staffRole: "医生", type: "首次分配", mode: "自动规则", operator: "系统", reason: "命中规则: 糖尿病+北京", createdAt: "2024-08-30 09:00" },
];
