"use client";

// 游戏竞品分析报告 — 暗/亮主题 Context 提供者

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Theme } from "@/types";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/** 从 localStorage 读取持久化的主题偏好，默认暗色 */
function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  const stored = localStorage.getItem("game-report-theme");
  if (stored === "light" || stored === "dark") return stored;
  return "dark";
}

/** 将主题应用到 document.documentElement.classList */
function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(theme);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  // 挂载后读取 localStorage 并应用主题
  useEffect(() => {
    const stored = getStoredTheme();
    setTheme(stored);
    applyTheme(stored);
  }, []);

  // 主题变化时同步 class 和 localStorage
  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem("game-report-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/** 便捷 Hook：在任意 "use client" 组件中获取主题状态 */
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (ctx === undefined) {
    throw new Error("useTheme 必须在 ThemeProvider 内部使用");
  }
  return ctx;
}
