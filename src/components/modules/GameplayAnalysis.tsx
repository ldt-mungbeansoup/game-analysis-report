"use client";

import { GameplayData } from "@/types";
import { ChevronDown } from "lucide-react";

interface Props {
  data: GameplayData;
}

const LOOP_STEPS = ["探索", "战斗", "养成", "抽卡", "社交"];

export default function GameplayAnalysis({ data }: Props) {
  return (
    <section id="gameplay" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">② 核心玩法拆解</h2>

      <div className="mb-6 rounded-lg border border-border bg-card p-6">
        <h3 className="mb-4 text-sm font-semibold text-muted-foreground">核心循环</h3>
        <div className="flex flex-wrap items-center justify-center gap-2 py-4">
          {LOOP_STEPS.map((step, i) => (
            <div key={step} className="flex items-center">
              <div className="rounded-full bg-primary/20 px-4 py-2 text-sm font-medium text-primary">
                {step}
              </div>
              {i < LOOP_STEPS.length - 1 && (
                <div className="mx-1 text-muted-foreground">→</div>
              )}
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-foreground/70">{data.coreLoop}</p>
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
          className="group mb-2 rounded-lg border border-border bg-card"
        >
          <summary className="flex cursor-pointer items-center justify-between p-4 text-sm font-medium text-foreground hover:bg-accent/50 transition-colors">
            {section.label}
            <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180" />
          </summary>
          <div className="border-t border-border px-4 py-3 text-sm leading-relaxed text-foreground/80">
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
  );
}
