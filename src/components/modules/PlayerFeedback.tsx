"use client";

import { PlayerFeedbackData } from "@/types";
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
  backgroundColor: "#1f2937",
  border: "1px solid #374151",
  borderRadius: "8px",
  color: "#f3f4f6",
};

export default function PlayerFeedback({ data }: Props) {
  return (
    <section id="playerFeedback" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">⑤ 玩家反馈层</h2>

      <div className="mb-6 rounded-lg border border-border bg-card p-5">
        <h3 className="mb-3 text-sm font-semibold text-muted-foreground">商店评分趋势</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.ratingTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
              <YAxis domain={[0, 5]} stroke="#9ca3af" fontSize={12} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Line
                type="monotone"
                dataKey="rating"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{ fill: "#f59e0b" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="mb-3 text-sm font-semibold text-green-400">正面关键词</h3>
          <div className="flex flex-wrap gap-2">
            {data.positiveKeywords.map((kw) => (
              <span
                key={kw.word}
                className="rounded-full bg-green-500/15 px-3 py-1 text-green-400"
                style={{ fontSize: `${Math.max(0.75, kw.weight / 10)}rem` }}
              >
                {kw.word}
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="mb-3 text-sm font-semibold text-red-400">负面关键词</h3>
          <div className="flex flex-wrap gap-2">
            {data.negativeKeywords.map((kw) => (
              <span
                key={kw.word}
                className="rounded-full bg-red-500/15 px-3 py-1 text-red-400"
                style={{ fontSize: `${Math.max(0.75, kw.weight / 10)}rem` }}
              >
                {kw.word}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-6 rounded-lg border border-border bg-card p-5">
        <h3 className="mb-3 text-sm font-semibold text-muted-foreground">社区高频话题</h3>
        <div className="flex flex-wrap gap-2">
          {data.hotTopics.map((t) => (
            <span
              key={t}
              className="rounded-md bg-accent px-3 py-1 text-sm text-foreground/80"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="mb-6 rounded-lg border border-border bg-card p-5">
        <h3 className="mb-3 text-sm font-semibold text-muted-foreground">媒体 / KOL 评价</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-2 text-left font-medium text-muted-foreground">来源</th>
                <th className="py-2 text-left font-medium text-muted-foreground">评分</th>
                <th className="py-2 text-left font-medium text-muted-foreground">摘要</th>
              </tr>
            </thead>
            <tbody>
              {data.mediaReviews.map((r) => (
                <tr key={r.source} className="border-b border-border/50">
                  <td className="py-2 text-foreground font-medium">{r.source}</td>
                  <td className="py-2 text-primary font-medium">{r.score}</td>
                  <td className="py-2 text-foreground/70">{r.summary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="mb-3 text-sm font-semibold text-muted-foreground">玩家核心诉求</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm text-foreground/80">
            {data.playerDemands.map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="mb-3 text-sm font-semibold text-muted-foreground">官方响应度</h3>
          <p className="text-sm leading-relaxed text-foreground/80">{data.officialResponse}</p>
        </div>
      </div>
    </section>
  );
}
