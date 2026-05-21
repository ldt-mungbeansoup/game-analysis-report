
import { NextRequest } from "next/server";

const BASE = "https://api.deepseek.com/v1";

function r(st: number, msg: string) {
  return new Response(JSON.stringify({ error: msg }), { status: st });
}

export async function POST(request: NextRequest) {
  const b = await request.json() as { gameName?: string; customPrompt?: string };
  const { gameName, customPrompt } = b;
  if (!gameName) return r(400, "No game name");
  const apiKey = process.env.DEEPSEEK_API_KEY || "";
  if (!apiKey) return r(500, "No API Key");

  const prompt = customPrompt
    ? "Analyze game: " + gameName + ". Extra requirements: " + customPrompt
    : "Analyze game: " + gameName;

  const ctrl = new AbortController();
  const timer = setTimeout(function() { ctrl.abort(); }, 60000);

  try {
    const res = await fetch(BASE + "/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + apiKey },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: 'You are a game analyst. Output a JSON array of events. Each event format: {"type":"moduleStart|moduleData|moduleDone","moduleId":"productInfo|gameplay|dataAndUsers|monetization|playerFeedback|competitiveMatrix|strategyInsights"}. 7 modules with full data. Final event: {"type":"done"}. All Chinese. Reply only JSON array.' },
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
      return r(502, "DeepSeek " + res.status + ": " + txt.slice(0, 200));
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content || "[]";

    // Try to extract JSON array from the response
    let events;
    // Find JSON array
    const arrMatch = content.match(/[s*{[sS]*}s*]/);
    if (arrMatch) {
      try {
        events = JSON.parse(arrMatch[0]);
      } catch {}
    }
    // Try parsing the whole thing
    if (!events) {
      try { events = JSON.parse(content); } catch {}
    }
    // Fallback: extract individual JSON objects
    if (!events || !Array.isArray(events)) {
      const objMatches = content.match(/{[^}]+}/g);
      if (objMatches) {
        events = objMatches.map(function(s: string) { try { return JSON.parse(s); } catch { return null; } }).filter(Boolean);
      }
    }

    if (!events || events.length === 0) {
      return r(500, "Failed to parse AI response. Raw: " + content.slice(0, 500));
    }

    return new Response(JSON.stringify(events), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    clearTimeout(timer);
    if (e instanceof DOMException && e.name === "AbortError") {
      return r(504, "Analysis timed out");
    }
    return r(500, "Internal error");
  }
}
