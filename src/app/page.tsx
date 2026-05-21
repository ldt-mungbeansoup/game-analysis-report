"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import InputPage from "@/components/InputPage";
import ConfirmCard from "@/components/ConfirmCard";
import HistoryPanel from "@/components/HistoryPanel";
import ProductInfo from "@/components/modules/ProductInfo";
import GameplayAnalysis from "@/components/modules/GameplayAnalysis";
import DataAndUsers from "@/components/modules/DataAndUsers";
import Monetization from "@/components/modules/Monetization";
import PlayerFeedback from "@/components/modules/PlayerFeedback";
import CompetitiveMatrix from "@/components/modules/CompetitiveMatrix";
import StrategyInsights from "@/components/modules/StrategyInsights";
import { BasicInfo, GameAnalysis, HistoryItem, ModuleId } from "@/types";
import { addHistory } from "@/lib/storage";
import { downloadPDF } from "@/lib/pdf";
import { downloadMarkdown } from "@/lib/markdown";
import { Download, FileText, Save, Loader2 } from "lucide-react";

type Phase = "input" | "confirming" | "outlining" | "expanding" | "done";

export default function Home() {
  const [phase, setPhase] = useState<Phase>("input");
  const [gameName, setGameName] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [basicInfo, setBasicInfo] = useState<BasicInfo|null>(null);
  const [result, setResult] = useState<GameAnalysis|null>(null);
  const [err, setErr] = useState("");
  const [hiOpen, setHiOpen] = useState(false);
  const [ld, setLd] = useState(false);
  const [expandProgress, setExpandProgress] = useState({ done: 0, total: 7 });
  const [expandFailures, setExpandFailures] = useState<string[]>([]);

  const hSubmit = async (name: string, custom: string) => {
    setGameName(name); setCustomPrompt(custom); setErr(""); setPhase("confirming"); setLd(true);
    try {
      const r = await fetch("/api/analyze/basic", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({gameName:name}) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error||"Search failed");
      setBasicInfo(d);
    } catch(e: any) { setErr(e.message||"Failed"); }
    finally { setLd(false); }
  };

  const hConfirm = async () => {
    setErr(""); setResult(null);

    // ---- Stage 1: Outline ----
    setPhase("outlining");
    let outline: Record<string, string> = {};
    try {
      const r1 = await fetch("/api/analyze/outline", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({gameName, customPrompt}) });
      const d1 = await r1.json();
      if (!r1.ok) throw new Error(d1.error||"Outline failed");
      if (d1.error) throw new Error(d1.error);
      outline = d1;
    } catch(e: any) { console.error(e); setErr("Outline: " + (e.message||"failed")); return; }

    // ---- Stage 2: Expand 7 modules in parallel ----
    setPhase("expanding");
    setExpandProgress({ done: 0, total: 7 });
    setExpandFailures([]);

    const moduleIds: ModuleId[] = ["productInfo","gameplay","dataAndUsers","monetization","playerFeedback","competitiveMatrix","strategyInsights"];
    const expanded: Partial<GameAnalysis> = {};
    let hasAnyFailure = false;
    const failures: string[] = [];

    const expandOne = async (id: ModuleId) => {
      try {
        const outlineText = typeof outline[id] === "string" ? outline[id] : JSON.stringify(outline[id]||{});
        const r = await fetch("/api/analyze/expand", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ moduleId: id, gameName, outline: outlineText, customPrompt }) });
        const d = await r.json();
        if (!r.ok || d.error) throw new Error(d.error||"Expand failed");
        if (d.data) (expanded as any)[id] = d.data;
      } catch(e: any) {
        hasAnyFailure = true;
        failures.push(id + ": " + (e.message||"unknown"));
      } finally {
        setExpandProgress(p => ({ ...p, done: p.done + 1 }));
      }
    };

    await Promise.all(moduleIds.map(expandOne));

    if (hasAnyFailure) {
      setExpandFailures(failures);
      setErr("Some modules failed: " + failures.join(", "));
      return;
    }

    const finalResult = expanded as GameAnalysis;
    setResult(finalResult);
    setPhase("done");
    try { addHistory(gameName, finalResult, customPrompt); } catch{}
  };

  const hRetry = () => { setPhase("input"); setBasicInfo(null); setErr(""); };
  const hBack = () => { setPhase("input"); setResult(null); setBasicInfo(null); setErr(""); };
  const hLoad = (item: HistoryItem) => { setGameName(item.gameName); setCustomPrompt(item.customPrompt||""); setResult(item.data); setPhase("done"); };

  return (
    <>
      {phase !== "input" && <Navbar onOpenHistory={()=>setHiOpen(true)} hasResults={phase==="done"&&!!result} onBack={hBack} />}
      <AnimatePresence mode="wait">

        {phase === "input" && (
          <motion.div key="input" initial={{opacity:1}} exit={{opacity:0}}><InputPage onSubmit={hSubmit} onOpenHistory={()=>setHiOpen(true)} /></motion.div>)}

        {phase === "confirming" && (
          <motion.div key="confirm" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="min-h-screen bg-[#f5f5f7] flex items-center justify-center pt-14">
            {ld ? (<div className="text-center"><div className="animate-spin rounded-full h-8 w-8 border-2 border-[#007AFF] border-t-transparent mx-auto mb-3" /><p className="text-sm text-[#86868b]">Searching...</p></div>)
            : err ? (<div className="text-center"><p className="text-[#ff3b30] text-sm mb-3">{err}</p><button onClick={hRetry} className="text-[#007AFF] text-sm">Retry</button></div>)
            : basicInfo ? (<ConfirmCard info={basicInfo} onConfirm={hConfirm} onRetry={hRetry} loading={false} />) : null}
          </motion.div>)}

        {phase === "outlining" && (
          <motion.div key="outline" initial={{opacity:0}} animate={{opacity:1}} className="min-h-screen bg-[#f5f5f7] pt-20 px-4">
            <div className="max-w-3xl mx-auto flex flex-col items-center justify-center py-32">
              <Loader2 className="h-10 w-10 animate-spin text-[#007AFF] mb-4" />
              <p className="text-[#86868b] text-base">Generating report outline...</p>
              <p className="text-[#aeaeb2] text-sm mt-1">Structuring 7-module analysis framework</p>
              {err && (<><p className="text-[#ff3b30] text-sm mt-4 mb-3">{err}</p><button onClick={hConfirm} className="rounded-full bg-[#007AFF] px-5 py-2 text-sm font-medium text-white">Retry</button></>)}
            </div>
          </motion.div>)}

        {phase === "expanding" && (
          <motion.div key="expand" initial={{opacity:0}} animate={{opacity:1}} className="min-h-screen bg-[#f5f5f7] pt-20 px-4">
            <div className="max-w-3xl mx-auto flex flex-col items-center justify-center py-32">
              {!err ? (<>
                <Loader2 className="h-10 w-10 animate-spin text-[#007AFF] mb-4" />
                <p className="text-[#86868b] text-base">Deep analyzing {gameName}...</p>
                <p className="text-[#aeaeb2] text-sm mt-1">Module {expandProgress.done}/{expandProgress.total} completed</p>
                <div className="w-48 h-1.5 bg-[#e5e5ea] rounded-full mt-4 overflow-hidden">
                  <div className="h-full bg-[#007AFF] rounded-full transition-all duration-300" style={{width: Math.round(expandProgress.done/expandProgress.total*100) + "%"}} />
                </div>
              </>) : (<>
                <p className="text-[#ff3b30] text-sm mb-4">{err}</p>
                <div className="flex gap-3">
                  <button onClick={hConfirm} className="rounded-full bg-[#007AFF] px-5 py-2 text-sm font-medium text-white">Retry All</button>
                  <button onClick={hRetry} className="rounded-full bg-[#f5f5f7] px-5 py-2 text-sm font-medium text-[#1d1d1f]">Back</button>
                </div>
              </>)}
            </div>
          </motion.div>)}


        {phase === "done" && result && (
          <motion.div key="done" initial={{opacity:0}} animate={{opacity:1}} className="min-h-screen bg-[#f5f5f7] pt-20 pb-32 px-4">
            <div className="max-w-3xl mx-auto mb-8 flex flex-wrap items-center justify-between gap-3">
              <h1 className="text-2xl font-bold text-[#1d1d1f]">{gameName}</h1>
              <div className="flex gap-2">
                <button onClick={()=>{try{downloadPDF(gameName,result as any)}catch(e){console.error(e)}}} className="inline-flex items-center gap-1.5 rounded-full bg-[#f5f5f7] px-4 py-2 text-sm font-medium text-[#1d1d1f] hover:bg-[#e8e8ed]"><Download className="h-4 w-4"/> PDF</button>
                <button onClick={()=>{try{downloadMarkdown(gameName,result as any)}catch(e){console.error(e)}}} className="inline-flex items-center gap-1.5 rounded-full bg-[#f5f5f7] px-4 py-2 text-sm font-medium text-[#1d1d1f] hover:bg-[#e8e8ed]"><FileText className="h-4 w-4"/> MD</button>
                <button onClick={()=>{try{addHistory(gameName,result as any,customPrompt)}catch(e){console.error(e)}}} className="inline-flex items-center gap-1.5 rounded-full bg-[#007AFF] px-4 py-2 text-sm font-medium text-white hover:bg-[#0066d6]"><Save className="h-4 w-4"/> Save</button>
              </div>
            </div>
            <div className="max-w-3xl mx-auto space-y-10">
              {!result.productInfo && !result.gameplay && !result.dataAndUsers && !result.monetization && !result.playerFeedback && !result.competitiveMatrix && !result.strategyInsights && (
                <div className="text-center py-8">
                  <p className="text-sm text-[#ff3b30] mb-3">Report data is empty or incomplete. AI may have returned an unexpected response.</p>
                  <button onClick={hConfirm} className="rounded-full bg-[#007AFF] px-5 py-2 text-sm font-medium text-white">Retry Analysis</button>
                </div>
              )}
              {result.productInfo && <Section><ProductInfo data={result.productInfo as any} /></Section>}
              {result.gameplay && <Section><GameplayAnalysis data={result.gameplay as any} /></Section>}
              {result.dataAndUsers && <Section><DataAndUsers data={result.dataAndUsers as any} /></Section>}
              {result.monetization && <Section><Monetization data={result.monetization as any} /></Section>}
              {result.playerFeedback && <Section><PlayerFeedback data={result.playerFeedback as any} /></Section>}
              {result.competitiveMatrix && <Section><CompetitiveMatrix data={result.competitiveMatrix as any} /></Section>}
              {result.strategyInsights && <Section><StrategyInsights data={result.strategyInsights as any} /></Section>}
            </div>
          </motion.div>)}

      </AnimatePresence>
      <HistoryPanel open={hiOpen} onClose={()=>setHiOpen(false)} onLoad={hLoad} />
    </>
  );
}

function Section({ children }: { children: React.ReactNode }) {
  return <motion.div initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{duration:0.4}}>{children}</motion.div>;
}