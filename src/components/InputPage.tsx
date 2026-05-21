"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Clock } from "lucide-react";

interface Props { onSubmit: (gameName: string, customPrompt: string) => void; onOpenHistory: () => void; }

export default function InputPage({ onSubmit, onOpenHistory }: Props) {
  const [name, setName] = useState("");
  const [custom, setCustom] = useState("");
  const [showCustom, setShowCustom] = useState(false);

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); if (name.trim()) onSubmit(name.trim(), custom.trim()); };

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex flex-col items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} className="w-full max-w-xl text-center">
        <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.6 }} className="text-4xl font-semibold tracking-tight text-[#1d1d1f] mb-2">游戏竞品分析报告</motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.6 }} className="text-lg text-[#86868b] mb-10">输入游戏名称，AI 为你生成专业分析</motion.p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6, duration: 0.5 }} className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#86868b]" />
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="输入游戏名称，如：原神" className="w-full h-14 pl-12 pr-4 rounded-2xl border-0 bg-white text-[#1d1d1f] text-lg placeholder:text-[#aeaeb2] shadow-sm ring-1 ring-black/5 focus:ring-2 focus:ring-[#007AFF] focus:shadow-md transition-all outline-none" autoFocus />
          </motion.div>

          {showCustom && (
            <motion.textarea initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} value={custom} onChange={(e) => setCustom(e.target.value)} placeholder={'可选：输入额外分析要求，如“着重分析付费设计、日本市场定位”'} rows={3} className="w-full px-4 py-3 rounded-2xl border-0 bg-white text-[#1d1d1f] text-sm placeholder:text-[#aeaeb2] shadow-sm ring-1 ring-black/5 focus:ring-2 focus:ring-[#007AFF] transition-all outline-none resize-none" />
          )}

          <div className="flex items-center justify-center gap-4">
            <button type="button" onClick={() => setShowCustom(!showCustom)} className="text-sm text-[#86868b] hover:text-[#007AFF] transition-colors">{showCustom ? "收起" : "+ 添加额外要求"}</button>
            <button type="submit" disabled={!name.trim()} className="rounded-full bg-[#007AFF] px-8 py-3 text-sm font-medium text-white hover:bg-[#0066d6] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm">开始分析</button>
          </div>
        </form>

        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 0.5 }} onClick={onOpenHistory} className="mt-12 inline-flex items-center gap-1.5 text-sm text-[#86868b] hover:text-[#1d1d1f] transition-colors"><Clock className="h-4 w-4" /> 历史记录</motion.button>
      </motion.div>
    </div>
  );
}
