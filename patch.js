const fs=require("fs"); const p="E:/game-analysis-report/src/app/page.tsx"; let c=fs.readFileSync(p,"utf8"); c=c.replace("setPhase('generating'); setErr(''); setResult(null);
    try {
      const r = await fetch('/api/analyze', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({gameName, customPrompt}) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error||'Analysis failed');
      if (d.error) throw new Error(d.error);
      setResult(d as GameAnalysis);
      setPhase('done');
      try { addHistory(gameName, d as GameAnalysis, customPrompt); } catch{}", "setPhase('generating'); setErr(''); setResult(null);
    try {
      const r = await fetch('/api/analyze', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({gameName, customPrompt}) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error||'Analysis failed');
      if (d.error) throw new Error(d.error);
      const keys = Object.keys(d||{});
      const hasModules = ['productInfo','gameplay','dataAndUsers','monetization','playerFeedback','competitiveMatrix','strategyInsights'].some(k=>keys.includes(k));
      if (!hasModules) throw new Error('AI returned incomplete data');
      setResult(d as GameAnalysis);
      setPhase('done');
      try { addHistory(gameName, d as GameAnalysis, customPrompt); } catch{}"); fs.writeFileSync(p, c, "utf8"); console.log("Done");