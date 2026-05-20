/** 游戏列表索引项 */
export interface GameIndexItem {
  id: string;
  name: string;
  developer: string;
  releaseYear: number;
  category: string;
}

/** ① 产品信息层 */
export interface ProductInfoData {
  developer: string;
  publisher: string;
  teamBackground: string;
  releaseDate: string;
  lifecycle: "上升期" | "稳定期" | "衰退期";
  platforms: string[];
  ipBackground: string;
}

/** ② 核心玩法拆解 */
export interface GameplayData {
  coreLoop: string;
  mechanics: string[];
  progression: string;
  contentStructure: string;
  socialSystem: string;
  onboarding: string;
  ugcEcosystem: string;
}

/** ③ 产品数据与用户层 */
export interface DataAndUsersData {
  marketPerformance: {
    downloadsTrend: { month: string; value: number }[];
    revenueEstimate: string;
    rankHistory: { date: string; rank: number }[];
  };
  userProfile: {
    ageDistribution: { group: string; percentage: number }[];
    genderRatio: { male: number; female: number };
    regionDistribution: { region: string; percentage: number }[];
    devicePreference: string;
  };
  userSegmentation: {
    coreVsCasual: { core: number; casual: number };
    paymentTiers: { whale: number; dolphin: number; minnow: number; f2p: number };
    socialStyle: { social: number; solo: number };
  };
  retention: {
    d1: string;
    d7: string;
    d30: string;
    churnNodes: string[];
    returnMechanism: string;
  };
  acquisition: {
    platforms: string[];
    creativeStyle: string;
    kolStrategy: string;
    ipCollaborations: string[];
  };
}

/** ④ 商业系统层 */
export interface MonetizationData {
  paymentModel: string[];
  pricingStrategy: string;
  battlePass: string;
  gacha: string;
  eventCadence: string;
  subscription: string;
  ads: string;
}

/** ⑤ 玩家反馈层 */
export interface PlayerFeedbackData {
  ratingTrend: { date: string; rating: number }[];
  positiveKeywords: { word: string; weight: number }[];
  negativeKeywords: { word: string; weight: number }[];
  hotTopics: string[];
  mediaReviews: { source: string; score: string; summary: string }[];
  playerDemands: string[];
  officialResponse: string;
}

/** ⑥ 竞品对比矩阵 */
export interface CompetitiveMatrixData {
  radar: {
    dimensions: string[];
    games: { name: string; values: number[] }[];
  };
  timeline: {
    eras: {
      name: string;
      period: string;
      milestones: { game: string; year: string; innovation: string }[];
      trend: string;
    }[];
  };
}

/** ⑦ 策略启示 */
export interface StrategyInsightsData {
  marketOpportunity: string;
  differentiation: string[];
  trendDirection: string[];
  riskWarnings: string[];
  resourceEstimation: string;
}

/** 完整游戏分析数据 */
export interface GameAnalysis {
  productInfo: ProductInfoData;
  gameplay: GameplayData;
  dataAndUsers: DataAndUsersData;
  monetization: MonetizationData;
  playerFeedback: PlayerFeedbackData;
  competitiveMatrix: CompetitiveMatrixData;
  strategyInsights: StrategyInsightsData;
}

/** 报告模块 ID */
export type SectionId =
  | "productInfo"
  | "gameplay"
  | "dataAndUsers"
  | "monetization"
  | "playerFeedback"
  | "competitiveMatrix"
  | "strategyInsights";


/** 主题色 */
export type Theme = "light" | "dark";

