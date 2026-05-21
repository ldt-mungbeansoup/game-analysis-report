"use client";

import type { ModuleId } from "@/types";

const NAV_ITEMS: { id: ModuleId; label: string }[] = [
  { id: "productInfo", label: "① 产品信息层" },
  { id: "gameplay", label: "② 核心玩法拆解" },
  { id: "dataAndUsers", label: "③ 产品数据与用户层" },
  { id: "monetization", label: "④ 商业系统层" },
  { id: "playerFeedback", label: "⑤ 玩家反馈层" },
  { id: "competitiveMatrix", label: "⑥ 竞品对比矩阵" },
  { id: "strategyInsights", label: "⑦ 策略启示" },
];

interface SidebarProps {
  activeSection: ModuleId;
  onNavigate: (id: ModuleId) => void;
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
                      ? "bg-[#007AFF]/10 text-[#007AFF] font-medium"
                      : "text-[#86868b] hover:bg-[#f5f5f7] hover:text-[#1d1d1f]"
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
