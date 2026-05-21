"use client";

import { useState, useEffect, useRef } from "react";
import { ModuleId } from "@/types";

export function useActiveSection(sectionIds: ModuleId[]) {
  const [activeSection, setActiveSection] = useState<ModuleId>(
    sectionIds[0] || "productInfo" as ModuleId
  );
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id as ModuleId);
            break;
          }
        }
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );

    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) observerRef.current.observe(el);
    }

    return () => observerRef.current?.disconnect();
  }, [sectionIds]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSection(id as ModuleId);
    }
  };

  return { activeSection, scrollTo };
}
