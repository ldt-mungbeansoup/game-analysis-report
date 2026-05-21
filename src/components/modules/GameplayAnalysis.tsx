"use client";

import { GameplayData } from "@/types";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  data: GameplayData;
}

const LOOP_STEPS = ["探索", "战斗", "养成", "抽卡", "社交"];

export default function GameplayAnalysis({ data }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <section id="gameplay" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold text-[#1d1d1f]">② 核心玩法拆解</h2>

        <div className="mb-6 rounded-2xl border border-[#e5e5ea] bg-white p-6">
          <h3 className="mb-4 text-sm font-semibold text-[#86868b]">核心循环</h3>
          <div className="flex flex-wrap items-center justify-center gap-2 py-4">
            {LOOP_STEPS.map((step, i) => (
              <div key={step} className="flex items-center">
                <div className="rounded-full bg-[#007AFF]/10 px-4 py-2 text-sm font-medium text-[#007AFF]">
                  {step}
                </div>
                {i < LOOP_STEPS.length - 1 && (
                  <div className="mx-1 text-[#86868b]">→</div>
                )}
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-[#3a3a3c]">{data.coreLoop}</p>
        </div>

        {([
          { key: "mechanics", label: "操作机制", type: "list", content: data.mechanics },
          { key: "progression", label: "成长体系", type: "text", content: data.progression },
          { key: "contentStructure", label: "关卡/内容结构", type: "text", content: data.contentStructure },
          { key: "socialSystem", label: "社交系统", type: "text", content: data.socialSystem },
          { key: "onboarding", label: "新手引导", type: "text", content: data.onboarding },
          { key: "ugcEcosystem", label: "UGC/社区生态", type: "text", content: data.ugcEcosystem },
        ] as const).map((section) => (
          <details
            key={section.key}
            className="group mb-2 rounded-2xl border border-[#e5e5ea] bg-white"
          >
            <summary className="flex cursor-pointer items-center justify-between p-4 text-sm font-medium text-[#1d1d1f] hover:bg-[#f5f5f7] transition-colors">
              {section.label}
              <ChevronDown className="h-4 w-4 text-[#86868b] transition-transform group-open:rotate-180" />
            </summary>
            <div className="border-t border-[#e5e5ea] px-4 py-3 text-sm leading-relaxed text-[#1d1d1f]">
              {section.type === "list" && Array.isArray(section.content) ? (
                <ul className="list-disc pl-5 space-y-1">
                  {section.content.map((item: string, i: number) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p>{section.content as string}</p>
              )}
            </div>
          </details>
        ))}
      </section>
    </motion.div>
  );
}
