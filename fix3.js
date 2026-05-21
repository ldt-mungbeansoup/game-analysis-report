const fs = require("fs");
const path = "E:/game-analysis-report/src/app/page.tsx";
let c = fs.readFileSync(path, "utf8");

const old = `            <div className="max-w-3xl mx-auto space-y-10">
              {result.productInfo && <Section><ProductInfo data={result.productInfo as any} /></Section>}`;

const neu = `            <div className="max-w-3xl mx-auto space-y-10">
              {!result.productInfo && !result.gameplay && !result.dataAndUsers && !result.monetization && !result.playerFeedback && !result.competitiveMatrix && !result.strategyInsights && (
                <div className="text-center py-8">
                  <p className="text-sm text-[#ff3b30] mb-3">Report data is empty or incomplete. AI may have returned an unexpected response.</p>
                  <button onClick={hConfirm} className="rounded-full bg-[#007AFF] px-5 py-2 text-sm font-medium text-white">Retry Analysis</button>
                </div>
              )}
              {result.productInfo && <Section><ProductInfo data={result.productInfo as any} /></Section>}`;

c = c.replace(old, neu);
fs.writeFileSync(path, c, "utf8");
console.log("Fix 3 done");