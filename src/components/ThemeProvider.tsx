"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Theme } from "@/types";

interface ThemeContextType { theme: Theme; toggleTheme: () => void; }

const ThemeContext = createContext<ThemeContextType>({ theme: "light", toggleTheme: () => {} });

function getStoredTheme(): Theme { if (typeof window === "undefined") return "light"; return (localStorage.getItem("theme") as Theme) || "light"; }

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => { const saved = getStoredTheme(); setTheme(saved); if (saved === "dark") { document.documentElement.classList.add("dark"); } else { document.documentElement.classList.remove("dark"); } }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      localStorage.setItem("theme", next);
      if (next === "dark") { document.documentElement.classList.add("dark"); } else { document.documentElement.classList.remove("dark"); }
      return next;
    });
  };

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
