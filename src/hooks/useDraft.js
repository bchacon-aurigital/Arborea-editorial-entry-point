"use client";

import { useState, useCallback, useMemo, useEffect, useRef } from "react";

/*
 * Local selection store for an in-house service page.
 *
 * These pages are a draft until the guest presses "Add to cart" once at the bottom:
 * selections and preference answers accumulate here, the page renders its own
 * summary from them, and only the commit writes to the global cart. Nothing in here
 * is persisted — the cart is the committed order (see CLAUDE.md).
 *
 * Entries are free-form per page; in practice `{ qty, date, duration, unitPrice }`.
 * Unlike the old `useOrderCart` this deliberately does NOT track labels or fold
 * quantity into a price — the commit builds those from the i18n data.
 *
 * `useOrderCart` still exists for FishingToursPage, which is intentionally not
 * wired to the cart yet.
 */

export function useDraft(initial = {}) {
  const [items, setItems] = useState(initial);

  const get = useCallback((id) => items[id], [items]);
  const has = useCallback((id) => Boolean(items[id]), [items]);

  /** Shallow-merges into the entry, creating it if absent. */
  const set = useCallback((id, patch) => {
    setItems((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));
  }, []);

  /** Replaces the entry outright. */
  const replace = useCallback((id, value) => {
    setItems((prev) => ({ ...prev, [id]: value }));
  }, []);

  const remove = useCallback((id) => {
    setItems((prev) => {
      if (!(id in prev)) return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const clear = useCallback(() => setItems({}), []);

  const ids = useMemo(() => Object.keys(items), [items]);
  const count = ids.length;

  return { items, ids, count, get, has, set, replace, remove, clear, setItems };
}

/**
 * Restores a page's draft from lines already committed to the cart, once, after
 * hydration.
 *
 * Without this, the "Edit" link in the cart drawer lands the guest on an empty page.
 * Because every commit does `clearService()` first, re-committing from that empty
 * page would silently drop the lines and preferences they had already added — they
 * would think they were adding a third massage and end up with only the new one.
 *
 * `skuToId` maps a committed line back to the draft key the page uses for it;
 * return a falsy value to ignore a line.
 *
 * Runs on the hydration tick only (guarded by a ref), so it can never overwrite
 * edits the guest is in the middle of making.
 */
export function useSeedDraftFromCart({ hydrated, lines, service, skuToId, setItems, onSeed }) {
  const seeded = useRef(false);

  useEffect(() => {
    if (seeded.current || !hydrated) return;
    seeded.current = true;

    const mine = lines.filter((l) => l.service === service);
    if (!mine.length) return;

    const next = {};
    for (const line of mine) {
      const id = skuToId(line);
      if (!id) continue;
      next[id] = {
        qty: line.qty,
        date: line.date ?? "",
        unitPrice: line.unitPrice,
        ...(line.options?.duration ? { duration: line.options.duration } : {}),
      };
    }

    if (Object.keys(next).length) setItems((prev) => ({ ...prev, ...next }));
    onSeed?.(mine);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);
}

export default useDraft;
