// 量表（问卷）系统 —— 题库 + 量表 + 分支三层结构
// 兼容性设计：题目独立维护，量表组卷复用，分诊路由可叠加（评分阈值 + 标签规则）

// ========== 题型 ==========
export type QuestionType =
  | "single" // 单选
  | "multi" // 多选
  | "scale" // 量表分（1-5/1-10）
  | "number" // 数值（年龄/身高/体重）
  | "text" // 文本
  | "date" // 日期
  | "matrix"; // 矩阵题（多行共用一组选项）

export const QTYPE_LABEL: Record<QuestionType, string> = {
  single: "单选题",
  multi: "多选题",
  scale: "量表分",
  number: "数值题",
  text: "文本题",
  date: "日期题",
  matrix: "矩阵题",
};

// ========== 题目维度（用于多维度计分 + 健康标签）==========
export const DIMENSIONS = [
  "情绪",
  "睡眠",
  "饮食",
  "运动",
  "代谢",
  "心血管",
  "内分泌",
  "认知",
  "疼痛",
  "生活方式",
] as const;
export type Dimension = (typeof DIMENSIONS)[number];

// ========== 题库：单题 ==========
export interface QuestionOption {
  key: string;
  label: string;
  score?: number; // 计分分值
  tags?: string[]; // 选中即打标签（如 "高血压风险"）
}

export interface QuestionItem {
  id: string;
  code: string; // 编码 Q-001
  type: QuestionType;
  title: string;
  required: boolean;
  dimension?: Dimension; // 主维度
  weight?: number; // 维度权重（默认 1）
  options?: QuestionOption[]; // 单/多/量表/矩阵用
  numberRange?: { min: number; max: number; unit?: string };
  matrixRows?: string[]; // 矩阵题行
  // 跳题：选了某个 option 后跳到 targetCode
  branches?: { whenOption: string; jumpTo: string }[];
  source: "题库" | "私有"; // 题库题 vs 量表自建
  status: "已发布" | "草稿" | "审核中";
}

export const QUESTION_BANK: QuestionItem[] = [
  {
    id: "Q-001",
    code: "Q-001",
    type: "single",
    title: "您的最高血压（收缩压）通常是多少？",
    required: true,
    dimension: "心血管",
    weight: 2,
    source: "题库",
    status: "已发布",
    options: [
      { key: "a", label: "<120 mmHg", score: 0 },
      { key: "b", label: "120-139 mmHg", score: 1, tags: ["血压偏高"] },
      { key: "c", label: "140-159 mmHg", score: 3, tags: ["高血压一级"] },
      { key: "d", label: "≥160 mmHg", score: 5, tags: ["高血压二级", "高风险"] },
      { key: "e", label: "不清楚", score: 1 },
    ],
    branches: [{ whenOption: "d", jumpTo: "Q-014" }],
  },
  {
    id: "Q-002",
    code: "Q-002",
    type: "single",
    title: "您的空腹血糖近一次结果？",
    required: true,
    dimension: "内分泌",
    weight: 2,
    source: "题库",
    status: "已发布",
    options: [
      { key: "a", label: "<5.6 mmol/L", score: 0 },
      { key: "b", label: "5.6-6.9 mmol/L", score: 2, tags: ["糖耐量异常"] },
      { key: "c", label: "≥7.0 mmol/L", score: 5, tags: ["糖尿病风险", "高风险"] },
      { key: "d", label: "未检测", score: 1 },
    ],
  },
  {
    id: "Q-003",
    code: "Q-003",
    type: "scale",
    title: "过去两周，您感到情绪低落、抑郁或绝望的频率？(PHQ-9)",
    required: true,
    dimension: "情绪",
    weight: 1,
    source: "题库",
    status: "已发布",
    options: [
      { key: "0", label: "完全没有", score: 0 },
      { key: "1", label: "几天", score: 1 },
      { key: "2", label: "一半以上的日子", score: 2, tags: ["情绪关注"] },
      { key: "3", label: "几乎每天", score: 3, tags: ["抑郁倾向"] },
    ],
  },
  {
    id: "Q-004",
    code: "Q-004",
    type: "single",
    title: "您每周中等强度运动累计时间？",
    required: true,
    dimension: "运动",
    source: "题库",
    status: "已发布",
    options: [
      { key: "a", label: "几乎没有", score: 3, tags: ["久坐"] },
      { key: "b", label: "<150 分钟", score: 1 },
      { key: "c", label: "150-300 分钟", score: 0 },
      { key: "d", label: ">300 分钟", score: 0 },
    ],
  },
  {
    id: "Q-005",
    code: "Q-005",
    type: "multi",
    title: "您正在服用以下哪些药物？(可多选)",
    required: false,
    dimension: "代谢",
    source: "题库",
    status: "已发布",
    options: [
      { key: "a", label: "降压药", tags: ["高血压"] },
      { key: "b", label: "降糖药/胰岛素", tags: ["糖尿病"] },
      { key: "c", label: "降脂药", tags: ["高血脂"] },
      { key: "d", label: "抗抑郁药", tags: ["精神类"] },
      { key: "e", label: "暂无" },
    ],
  },
  {
    id: "Q-006",
    code: "Q-006",
    type: "number",
    title: "您当前的体重（kg）",
    required: true,
    dimension: "代谢",
    source: "题库",
    status: "已发布",
    numberRange: { min: 30, max: 200, unit: "kg" },
  },
  {
    id: "Q-007",
    code: "Q-007",
    type: "number",
    title: "您的身高（cm）",
    required: true,
    dimension: "代谢",
    source: "题库",
    status: "已发布",
    numberRange: { min: 100, max: 220, unit: "cm" },
  },
  {
    id: "Q-008",
    code: "Q-008",
    type: "single",
    title: "您的睡眠时长？",
    required: true,
    dimension: "睡眠",
    source: "题库",
    status: "已发布",
    options: [
      { key: "a", label: "<5 小时", score: 3, tags: ["睡眠不足"] },
      { key: "b", label: "5-6 小时", score: 2 },
      { key: "c", label: "6-8 小时", score: 0 },
      { key: "d", label: ">8 小时", score: 1 },
    ],
  },
  {
    id: "Q-014",
    code: "Q-014",
    type: "single",
    title: "（跳题）您的高血压是否已确诊？",
    required: true,
    dimension: "心血管",
    source: "题库",
    status: "已发布",
    options: [
      { key: "a", label: "是，规律服药", score: 1 },
      { key: "b", label: "是，未规律治疗", score: 4, tags: ["高风险", "需就诊"] },
      { key: "c", label: "未确诊", score: 2 },
    ],
  },
];

// ========== 量表（问卷）==========
export type ScaleCategory = "分诊" | "专病" | "心理" | "营养" | "生活方式" | "随访";

export interface ScoringRange {
  min: number;
  max: number;
  level: "正常" | "关注" | "异常" | "高危";
  advice: string;
  triggerTags?: string[]; // 命中范围后追加的健康标签
}

export interface RoutingRule {
  id: string;
  name: string;
  // 评分阈值触发
  byScore?: { dimension?: Dimension | "总分"; min?: number; max?: number };
  // 标签触发（命中任一即可）
  byTags?: string[];
  // 推荐目标
  recommend: {
    type: "专科量表" | "医生分诊" | "营养师跟进" | "生成方案";
    targetId?: string; // 专科量表 id 或 角色
    targetLabel: string;
  };
}

export interface ScaleItem {
  id: string;
  code: string;
  name: string;
  category: ScaleCategory;
  description: string;
  audience: string; // 适用人群
  estimatedMinutes: number;
  questionIds: string[]; // 引用题库
  // 计分：维度权重和总分换算
  scoring: {
    mode: "总分" | "维度分" | "公式";
    formula?: string; // mode=公式时，如 "BMI = Q-006 / (Q-007/100)^2"
    dimensions?: Partial<Record<Dimension, number>>; // 维度权重
    ranges: ScoringRange[]; // 总分区间结论
  };
  routing: RoutingRule[]; // 智能路由
  status: "已发布" | "草稿" | "审核中" | "已下线";
  reviewer?: string; // 审核专家
  publishedAt?: string;
  filledCount: number;
  createdBy: string;
}

export const SCALES: ScaleItem[] = [
  {
    id: "S-001",
    code: "PRE-TRIAGE",
    name: "通用健康分诊量表",
    category: "分诊",
    description: "新用户首次入驻必填，根据评分自动推荐专科量表与医护",
    audience: "全部新用户",
    estimatedMinutes: 5,
    questionIds: ["Q-001", "Q-002", "Q-003", "Q-004", "Q-008"],
    scoring: {
      mode: "维度分",
      dimensions: { 心血管: 1, 内分泌: 1, 情绪: 1, 运动: 1, 睡眠: 1 },
      ranges: [
        { min: 0, max: 5, level: "正常", advice: "保持当前生活方式，3 个月后复测" },
        { min: 6, max: 12, level: "关注", advice: "建议完成对应专科量表，营养师跟进", triggerTags: ["关注人群"] },
        { min: 13, max: 20, level: "异常", advice: "建议在线问诊医生", triggerTags: ["医生介入"] },
        { min: 21, max: 100, level: "高危", advice: "立即推送医生 + 营养师双跟进", triggerTags: ["高风险", "重点关怀"] },
      ],
    },
    routing: [
      {
        id: "R-1",
        name: "心血管维度 ≥3 → 高血压专病量表",
        byScore: { dimension: "心血管", min: 3 },
        recommend: { type: "专科量表", targetId: "S-002", targetLabel: "《高血压专病管理量表》" },
      },
      {
        id: "R-2",
        name: "内分泌维度 ≥3 → 糖尿病专病量表",
        byScore: { dimension: "内分泌", min: 3 },
        recommend: { type: "专科量表", targetId: "S-003", targetLabel: "《糖尿病专病管理量表》" },
      },
      {
        id: "R-3",
        name: "情绪维度 ≥4 → PHQ-9 全量评估",
        byScore: { dimension: "情绪", min: 4 },
        recommend: { type: "专科量表", targetId: "S-004", targetLabel: "《PHQ-9 抑郁筛查》" },
      },
      {
        id: "R-4",
        name: "命中【高风险】标签 → 立即派单医生",
        byTags: ["高风险"],
        recommend: { type: "医生分诊", targetLabel: "派单给【内科主治医生】" },
      },
    ],
    status: "已发布",
    reviewer: "王主任医师",
    publishedAt: "2024-09-12",
    filledCount: 8421,
    createdBy: "平台管理员",
  },
  {
    id: "S-002",
    code: "HTN-PRO",
    name: "高血压专病管理量表",
    category: "专病",
    description: "针对高血压患者的复诊评估，含用药依从性与靶器官损害筛查",
    audience: "已确诊或疑似高血压",
    estimatedMinutes: 8,
    questionIds: ["Q-001", "Q-005", "Q-014", "Q-006", "Q-007", "Q-004"],
    scoring: {
      mode: "总分",
      ranges: [
        { min: 0, max: 8, level: "正常", advice: "维持现方案，月度随访" },
        { min: 9, max: 15, level: "关注", advice: "营养师调整饮食方案", triggerTags: ["饮食干预"] },
        { min: 16, max: 25, level: "异常", advice: "医生复评用药方案", triggerTags: ["复诊提醒"] },
        { min: 26, max: 100, level: "高危", advice: "建议线下就诊", triggerTags: ["高风险"] },
      ],
    },
    routing: [
      {
        id: "R-1",
        name: "总分 ≥16 → 自动派单主治医生",
        byScore: { dimension: "总分", min: 16 },
        recommend: { type: "医生分诊", targetLabel: "心内科医生" },
      },
    ],
    status: "已发布",
    reviewer: "李心内科主任",
    publishedAt: "2024-10-03",
    filledCount: 1264,
    createdBy: "平台管理员",
  },
  {
    id: "S-003",
    code: "DM-PRO",
    name: "糖尿病专病管理量表",
    category: "专病",
    description: "糖尿病复诊评估，覆盖血糖控制、并发症筛查、饮食运动",
    audience: "糖耐量异常或已确诊糖尿病",
    estimatedMinutes: 10,
    questionIds: ["Q-002", "Q-005", "Q-006", "Q-007", "Q-004", "Q-008"],
    scoring: {
      mode: "公式",
      formula: "总分 = 血糖×3 + BMI×2 + 运动 + 睡眠；BMI = Q-006/(Q-007/100)^2",
      ranges: [
        { min: 0, max: 10, level: "正常", advice: "维持当前方案" },
        { min: 11, max: 18, level: "关注", advice: "营养师跟进", triggerTags: ["饮食干预"] },
        { min: 19, max: 100, level: "高危", advice: "医生复评", triggerTags: ["高风险"] },
      ],
    },
    routing: [
      {
        id: "R-1",
        name: "命中糖尿病标签 → 内分泌科医生",
        byTags: ["糖尿病", "糖尿病风险"],
        recommend: { type: "医生分诊", targetLabel: "内分泌科医生" },
      },
    ],
    status: "已发布",
    reviewer: "陈内分泌主任",
    publishedAt: "2024-10-15",
    filledCount: 892,
    createdBy: "平台管理员",
  },
  {
    id: "S-004",
    code: "PHQ-9",
    name: "PHQ-9 抑郁症筛查量表",
    category: "心理",
    description: "国际通用抑郁筛查量表，9 题快速评估",
    audience: "情绪维度≥4 或自愿测评",
    estimatedMinutes: 3,
    questionIds: ["Q-003"],
    scoring: {
      mode: "总分",
      ranges: [
        { min: 0, max: 4, level: "正常", advice: "无明显抑郁症状" },
        { min: 5, max: 9, level: "关注", advice: "轻度抑郁，建议关注情绪", triggerTags: ["情绪关注"] },
        { min: 10, max: 14, level: "异常", advice: "中度抑郁，建议心理咨询" },
        { min: 15, max: 27, level: "高危", advice: "重度抑郁，建议医生评估", triggerTags: ["高风险", "心理介入"] },
      ],
    },
    routing: [
      {
        id: "R-1",
        name: "总分≥15 → 立即派单",
        byScore: { dimension: "总分", min: 15 },
        recommend: { type: "医生分诊", targetLabel: "心理科医生" },
      },
    ],
    status: "已发布",
    reviewer: "周心理主任",
    publishedAt: "2024-09-20",
    filledCount: 3211,
    createdBy: "平台管理员",
  },
  {
    id: "S-005",
    code: "DIET-7",
    name: "7 日饮食习惯评估",
    category: "营养",
    description: "评估近 7 日饮食结构，输出个性化营养方案",
    audience: "全部用户",
    estimatedMinutes: 6,
    questionIds: ["Q-004", "Q-006", "Q-007", "Q-008"],
    scoring: {
      mode: "维度分",
      dimensions: { 饮食: 1, 运动: 1, 睡眠: 1 },
      ranges: [
        { min: 0, max: 4, level: "正常", advice: "饮食结构良好" },
        { min: 5, max: 10, level: "关注", advice: "营养师定制方案", triggerTags: ["饮食干预"] },
        { min: 11, max: 100, level: "异常", advice: "营养师 1v1 介入" },
      ],
    },
    routing: [
      {
        id: "R-1",
        name: "总分≥5 → 营养师跟进",
        byScore: { dimension: "总分", min: 5 },
        recommend: { type: "营养师跟进", targetLabel: "分配给【签约营养师】" },
      },
    ],
    status: "已发布",
    reviewer: "张营养师",
    publishedAt: "2024-11-01",
    filledCount: 5641,
    createdBy: "平台管理员",
  },
  {
    id: "S-006",
    code: "POST-VISIT",
    name: "门诊后随访量表",
    category: "随访",
    description: "门诊/咨询后 7 天自动推送，评估方案执行情况",
    audience: "已完成门诊用户",
    estimatedMinutes: 4,
    questionIds: ["Q-001", "Q-005", "Q-008"],
    scoring: {
      mode: "总分",
      ranges: [
        { min: 0, max: 5, level: "正常", advice: "依从性良好" },
        { min: 6, max: 100, level: "异常", advice: "复诊提醒", triggerTags: ["复诊提醒"] },
      ],
    },
    routing: [],
    status: "草稿",
    publishedAt: undefined,
    filledCount: 0,
    createdBy: "李医生",
  },
];

// ========== 答卷记录 ==========
export interface ScaleResponse {
  id: string;
  scaleId: string;
  scaleName: string;
  userId: string;
  userName: string;
  filledAt: string;
  totalScore: number;
  level: "正常" | "关注" | "异常" | "高危";
  triggeredTags: string[];
  triggeredRoutes: string[]; // 命中的路由名称
  followUpStatus: "已派单" | "已生成方案" | "等待跟进" | "已闭环";
  handler?: string;
}

export const SCALE_RESPONSES: ScaleResponse[] = [
  {
    id: "RSP-1001",
    scaleId: "S-001",
    scaleName: "通用健康分诊量表",
    userId: "U10001",
    userName: "王建国",
    filledAt: "2024-11-15 09:23",
    totalScore: 18,
    level: "异常",
    triggeredTags: ["高血压一级", "医生介入"],
    triggeredRoutes: ["心血管维度 ≥3 → 高血压专病量表", "命中【高风险】标签 → 立即派单医生"],
    followUpStatus: "已派单",
    handler: "李医生",
  },
  {
    id: "RSP-1002",
    scaleId: "S-002",
    scaleName: "高血压专病管理量表",
    userId: "U10001",
    userName: "王建国",
    filledAt: "2024-11-16 10:11",
    totalScore: 14,
    level: "关注",
    triggeredTags: ["饮食干预"],
    triggeredRoutes: [],
    followUpStatus: "已生成方案",
    handler: "张营养师",
  },
  {
    id: "RSP-1003",
    scaleId: "S-001",
    scaleName: "通用健康分诊量表",
    userId: "U10002",
    userName: "陈秀英",
    filledAt: "2024-11-14 15:42",
    totalScore: 23,
    level: "高危",
    triggeredTags: ["糖尿病风险", "高风险", "重点关怀"],
    triggeredRoutes: [
      "内分泌维度 ≥3 → 糖尿病专病量表",
      "命中【高风险】标签 → 立即派单医生",
    ],
    followUpStatus: "已派单",
    handler: "李医生",
  },
  {
    id: "RSP-1004",
    scaleId: "S-005",
    scaleName: "7 日饮食习惯评估",
    userId: "U10003",
    userName: "刘志强",
    filledAt: "2024-11-15 20:01",
    totalScore: 7,
    level: "关注",
    triggeredTags: ["饮食干预"],
    triggeredRoutes: ["总分≥5 → 营养师跟进"],
    followUpStatus: "等待跟进",
  },
  {
    id: "RSP-1005",
    scaleId: "S-004",
    scaleName: "PHQ-9 抑郁症筛查量表",
    userId: "U10004",
    userName: "赵丽",
    filledAt: "2024-11-13 14:00",
    totalScore: 12,
    level: "异常",
    triggeredTags: ["情绪关注"],
    triggeredRoutes: [],
    followUpStatus: "等待跟进",
  },
];

// 待审核量表
export interface ScaleAudit {
  id: string;
  scaleName: string;
  submittedBy: string;
  submittedAt: string;
  category: ScaleCategory;
  questionCount: number;
  status: "待审核" | "已通过" | "已驳回";
  reviewer?: string;
  comment?: string;
}

export const SCALE_AUDITS: ScaleAudit[] = [
  { id: "A-001", scaleName: "门诊后随访量表", submittedBy: "李医生", submittedAt: "2024-11-12", category: "随访", questionCount: 6, status: "待审核" },
  { id: "A-002", scaleName: "孕期营养评估量表", submittedBy: "张营养师", submittedAt: "2024-11-10", category: "营养", questionCount: 12, status: "待审核" },
  { id: "A-003", scaleName: "老年跌倒风险评估", submittedBy: "李医生", submittedAt: "2024-11-08", category: "专病", questionCount: 8, status: "已通过", reviewer: "王主任医师", comment: "符合临床规范" },
];
