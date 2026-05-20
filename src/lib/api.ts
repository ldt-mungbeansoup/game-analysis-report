const DEEPSEEK_BASE = "https://api.deepseek.com/v1";
const DEEPSEEK_MODEL = "deepseek-chat";

const MODULE_CONTEXTS: Record<string, string> = {
  productInfo:
    "你正在分析一款游戏的产品信息层，包括开发商、发行商、开发团队背景、上线时间、生命周期阶段、平台和IP背景。请根据这些信息给出专业分析。",
  gameplay:
    "你正在分析一款游戏的核心玩法，包括核心循环、操作机制、成长体系、关卡结构、社交系统、新手引导和UGC生态。请从游戏设计角度给出专业拆解。",
  dataAndUsers:
    "你正在分析一款游戏的产品数据和用户情况，包括市场表现、用户画像、用户分层、留存数据和获客渠道。请从数据角度给出洞察。",
  monetization:
    "你正在分析一款游戏的商业系统，包括付费模式、定价策略、Battle Pass、抽卡机制、活动节奏、订阅和广告变现。请从商业化角度给出分析。",
  playerFeedback:
    "你正在分析玩家对一款游戏的反馈，包括评分趋势、评论关键词、社区话题和媒体评价。请从用户研究角度给出总结。",
  competitiveMatrix:
    "你正在分析游戏品类的竞争格局，包括横向竞品对比和纵向历史演进。请给出竞争策略方面的洞察。",
  strategyInsights:
    "你正在总结一款游戏竞品分析报告的策略启示。请结合前述分析，给出市场机会、差异化建议、趋势方向和风险预警。",
};

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export async function sendChatMessage(
  messages: ChatMessage[],
  moduleId: string,
  apiKey: string
): Promise<string> {
  const context = MODULE_CONTEXTS[moduleId] || MODULE_CONTEXTS.productInfo;
  const systemMessage: ChatMessage = {
    role: "system",
    content: `你是一个专业的游戏竞品分析助手。${context}请用中文回答，分析要专业深入，可以输出表格，字数控制在200-500字。`,
  };

  const response = await fetch(`${DEEPSEEK_BASE}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: DEEPSEEK_MODEL,
      messages: [systemMessage, ...messages],
      max_tokens: 2048,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      (error as { error?: { message?: string } })?.error?.message ||
        `API 请求失败 (${response.status})`
    );
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "未能获取分析结果，请稍后重试。";
}
