// Type-safe helpers for AI-generated data that may have wrong types

export function safeArray<T>(val: unknown, fallback: T[] = []): T[] {
  if (Array.isArray(val)) return val as T[];
  if (typeof val === "string" && val.trim()) return val.split(/[,;，；、]/).map(s => s.trim()).filter(Boolean) as T[];
  return fallback;
}

export function safeString(val: unknown, fallback = "-"): string {
  if (typeof val === "string" && val.trim()) return val.trim();
  if (typeof val === "number") return String(val);
  return fallback;
}

export function safeNumber(val: unknown, fallback = 0): number {
  if (typeof val === "number" && !isNaN(val)) return val;
  if (typeof val === "string") { const n = parseFloat(val); if (!isNaN(n)) return n; }
  return fallback;
}

export function safeObj<T extends Record<string, unknown>>(val: unknown, fallback: T = {} as T): T {
  if (val && typeof val === "object" && !Array.isArray(val)) return val as T;
  return fallback;
}
