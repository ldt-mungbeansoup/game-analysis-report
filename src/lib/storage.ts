import { HistoryItem, GameAnalysis } from "@/types";

const STORAGE_KEY = "game-analysis-history";
const MAX_ITEMS = 20;

function getAll(): HistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveAll(items: HistoryItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function getHistory(): HistoryItem[] {
  return getAll();
}

export function addHistory(gameName: string, data: GameAnalysis, customPrompt?: string): HistoryItem {
  const items = getAll();
  const item: HistoryItem = {
    id: Date.now().toString(36),
    gameName,
    createdAt: new Date().toISOString(),
    customPrompt,
    data,
  };
  items.unshift(item);
  if (items.length > MAX_ITEMS) items.pop();
  saveAll(items);
  return item;
}

export function removeHistory(id: string) {
  const items = getAll().filter((i) => i.id !== id);
  saveAll(items);
}

export function clearHistory() {
  saveAll([]);
}
