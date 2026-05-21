const fs = require("fs");
const path = "E:/game-analysis-report/src/app/api/analyze/route.ts";
let c = fs.readFileSync(path, "utf8");

// Fix the system prompt - change single quotes to backticks
c = c.replace(
  "content: 'You are a game analyst.",
  "content: `You are a game analyst."
);

// Fix closing quote
c = c.replace(
  "no explanation.'",
  "no explanation.`"
);

// Also fix extractJSON function type
c = c.replace(
  "function extractJSON(content) {",
  "function extractJSON(content: string): object | null {"
);

fs.writeFileSync(path, c, "utf8");
console.log("route.ts system prompt fixed");