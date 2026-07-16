import { DEMO_ACCOUNTS, type AdminUser, type AdminRole } from "./roles";

const STORAGE_KEY = "admin_session";

export function getCurrentAdmin(): AdminUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AdminUser;
  } catch {
    return null;
  }
}

export function loginAdmin(username: string, password: string): AdminUser {
  if (password !== "123456") {
    throw new Error("密码错误，演示账号统一密码：123456");
  }
  const user = DEMO_ACCOUNTS[username];
  if (!user) {
    throw new Error("用户名不存在");
  }
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }
  return user;
}

export function logoutAdmin() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export function switchRole(role: AdminRole): AdminUser {
  const user = DEMO_ACCOUNTS[role];
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }
  return user;
}
