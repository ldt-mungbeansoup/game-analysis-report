const fs = require("fs");
const path = "E:/game-analysis-report/src/app/page.tsx";
let c = fs.readFileSync(path, "utf8");

const old = `              <Loader2 className="h-10 w-10 animate-spin text-[#007AFF] mb-4" />
              <p className="text-[#86868b] text-base">AI is analyzing {gameName}...</p>
              <p className="text-[#aeaeb2] text-sm mt-1">Generating 7-module analysis report, please wait</p>
              {err && <p className="text-[#ff3b30] text-sm mt-6">{err}</p>}`;

const neu = `              {!err ? (<>
                <Loader2 className="h-10 w-10 animate-spin text-[#007AFF] mb-4" />
                <p className="text-[#86868b] text-base">AI is analyzing {gameName}...</p>
                <p className="text-[#aeaeb2] text-sm mt-1">Generating 7-module analysis report, please wait</p>
              </>) : (<>
                <p className="text-[#ff3b30] text-sm mb-4">{err}</p>
                <div className="flex gap-3">
                  <button onClick={hConfirm} className="rounded-full bg-[#007AFF] px-5 py-2 text-sm font-medium text-white">Retry</button>
                  <button onClick={hRetry} className="rounded-full bg-[#f5f5f7] px-5 py-2 text-sm font-medium text-[#1d1d1f]">Back</button>
                </div>
              </>)}`;

c = c.replace(old, neu);
fs.writeFileSync(path, c, "utf8");
console.log("Fix 2 done");