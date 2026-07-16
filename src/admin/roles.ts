// 后台管理系统 - 角色定义与权限菜单（基于「蜻蜓康健家-后台」思维导图）

export type AdminRole =
  | "nutritionist" // 营养师
  | "doctor" // 医生
  | "health_manager" // 健康管理师（独立移动端工作台）
  | "platform_admin" // 平台管理员
  | "third_party" // 三方运营
  | "finance"; // 财务

export interface AdminUser {
  id: string;
  name: string;
  role: AdminRole;
  org: string;
  avatar?: string;
}

export const ROLE_LABEL: Record<AdminRole, string> = {
  nutritionist: "营养师",
  doctor: "医生",
  health_manager: "健康管理师",
  platform_admin: "平台管理员",
  third_party: "三方运营",
  finance: "财务",
};

export const ROLE_COLOR: Record<AdminRole, string> = {
  nutritionist: "bg-emerald-100 text-emerald-700",
  doctor: "bg-blue-100 text-blue-700",
  health_manager: "bg-teal-100 text-teal-700",
  platform_admin: "bg-rose-100 text-rose-700",
  third_party: "bg-violet-100 text-violet-700",
  finance: "bg-amber-100 text-amber-700",
};

// 演示账号 - 用户名即角色 key，密码统一为 123456
export const DEMO_ACCOUNTS: Record<string, AdminUser> = {
  nutritionist: {
    id: "u-nut-01",
    name: "张营养师",
    role: "nutritionist",
    org: "蜻蜓健康管理中心",
  },
  doctor: {
    id: "u-doc-01",
    name: "李医生",
    role: "doctor",
    org: "蜻蜓互联网医院",
  },
  platform_admin: {
    id: "u-pa-01",
    name: "平台管理员",
    role: "platform_admin",
    org: "蜻蜓康健家总部",
  },
  third_party: {
    id: "u-tp-01",
    name: "陈合伙人",
    role: "third_party",
    org: "三方合作机构",
  },
  finance: {
    id: "u-fin-01",
    name: "刘财务",
    role: "finance",
    org: "财务中心",
  },
  hm: {
    id: "u-hm-01",
    name: "孙健康",
    role: "health_manager",
    org: "蜻蜓健康管理中心 · 一组",
  },
};

export interface MenuChild {
  to: string;
  label: string;
}

export interface MenuGroup {
  key: string;
  label: string;
  icon: string; // lucide icon name
  children: MenuChild[];
}

// ===== 权限模型 =====

// 数据可见范围
export type DataScope =
  | "all" // 全平台
  | "own_org" // 本机构
  | "assigned" // 分配给我的
  | "self"; // 仅本人

export const DATA_SCOPE_LABEL: Record<DataScope, string> = {
  all: "全平台",
  own_org: "本机构",
  assigned: "分配给我的",
  self: "仅本人",
};

// 操作权限
export type Action = "view" | "create" | "edit" | "delete" | "export" | "audit" | "assign";

export const ACTION_LABEL: Record<Action, string> = {
  view: "查看",
  create: "新增",
  edit: "编辑",
  delete: "删除",
  export: "导出",
  audit: "审核",
  assign: "分配",
};

// 业务资源（用于权限矩阵）
export interface ResourcePermission {
  key: string;
  label: string;
  category: string;
  scope: Record<AdminRole, DataScope | "none">;
  actions: Record<AdminRole, Action[]>;
}

// 平台核心资源权限矩阵 —— 角色 × 资源 × (数据范围 + 操作)
export const RESOURCE_MATRIX: ResourcePermission[] = [
  // ===== C 端用户与档案 =====
  {
    key: "c_users",
    label: "C 端用户列表",
    category: "C 端用户中心",
    scope: {
      platform_admin: "all",
      nutritionist: "assigned",
      doctor: "assigned",
      third_party: "none",
      finance: "none",
      health_manager: "none",
    },
    actions: {
      platform_admin: ["view", "create", "edit", "export", "assign"],
      nutritionist: ["view"],
      doctor: ["view"],
      third_party: [],
      finance: [],
      health_manager: [],
    },
  },
  {
    key: "patient_profile",
    label: "患者/客户健康档案",
    category: "C 端用户中心",
    scope: {
      platform_admin: "all",
      nutritionist: "assigned",
      doctor: "assigned",
      third_party: "none",
      finance: "none",
      health_manager: "none",
    },
    actions: {
      platform_admin: ["view", "edit", "export"],
      nutritionist: ["view", "edit"],
      doctor: ["view", "edit"],
      third_party: [],
      finance: [],
      health_manager: [],
    },
  },
  {
    key: "assignment",
    label: "医护分配（指派医生/营养师）",
    category: "C 端用户中心",
    scope: {
      platform_admin: "all",
      nutritionist: "none",
      doctor: "none",
      third_party: "none",
      finance: "none",
      health_manager: "none",
    },
    actions: {
      platform_admin: ["view", "create", "edit", "assign", "audit"],
      nutritionist: [],
      doctor: [],
      third_party: [],
      finance: [],
      health_manager: [],
    },
  },
  // ===== 服务执行 =====
  {
    key: "consult",
    label: "在线咨询/接诊",
    category: "服务执行",
    scope: {
      platform_admin: "all",
      nutritionist: "assigned",
      doctor: "assigned",
      third_party: "none",
      finance: "none",
      health_manager: "none",
    },
    actions: {
      platform_admin: ["view", "audit", "export"],
      nutritionist: ["view", "create", "edit"],
      doctor: ["view", "create", "edit"],
      third_party: [],
      finance: [],
      health_manager: [],
    },
  },
  {
    key: "health_plan",
    label: "健康/医疗方案",
    category: "服务执行",
    scope: {
      platform_admin: "all",
      nutritionist: "assigned",
      doctor: "assigned",
      third_party: "none",
      finance: "none",
      health_manager: "none",
    },
    actions: {
      platform_admin: ["view", "audit"],
      nutritionist: ["view", "create", "edit"],
      doctor: ["view", "create", "edit", "audit"],
      third_party: [],
      finance: [],
      health_manager: [],
    },
  },
  // ===== Agent 运营 =====
  {
    key: "agent_campaign",
    label: "Agent 运营活动",
    category: "运营",
    scope: {
      platform_admin: "all",
      nutritionist: "assigned",
      doctor: "none",
      third_party: "none",
      finance: "none",
      health_manager: "none",
    },
    actions: {
      platform_admin: ["view", "create", "edit", "audit", "delete"],
      nutritionist: ["view", "create"],
      doctor: [],
      third_party: [],
      finance: [],
      health_manager: [],
    },
  },
  // ===== 商品/服务/供应链 =====
  {
    key: "product",
    label: "商品与服务（商城）",
    category: "供应链",
    scope: {
      platform_admin: "all",
      nutritionist: "none",
      doctor: "none",
      third_party: "own_org",
      finance: "none",
      health_manager: "none",
    },
    actions: {
      platform_admin: ["view", "create", "edit", "delete", "audit"],
      nutritionist: [],
      doctor: [],
      third_party: ["view"],
      finance: [],
      health_manager: [],
    },
  },
  {
    key: "supply",
    label: "供应链与库存",
    category: "供应链",
    scope: {
      platform_admin: "all",
      nutritionist: "none",
      doctor: "none",
      third_party: "own_org",
      finance: "none",
      health_manager: "none",
    },
    actions: {
      platform_admin: ["view", "create", "edit", "delete"],
      nutritionist: [],
      doctor: [],
      third_party: ["view"],
      finance: [],
      health_manager: [],
    },
  },
  // ===== 财务 =====
  {
    key: "finance_billing",
    label: "全平台账单",
    category: "财务",
    scope: {
      platform_admin: "all",
      nutritionist: "self",
      doctor: "self",
      third_party: "own_org",
      finance: "all",
      health_manager: "none",
    },
    actions: {
      platform_admin: ["view"],
      nutritionist: ["view", "export"],
      doctor: ["view", "export"],
      third_party: ["view", "export"],
      finance: ["view", "create", "edit", "audit", "export"],
      health_manager: [],
    },
  },
  {
    key: "finance_split",
    label: "分账规则",
    category: "财务",
    scope: {
      platform_admin: "all",
      nutritionist: "none",
      doctor: "none",
      third_party: "none",
      finance: "all",
      health_manager: "none",
    },
    actions: {
      platform_admin: ["view", "audit"],
      nutritionist: [],
      doctor: [],
      third_party: [],
      finance: ["view", "create", "edit", "audit"],
      health_manager: [],
    },
  },
  // ===== 量表 =====
  {
    key: "scale_center",
    label: "量表（问卷）中心",
    category: "C 端用户中心",
    scope: {
      platform_admin: "all",
      nutritionist: "self",
      doctor: "self",
      third_party: "none",
      finance: "none",
      health_manager: "none",
    },
    actions: {
      platform_admin: ["view", "create", "edit", "delete", "audit"],
      nutritionist: ["view", "create", "edit"],
      doctor: ["view", "create", "edit"],
      third_party: [],
      finance: [],
      health_manager: [],
    },
  },
  // ===== 系统 =====
  {
    key: "sys_role",
    label: "角色与账号",
    category: "系统",
    scope: {
      platform_admin: "all",
      nutritionist: "none",
      doctor: "none",
      third_party: "none",
      finance: "none",
      health_manager: "none",
    },
    actions: {
      platform_admin: ["view", "create", "edit", "delete"],
      nutritionist: [],
      doctor: [],
      third_party: [],
      finance: [],
      health_manager: [],
    },
  },
];

// 角色默认数据范围（顶部 Banner 提示用）
export const ROLE_DEFAULT_SCOPE: Record<AdminRole, { scope: DataScope; desc: string }> = {
  platform_admin: { scope: "all", desc: "可查看与管理全平台所有数据" },
  finance: { scope: "all", desc: "可查看全平台财务数据，不可见 C 端健康档案" },
  doctor: { scope: "assigned", desc: "仅可查看已分配给您的患者及相关数据" },
  nutritionist: { scope: "assigned", desc: "仅可查看已分配给您的客户及相关数据" },
  third_party: { scope: "own_org", desc: "仅可查看本合作机构相关的合作模块数据" },
  health_manager: { scope: "assigned", desc: "仅可查看已分配给您的健康用户及对应预警/任务" },
};

// 每个角色的工作台首页
export const ROLE_HOME: Record<AdminRole, string> = {
  nutritionist: "/admin/nutritionist",
  doctor: "/admin/doctor",
  platform_admin: "/admin/platform",
  third_party: "/admin/third-party",
  finance: "/admin/finance",
  health_manager: "/hm",
};

// 二级折叠菜单 —— 按导图组织
export const ROLE_MENU: Record<AdminRole, MenuGroup[]> = {
  // ===== 营养师 =====
  nutritionist: [
    {
      key: "workbench",
      label: "工作台",
      icon: "LayoutDashboard",
      children: [{ to: "/admin/nutritionist", label: "数据看板" }],
    },
    {
      key: "customer",
      label: "客户管理",
      icon: "Users",
      children: [
        { to: "/admin/nutritionist/customers", label: "我的客户" },
        { to: "/admin/nutritionist/customers/tags", label: "客户标签" },
      ],
    },
    {
      key: "service",
      label: "服务执行",
      icon: "ClipboardList",
      children: [
        { to: "/admin/nutritionist/plans", label: "方案制定" },
        { to: "/admin/nutritionist/appointments", label: "预约管理" },
        { to: "/admin/nutritionist/checkup", label: "体检服务" },
        { to: "/admin/nutritionist/reception", label: "接待记录" },
        { to: "/admin/platform/scale", label: "量表（公共+私有）" },
      ],
    },
    {
      key: "agent",
      label: "Agent 运营",
      icon: "Sparkles",
      children: [
        { to: "/admin/nutritionist/agent/activities", label: "活动配置" },
        { to: "/admin/nutritionist/agent/monitor", label: "执行监控" },
      ],
    },
    {
      key: "finance",
      label: "财务",
      icon: "Wallet",
      children: [{ to: "/admin/nutritionist/billing", label: "个人分账账单" }],
    },
    {
      key: "report",
      label: "数据中心",
      icon: "BarChart3",
      children: [{ to: "/admin/nutritionist/reports", label: "个人业务报表" }],
    },
  ],

  // ===== 医生 =====
  doctor: [
    {
      key: "workbench",
      label: "工作台",
      icon: "LayoutDashboard",
      children: [{ to: "/admin/doctor", label: "数据看板" }],
    },
    {
      key: "patient",
      label: "患者管理",
      icon: "Users",
      children: [
        { to: "/admin/doctor/patients", label: "我的患者" },
        { to: "/admin/doctor/patients/records", label: "健康/服务记录" },
      ],
    },
    {
      key: "service",
      label: "服务执行",
      icon: "Stethoscope",
      children: [
        { to: "/admin/doctor/consult", label: "在线接诊" },
        { to: "/admin/doctor/plans", label: "医疗方案" },
        { to: "/admin/doctor/followup", label: "随访计划" },
        { to: "/admin/platform/scale", label: "量表（公共+私有）" },
      ],
    },
    {
      key: "finance",
      label: "财务",
      icon: "Wallet",
      children: [{ to: "/admin/doctor/billing", label: "个人分账" }],
    },
  ],

  // ===== 平台管理员 =====
  platform_admin: [
    {
      key: "dashboard",
      label: "全局看板",
      icon: "LayoutDashboard",
      children: [
        { to: "/admin/platform", label: "数据大屏" },
        { to: "/admin/platform/realtime", label: "实时数据" },
        { to: "/admin/platform/dispatch", label: "运营调度台" },
      ],
    },
    {
      key: "approval",
      label: "审批中心",
      icon: "ShieldCheck",
      children: [
        { to: "/admin/platform/approval", label: "待办审批" },
      ],
    },
    {
      key: "c-users",
      label: "C 端用户中心",
      icon: "UserCog",
      children: [
        { to: "/admin/platform/c-users", label: "C 端用户列表" },
        { to: "/admin/platform/c-users/profile", label: "用户/患者档案" },
        { to: "/admin/platform/c-users/assignment", label: "医护分配" },
        { to: "/admin/platform/c-users/assignment-rules", label: "分配规则配置" },
        { to: "/admin/platform/c-users/assignment-history", label: "分配历史" },
      ],
    },
    {
      key: "customer-ops",
      label: "客户运营",
      icon: "Users",
      children: [
        { to: "/admin/platform/customers/tags", label: "客户标签" },
        { to: "/admin/platform/customers/im", label: "IM 互动" },
        { to: "/admin/platform/key-accounts", label: "大客户管理" },
      ],
    },
    {
      key: "service-exec",
      label: "服务执行管理",
      icon: "ClipboardList",
      children: [
        { to: "/admin/platform/online-consult", label: "线上咨询" },
        { to: "/admin/platform/offline-service", label: "线下服务" },
        { to: "/admin/platform/health-plan", label: "健康计划" },
      ],
    },
    {
      key: "scale",
      label: "量表（问卷）中心",
      icon: "ClipboardCheck",
      children: [
        { to: "/admin/platform/scale", label: "量表列表" },
        { to: "/admin/platform/scale/bank", label: "题库管理" },
        { to: "/admin/platform/scale/editor", label: "量表编辑器" },
        { to: "/admin/platform/scale/routing", label: "分诊路由规则" },
        { to: "/admin/platform/scale/responses", label: "答卷记录" },
        { to: "/admin/platform/scale/audit", label: "量表审核" },
      ],
    },
    {
      key: "agent",
      label: "Agent 运营",
      icon: "Sparkles",
      children: [
        { to: "/admin/platform/agent/activities", label: "活动配置" },
        { to: "/admin/platform/agent/audit", label: "活动审核" },
        { to: "/admin/platform/agent/monitor", label: "执行监控" },
        { to: "/admin/platform/agent/reach", label: "自动化触达" },
      ],
    },
    {
      key: "store",
      label: "自营门店管理",
      icon: "Store",
      children: [
        { to: "/admin/platform/store/info", label: "门店信息配置" },
        { to: "/admin/platform/store/data", label: "门店运营数据" },
      ],
    },
    {
      key: "supply",
      label: "供应链与履约",
      icon: "Truck",
      children: [
        { to: "/admin/platform/supply/suppliers", label: "供应商管理" },
        { to: "/admin/platform/supply/inventory", label: "库存管理" },
        { to: "/admin/platform/supply/orders", label: "订单履约" },
        { to: "/admin/platform/supply/canteen", label: "食堂管理" },
      ],
    },
    {
      key: "product",
      label: "产品运营（商城）",
      icon: "Package",
      children: [
        { to: "/admin/platform/product/services", label: "服务项目" },
        { to: "/admin/platform/product/goods", label: "健康商品" },
        { to: "/admin/platform/product/virtual", label: "虚拟服务" },
      ],
    },
    {
      key: "marketing",
      label: "营销增长",
      icon: "TrendingUp",
      children: [
        { to: "/admin/platform/marketing/stages", label: "用户阶段管理" },
        { to: "/admin/platform/marketing/tags", label: "标签体系" },
        { to: "/admin/platform/marketing/campaigns", label: "营销活动" },
      ],
    },
    {
      key: "content",
      label: "内容与知识库",
      icon: "BookOpen",
      children: [
        { to: "/admin/platform/content/health", label: "健康内容" },
        { to: "/admin/platform/content/ai-kb", label: "AI 知识库" },
        { to: "/admin/platform/content/community", label: "蜻蜓圈内容" },
      ],
    },
    {
      key: "device",
      label: "智能设备与数据",
      icon: "Cpu",
      children: [
        { to: "/admin/platform/device/list", label: "设备管理" },
        { to: "/admin/platform/device/data", label: "数据接入与质控" },
      ],
    },
    {
      key: "finance",
      label: "财务结算",
      icon: "Wallet",
      children: [
        { to: "/admin/platform/finance/split-rules", label: "分账规则审核" },
      ],
    },
    {
      key: "sys",
      label: "系统管理",
      icon: "Settings",
      children: [
        { to: "/admin/platform/sys/permission-matrix", label: "权限矩阵（角色×资源）" },
        { to: "/admin/platform/sys/permission", label: "权限项管理" },
        { to: "/admin/platform/sys/roles", label: "角色与账号" },
        { to: "/admin/platform/sys/notify", label: "通知模板" },
        { to: "/admin/platform/sys/base", label: "基础配置" },
        { to: "/admin/platform/sys/third-party", label: "三方合作权限" },
        { to: "/admin/platform/audit-log", label: "操作审计日志" },
      ],
    },
  ],

  // ===== 三方运营 =====
  third_party: [
    {
      key: "workbench",
      label: "工作台",
      icon: "LayoutDashboard",
      children: [{ to: "/admin/third-party", label: "合作概览" }],
    },
    {
      key: "data",
      label: "数据中心",
      icon: "BarChart3",
      children: [
        { to: "/admin/third-party/reports", label: "合作模块数据" },
      ],
    },
  ],

  // ===== 财务 =====
  finance: [
    {
      key: "workbench",
      label: "工作台",
      icon: "LayoutDashboard",
      children: [{ to: "/admin/finance", label: "财务概览" }],
    },
    {
      key: "settle",
      label: "财务结算",
      icon: "Wallet",
      children: [
        { to: "/admin/finance/orders", label: "订单管理" },
        { to: "/admin/finance/split", label: "分账管理" },
        { to: "/admin/finance/billing", label: "账单管理" },
      ],
    },
    {
      key: "account",
      label: "账户与资金",
      icon: "Banknote",
      children: [
        { to: "/admin/finance/balance", label: "账户余额" },
        { to: "/admin/finance/payment", label: "支付管理" },
        { to: "/admin/finance/invoice", label: "发票管理" },
      ],
    },
    {
      key: "accounting",
      label: "财务核算",
      icon: "Calculator",
      children: [
        { to: "/admin/finance/reconcile", label: "订单对账" },
        { to: "/admin/finance/revenue", label: "营收统计" },
        { to: "/admin/finance/cost", label: "成本核算" },
      ],
    },
    {
      key: "report",
      label: "财务报表",
      icon: "FileSpreadsheet",
      children: [{ to: "/admin/finance/report", label: "报表分析" }],
    },
  ],

  // ===== 健康管理师（独立移动端工作台 /hm，菜单仅作占位） =====
  health_manager: [
    {
      key: "hm",
      label: "健康管理师工作台",
      icon: "HeartPulse",
      children: [
        { to: "/hm", label: "今日工作台" },
        { to: "/hm/alerts", label: "健康预警" },
        { to: "/hm/users", label: "用户列表" },
        { to: "/hm/team", label: "团队协作" },
        { to: "/hm/me", label: "我的与绩效" },
      ],
    },
  ],
};
