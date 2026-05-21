"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { ModuleId } from "@/types";

const STEPS: { id: ModuleId; label: string }[] = [
  { id: "productInfo", label: "产品信息层" },
  { id: "gameplay", label: "核心玩法拆解" },
  { id: "dataAndUsers", label: "数据与用户层" },
  { id: "monetization", label: "商业系统层" },
  { id: "playerFeedback", label: "玩家反馈层" },
  { id: "competitiveMatrix", label: "竞品对比矩阵" },
  { id: "strategyInsights", label: "策略启示" },
];

interface Props { currentModule: ModuleId | null; completedModules: ModuleId[]; }

export default function ProgressBar({ currentModule, completedModules }: Props) {
  return (
    <div className="w-full max-w-3xl mx-auto mb-10">
      <div className="flex items-center justify-between">
        {STEPS.map((step, i) => {
          const done = completedModules.includes(step.id);
          const active = step.id === currentModule;
          return (
            <div key={step.id} className="flex flex-col items-center gap-1.5 flex-1 relative">
              {i > 0 && <div className={`absolute right-full top-3 h-0.5 w-full -translate-y-1/2 ${i <= completedModules.length ? "bg-[#007AFF]" : "bg-[#e5e5ea]"}`} />}
              <motion.div animate={active ? { scale: [1, 1.1, 1] } : {}} transition={{ repeat: active ? Infinity : 0, duration: 1.5 }} className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${done ? "bg-[#007AFF] text-white" : active ? "bg-[#007AFF] text-white ring-4 ring-[#007AFF]/20" : "bg-[#e5e5ea] text-[#86868b]"}`}>
                {done ? <Check className="h-3 w-3" /> : i + 1}
              </motion.div>
              <span className={`text-xs ${active ? "text-[#007AFF] font-medium" : done ? "text-[#007AFF]" : "text-[#aeaeb2]"} hidden sm:block`}>{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
