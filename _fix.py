import os

route_ts = '''import { NextRequest } from "next/server";

const DEEPSEEK_BASE = "https://api.deepseek.com/v1";

export async function POST(request: NextRequest) {
  const body = await request.json() as { gameName?: string; customPrompt?: string };
  const { gameName, customPrompt } = body;
  if (!gameName) return new Response(JSON.stringify({ error: "Please enter a game name" }), { status: 400 });
  const apiKey = process.env.DEEPSEEK_API_KEY || "";
  if (!apiKey) return new Response(JSON.stringify({ error: "API Key not configured" }), { status: 500 });
  const userPrompt = customPrompt ? `Analyze: ${gameName}. Extra: ${customPrompt}` : `Analyze: ${gameName}`;
  const res = await fetch(`${DEEPSEEK_BASE}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: "You are a game analyst. Output structured JSON events: basicInfo, then 7 modules (productInfo/gameplay/dataAndUsers/monetization/playerFeedback/competitiveMatrix/strategyInsights) using moduleStart/moduleData/moduleDone format, then done. All in Chinese. Radar with 3+ games. Timeline with 3+ eras." },
        { role: "user", content: userPrompt },
      ], stream: true, max_tokens: 8192, temperature: 0.7,
    }),
  });
  if (!res.ok) {
    const e = await res.json().catch(() => ({}));
    const msg = typeof (e as Record<string,unknown>).error === "string" ? (e as Record<string,unknown>).error as string : "AI failed";
    return new Response(JSON.stringify({ error: msg }), { status: 502 });
  }
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const reader = res.body?.getReader();
      if (!reader) { controller.close(); return; }
      const decoder = new TextDecoder();
      let buf = "";
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += decoder.decode(value, { stream: true });
          const lines = buf.split("\n");
          buf = lines.pop() || "";
          for (const line of lines) {
            const t = line.trim();
            if (!t.startsWith("data:")) continue;
            const j = t.slice(5).trim();
            if (j === "[DONE]") continue;
            try {
              const c = JSON.parse(j) as { choices?: { delta?: { content?: string } }[] };
              const ct = c.choices?.[0]?.delta?.content;
              if (ct) controller.enqueue(encoder.encode(ct));
            } catch { /* skip */ }
          }
        }
      } catch (e) { console.error(e); }
      controller.close();
    },
  });
  return new Response(stream, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-cache" } });
}
'''

with open(r'E:\game-analysis-report\src\app\api\analyze\route.ts', 'w', encoding='utf-8') as f:
    f.write(route_ts)
print('route.ts ok')