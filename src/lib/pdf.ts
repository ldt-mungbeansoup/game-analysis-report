import { GameAnalysis } from "@/types";

export async function downloadPDF(gameName: string, data: GameAnalysis) {
  const { default: jsPDF } = await import("jspdf");
  const doc = new jsPDF();
  doc.setFont("helvetica");
  doc.setFontSize(20);
  doc.text(`${gameName} Analysis Report`, 20, 30);
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 40);
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
  addSection("Product Info", [
    `Dev: ${data.productInfo.developer}` ,
    `Publisher: ${data.productInfo.publisher}` ,
    `Release: ${data.productInfo.releaseDate}` ,
    `Platforms: ${data.productInfo.platforms.join(" / ")}` ,
  ]);
  addSection("Gameplay", [
    `Core Loop: ${data.gameplay.coreLoop}` ,
    `Mechanics: ${data.gameplay.mechanics.join("; ")}` ,
    `Progression: ${data.gameplay.progression}` ,
  ]);
  addSection("Data & Users", [
    `Revenue: ${data.dataAndUsers.marketPerformance.revenueEstimate}` ,
    `D1: ${data.dataAndUsers.retention.d1}` ,
    `D7: ${data.dataAndUsers.retention.d7}` ,
    `D30: ${data.dataAndUsers.retention.d30}` ,
  ]);
  addSection("Monetization", [
    `Models: ${data.monetization.paymentModel.join(" / ")}` ,
    `Pricing: ${data.monetization.pricingStrategy}` ,
    `Battle Pass: ${data.monetization.battlePass}` ,
    `Gacha: ${data.monetization.gacha}` ,
  ]);
  addSection("Player Feedback", [
    `Demands: ${data.playerFeedback.playerDemands.join("; ")}` ,
    `Response: ${data.playerFeedback.officialResponse}` ,
  ]);
  addSection("Competitors", data.competitiveMatrix.radar.games.map(g =>
    `${g.name}: ${data.competitiveMatrix.radar.dimensions.map((d,i) => `${d}=${g.values[i]}`).join(", ")}`
  ));
  addSection("Strategy", [
    `Opportunity: ${data.strategyInsights.marketOpportunity}` ,
    `Differentiation: ${data.strategyInsights.differentiation.join("; ")}` ,
    `Trends: ${data.strategyInsights.trendDirection.join("; ")}` ,
    `Risks: ${data.strategyInsights.riskWarnings.join("; ")}` ,
  ]);
  doc.save(`${gameName}_analysis.pdf`);
}