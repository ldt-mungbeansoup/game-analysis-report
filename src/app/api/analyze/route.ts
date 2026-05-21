import { NextRequest } from "next/server";

const BASE = "https://api.deepseek.com/v1";

export async function POST(request: NextRequest) {
  const body = await request.json() as { gameName?: string; customPrompt?: string };
  const { gameName, customPrompt } = body;
  if (!gameName) {
    return new Response(JSON.stringify({ error: "No game name" }), { status: 400 });
  }
  const apiKey = process.env.DEEPSEEK_API_KEY || "";
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "No API Key" }), { status: 500 });
  }
  const prompt = customPrompt
    ? "Analyze: " + gameName + ". Extra: " + customPrompt
    : "Analyze: " + gameName;

  const res = await fetch(BASE + "/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "Bearer " + apiKey },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: "You are a game analyst. Output JSON events: basicInfo, then 7 modules (productInfo/gameplay/dataAndUsers/monetization/playerFeedback/competitiveMatrix/strategyInsights) using moduleStart/moduleData/moduleDone, then done. All Chinese. Radar 3+ games. Timeline 3+ eras." },
        { role: "user", content: prompt },
      ],
      stream: true,
      max_tokens: 8192,
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    return new Response(JSON.stringify({ error: "AI request failed" }), { status: 502 });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const reader = res.body?.getReader();
      if (!reader) {
        controller.close();
        return;
      }
      const decoder = new TextDecoder();
      let buf = "";
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += decoder.decode(value, { stream: true });
          while (buf.indexOf("\n") !== -1) {
            const idx = buf.indexOf("\n");
            const line = buf.slice(0, idx);
            buf = buf.slice(idx + 1);
            const t = line.trim();
            if (t.indexOf("data:") !== 0) continue;
            const j = t.slice(5).trim();
            if (j === "[DONE]") continue;
            try {
              const c = JSON.parse(j) as { choices?: { delta?: { content?: string } }[] };
              const ct = c.choices?.[0]?.delta?.content;
              if (ct) controller.enqueue(encoder.encode(ct));
            } catch (_e) { /* skip */ }
          }
        }
      } catch (e) {
        console.error(e);
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}
