const USAGE_KEY = "EDUVISION_USAGE_V1";

export function currentIsoWeekId(date = new Date()) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = (d.getUTCDay() + 6) % 7;
  d.setUTCDate(d.getUTCDate() + 3 - dayNum);
  const weekYear = d.getUTCFullYear();
  const thursday = new Date(Date.UTC(weekYear, d.getUTCMonth(), d.getUTCDate()));
  const firstThursday = new Date(Date.UTC(weekYear, 0, 4));
  const diff = thursday - firstThursday;
  const week = 1 + Math.round(diff / (7 * 24 * 3600 * 1000));
  return `${weekYear}-W${String(week).padStart(2, "0")}`;
}

export function readUsage() {
  try {
    const raw = localStorage.getItem(USAGE_KEY);
    if (!raw) return { weekId: currentIsoWeekId(), count: 0 };
    const parsed = JSON.parse(raw);
    const nowId = currentIsoWeekId();
    if (parsed.weekId !== nowId) return { weekId: nowId, count: 0 };
    return parsed;
  } catch {
    return { weekId: currentIsoWeekId(), count: 0 };
  }
}

export function writeUsage(u) {
  localStorage.setItem(USAGE_KEY, JSON.stringify(u));
}

export function getRemainingForFree(limit = 25) {
  const u = readUsage();
  return Math.max(0, limit - (u.count || 0));
}

export function recordUsage(n = 1, limit = 25) {
  const u = readUsage();
  u.count = (u.count || 0) + n;
  writeUsage(u);
  return getRemainingForFree(limit);
}

export function canUseFeature(plan = "free", limit = 25) {
  if (plan === "pro") return true;
  return getRemainingForFree(limit) > 0;
}

export function usageSummary(limit = 25) {
  const { weekId, count } = readUsage();
  return { weekId, used: count, remaining: Math.max(0, limit - count), limit };
}

export const USAGE_STORAGE_KEY = USAGE_KEY;
