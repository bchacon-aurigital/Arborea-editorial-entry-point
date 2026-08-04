"use client";

import { useMemo, useState, useCallback } from "react";

export function useOrderCart() {
  const [items, setItems] = useState({});

  const toggleItem = useCallback((id, item) => {
    setItems((prev) => {
      if (prev[id]) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return { ...prev, [id]: item };
    });
  }, []);

  const setItem = useCallback((id, item) => {
    setItems((prev) => ({ ...prev, [id]: item }));
  }, []);

  const removeItem = useCallback((id) => {
    setItems((prev) => {
      if (!prev[id]) return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const isSelected = useCallback((id) => Boolean(items[id]), [items]);

  const lines = useMemo(() => Object.values(items), [items]);
  const total = useMemo(() => lines.reduce((sum, line) => sum + (Number(line.price) || 0), 0), [lines]);
  const count = lines.length;

  return { items, toggleItem, setItem, removeItem, isSelected, lines, total, count };
}
