"use client";

import { useCallback, useEffect, useState } from "react";
import type { UserAnnotation } from "@/types/crux";

export function usePrefersReducedMotion(): boolean {
  // Lazy initializer reads the current value once — SSR-safe via typeof window guard.
  // The effect only subscribes to changes, which satisfies the no-synchronous-setState rule.
  const [prefersReduced, setPrefersReduced] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return prefersReduced;
}

export function useLocalAnnotations(storageKey: string) {
  const [annotations, setAnnotations] = useState<UserAnnotation[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? (JSON.parse(stored) as UserAnnotation[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(annotations));
    } catch {
      // localStorage quota exceeded — fail silently
    }
  }, [annotations, storageKey]);

  const addAnnotation = useCallback((date: string, label: string) => {
    setAnnotations((prev) => [
      ...prev,
      { id: crypto.randomUUID(), date, label },
    ]);
  }, []);

  const removeAnnotation = useCallback((id: string) => {
    setAnnotations((prev) => prev.filter((a) => a.id !== id));
  }, []);

  return { annotations, addAnnotation, removeAnnotation };
}
