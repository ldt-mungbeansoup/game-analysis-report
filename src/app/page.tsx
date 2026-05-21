"use client";

import React, { useState, useRef } from "react";
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

export default function Home() {
  const [phase, setPhase] = React.useState<Phase>("input");
  const [gameName, setGameName] = React.useState("");
  const [customPrompt, setCustomPrompt] = React.useState("");
  const [basicInfo, setBasicInfo] = React.useState<BasicInfo|null>(null);
  const [curMod, setCurMod] = React.useState<ModuleId|null>(null);
  const [doneMods, setDoneMods] = React.useState<ModuleId[]>([]);
  const [gd, setGd] = React.useState<GameAnalysis|null>(null);
  const [err, setErr] = React.useState("");
  const [hiOpen, setHiOpen] = React.useState(false);
  const [ld, setLd] = React.useState(false);

  const hSubmit = async (name: string, custom: string) => {
    setGameName(name); setCustomPrompt(custom); setErr(""); setPhase("confirming"); setLd(true);
    try {
      const r = await fetch("/api/analyze/basic", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({gameName:name}) });
      if (!r.ok) { const e = await r.json().catch(()=>({})); throw new Error(e.error||"Search failed"); }
      setBasicInfo(await r.json());
    } catch(e) { setErr(e instanceof Error ? e.message : "Failed"); }
    finally { setLd(false); }
  };

  const hConfirm = async () => {
    setPhase("generating"); setErr(""); setDoneMods([]); setCurMod(null); setGd(null);
    try {
      const r = await fetch("/api/analyze", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({gameName, customPrompt}) });
      if (!r.ok) { const e = await r.json().catch(()=>({})); throw new Error(e.error||"Analysis failed"); }
      const events = await r.json() as StreamEvent[];
      let data: Partial<GameAnalysis> = {};
      for (const evt of events) {
        if (evt.type === "moduleStart" && evt.moduleId) { setCurMod(evt.moduleId); await new Promise(r=>setTimeout(r,200)); }
        else if (evt.type === "moduleData" && evt.moduleId && evt.data) { data = {...data, [evt.moduleId]: evt.data}; setGd(data as GameAnalysis); }
        else if (evt.type === "moduleDone" && evt.moduleId) { setDoneMods(p=>[...p, evt.moduleId!]); }
        else if (evt.type === "done") { setCurMod(null); if (Object.keys(data).length > 0) addHistory(gameName, data as GameAnalysis, customPrompt); setPhase("done"); return; }
        else if (evt.type === "error") { setErr(String(evt.data||"Error")); return; }
      }
      if (phase !== "done") setErr("Analysis completed but no results");
    } catch(e) { setErr(e instanceof Error ? e.message : "Failed"); }
  };

  const hRetry = () => { setPhase("input"); setBasicInfo(null); setErr(""); };
  const hBack = () => { setPhase("input"); setGd(null); setBasicInfo(null); setErr(""); };
  const hLoad = (item: HistoryItem) => { setGameName(item.gameName); setCustomPrompt(item.customPrompt||""); setGd(item.data); setPhase("done"); };

  const renderModule = (id: ModuleId) => {
    if (!gd) return null;
    const d = gd[id]; if (!d) return null;
    const W = motion.div;
    switch(id) {
      case "productInfo": return <W key={id} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.4}}><ProductInfo data={d as any} /></W>;
      case "gameplay": return <W key={id} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.4}}><GameplayAnalysis data={d as any} /></W>;
      case "dataAndUsers": return <W key={id} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.4}}><DataAndUsers data={d as any} /></W>;
      case "monetization": return <W key={id} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.4}}><Monetization data={d as any} /></W>;
      case "playerFeedback": return <W key={id} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.4}}><PlayerFeedback data={d as any} /></W>;
      case "competitiveMatrix": return <W key={id} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.4}}><CompetitiveMatrix data={d as any} /></W>;
      case "strategyInsights": return <W key={id} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.4}}><StrategyInsights data={d as any} /></W>;
      default: return null;
    }
  };

  return (
    <>
      {phase !== "input" && <Navbar onOpenHistory={()=>setHiOpen(true)} hasResults={phase==="done"&&!!gd} onBack={hBack} />}
      <AnimatePresence mode="wait">
        {phase === "input" && (
          <motion.div key="input" initial={{opacity:1}} exit={{opacity:0}}>
            <InputPage onSubmit={hSubmit} onOpenHistory={()=>setHiOpen(true)} />
          </motion.div>)}
        {phase === "confirming" && (
          <motion.div key="confirm" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="min-h-screen bg-[#f5f5f7] flex items-center justify-center pt-14">
            {ld ? (<div className="text-center"><div className="animate-spin rounded-full h-8 w-8 border-2 border-[#007AFF] border-t-transparent mx-auto mb-3" /><p className="text-sm text-[#86868b]">Searching...</p></div>)
            : err ? (<div className="text-center"><p className="text-[#ff3b30] text-sm mb-3">{err}</p><button onClick={hRetry} className="text-[#007AFF] text-sm">Retry</button></div>)
            : basicInfo ? (<ConfirmCard info={basicInfo} onConfirm={hConfirm} onRetry={hRetry} loading={false} />) : null}
          </motion.div>)}
        {phase === "generating" && (
          <motion.div key="gen" initial={{opacity:0}} animate={{opacity:1}} className="min-h-screen bg-[#f5f5f7] pt-20 px-4">
            <ProgressBar currentModule={curMod} completedModules={doneMods} />
            <div className="max-w-3xl mx-auto space-y-8">
              {renderModule("productInfo")}{renderModule("gameplay")}{renderModule("dataAndUsers")}{renderModule("monetization")}
              {renderModule("playerFeedback")}{renderModule("competitiveMatrix")}{renderModule("strategyInsights")}
              {err && <p className="text-[#ff3b30] text-sm text-center mt-4">{err}</p>}
            </div>
          </motion.div>)}
        {phase === "done" && gd && (
          <motion.div key="done" initial={{opacity:0}} animate={{opacity:1}} className="min-h-screen bg-[#f5f5f7] pt-20 pb-32 px-4">
            <div className="max-w-3xl mx-auto mb-8 flex flex-wrap items-center justify-between gap-3">
              <h1 className="text-2xl font-bold text-[#1d1d1f]">{gameName}</h1>
              <div className="flex gap-2">
                <button onClick={()=>downloadPDF(gameName,gd)} className="inline-flex items-center gap-1.5 rounded-full bg-[#f5f5f7] px-4 py-2 text-sm font-medium text-[#1d1d1f] hover:bg-[#e8e8ed]"><Download className="h-4 w-4"/> PDF</button>
                <button onClick={()=>downloadMarkdown(gameName,gd)} className="inline-flex items-center gap-1.5 rounded-full bg-[#f5f5f7] px-4 py-2 text-sm font-medium text-[#1d1d1f] hover:bg-[#e8e8ed]"><FileText className="h-4 w-4"/> MD</button>
                <button onClick={()=>addHistory(gameName,gd,customPrompt)} className="inline-flex items-center gap-1.5 rounded-full bg-[#007AFF] px-4 py-2 text-sm font-medium text-white hover:bg-[#0066d6]"><Save className="h-4 w-4"/> Save</button>
              </div>
            </div>
            <div className="max-w-3xl mx-auto space-y-8">
              {renderModule("productInfo")}{renderModule("gameplay")}{renderModule("dataAndUsers")}{renderModule("monetization")}
              {renderModule("playerFeedback")}{renderModule("competitiveMatrix")}{renderModule("strategyInsights")}
            </div>
          </motion.div>)}
      </AnimatePresence>
      <HistoryPanel open={hiOpen} onClose={()=>setHiOpen(false)} onLoad={hLoad} />
    </>
  );
}