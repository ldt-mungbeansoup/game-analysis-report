"use client";

import type { CompetitiveMatrixData } from "@/types";
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Legend,
} from "recharts";
import { motion } from "framer-motion";

interface Props {
  data: CompetitiveMatrixData;
}

const RADAR_COLORS = ["#f59e0b", "#3b82f6", "#10b981", "#ef4444", "#8b5cf6"];

export default function CompetitiveMatrix({ data }: Props) {
  const radar = data.radar || { dimensions: [], games: [] };
  const timeline = data.timeline || { eras: [] };

  const radarData = (radar.dimensions||[]).map((dim, i) => {
    const entry: Record<string, string | number> = { dimension: dim };
    (radar.games||[]).forEach((game) => {
      entry[game.name] = game.values[i] ?? 0;
    });
    return entry;
  });

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
    <section id="competitiveMatrix" className="scroll-mt-20 mb-16">
      <h2 className="text-xl font-bold text-[#1d1d1f] mb-5">
        ⑥ 竞品对比矩阵
      </h2>

      {/* 横向：雷达图 */}
      <div className="border border-[#e5e5ea] bg-white rounded-2xl p-5 mb-8">
        <h3 className="text-sm font-semibold text-[#86868b] mb-3">
          横向对比 · 竞品雷达图
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e5e5ea" />
              <PolarAngleAxis
                dataKey="dimension"
                tick={{ fill: "#86868b", fontSize: 12 }}
              />
              {(radar.games||[]).map((game, index) => (
                <Radar
                  key={game.name}
                  name={game.name}
                  dataKey={game.name}
                  stroke={RADAR_COLORS[index % RADAR_COLORS.length]}
                  fill={RADAR_COLORS[index % RADAR_COLORS.length]}
                  strokeWidth={2}
                  fillOpacity={0.15}
                />
              ))}
              <Legend
                wrapperStyle={{
                  color: "#86868b",
                  fontSize: 12,
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 纵向：时间轴 */}
      <div className="border border-[#e5e5ea] bg-white rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-[#86868b] mb-6">
          纵向对比 · 品类历史演进
        </h3>

        <div className="relative">
          {/* 时间轴竖线 */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[#e5e5ea]" />

          <div className="space-y-8">
            {(timeline.eras||[]).map((era, eraIndex) => (
              <div key={eraIndex} className="relative pl-10">
                {/* 时间轴圆点 */}
                <div className="absolute left-2.5 top-1.5 h-3 w-3 rounded-full bg-[#007AFF] ring-2 ring-white" />

                {/* 卡片内容 */}
                <div className="border border-[#e5e5ea] bg-white rounded-2xl p-4">
                  {/* 头部 */}
                  <div className="flex items-center gap-3 mb-3">
                    <span className="inline-flex items-center rounded-full bg-[#007AFF]/10 text-[#007AFF] text-xs font-medium px-2.5 py-0.5">
                      {era.name}
                    </span>
                    <span className="text-xs text-[#86868b]">
                      {era.period}
                    </span>
                  </div>

                  {/* 里程碑列表 */}
                  <div className="space-y-2 mb-3">
                    {(era.milestones||[]).map((m, mi) => (
                      <div
                        key={mi}
                        className="grid grid-cols-[80px_1fr] gap-2 text-sm"
                      >
                        <span className="text-[#86868b]">{m.year}</span>
                        <span>
                          <span className="text-[#1d1d1f] font-medium">
                            {m.game}
                          </span>
                          <span className="text-[#86868b]">
                            {' '}
                            — {m.innovation}
                          </span>
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* 趋势 */}
                  <div className="border-t border-[#e5e5ea] pt-2">
                    <p className="text-xs text-[#86868b]">{era.trend}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
    </motion.div>
  );
}
