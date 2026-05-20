"use client";

import { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import AIChat from "@/components/AIChat";
import ProductInfo from "@/components/modules/ProductInfo";
import GameplayAnalysis from "@/components/modules/GameplayAnalysis";
import DataAndUsers from "@/components/modules/DataAndUsers";
import Monetization from "@/components/modules/Monetization";
import PlayerFeedback from "@/components/modules/PlayerFeedback";
import CompetitiveMatrix from "@/components/modules/CompetitiveMatrix";
import StrategyInsights from "@/components/modules/StrategyInsights";
import { useActiveSection } from "@/hooks/useActiveSection";
import { GameIndexItem, GameAnalysis, SectionId } from "@/types";

const SECTION_IDS: SectionId[] = [
  "productInfo",
  "gameplay",
  "dataAndUsers",
  "monetization",
  "playerFeedback",
  "competitiveMatrix",
  "strategyInsights",
];

export default function Home() {
  const [games, setGames] = useState<GameIndexItem[]>([]);
  const [selectedGameId, setSelectedGameId] = useState("");
  const [aiOpen, setAiOpen] = useState(false);
  const [gameData, setGameData] = useState<GameAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const { activeSection, scrollTo } = useActiveSection(SECTION_IDS);

  useEffect(() => {
    fetch("/data/games.json")
      .then((res) => res.json())
      .then((data: GameIndexItem[]) => {
        setGames(data);
        if (data.length > 0) {
          setSelectedGameId(data[0].id);
        }
      })
      .catch(console.error);
  }, []);

  const loadGameData = useCallback(async (id: string) => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await fetch(`/data/games/${id}.json`);
      const data: GameAnalysis = await res.json();
      setGameData(data);
    } catch (e) {
      console.error("加载游戏数据失败:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedGameId) {
      loadGameData(selectedGameId);
    }
  }, [selectedGameId, loadGameData]);

  const handleSelectGame = (id: string) => {
    setSelectedGameId(id);
  };

  const handleNavigate = (id: SectionId) => {
    scrollTo(id);
  };

  return (
    <>
      <Navbar
        games={games}
        selectedGameId={selectedGameId}
        onSelectGame={handleSelectGame}
        onOpenAI={() => setAiOpen(true)}
      />

      <Sidebar activeSection={activeSection} onNavigate={handleNavigate} />

      <main className="mx-auto max-w-3xl px-4 pt-20 pb-32 lg:ml-52">
        {loading || !gameData ? (
          <div className="flex h-64 items-center justify-center">
            <p className="text-muted-foreground animate-pulse">加载分析数据中...</p>
          </div>
        ) : (
          <>
            <ProductInfo data={gameData.productInfo} />
            <GameplayAnalysis data={gameData.gameplay} />
            <DataAndUsers data={gameData.dataAndUsers} />
            <Monetization data={gameData.monetization} />
            <PlayerFeedback data={gameData.playerFeedback} />
            <CompetitiveMatrix data={gameData.competitiveMatrix} />
            <StrategyInsights data={gameData.strategyInsights} />
          </>
        )}
      </main>

      <AIChat
        open={aiOpen}
        onClose={() => setAiOpen(false)}
        activeModule={activeSection}
      />
    </>
  );
}
