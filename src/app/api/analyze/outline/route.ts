import { NextRequest } from "next/server";

const BASE = "https://api.deepseek.com/v1";

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

    const sysPrompt = customPrompt
      ? "Generate an outline for game analysis of: " + gameName + ". User request: " + customPrompt
      : "Generate an outline for game analysis of: " + gameName;

    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 60000);

    try {
      const res = await fetch(BASE + "/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + apiKey },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            {
              role: "system",
              content: "You are a senior game analyst. Generate a structured outline for a competitive analysis report in Chinese. Return a JSON object with 7 keys: productInfo, gameplay, dataAndUsers, monetization, playerFeedback, competitiveMatrix, strategyInsights. Each key contains a BRIEF summary in Chinese (1-2 sentences each), enough to guide a deeper analysis. All strings must be in Chinese. The outline should map to the game: " + gameName + ". Reply with ONLY the JSON object, no markdown, no explanation."
            },
            { role: "user", content: sysPrompt },
          ],
          stream: false,
          max_tokens: 2048,
          temperature: 0.5,
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
      const result = extractJSON(content);
      if (!result) {
        console.error("[outline] Parse failed. Raw:", content.slice(0, 500));
        return json({ error: "Failed to parse outline", raw: content.slice(0, 300) }, 500);
      }
      console.log("[outline] OK. Keys:", Object.keys(result).join(", "));
      return json(result);
    } catch (e) {
      clearTimeout(timer);
      if (e instanceof Error && e.name === "AbortError") return json({ error: "Outline timed out" }, 504);
      throw e;
    }
  } catch (e) {
    console.error("[outline] Internal error:", e);
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
