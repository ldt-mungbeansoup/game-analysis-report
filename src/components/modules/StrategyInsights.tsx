"use client";

import type { StrategyInsightsData } from "@/types";
import { safeArray, safeString } from "@/lib/safe";
import { TrendingUp, Target, ArrowUpRight, AlertTriangle, Calculator } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  data: StrategyInsightsData;
}

interface InsightCardProps {
  icon: React.ReactNode;
  title: string;
  borderColor: string;
  bgColor: string;
  content: string | string[];
}

function InsightCard({
  icon,
  title,
  borderColor,
  bgColor,
  content,
}: InsightCardProps) {
  return (
    <div
      className={`rounded-2xl border border-[#e5e5ea] p-5 space-y-4 ${borderColor} ${bgColor}`}
    >
      <div className="flex items-center gap-2">
        <span className="shrink-0">{icon}</span>
        <h3 className="text-sm font-semibold text-[#1d1d1f]">{title}</h3>
      </div>

      <div>
        {Array.isArray(content) ? (
          <ul className="space-y-2">
            {content.map((item, i) => (
              <li key={i} className="text-sm text-[#1d1d1f] flex items-start gap-2">
                <span className="text-[#86868b] mt-1 shrink-0">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-[#1d1d1f]">{content}</p>
        )}
      </div>
    </div>
  );
}

export default function StrategyInsights({ data }: Props) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
    <section id="strategyInsights" className="scroll-mt-20 mb-16">
      <h2 className="text-xl font-bold text-[#1d1d1f] mb-5">
        ⑦ 策略启示
      </h2>

      <div className="space-y-4">
        {/* 市场机会 */}
        <InsightCard
          icon={<TrendingUp className="h-5 w-5 text-green-400" />}
          title="市场机会"
          borderColor="border-l-4 border-l-green-500"
          bgColor="bg-green-500/5"
          content={safeString(data.marketOpportunity)}
        />

        {/* 差异化建议 */}
        <InsightCard
          icon={<Target className="h-5 w-5 text-blue-400" />}
          title="差异化建议"
          borderColor="border-l-4 border-l-blue-500"
          bgColor="bg-blue-500/5"
          content={safeArray(data.differentiation) as string[]}
        />

        {/* 趋势方向 */}
        <InsightCard
          icon={<ArrowUpRight className="h-5 w-5 text-purple-400" />}
          title="趋势方向"
          borderColor="border-l-4 border-l-purple-500"
          bgColor="bg-purple-500/5"
          content={safeArray(data.trendDirection) as string[]}
        />

        {/* 风险预警 */}
        <InsightCard
          icon={<AlertTriangle className="h-5 w-5 text-red-400" />}
          title="风险预警"
          borderColor="border-l-4 border-l-red-500"
          bgColor="bg-red-500/5"
          content={safeArray(data.riskWarnings) as string[]}
        />

        {/* 资源评估 */}
        <InsightCard
          icon={<Calculator className="h-5 w-5 text-amber-400" />}
          title="资源评估"
          borderColor="border-l-4 border-l-amber-500"
          bgColor="bg-amber-500/5"
          content={safeString(data.resourceEstimation)}
        />
      </div>
    </section>
    </motion.div>
  );
}
