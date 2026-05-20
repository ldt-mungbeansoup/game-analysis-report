"use client";

import type { DataAndUsersData } from "@/types";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  BarChart, Bar,
} from "recharts";
import type { ReactNode } from "react";

interface Props {
  data: DataAndUsersData;
}

const COLORS = ["#f59e0b", "#3b82f6", "#10b981", "#ef4444", "#8b5cf6"];
const PIE_COLORS = ["#f59e0b", "#3b82f6", "#10b981", "#ef4444", "#8b5cf6"];

const chartTooltipStyle = {
  backgroundColor: "#1f2937",
  border: "1px solid #374151",
  borderRadius: "8px",
  color: "#f3f4f6",
};

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-xl font-bold text-foreground mb-5">{children}</h2>
  );
}

function SubSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="border border-border bg-card/50 rounded-lg p-5 mb-6">
      <h3 className="text-sm font-semibold text-muted-foreground mb-3">{title}</h3>
      {children}
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-border bg-card rounded-lg p-4 text-center">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className="text-lg font-bold text-primary">{value}</p>
    </div>
  );
}

function TagGroup({ label, tags }: { label: string; tags: string[] }) {
  return (
    <div className="mb-3">
      <p className="text-xs text-muted-foreground mb-2">{label}</p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-primary/10 text-primary text-xs px-3 py-1"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

function BarChartCard({
  title,
  data,
}: {
  title: string;
  data: { name: string; value: number }[];
}) {
  return (
    <div>
      <p className="text-xs text-muted-foreground mb-2">{title}</p>
      <div className="h-36">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid stroke="#374151" strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fill: "#9ca3af", fontSize: 11 }} />
            <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} />
            <Tooltip contentStyle={chartTooltipStyle} />
            <Bar dataKey="value" fill="#f59e0b" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function DataAndUsers({ data }: Props) {
  const {
    marketPerformance,
    userProfile,
    userSegmentation,
    retention,
    acquisition,
  } = data;

  const coreCasualData = [
    { name: "核心玩家", value: userSegmentation.coreVsCasual.core },
    { name: "泛用户", value: userSegmentation.coreVsCasual.casual },
  ];

  const paymentTierData = [
    { name: "鲸鱼", value: userSegmentation.paymentTiers.whale },
    { name: "海豚", value: userSegmentation.paymentTiers.dolphin },
    { name: "小鱼", value: userSegmentation.paymentTiers.minnow },
    { name: "免费", value: userSegmentation.paymentTiers.f2p },
  ];

  const socialStyleData = [
    { name: "社交型", value: userSegmentation.socialStyle.social },
    { name: "独狼型", value: userSegmentation.socialStyle.solo },
  ];

  return (
    <section id="dataAndUsers" className="scroll-mt-20 mb-16">
      <SectionTitle>③ 产品数据与用户层</SectionTitle>

      {/* 市场表现 */}
      <SubSection title="市场表现">
        <div className="h-56 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={marketPerformance.downloadsTrend}>
              <CartesianGrid stroke="#374151" strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tick={{ fill: "#9ca3af", fontSize: 11 }}
              />
              <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{ fill: "#f59e0b", r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <MetricCard label="收入估算" value={marketPerformance.revenueEstimate} />
      </SubSection>

      {/* 用户画像 */}
      <SubSection title="用户画像">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 年龄分布饼图 */}
          <div className="h-44">
            <p className="text-xs text-muted-foreground mb-2 text-center">年龄分布</p>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userProfile.ageDistribution.map((item) => ({
                    name: item.group,
                    value: item.percentage,
                  }))}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={60}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, value }) => `${name} ${value}%`}
                >
                  {userProfile.ageDistribution.map((_, index) => (
                    <Cell
                      key={`age-cell-${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip contentStyle={chartTooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* 性别比 */}
          <div className="flex items-center justify-center gap-8">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-400">
                {userProfile.genderRatio.male}%
              </p>
              <p className="text-xs text-muted-foreground mt-1">男性</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-pink-400">
                {userProfile.genderRatio.female}%
              </p>
              <p className="text-xs text-muted-foreground mt-1">女性</p>
            </div>
          </div>

          {/* 地域分布进度条 */}
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">地域分布</p>
            {userProfile.regionDistribution.map((item, index) => (
              <div key={item.region}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">{item.region}</span>
                  <span className="text-foreground">{item.percentage}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted">
                  <div
                    className="h-1.5 rounded-full"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: COLORS[index % COLORS.length],
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </SubSection>

      {/* 用户分层 */}
      <SubSection title="用户分层">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <BarChartCard title="核心 vs 泛用户" data={coreCasualData} />
          <BarChartCard title="付费分层" data={paymentTierData} />
          <BarChartCard title="社交 vs 独狼" data={socialStyleData} />
        </div>
      </SubSection>

      {/* 留存 */}
      <SubSection title="留存">
        <div className="flex gap-4 mb-4">
          <div className="flex-1 border border-border bg-card rounded-lg p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">次日留存</p>
            <p className="text-xl font-bold text-primary">{retention.d1}</p>
          </div>
          <div className="flex-1 border border-border bg-card rounded-lg p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">7日留存</p>
            <p className="text-xl font-bold text-primary">{retention.d7}</p>
          </div>
          <div className="flex-1 border border-border bg-card rounded-lg p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">30日留存</p>
            <p className="text-xl font-bold text-primary">{retention.d30}</p>
          </div>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-2">流失节点</p>
          <ul className="space-y-1">
            {retention.churnNodes.map((node, i) => (
              <li key={i} className="text-sm text-foreground flex items-start gap-2">
                <span className="text-muted-foreground mt-0.5">•</span>
                {node}
              </li>
            ))}
          </ul>
        </div>
      </SubSection>

      {/* 获客 */}
      <SubSection title="获客策略">
        <TagGroup label="买量平台" tags={acquisition.platforms} />
        <div className="mb-3">
          <p className="text-xs text-muted-foreground mb-1">素材风格</p>
          <p className="text-sm text-foreground">{acquisition.creativeStyle}</p>
        </div>
        <div className="mb-3">
          <p className="text-xs text-muted-foreground mb-1">KOL 策略</p>
          <p className="text-sm text-foreground">{acquisition.kolStrategy}</p>
        </div>
        <TagGroup label="IP 联动" tags={acquisition.ipCollaborations} />
      </SubSection>
    </section>
  );
}
