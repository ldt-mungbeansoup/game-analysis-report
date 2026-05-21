"use client";

import { Sun, Moon, Clock } from "lucide-react";
import { useTheme } from "./ThemeProvider";

interface NavbarProps { onOpenHistory: () => void; hasResults: boolean; onBack: () => void; }

export default function Navbar({ onOpenHistory, hasResults, onBack }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 border-b border-[#e5e5ea] bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-12 max-w-4xl items-center justify-between px-4">
        {hasResults ? (
          <button onClick={onBack} className="text-sm text-[#007AFF] hover:text-[#0066d6] font-medium transition-colors">← 返回</button>
        ) : <div />}
        <h1 className="text-sm font-medium text-[#1d1d1f]">游戏竞品分析报告</h1>
        <div className="flex items-center gap-1">
          {hasResults && (
            <button onClick={onOpenHistory} className="p-2 rounded-full hover:bg-[#f5f5f7] transition-colors" aria-label="历史记录"><Clock className="h-4 w-4 text-[#86868b]" /></button>
          )}
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-[#f5f5f7] transition-colors" aria-label="切换主题">
            {theme === "dark" ? <Sun className="h-4 w-4 text-[#86868b]" /> : <Moon className="h-4 w-4 text-[#86868b]" />}
          </button>
        </div>
      </div>
    </header>
  );
}
