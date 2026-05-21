import { NextRequest } from "next/server";

const BASE = "https://api.deepseek.com/v1";

function r(st: number, msg: string) {
  return new Response(JSON.stringify({ error: msg }), { status: st });
}

export async function POST(request: NextRequest) {
  const b = await request.json() as { gameName?: string };
  const gameName = b?.gameName;
  if (!gameName) return r(400, "No game name");
  const apiKey = process.env.DEEPSEEK_API_KEY || "";
  if (!apiKey) return r(500, "No API Key");

  const ctrl = new AbortController();
  const timer = setTimeout(function() { ctrl.abort(); }, 20000);

  try {
    const res = await fetch(BASE + "/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + apiKey },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: "Search the web and return basic game info as JSON. Keys: name, developer, publisher, releaseDate, platforms (array), ipBackground, lifecycle (one of: rising/stable/declining), teamBackground. Reply with only the JSON object, no extra text." },
          { role: "user", content: "Search for game: " + gameName },
        ],
        max_tokens: 2048,
        temperature: 0.3,
      }),
      signal: ctrl.signal,
    });

    if (!res.ok) { const e = await res.json().catch(() => ({})); const msg = typeof (e as Record<string,unknown>).error === "string" ? (e as Record<string,unknown>).error as string : "AI API error (" + res.status + ")"; return r(502, "DeepSeek: " + msg); }
    const data = await res.json();
    const content = data.choices?.[0]?.message?.content || "{}";
    const m = content.match(/\{[\s\S]*\}/);
    const json = m ? JSON.parse(m[0]) : { name: gameName, developer: "unknown", publisher: "unknown", releaseDate: "unknown", platforms: [], ipBackground: "unknown", lifecycle: "stable", teamBackground: "No info found" };
    return new Response(JSON.stringify(json), { headers: { "Content-Type": "application/json" } });
  } catch (e) {
    if (e instanceof DOMException && e.name === "AbortError") {
      return r(504, "Request timed out, please try again");
    }
    return r(500, "Internal error");
  } finally {
    clearTimeout(timer);
  }
}
