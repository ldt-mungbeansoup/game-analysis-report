import { NextRequest } from "next/server";

const DEEPSEEK_BASE = "https://api.deepseek.com/v1";

export async function POST(request: NextRequest) {
  const { gameName } = await request.json();
  if (!gameName) return new Response(JSON.stringify({ error: "请输入游戏名称" }), { status: 400 });
  const apiKey = process.env.DEEPSEEK_API_KEY || "";
  if (!apiKey) return new Response(JSON.stringify({ error: "未配置 API Key" }), { status: 500 });

  const systemPrompt = `你是一个游戏信息查询助手。用户会给你一个游戏名称，请联网搜索并返回游戏的基础信息，用JSON格式返回：` +
    JSON.stringify({ name: "游戏名", developer: "开发商", publisher: "发行商", releaseDate: "上线时间", platforms: ["平台1", "平台2"], ipBackground: "IP背景", lifecycle: "上升期/稳定期/衰退期", teamBackground: "开发团队背景简介（50字以上）" }) +
    `。只返回这个JSON，不要其他文字。`;

  const res = await fetch(`${DEEPSEEK_BASE}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `查询游戏：${gameName}` },
      ],
      max_tokens: 1024,
      temperature: 0.3,
    }),
  });

  if (!res.ok) return new Response(JSON.stringify({ error: "查询失败" }), { status: 502 });
  const data = await res.json();
  const content = data.choices?.[0]?.message?.content || "{}";
  
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  const json = jsonMatch ? JSON.parse(jsonMatch[0]) : { name: gameName, developer: "未知", publisher: "未知", releaseDate: "未知", platforms: [], ipBackground: "未知", lifecycle: "稳定期", teamBackground: "无" };

  return new Response(JSON.stringify(json), { headers: { "Content-Type": "application/json" } });
}
