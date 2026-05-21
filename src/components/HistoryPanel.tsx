"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Clock } from "lucide-react";
import { HistoryItem } from "@/types";
import { getHistory, removeHistory, clearHistory } from "@/lib/storage";

interface Props { open: boolean; onClose: () => void; onLoad: (item: HistoryItem) => void; }

export default function HistoryPanel({ open, onClose, onLoad }: Props) {
  const [items, setItems] = useState<HistoryItem[]>([]);

  useEffect(() => { if (open) setItems(getHistory()); }, [open]);

  const handleRemove = (id: string) => { removeHistory(id); setItems(getHistory()); };
  const handleClear = () => { clearHistory(); setItems([]); };
  const handleLoad = (item: HistoryItem) => { onLoad(item); onClose(); };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm" />
          <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed right-0 top-0 z-50 h-full w-full max-w-sm bg-white shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#e5e5ea]">
              <h2 className="text-lg font-semibold text-[#1d1d1f]">历史记录</h2>
              <div className="flex items-center gap-2">
                {items.length > 0 && <button onClick={handleClear} className="text-xs text-[#ff3b30] hover:underline">清空</button>}
                <button onClick={onClose} className="p-1 rounded-full hover:bg-[#f5f5f7] transition-colors"><X className="h-5 w-5 text-[#86868b]" /></button>
              </div>
            </div>
            <div className="overflow-y-auto h-[calc(100%-57px)]">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-[#aeaeb2]"><Clock className="h-8 w-8 mb-2" /><p className="text-sm">暂无历史记录</p></div>
              ) : (
                <div className="p-3 space-y-2">
                  {items.map((item) => (
                    <div key={item.id} className="group flex items-center justify-between rounded-xl bg-[#f5f5f7] p-4 hover:bg-[#e8e8ed] transition-colors cursor-pointer" onClick={() => handleLoad(item)}>
                      <div>
                        <p className="text-sm font-medium text-[#1d1d1f]">{item.gameName}</p>
                        <p className="text-xs text-[#aeaeb2] mt-0.5">{new Date(item.createdAt).toLocaleString("zh-CN")}</p>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); handleRemove(item.id); }} className="opacity-0 group-hover:opacity-100 p-1 rounded-full hover:bg-red-50 transition-all"><Trash2 className="h-4 w-4 text-[#ff3b30]" /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
