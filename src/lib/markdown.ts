import { GameAnalysis } from "@/types";

export function generateMarkdown(gameName: string, data: GameAnalysis): string {
  const md = [
    `# ${gameName} 竞品分析报告`,
    `> 生成时间: ${new Date().toLocaleString("zh-CN")}`,
    "",
    "## 一、产品信息层",
    `- **开发商**: ${data.productInfo.developer}`,
    `- **发行商**: ${data.productInfo.publisher}`,
    `- **上线时间**: ${data.productInfo.releaseDate}`,
    `- **生命周期**: ${data.productInfo.lifecycle}`,
    `- **平台**: ${data.productInfo.platforms.join(" / ")}`,
    `- **IP 背景**: ${data.productInfo.ipBackground}`,
    `- **团队背景**: ${data.productInfo.teamBackground}`,
    "",
    "## 二、核心玩法拆解",
    `**核心循环**: ${data.gameplay.coreLoop}`,
    `- 操作机制: ${data.gameplay.mechanics.join("; ")}`,
    `- 成长体系: ${data.gameplay.progression}`,
    `- 关卡结构: ${data.gameplay.contentStructure}`,
    `- 社交系统: ${data.gameplay.socialSystem}`,
    `- 新手引导: ${data.gameplay.onboarding}`,
    `- UGC 生态: ${data.gameplay.ugcEcosystem}`,
    "",
    "## 三、产品数据与用户层",
    `**收入估算**: ${data.dataAndUsers.marketPerformance.revenueEstimate}`,
    `- 性别比: 男 ${data.dataAndUsers.userProfile.genderRatio.male}% / 女 ${data.dataAndUsers.userProfile.genderRatio.female}%`,
    `- 设备偏好: ${data.dataAndUsers.userProfile.devicePreference}`,
    `- 次日留存: ${data.dataAndUsers.retention.d1}`,
    `- 7日留存: ${data.dataAndUsers.retention.d7}`,
    `- 30日留存: ${data.dataAndUsers.retention.d30}`,
    "",
    "## 四、商业系统层",
    `- 付费模式: ${data.monetization.paymentModel.join(" / ")}`,
    `- 定价策略: ${data.monetization.pricingStrategy}`,
    `- 战令: ${data.monetization.battlePass}`,
    `- 抽卡: ${data.monetization.gacha}`,
    `- 活动节奏: ${data.monetization.eventCadence}`,
    `- 订阅: ${data.monetization.subscription}`,
    `- 广告: ${data.monetization.ads}`,
    "",
    "## 五、玩家反馈层",
    `- 玩家诉求: ${data.playerFeedback.playerDemands.join("; ")}`,
    `- 官方响应: ${data.playerFeedback.officialResponse}`,
    "",
    "## 六、竞品对比矩阵",
    ...data.competitiveMatrix.radar.games.map(g =>
      `- ${g.name}: ${data.competitiveMatrix.radar.dimensions.map((d, i) => `${d}=${g.values[i]}`).join(", ")}`
    ),
    "",
    "## 七、策略启示",
    `- 市场机会: ${data.strategyInsights.marketOpportunity}`,
    `- 差异化: ${data.strategyInsights.differentiation.join("; ")}`,
    `- 趋势方向: ${data.strategyInsights.trendDirection.join("; ")}`,
    `- 风险: ${data.strategyInsights.riskWarnings.join("; ")}`,
    `- 资源评估: ${data.strategyInsights.resourceEstimation}`,
  ].join("\n");
  return md;
}

export function downloadMarkdown(gameName: string, data: GameAnalysis) {
  const md = generateMarkdown(gameName, data);
  const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${gameName}_竞品分析报告.md`;
  a.click();
  URL.revokeObjectURL(url);
}
