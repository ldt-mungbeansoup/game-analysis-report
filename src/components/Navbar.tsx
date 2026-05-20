"use client";

// 游戏竞品分析报告 — 顶部导航栏

import { useTheme } from "./ThemeProvider";
import { Sun, Moon, Bot } from "lucide-react";
import type { GameIndexItem } from "@/types";

interface NavbarProps {
  games: GameIndexItem[];
  selectedGameId: string;
  onSelectGame: (id: string) => void;
  onOpenAI: () => void;
}

export default function Navbar({
  games,
  selectedGameId,
  onSelectGame,
  onOpenAI,
}: NavbarProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-4">
        {/* 左侧：标题 */}
        <h1 className="text-lg font-bold whitespace-nowrap shrink-0">
          游戏竞品分析报告
        </h1>

        {/* 中间：游戏选择下拉框 */}
        <div className="flex-1 max-w-md mx-auto">
          <select
            value={selectedGameId}
            onChange={(e) => onSelectGame(e.target.value)}
            className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm
                       focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1
                       text-foreground cursor-pointer"
          >
            {games.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>

        {/* 右侧：AI 分析按钮 + 主题切换 */}
        <div className="flex items-center gap-2 shrink-0">
          {/* AI 分析按钮 */}
          <button
            onClick={onOpenAI}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium
                       text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Bot size={16} />
            <span className="hidden sm:inline">AI 分析</span>
          </button>

          {/* 暗/亮主题切换 */}
          <button
            onClick={toggleTheme}
            className="inline-flex items-center justify-center w-9 h-9 rounded-md border border-input
                       bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
            aria-label={theme === "dark" ? "切换亮色主题" : "切换暗色主题"}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
