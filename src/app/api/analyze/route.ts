
import { NextRequest } from "next/server";

const BASE = "https://api.deepseek.com/v1";

function extractJSON(content: string): object | null {
  try { const r = JSON.parse(content); if (r && typeof r === 'object') return r; } catch {}
  let cleaned = content.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?\s*```\s*$/i, '').trim();
  try { const r = JSON.parse(cleaned); if (r && typeof r === 'object') return r; } catch {}
  const m = cleaned.match(/\{[\s\S]*\}/);
  if (m) { try { const r = JSON.parse(m[0]); if (r && typeof r === 'object') return r; } catch {} }
  const m2 = content.match(/\{[\s\S]*\}/);
  if (m2) { try { const r = JSON.parse(m2[0]); if (r && typeof r === 'object') return r; } catch {} }
  return null;
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });
}

export async function POST(request: NextRequest) {
  try {
    const b = await request.json() as { gameName?: string; customPrompt?: string };
    const { gameName, customPrompt } = b;
    if (!gameName) return json({ error: "No game name" }, 400);
    const apiKey = process.env.DEEPSEEK_API_KEY || "";
    if (!apiKey) return json({ error: "No API Key" }, 500);

    const prompt = customPrompt
      ? "Analyze: " + gameName + ". Extra: " + customPrompt
      : "Analyze: " + gameName;

    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 90000);

    try {
      const res = await fetch(BASE + "/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + apiKey },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            {
              role: "system",
              content: `You are a game analyst. Analyze the game and return a JSON object with these 7 top-level keys: productInfo, gameplay, dataAndUsers, monetization, playerFeedback, competitiveMatrix, strategyInsights. Each key contains a complete analysis object.

productInfo: {developer, publisher, teamBackground, releaseDate, lifecycle, platforms:[], ipBackground}
gameplay: {coreLoop, mechanics:[], progression, contentStructure, socialSystem, onboarding, ugcEcosystem}
dataAndUsers: {marketPerformance:{downloadsTrend:[{month,value}], revenueEstimate, rankHistory:[{date,rank}]}, userProfile:{ageDistribution:[{group,percentage}], genderRatio:{male,female}, regionDistribution:[{region,percentage}], devicePreference}, userSegmentation:{coreVsCasual:{core,casual}, paymentTiers:{whale,dolphin,minnow,f2p}, socialStyle:{social,solo}}, retention:{d1,d7,d30,churnNodes:[],returnMechanism}, acquisition:{platforms:[],creativeStyle,kolStrategy,ipCollaborations:[]}}
monetization: {paymentModel:[], pricingStrategy, battlePass, gacha, eventCadence, subscription, ads}
playerFeedback: {ratingTrend:[{date,rating}], positiveKeywords:[{word,weight}], negativeKeywords:[{word,weight}], hotTopics:[], mediaReviews:[{source,score,summary}], playerDemands:[], officialResponse}
competitiveMatrix: {radar:{dimensions:["Play Depth","Art Quality","Monetization","Social","Retention","Innovation"], games:[{name,values:[]}]}, timeline:{eras:[{name,period,milestones:[{game,year,innovation}],trend}]}}
strategyInsights: {marketOpportunity, differentiation:[], trendDirection:[], riskWarnings:[], resourceEstimation}

All arrays must have 3+ items. All strings in Chinese. All data realistic. Reply with ONLY the JSON object, no markdown, no explanation.`
            },
            { role: "user", content: prompt },
          ],
          stream: false,
          max_tokens: 8192,
          temperature: 0.7,
        }),
        signal: ctrl.signal,
      });

      clearTimeout(timer);

      if (!res.ok) {
        const txt = await res.text();
        return json({ error: "DeepSeek " + res.status + ": " + txt.slice(0, 300) }, 502);
      }

      const data = await res.json();
      const content = data.choices?.[0]?.message?.content || "{}";

      // Extract JSON
      const result = extractJSON(content);
      if (!result) {
        console.error('[analyze] Parse failed. Raw:', content.slice(0, 800));
        return json({ error: 'Failed to parse AI response', raw: content.slice(0, 500) }, 500);
      }
      console.log('[analyze] OK. Keys:', Object.keys(result).join(', '));
      return json(result);
    } catch (e) {
      clearTimeout(timer);
      if (e instanceof Error && e.name === "AbortError") return json({ error: "Analysis timed out (90s)" }, 504);
      throw e;
    }
  } catch (e) {
    console.error('[analyze] Internal error:', e);
    return json({ error: 'Internal error' }, 500);
  }
}
