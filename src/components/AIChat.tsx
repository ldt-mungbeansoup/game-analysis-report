"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, Loader2, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type ChatMessage, sendChatMessage } from "@/lib/api";

interface AIChatProps {
  open: boolean;
  onClose: () => void;
  activeModule: string;
}

const MODULE_LABELS: Record<string, string> = {
  productInfo: "产品信息",
  gameplay: "核心玩法",
  dataAndUsers: "数据与用户",
  monetization: "商业系统",
  playerFeedback: "玩家反馈",
  competitiveMatrix: "竞品对比",
  strategyInsights: "策略启示",
};

export default function AIChat({ open, onClose, activeModule }: AIChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState(
    process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY || ""
  );
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMsg: ChatMessage = { role: "user", content: trimmed };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setError(null);
    setLoading(true);

    try {
      const reply = await sendChatMessage(updatedMessages, activeModule, apiKey);
      setMessages([...updatedMessages, { role: "assistant", content: reply }]);
    } catch (err) {
      const errMsg =
        err instanceof Error ? err.message : "请求失败，请检查 API Key 或网络连接。";
      setError(errMsg);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `❌ 错误：${errMsg}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <>
      {/* 背景遮罩 */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* 抽屉面板 */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col border-l border-gray-200">
        {/* 标题栏 */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-gray-800">AI 分析助手</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
              {MODULE_LABELS[activeModule] || activeModule}
            </span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* API Key 输入 */}
        {!apiKey && (
          <div className="px-4 py-2 border-b border-gray-100 bg-amber-50">
            <label className="text-xs text-amber-700 font-medium block mb-1">
              DeepSeek API Key（或设置 NEXT_PUBLIC_DEEPSEEK_API_KEY 环境变量）
            </label>
            <input
              type="password"
              className="w-full px-2 py-1 text-sm border border-amber-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-400"
              placeholder="sk-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>
        )}

        {/* 消息列表 */}
        <ScrollArea className="flex-1 px-4 py-3">
          <div ref={scrollRef} className="space-y-3">
            {messages.length === 0 && (
              <div className="text-center text-gray-400 mt-10">
                <Bot className="w-10 h-10 mx-auto mb-2 opacity-40" />
                <p className="text-sm">当前分析模块：{MODULE_LABELS[activeModule] || activeModule}</p>
                <p className="text-xs mt-1">输入问题，AI 帮你深度解读</p>
              </div>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-lg text-sm whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-4 py-2 rounded-lg">
                  <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* 错误提示 */}
        {error && (
          <div className="px-4 py-2 mx-4 mb-2 border border-red-300 bg-red-50 rounded-lg text-sm text-red-700">
            {error}
            <button
              onClick={() => setError(null)}
              className="ml-2 text-red-400 hover:text-red-600"
            >
              ×
            </button>
          </div>
        )}

        {/* 输入区 */}
        <div className="flex items-center gap-2 px-4 py-3 border-t border-gray-200">
          <input
            type="text"
            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="输入问题，按 Enter 发送..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={loading}
          />
          <Button
            size="icon"
            onClick={handleSend}
            disabled={loading || !input.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </>
  );
}
