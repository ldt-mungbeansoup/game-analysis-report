"use client";
import React from "react";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import InputPage from "@/components/InputPage";
import ConfirmCard from "@/components/ConfirmCard";
import ProgressBar from "@/components/ProgressBar";
import HistoryPanel from "@/components/HistoryPanel";
import ProductInfo from "@/components/modules/ProductInfo";
import GameplayAnalysis from "@/components/modules/GameplayAnalysis";
import DataAndUsers from "@/components/modules/DataAndUsers";
import Monetization from "@/components/modules/Monetization";
import PlayerFeedback from "@/components/modules/PlayerFeedback";
import CompetitiveMatrix from "@/components/modules/CompetitiveMatrix";
import StrategyInsights from "@/components/modules/StrategyInsights";
import { BasicInfo, ModuleId, GameAnalysis, HistoryItem, StreamEvent } from "@/types";
import { addHistory } from "@/lib/storage";
import { downloadPDF } from "@/lib/pdf";
import { downloadMarkdown } from "@/lib/markdown";
import { Download, FileText, Save } from "lucide-react";

type Phase = "input" | "confirming" | "generating" | "done";
type MC = React.FC<{ data: Record<string, unknown> }>;

const MODS = [
  { id: "productInfo" as ModuleId, c: ProductInfo as unknown as MC, ok: function(d: Record<string, unknown>) { return typeof d.developer === "string"; } },
  { id: "gameplay" as ModuleId, c: GameplayAnalysis as unknown as MC, ok: function(d: Record<string, unknown>) { return typeof d.coreLoop === "string"; } },
  { id: "dataAndUsers" as ModuleId, c: DataAndUsers as unknown as MC, ok: function(d: Record<string, unknown>) { return typeof d.marketPerformance === "object"; } },
  { id: "monetization" as ModuleId, c: Monetization as unknown as MC, ok: function(d: Record<string, unknown>) { return typeof d.paymentModel === "object"; } },
  { id: "playerFeedback" as ModuleId, c: PlayerFeedback as unknown as MC, ok: function(d: Record<string, unknown>) { return typeof d.ratingTrend === "object"; } },
  { id: "competitiveMatrix" as ModuleId, c: CompetitiveMatrix as unknown as MC, ok: function(d: Record<string, unknown>) { return typeof d.radar === "object"; } },
  { id: "strategyInsights" as ModuleId, c: StrategyInsights as unknown as MC, ok: function(d: Record<string, unknown>) { return typeof d.marketOpportunity === "string"; } },
];


export default function Home() {
  const [phase, setPhase] = useState<Phase>("input");
  const [gameName, setGameName] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [basicInfo, setBasicInfo] = useState<BasicInfo | null>(null);
  const [curMod, setCurMod] = useState<ModuleId | null>(null);
  const [doneMods, setDoneMods] = useState<ModuleId[]>([]);
  const [gd, setGd] = useState<GameAnalysis | null>(null);
  const [err, setErr] = useState("");
  const [hiOpen, setHiOpen] = useState(false);
  const [ld, setLd] = useState(false);
  const abt = useRef<AbortController | null>(null);

  const hSubmit = async (name: string, custom: string) => {
    setGameName(name); setCustomPrompt(custom); setErr(""); setPhase("confirming"); setLd(true);
    try {
      const r = await fetch("/api/analyze/basic", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ gameName: name }), signal: AbortSignal.timeout(30000) });
      if (!r.ok) { const e = await r.json(); throw new Error(e.error || "Failed"); }
      setBasicInfo(await r.json());
    } catch (e) { setErr(e instanceof Error ? e.message : "Failed"); }
    finally { setLd(false); }
  };

  const hConfirm = async () => {
    setPhase("generating"); setErr(""); setDoneMods([]); setCurMod(null); setGd(null);
    try {
      const r = await fetch("/api/analyze", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ gameName, customPrompt }) });
      if (!r.ok) { const e = await r.json().catch(function() { return {}; }); throw new Error(e.error || "API failed"); }
      const events = await r.json() as StreamEvent[];
      for (const evt of events) {
        if (evt.type === "moduleStart" && evt.moduleId) { setCurMod(evt.moduleId); await new Promise(function(r) { setTimeout(r, 100); }); }
        else if (evt.type === "moduleData" && evt.moduleId && evt.data) { setGd(function(p) { return { ...p, [evt.moduleId!]: evt.data } as GameAnalysis; }); }
        else if (evt.type === "moduleDone" && evt.moduleId) setDoneMods(function(p) { return [...p, evt.moduleId!]; });
        else if (evt.type === "done") { setCurMod(null); setGd(function(p) { if (p) addHistory(gameName, p, customPrompt); return p; }); setPhase("done"); }
        else if (evt.type === "error") setErr(String(evt.data || "Error"));
      }
      if (!events.length) setErr("No analysis data received");
    } catch (e) { setErr(e instanceof Error ? e.message : "Analysis failed"); }
  };
  const hRetry = function() { setPhase("input"); setBasicInfo(null); setErr(""); };
  const hBack = function() { abt.current?.abort(); setPhase("input"); setGd(null); setBasicInfo(null); setErr(""); };
  const hLoad = function(item: HistoryItem) { setGameName(item.gameName); setCustomPrompt(item.customPrompt || ""); setGd(item.data); setPhase("done"); };

  return React.createElement(React.Fragment, null,
    phase !== "input" && React.createElement(Navbar, { onOpenHistory: function() { setHiOpen(true); }, hasResults: phase === "done" && !!gd, onBack: hBack }),
    React.createElement(AnimatePresence, { mode: "wait" },
      phase === "input" && React.createElement(motion.div, { key: "input", initial: { opacity: 1 }, exit: { opacity: 0 } },
        React.createElement(InputPage, { onSubmit: hSubmit, onOpenHistory: function() { setHiOpen(true); } })
      ),
      phase === "confirming" && React.createElement(motion.div, { key: "confirm", initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "min-h-screen bg-[#f5f5f7] flex items-center justify-center pt-14" },
        ld ? React.createElement("div", { className: "text-center" },
          React.createElement("div", { className: "animate-spin rounded-full h-8 w-8 border-2 border-[#007AFF] border-t-transparent mx-auto mb-3" }),
          React.createElement("p", { className: "text-sm text-[#86868b]" }, "Searching...")
        ) : err ? React.createElement("div", { className: "text-center" },
          React.createElement("p", { className: "text-[#ff3b30] text-sm mb-3" }, err),
          React.createElement("button", { onClick: hRetry, className: "text-[#007AFF] text-sm" }, "Retry")
        ) : basicInfo ? React.createElement(ConfirmCard, { info: basicInfo, onConfirm: hConfirm, onRetry: hRetry, loading: false }) : null
      ),
      phase === "generating" && React.createElement(motion.div, { key: "gen", initial: { opacity: 0 }, animate: { opacity: 1 }, className: "min-h-screen bg-[#f5f5f7] pt-20 px-4" },
        React.createElement(ProgressBar, { currentModule: curMod, completedModules: doneMods }),
        React.createElement("div", { className: "max-w-3xl mx-auto space-y-8" },
          MODS.map(function(m) { const d = gd?.[m.id]; if (!d || !m.ok(d as unknown as Record<string, unknown>)) return null; return React.createElement(motion.div, { key: m.id, initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } }, React.createElement(m.c, { data: d as unknown as Record<string, unknown> })); }),
          err && React.createElement("p", { className: "text-[#ff3b30] text-sm text-center" }, err)
        )
      ),
      phase === "done" && gd && React.createElement(motion.div, { key: "done", initial: { opacity: 0 }, animate: { opacity: 1 }, className: "min-h-screen bg-[#f5f5f7] pt-20 pb-32 px-4" },
        React.createElement("div", { className: "max-w-3xl mx-auto mb-8 flex flex-wrap items-center justify-between gap-3" },
          React.createElement("h1", { className: "text-2xl font-bold text-[#1d1d1f]" }, gameName),
          React.createElement("div", { className: "flex gap-2" },
            React.createElement("button", { onClick: function() { downloadPDF(gameName, gd); }, className: "inline-flex items-center gap-1.5 rounded-full bg-[#f5f5f7] px-4 py-2 text-sm font-medium text-[#1d1d1f] hover:bg-[#e8e8ed]" }, React.createElement(Download, { className: "h-4 w-4" }), " PDF"),
            React.createElement("button", { onClick: function() { downloadMarkdown(gameName, gd); }, className: "inline-flex items-center gap-1.5 rounded-full bg-[#f5f5f7] px-4 py-2 text-sm font-medium text-[#1d1d1f] hover:bg-[#e8e8ed]" }, React.createElement(FileText, { className: "h-4 w-4" }), " MD"),
            React.createElement("button", { onClick: function() { addHistory(gameName, gd, customPrompt); }, className: "inline-flex items-center gap-1.5 rounded-full bg-[#007AFF] px-4 py-2 text-sm font-medium text-white hover:bg-[#0066d6]" }, React.createElement(Save, { className: "h-4 w-4" }), " Save")
          )
        ),
        React.createElement("div", { className: "max-w-3xl mx-auto space-y-8" },
          MODS.map(function(m) { const d = gd[m.id]; if (!d || !m.ok(d as unknown as Record<string, unknown>)) return null; return React.createElement(motion.div, { key: m.id, initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.4 } }, React.createElement(m.c, { data: d as unknown as Record<string, unknown> })); })
        )
      )
    ),
    React.createElement(HistoryPanel, { open: hiOpen, onClose: function() { setHiOpen(false); }, onLoad: hLoad })
  );
}