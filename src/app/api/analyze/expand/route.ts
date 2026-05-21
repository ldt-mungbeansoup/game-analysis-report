export const maxDuration = 60;

import { NextRequest } from "next/server";

const BASE = "https://api.deepseek.com/v1";

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });
}

const MODULE_PROMPTS: Record<string, string> = {
  productInfo: "You are a game industry researcher. Deeply analyze the PRODUCT INFO of this game: developer history, publisher strategy, team pedigree, release timeline & lifecycle stage, platform strategy, and IP background. Provide rich detail: historical context, studio reputation, previous titles, version milestones, platform exclusivity deals, IP origins and cross-media expansions. Write 400-800 Chinese characters. Return ONLY a JSON object: {developer, publisher, teamBackground, releaseDate, lifecycle, platforms:[], ipBackground}. All strings in Chinese.",

  gameplay: "You are a game design expert. Deeply analyze the GAMEPLAY of this game: core loop mechanics (with specific examples), combat/control systems, progression & upgrade trees, level/map structure, social & guild systems, new player onboarding funnel, and UGC/creator ecosystem. Be specific: name skills, describe combos, explain economy flow, map out progression tiers. Write 400-800 Chinese characters. Return ONLY a JSON object: {coreLoop, mechanics:[at least 5 items], progression, contentStructure, socialSystem, onboarding, ugcEcosystem}. All strings in Chinese.",

  dataAndUsers: "You are a game data analyst. Deeply analyze the DATA & USERS of this game: market performance with estimated numbers, user demographics with percentages, user segmentation (core/casual, whales/dolphins/minnows, social/solo), retention funnel with dropout reasons, and user acquisition strategy. Use realistic industry benchmarks. Write 400-800 Chinese characters. Return ONLY a JSON object: {marketPerformance:{downloadsTrend:[{month,value}], revenueEstimate, rankHistory:[{date,rank}]}, userProfile:{ageDistribution:[{group,percentage}], genderRatio:{male,female}, regionDistribution:[{region,percentage}], devicePreference}, userSegmentation:{coreVsCasual:{core,casual}, paymentTiers:{whale,dolphin,minnow,f2p}, socialStyle:{social,solo}}, retention:{d1,d7,d30,churnNodes:[at least 3],returnMechanism}, acquisition:{platforms:[at least 3],creativeStyle,kolStrategy,ipCollaborations:[at least 3]}}. All strings in Chinese.",

  monetization: "You are a game monetization expert. Deeply analyze the MONETIZATION of this game: payment models breakdown, pricing psychology, battle pass structure (tiers, rewards, pricing), gacha mechanics (rates, pity system, banner strategy), event calendar & FOMO tactics, subscription benefits, and ad integration. Be specific: name battle pass tiers, describe gacha banners, list event types, analyze pricing tiers. Write 400-800 Chinese characters. Return ONLY a JSON object: {paymentModel:[at least 3], pricingStrategy, battlePass, gacha, eventCadence, subscription, ads}. All strings in Chinese.",

  playerFeedback: "You are a player sentiment analyst. Deeply analyze PLAYER FEEDBACK for this game: rating trends over time with explanation, positive & negative keyword clusters with weights, community hot topics with context, media/KOL reviews with actual sources, player demands & complaints, and how the developers respond. Reference real review platforms like TapTap, Bilibili, NGA. Write 400-800 Chinese characters. Return ONLY a JSON object: {ratingTrend:[{date,rating} at least 5], positiveKeywords:[{word,weight} at least 5], negativeKeywords:[{word,weight} at least 5], hotTopics:[at least 4], mediaReviews:[{source,score,summary} at least 3], playerDemands:[at least 4], officialResponse}. All strings in Chinese.",

  competitiveMatrix: "You are a game market strategist. Deeply analyze COMPETITIVE LANDSCAPE for this game: horizontal comparison with 4+ similar games (radar chart dimensions), AND vertical timeline showing genre evolution across eras with key milestone games and innovations. Be specific: name real competitor games, describe what each innovated, trace genre history. Write 400-800 Chinese characters. Return ONLY a JSON object: {radar:{dimensions:['Play Depth','Art Quality','Monetization','Social','Retention','Innovation'], games:[{name,values:[6 numbers 0-100]} at least 4]}, timeline:{eras:[{name,period,milestones:[{game,year,innovation} at least 2],trend} at least 3]}}. All strings in Chinese.",

  strategyInsights: "You are a game strategy consultant. Deeply analyze STRATEGIC INSIGHTS from this game's analysis: market opportunity gaps, actionable differentiation suggestions, industry trend directions, risk warnings, and resource estimation for a new entrant. Be actionable and specific. Write 400-800 Chinese characters. Return ONLY a JSON object: {marketOpportunity, differentiation:[at least 4], trendDirection:[at least 3], riskWarnings:[at least 3], resourceEstimation}. All strings in Chinese."
};

export async function POST(request: NextRequest) {
  try {
    const b = await request.json() as { moduleId?: string; gameName?: string; outline?: string; customPrompt?: string; retryCount?: number };
    const { moduleId, gameName, outline, customPrompt, retryCount } = b;
    if (!moduleId || !gameName) return json({ error: "Missing moduleId or gameName" }, 400);

    const apiKey = process.env.DEEPSEEK_API_KEY || "";
    if (!apiKey) return json({ error: "No API Key" }, 500);

    let modulePrompt = MODULE_PROMPTS[moduleId];
    if (!modulePrompt) return json({ error: "Unknown module: " + moduleId }, 400);
    if (retryCount && retryCount > 0) {
      modulePrompt = "[RETRY #" + retryCount + " - PREVIOUS ATTEMPT FAILED DUE TO INVALID JSON FORMAT] " + modulePrompt + " CRITICAL: You MUST output ONLY a valid JSON object. No markdown code fences, no explanatory text, no trailing commas. The response must start with { and end with }. Your previous response could not be parsed as JSON. This is your last chance.";
    }

    const userMsg = outline
      ? "Game: " + gameName + ". Outline to expand: " + outline + (customPrompt ? ". Additional context: " + customPrompt : "")
      : "Game: " + gameName + (customPrompt ? ". Additional context: " + customPrompt : "");

    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 90000);

    try {
      const res = await fetch(BASE + "/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + apiKey },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            { role: "system", content: modulePrompt },
            { role: "user", content: userMsg },
          ],
          stream: false,
          max_tokens: 4096,
          temperature: 0.7,
        }),
        signal: ctrl.signal,
      });

      clearTimeout(timer);

      if (!res.ok) {
        const txt = await res.text();
        console.error("[expand:" + moduleId + "] DeepSeek error:", res.status, txt.slice(0, 200));
        return json({ error: "DeepSeek " + res.status + ": " + txt.slice(0, 200) }, 502);
      }

      const data = await res.json();
      const content = data.choices?.[0]?.message?.content || "{}";
      const result = extractJSON(content);
      if (!result) {
        console.error("[expand:" + moduleId + "] Parse failed. Raw:", content.slice(0, 400));
        return json({ error: "Failed to parse expansion for " + moduleId, raw: content.slice(0, 300) }, 500);
      }
      console.log("[expand:" + moduleId + "] OK. Keys:", Object.keys(result).join(", "));
      return json({ moduleId, data: result });
    } catch (e) {
      clearTimeout(timer);
      if (e instanceof Error && e.name === "AbortError") return json({ error: "Expand " + moduleId + " timed out" }, 504);
      throw e;
    }
  } catch (e) {
    console.error("[expand] Internal error:", e);
    return json({ error: "Internal error" }, 500);
  }
}

function extractJSON(content: string): object | null {
  try { const r = JSON.parse(content); if (r && typeof r === "object") return r; } catch {}
  let cleaned = content.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?\s*```\s*$/i, "").trim();
  try { const r = JSON.parse(cleaned); if (r && typeof r === "object") return r; } catch {}
  const m = cleaned.match(/\{[\s\S]*\}/);
  if (m) { try { const r = JSON.parse(m[0]); if (r && typeof r === "object") return r; } catch {} }
  const m2 = content.match(/\{[\s\S]*\}/);
  if (m2) { try { const r = JSON.parse(m2[0]); if (r && typeof r === "object") return r; } catch {} }
  return null;
}
