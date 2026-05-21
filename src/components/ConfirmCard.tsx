"use client";

import { motion } from "framer-motion";
import { BasicInfo } from "@/types";

interface Props { info: BasicInfo; onConfirm: () => void; onRetry: () => void; loading: boolean; }

export default function ConfirmCard({ info, onConfirm, onRetry, loading }: Props) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-xl mx-auto">
      <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-black/5">
        <h2 className="text-xl font-semibold text-[#1d1d1f] mb-2">确认游戏信息</h2>
        <p className="text-sm text-[#86868b] mb-6">AI 搜索到以下游戏信息，请确认是否正确</p>
        <div className="space-y-3 mb-8">
          <Row label="名称" value={info.name} />
          <Row label="开发商" value={info.developer} />
          <Row label="发行商" value={info.publisher} />
          <Row label="上线时间" value={info.releaseDate} />
          <Row label="平台" value={info.platforms?.join(" / ")} />
          <Row label="IP 背景" value={info.ipBackground} />
        </div>
        <div className="flex gap-3">
          <button onClick={onConfirm} disabled={loading} className="flex-1 rounded-full bg-[#007AFF] py-3 text-sm font-medium text-white hover:bg-[#0066d6] disabled:opacity-40 transition-all shadow-sm">{loading ? "确认中..." : "确认，开始分析"}</button>
          <button onClick={onRetry} disabled={loading} className="rounded-full bg-[#f5f5f7] px-6 py-3 text-sm font-medium text-[#1d1d1f] hover:bg-[#e8e8ed] transition-all">重新输入</button>
        </div>
      </div>
    </motion.div>
  );
}

function Row({ label, value }: { label: string; value?: string }) {
  return <div className="flex items-start gap-3 text-sm"><span className="w-16 shrink-0 text-[#86868b]">{label}</span><span className="text-[#1d1d1f] font-medium">{value || "-"}</span></div>;
}
