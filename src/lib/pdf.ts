import { GameAnalysis } from "@/types";
import { safeArray, safeString, safeObj } from "@/lib/safe";

function safe(obj: any, path: string[], fallback: any = "-"): any {
  let cur = obj;
  for (const key of path) {
    if (cur == null || typeof cur !== "object") return fallback;
    cur = cur[key];
  }
  return cur ?? fallback;
}

export async function downloadPDF(gameName: string, data: GameAnalysis) {
  const { default: jsPDF } = await import("jspdf");
  const doc = new jsPDF();
  doc.setFont("helvetica");
  doc.setFontSize(20);
  doc.text(gameName + " Analysis Report", 20, 30);
  doc.setFontSize(10);
  doc.text("Generated: " + new Date().toLocaleString(), 20, 40);
  let y = 55;

  const addSection = (title: string, lines: string[]) => {
    if (y > 260) { doc.addPage(); y = 30; }
    doc.setFontSize(14);
    doc.text(title, 20, y);
    y += 10;
    doc.setFontSize(10);
    for (const line of lines) {
      if (y > 270) { doc.addPage(); y = 30; }
      doc.text(line, 20, y);
      y += 7;
    }
    y += 5;
  };

  const pi = data.productInfo || {} as any;
  addSection("Product Info", [
    "Dev: " + safeString(pi.developer),
    "Publisher: " + safeString(pi.publisher),
    "Release: " + safeString(pi.releaseDate),
    "Platforms: " + safeArray(pi.platforms).join(" / "),
  ]);

  const gp = data.gameplay || {} as any;
  addSection("Gameplay", [
    "Core Loop: " + safeString(gp.coreLoop),
    "Mechanics: " + safeArray(gp.mechanics).join("; "),
    "Progression: " + safeString(gp.progression),
  ]);

  const du = data.dataAndUsers || {} as any;
  addSection("Data & Users", [
    "Revenue: " + safeString(safe(du, ["marketPerformance", "revenueEstimate"])),
    "D1: " + safeString(safe(du, ["retention", "d1"])),
    "D7: " + safeString(safe(du, ["retention", "d7"])),
    "D30: " + safeString(safe(du, ["retention", "d30"])),
  ]);

  const mn = data.monetization || {} as any;
  addSection("Monetization", [
    "Models: " + safeArray(mn.paymentModel).join(" / "),
    "Pricing: " + safeString(mn.pricingStrategy),
    "Battle Pass: " + safeString(mn.battlePass),
    "Gacha: " + safeString(mn.gacha),
  ]);

  const pf = data.playerFeedback || {} as any;
  addSection("Player Feedback", [
    "Demands: " + safeArray(pf.playerDemands).join("; "),
    "Response: " + safeString(pf.officialResponse),
  ]);

  const cm = data.competitiveMatrix || {} as any;
  const radar = safeObj(cm.radar, { dimensions: [], games: [] }) as any;
  addSection("Competitors", safeArray(radar.games).map((g: any) =>
    safeString(g.name) + ": " + safeArray(radar.dimensions).map((d: any, i: number) => safeString(d) + "=" + (safeArray(g.values)[i] ?? "-")).join(", ")
  ));

  const si = data.strategyInsights || {} as any;
  addSection("Strategy", [
    "Opportunity: " + safeString(si.marketOpportunity),
    "Differentiation: " + safeArray(si.differentiation).join("; "),
    "Trends: " + safeArray(si.trendDirection).join("; "),
    "Risks: " + safeArray(si.riskWarnings).join("; "),
  ]);

  doc.save(gameName + "_analysis.pdf");
}
