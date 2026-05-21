const fs = require("fs");
const path = "E:/game-analysis-report/src/app/page.tsx";
let c = fs.readFileSync(path, "utf8");

// Fix 1: data validation
const old1 = `    setPhase("generating"); setErr(""); setResult(null);
    try {
      const r = await fetch("/api/analyze", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({gameName, customPrompt}) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error||"Analysis failed");
      if (d.error) throw new Error(d.error);
      setResult(d as GameAnalysis);
      setPhase("done");
      try { addHistory(gameName, d as GameAnalysis, customPrompt); } catch{}`;

const new1 = `    setPhase("generating"); setErr(""); setResult(null);
    try {
      const r = await fetch("/api/analyze", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({gameName, customPrompt}) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error||"Analysis failed");
      if (d.error) throw new Error(d.error);
      const keys = Object.keys(d||{});
      const hasData = ["productInfo","gameplay","dataAndUsers","monetization","playerFeedback","competitiveMatrix","strategyInsights"].some(k=>keys.includes(k));
      if (!hasData) throw new Error("AI returned incomplete data. Please retry.");
      setResult(d as GameAnalysis);
      setPhase("done");
      try { addHistory(gameName, d as GameAnalysis, customPrompt); } catch{}`;

c = c.replace(old1, new1);

fs.writeFileSync(path, c, "utf8");
console.log("Done");