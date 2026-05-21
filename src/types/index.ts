/** 分析请求 */
export interface AnalyzeRequest { gameName: string; customPrompt?: string; }

/** 模块 ID */
export type ModuleId = "productInfo" | "gameplay" | "dataAndUsers" | "monetization" | "playerFeedback" | "competitiveMatrix" | "strategyInsights";

/** 基础信息确认 */
export interface BasicInfo { name: string; developer: string; publisher: string; releaseDate: string; platforms: string[]; ipBackground: string; lifecycle: string; teamBackground: string; }

/** 主题 */
export type Theme = "dark" | "light";

/** SSE 流事件 */
export interface StreamEvent { type: "basicInfo" | "moduleStart" | "moduleData" | "moduleDone" | "done" | "error"; data?: unknown; moduleId?: ModuleId; label?: string; }

/** 历史记录项 */
export interface HistoryItem { id: string; gameName: string; createdAt: string; customPrompt?: string; data: GameAnalysis; }

// ---- 七大模块类型 ----

export interface ProductInfoData { developer: string; publisher: string; teamBackground: string; releaseDate: string; lifecycle: string; platforms: string[]; ipBackground: string; }

export interface GameplayData { coreLoop: string; mechanics: string[]; progression: string; contentStructure: string; socialSystem: string; onboarding: string; ugcEcosystem: string; }

export interface DataAndUsersData { marketPerformance: { downloadsTrend: { month: string; value: number }[]; revenueEstimate: string; rankHistory: { date: string; rank: number }[]; }; userProfile: { ageDistribution: { group: string; percentage: number }[]; genderRatio: { male: number; female: number }; regionDistribution: { region: string; percentage: number }[]; devicePreference: string; }; userSegmentation: { coreVsCasual: { core: number; casual: number }; paymentTiers: { whale: number; dolphin: number; minnow: number; f2p: number }; socialStyle: { social: number; solo: number }; }; retention: { d1: string; d7: string; d30: string; churnNodes: string[]; returnMechanism: string; }; acquisition: { platforms: string[]; creativeStyle: string; kolStrategy: string; ipCollaborations: string[]; }; }

export interface MonetizationData { paymentModel: string[]; pricingStrategy: string; battlePass: string; gacha: string; eventCadence: string; subscription: string; ads: string; }

export interface PlayerFeedbackData { ratingTrend: { date: string; rating: number }[]; positiveKeywords: { word: string; weight: number }[]; negativeKeywords: { word: string; weight: number }[]; hotTopics: string[]; mediaReviews: { source: string; score: string; summary: string }[]; playerDemands: string[]; officialResponse: string; }

export interface CompetitiveMatrixData { radar: { dimensions: string[]; games: { name: string; values: number[] }[]; }; timeline: { eras: { name: string; period: string; milestones: { game: string; year: string; innovation: string }[]; trend: string }[]; }; }

export interface StrategyInsightsData { marketOpportunity: string; differentiation: string[]; trendDirection: string[]; riskWarnings: string[]; resourceEstimation: string; }

export interface GameAnalysis { productInfo: ProductInfoData; gameplay: GameplayData; dataAndUsers: DataAndUsersData; monetization: MonetizationData; playerFeedback: PlayerFeedbackData; competitiveMatrix: CompetitiveMatrixData; strategyInsights: StrategyInsightsData; }
