import { GameAnalysis } from "@/types";
import { safeArray, safeString, safeObj } from "@/lib/safe";

function safe(obj: any, path: string[], fallback: any = "-"): any {
  let cur = obj;
  for (const key of path) {
    if (cur == null || typeof cur !== "object") return fallback;
    cur = cur[key];
  }
  return cur ?? fallback;
}

export function generateMarkdown(gameName: string, data: GameAnalysis): string {
  const pi = data.productInfo || {} as any;
  const gp = data.gameplay || {} as any;
  const du = data.dataAndUsers || {} as any;
  const mn = data.monetization || {} as any;
  const pf = data.playerFeedback || {} as any;
  const cm = data.competitiveMatrix || {} as any;
  const si = data.strategyInsights || {} as any;
  const radar = safeObj(cm.radar, { dimensions: [] as string[], games: [] as any[] }) as any;

  const lines = [
    "# " + gameName + " 竞品分析报告",
    "> 生成时间: " + new Date().toLocaleString("zh-CN"),
    "",
    "## 一、产品信息层",
    "- **开发商**: " + safeString(pi.developer),
    "- **发行商**: " + safeString(pi.publisher),
    "- **上线时间**: " + safeString(pi.releaseDate),
    "- **生命周期**: " + safeString(pi.lifecycle),
    "- **平台**: " + safeArray(pi.platforms).join(" / "),
    "- **IP 背景**: " + safeString(pi.ipBackground),
    "- **团队背景**: " + safeString(pi.teamBackground),
    "",
    "## 二、核心玩法拆解",
    "**核心循环**: " + safeString(gp.coreLoop),
    "- 操作机制: " + safeArray(gp.mechanics).join("; "),
    "- 成长体系: " + safeString(gp.progression),
    "- 关卡结构: " + safeString(gp.contentStructure),
    "- 社交系统: " + safeString(gp.socialSystem),
    "- 新手引导: " + safeString(gp.onboarding),
    "- UGC 生态: " + safeString(gp.ugcEcosystem),
    "",
    "## 三、产品数据与用户层",
    "**收入估算**: " + safeString(safe(du, ["marketPerformance", "revenueEstimate"])),
    "- 性别比: 男 " + safe(du, ["userProfile", "genderRatio", "male"], 0) + "% / 女 " + safe(du, ["userProfile", "genderRatio", "female"], 0) + "%",
    "- 设备偏好: " + safeString(safe(du, ["userProfile", "devicePreference"])),
    "- 次日留存: " + safeString(safe(du, ["retention", "d1"])),
    "- 7日留存: " + safeString(safe(du, ["retention", "d7"])),
    "- 30日留存: " + safeString(safe(du, ["retention", "d30"])),
    "",
    "## 四、商业系统层",
    "- 付费模式: " + safeArray(mn.paymentModel).join(" / "),
    "- 定价策略: " + safeString(mn.pricingStrategy),
    "- 战令: " + safeString(mn.battlePass),
    "- 抽卡: " + safeString(mn.gacha),
    "- 活动节奏: " + safeString(mn.eventCadence),
    "- 订阅: " + safeString(mn.subscription),
    "- 广告: " + safeString(mn.ads),
    "",
    "## 五、玩家反馈层",
    "- 玩家诉求: " + safeArray(pf.playerDemands).join("; "),
    "- 官方响应: " + safeString(pf.officialResponse),
    "",
    "## 六、竞品对比矩阵",
    ...safeArray(radar.games).map((g: any) =>
      "- " + safeString(g.name) + ": " + safeArray(radar.dimensions).map((d: any, i: number) => safeString(d) + "=" + (safeArray(g.values)[i] ?? "-")).join(", ")
    ),
    "",
    "## 七、策略启示",
    "- 市场机会: " + safeString(si.marketOpportunity),
    "- 差异化: " + safeArray(si.differentiation).join("; "),
    "- 趋势方向: " + safeArray(si.trendDirection).join("; "),
    "- 风险: " + safeArray(si.riskWarnings).join("; "),
    "- 资源评估: " + safeString(si.resourceEstimation),
  ];

  return lines.join("\n");
}

export function downloadMarkdown(gameName: string, data: GameAnalysis) {
  try {
    const md = generateMarkdown(gameName, data);
    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = gameName + "_竞品分析报告.md";
    a.click();
    URL.revokeObjectURL(url);
  } catch(e: any) {
    console.error("Failed to download markdown:", e);
  }
}
