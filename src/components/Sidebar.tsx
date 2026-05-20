"use client";

// 游戏竞品分析报告 — 左侧目录导航（桌面端显示）

import type { SectionId } from "@/types";

/** 导航项配置 */
const NAV_ITEMS: { id: SectionId; label: string }[] = [
  { id: "productInfo", label: "① 产品信息层" },
  { id: "gameplay", label: "② 核心玩法拆解" },
  { id: "dataAndUsers", label: "③ 产品数据与用户层" },
  { id: "monetization", label: "④ 商业系统层" },
  { id: "playerFeedback", label: "⑤ 玩家反馈层" },
  { id: "competitiveMatrix", label: "⑥ 竞品对比矩阵" },
  { id: "strategyInsights", label: "⑦ 策略启示" },
];

interface SidebarProps {
  activeSection: SectionId;
  onNavigate: (id: SectionId) => void;
}

export default function Sidebar({ activeSection, onNavigate }: SidebarProps) {
  return (
    <aside className="hidden lg:block fixed left-4 top-20 z-40 w-48">
      <nav>
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors
                    ${isActive
                      ? "bg-primary/15 text-primary font-medium"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                >
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
