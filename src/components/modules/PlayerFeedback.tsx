"use client";

import { PlayerFeedbackData } from "@/types";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Props {
  data: PlayerFeedbackData;
}

const TOOLTIP_STYLE = {
  backgroundColor: "#ffffff",
  border: "1px solid #e5e5ea",
  borderRadius: "8px",
  color: "#1d1d1f",
};

export default function PlayerFeedback({ data }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <section id="playerFeedback" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold text-[#1d1d1f]">⑤ 玩家反馈层</h2>

        <div className="mb-6 rounded-2xl border border-[#e5e5ea] bg-white p-5">
          <h3 className="mb-3 text-sm font-semibold text-[#86868b]">商店评分趋势</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.ratingTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5ea" />
                <XAxis dataKey="date" stroke="#86868b" fontSize={12} />
                <YAxis domain={[0, 5]} stroke="#86868b" fontSize={12} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Line
                  type="monotone"
                  dataKey="rating"
                  stroke="#007AFF"
                  strokeWidth={2}
                  dot={{ fill: "#007AFF" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-[#e5e5ea] bg-white p-5">
            <h3 className="mb-3 text-sm font-semibold text-green-600">正面关键词</h3>
            <div className="flex flex-wrap gap-2">
              {data.positiveKeywords.map((kw) => (
                <span
                  key={kw.word}
                  className="rounded-full bg-green-500/10 px-3 py-1 text-green-600"
                  style={{ fontSize: `${Math.max(0.75, kw.weight / 10)}rem` }}
                >
                  {kw.word}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-[#e5e5ea] bg-white p-5">
            <h3 className="mb-3 text-sm font-semibold text-red-500">负面关键词</h3>
            <div className="flex flex-wrap gap-2">
              {data.negativeKeywords.map((kw) => (
                <span
                  key={kw.word}
                  className="rounded-full bg-red-500/10 px-3 py-1 text-red-500"
                  style={{ fontSize: `${Math.max(0.75, kw.weight / 10)}rem` }}
                >
                  {kw.word}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-6 rounded-2xl border border-[#e5e5ea] bg-white p-5">
          <h3 className="mb-3 text-sm font-semibold text-[#86868b]">社区高频话题</h3>
          <div className="flex flex-wrap gap-2">
            {data.hotTopics.map((t) => (
              <span
                key={t}
                className="rounded-md bg-[#f5f5f7] px-3 py-1 text-sm text-[#1d1d1f]"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-6 rounded-2xl border border-[#e5e5ea] bg-white p-5">
          <h3 className="mb-3 text-sm font-semibold text-[#86868b]">媒体 / KOL 评价</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#e5e5ea]">
                  <th className="py-2 text-left font-medium text-[#86868b]">来源</th>
                  <th className="py-2 text-left font-medium text-[#86868b]">评分</th>
                  <th className="py-2 text-left font-medium text-[#86868b]">摘要</th>
                </tr>
              </thead>
              <tbody>
                {data.mediaReviews.map((r) => (
                  <tr key={r.source} className="border-b border-[#e5e5ea]/50">
                    <td className="py-2 text-[#1d1d1f] font-medium">{r.source}</td>
                    <td className="py-2 text-[#007AFF] font-medium">{r.score}</td>
                    <td className="py-2 text-[#3a3a3c]">{r.summary}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-[#e5e5ea] bg-white p-5">
            <h3 className="mb-3 text-sm font-semibold text-[#86868b]">玩家核心诉求</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm text-[#1d1d1f]">
              {data.playerDemands.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-[#e5e5ea] bg-white p-5">
            <h3 className="mb-3 text-sm font-semibold text-[#86868b]">官方响应度</h3>
            <p className="text-sm leading-relaxed text-[#1d1d1f]">{data.officialResponse}</p>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
