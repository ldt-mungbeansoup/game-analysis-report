"use client";

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ModuleComponent = React.FC<{ data: any }>;

const MODULES: { id: ModuleId; component: ModuleComponent; hasContent: (d: unknown) => boolean }[] = [
  { id: "productInfo", component: ProductInfo as ModuleComponent, hasContent: (d: unknown) => typeof (d as Record<string,unknown>).developer === "string" },
  { id: "gameplay", component: GameplayAnalysis as ModuleComponent, hasContent: (d: unknown) => typeof (d as Record<string,unknown>).coreLoop === "string" },
  { id: "dataAndUsers", component: DataAndUsers as ModuleComponent, hasContent: (d: unknown) => typeof (d as Record<string,unknown>).marketPerformance === "object" },
  { id: "monetization", component: Monetization as ModuleComponent, hasContent: (d: unknown) => typeof (d as Record<string,unknown>).paymentModel === "object" },
  { id: "playerFeedback", component: PlayerFeedback as ModuleComponent, hasContent: (d: unknown) => typeof (d as Record<string,unknown>).ratingTrend === "object" },
  { id: "competitiveMatrix", component: CompetitiveMatrix as ModuleComponent, hasContent: (d: unknown) => typeof (d as Record<string,unknown>).radar === "object" },
  { id: "strategyInsights", component: StrategyInsights as ModuleComponent, hasContent: (d: unknown) => typeof (d as Record<string,unknown>).marketOpportunity === "string" },
];

export default function Home() {
  const [phase, setPhase] = useState<Phase>("input");
  const [gameName, setGameName] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [basicInfo, setBasicInfo] = useState<BasicInfo | null>(null);
  const [currentModule, setCurrentModule] = useState<ModuleId | null>(null);
  const [completedModules, setCompletedModules] = useState<ModuleId[]>([]);
  const [gameData, setGameData] = useState<GameAnalysis | null>(null);
  const [error, setError] = useState("");
  const [hiOpen, setHiOpen] = useState(false);
  const [loadingConfirm, setLoadingConfirm] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const handleSubmit = async (name: string, custom: string) => {
    setGameName(name);
    setCustomPrompt(custom);
    setError("");
    setPhase("confirming");
    setLoadingConfirm(true);
    try {
      const res = await fetch("/api/analyze/basic", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ gameName: name }) });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error || "获取失败"); }
      setBasicInfo(await res.json());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "获取失败");
    } finally {
      setLoadingConfirm(false);
    }
  };

  const handleConfirm = async () => {
    setPhase("generating");
    setError("");
    setCompletedModules([]);
    setCurrentModule(null);
    setGameData(null);
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const res = await fetch("/api/analyze", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ gameName, customPrompt }), signal: controller.signal });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error || "分析失败"); }
      const reader = res.body?.getReader();
      if (!reader) throw new Error("无法读取流");
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;
          try {
            const event: StreamEvent = JSON.parse(trimmed);
            if (event.type === "moduleStart" && event.moduleId) {
              setCurrentModule(event.moduleId);
            } else if (event.type === "moduleData" && event.moduleId && event.data) {
              setGameData((prev) => ({ ...prev, [event.moduleId!]: event.data } as GameAnalysis));
            } else if (event.type === "moduleDone" && event.moduleId) {
              setCompletedModules((prev) => [...prev, event.moduleId!]);
            } else if (event.type === "done") {
              setCurrentModule(null);
              setGameData((prev) => { if (prev) addHistory(gameName, prev, customPrompt); return prev; });
              setPhase("done");
            } else if (event.type === "error") {
              setError(String(event.data || "分析出错"));
            }
          } catch { /* skip malformed JSON */ }
        }
      }
    } catch (e: unknown) {
      if (!(e instanceof DOMException && e.name === "AbortError")) setError(e instanceof Error ? e.message : "分析失败");
    }
  };

  const handleRetry = () => { setPhase("input"); setBasicInfo(null); setError(""); };
  const handleBack = () => { abortRef.current?.abort(); setPhase("input"); setGameData(null); setBasicInfo(null); setError(""); };

  const handleLoadHistory = (item: HistoryItem) => {
    setGameName(item.gameName);
    setCustomPrompt(item.customPrompt || "");
    setGameData(item.data);
    setPhase("done");
  };

  return (
    <>
      {phase !== "input" && <Navbar onOpenHistory={() => setHiOpen(true)} hasResults={phase === "done" && !!gameData} onBack={handleBack} />}

      <AnimatePresence mode="wait">
        {phase === "input" && (
          <motion.div key="input" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <InputPage onSubmit={handleSubmit} onOpenHistory={() => setHiOpen(true)} />
          </motion.div>
        )}

        {phase === "confirming" && (
          <motion.div key="confirm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen bg-[#f5f5f7] flex items-center justify-center pt-14">
            {loadingConfirm ? (
              <div className="text-center"><div className="animate-spin rounded-full h-8 w-8 border-2 border-[#007AFF] border-t-transparent mx-auto mb-3" /><p className="text-sm text-[#86868b]">正在搜索游戏信息...</p></div>
            ) : error ? (
              <div className="text-center"><p className="text-[#ff3b30] text-sm mb-3">{error}</p><button onClick={handleRetry} className="text-[#007AFF] text-sm">重新输入</button></div>
            ) : basicInfo ? (
              <ConfirmCard info={basicInfo} onConfirm={handleConfirm} onRetry={handleRetry} loading={false} />
            ) : null}
          </motion.div>
        )}

        {phase === "generating" && (
          <motion.div key="generating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-[#f5f5f7] pt-20 px-4">
            <ProgressBar currentModule={currentModule} completedModules={completedModules} />
            <div className="max-w-3xl mx-auto space-y-8">
              {MODULES.map(({ id, component: Comp, hasContent }) => {
                const moduleData = gameData?.[id];
                if (!moduleData || !hasContent(moduleData)) return null;
                return (
                  <motion.div key={id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                    <Comp data={moduleData} />
                  </motion.div>
                );
              })}
              {error && <p className="text-[#ff3b30] text-sm text-center">{error}</p>}
            </div>
          </motion.div>
        )}

        {phase === "done" && gameData && (
          <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-[#f5f5f7] pt-20 pb-32 px-4">
            <div className="max-w-3xl mx-auto mb-8 flex flex-wrap items-center justify-between gap-3">
              <h1 className="text-2xl font-bold text-[#1d1d1f]">{gameName} 竞品分析报告</h1>
              <div className="flex gap-2">
                <button onClick={() => downloadPDF(gameName, gameData)} className="inline-flex items-center gap-1.5 rounded-full bg-[#f5f5f7] px-4 py-2 text-sm font-medium text-[#1d1d1f] hover:bg-[#e8e8ed] transition-colors"><Download className="h-4 w-4" /> PDF</button>
                <button onClick={() => downloadMarkdown(gameName, gameData)} className="inline-flex items-center gap-1.5 rounded-full bg-[#f5f5f7] px-4 py-2 text-sm font-medium text-[#1d1d1f] hover:bg-[#e8e8ed] transition-colors"><FileText className="h-4 w-4" /> MD</button>
                <button onClick={() => addHistory(gameName, gameData, customPrompt)} className="inline-flex items-center gap-1.5 rounded-full bg-[#007AFF] px-4 py-2 text-sm font-medium text-white hover:bg-[#0066d6] transition-colors"><Save className="h-4 w-4" /> 保存</button>
              </div>
            </div>
            <div className="max-w-3xl mx-auto space-y-8">
              {MODULES.map(({ id, component: Comp, hasContent }) => {
                const data = gameData[id];
                if (!data || !hasContent(data)) return null;
                return (
                  <motion.div key={id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
                    <Comp data={data} />
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <HistoryPanel open={hiOpen} onClose={() => setHiOpen(false)} onLoad={handleLoadHistory} />
    </>
  );
}
