"use client";

import {
  createContext, useContext, useState, useEffect, useMemo, useCallback,
} from "react";
import { SERVICES, SERVICE_ORDER } from "@/data/services";

/*
 * The single cart for the whole site.
 *
 * This replaces six independent page-local carts, each of which was lost on
 * navigation and submitted its own separate order. Pages now add lines here and
 * read them back; only the drawer and /checkout/ review or submit.
 *
 * Design notes worth keeping:
 *
 * - `lineTotal` is DERIVED, never stored. Every previous page baked quantity into
 *   the price AND into the display label ("Massage x2"), which is where the
 *   desync bugs came from. Store qty and unitPrice; compute the rest.
 *
 * - `normalizeLine` is a strict WHITELIST, not just validation. `tours.activities`
 *   in the i18n files carries internal `commission` / `contactName` / `whatsapp`
 *   fields, and cart lines are built from those objects. Whitelisting here means
 *   internal margin data structurally cannot reach the outbound payload.
 *
 * - Persistence is sessionStorage by product decision: the cart is meant to
 *   survive a page navigation, not a closed browser.
 *
 * - Free-form per-service preferences (chef dietary form, fridge questionnaire,
 *   spa allergies) live in `serviceForms`, NOT as zero-price cart lines. The old
 *   code faked them as priced items with price 0, which polluted the summary.
 */

const STORAGE_KEY = "arborea.cart.v1";

const CartContext = createContext(null);

function toQty(value, fallback = 1) {
  const n = Math.round(Number(value));
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

function toPrice(value) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

/* Returns null for anything unusable, so bad input is dropped rather than stored.
 * Exported so the whitelist can be verified directly — it is the guard that keeps
 * internal i18n fields (commission, contactName, whatsapp) out of stored state and
 * therefore out of the outbound payload. */
export function normalizeLine(raw) {
  if (!raw || typeof raw !== "object") return null;
  if (!raw.lineId || !raw.service) return null;
  if (!SERVICES[raw.service]) return null;

  return {
    lineId: String(raw.lineId),
    service: String(raw.service),
    sku: String(raw.sku ?? ""),
    title: String(raw.title ?? ""),
    qty: toQty(raw.qty),
    unitPrice: toPrice(raw.unitPrice),
    date: typeof raw.date === "string" ? raw.date : "",
    options:
      raw.options && typeof raw.options === "object" && !Array.isArray(raw.options)
        ? raw.options
        : {},
  };
}

export function CartProvider({ children }) {
  const [stored, setStored] = useState([]);
  const [serviceForms, setForms] = useState({});
  const [hydrated, setHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  /* Read once on mount. Never during render: the HTML is prerendered at build
   * time, so touching sessionStorage in the render pass desyncs hydration. */
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed?.lines)) {
          setStored(parsed.lines.map(normalizeLine).filter(Boolean));
        }
        if (parsed?.serviceForms && typeof parsed.serviceForms === "object") {
          setForms(parsed.serviceForms);
        }
      }
    } catch {
      /* private mode, disabled storage, corrupt JSON — start empty */
    }
    setHydrated(true);
  }, []);

  /* Guarded on `hydrated` so the empty initial state can't clobber saved data. */
  useEffect(() => {
    if (!hydrated) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ lines: stored, serviceForms }));
    } catch {
      /* quota or disabled storage — the cart still works in memory */
    }
  }, [hydrated, stored, serviceForms]);

  /* ── line mutations ─────────────────────────────────────── */

  /** Insert or fully replace a line. Keeps its position if it already exists. */
  const setLine = useCallback((line) => {
    const next = normalizeLine(line);
    if (!next) return;
    setStored((prev) => {
      const i = prev.findIndex((l) => l.lineId === next.lineId);
      if (i === -1) return [...prev, next];
      const copy = [...prev];
      copy[i] = next;
      return copy;
    });
  }, []);

  /** Insert, or add to the quantity of an existing line. */
  const addLine = useCallback((line) => {
    const next = normalizeLine(line);
    if (!next) return;
    setStored((prev) => {
      const i = prev.findIndex((l) => l.lineId === next.lineId);
      if (i === -1) return [...prev, next];
      const copy = [...prev];
      copy[i] = { ...copy[i], qty: copy[i].qty + next.qty };
      return copy;
    });
  }, []);

  /** Patch fields of an existing line. No-op if it isn't in the cart. */
  const updateLine = useCallback((lineId, patch) => {
    setStored((prev) => {
      const i = prev.findIndex((l) => l.lineId === lineId);
      if (i === -1) return prev;
      const merged = normalizeLine({ ...prev[i], ...patch });
      if (!merged) return prev;
      const copy = [...prev];
      copy[i] = merged;
      return copy;
    });
  }, []);

  const removeLine = useCallback((lineId) => {
    setStored((prev) => {
      if (!prev.some((l) => l.lineId === lineId)) return prev;
      return prev.filter((l) => l.lineId !== lineId);
    });
  }, []);

  /** Quantity at or below zero removes the line — every stepper relies on this. */
  const setQty = useCallback((lineId, qty) => {
    const n = Math.round(Number(qty));
    if (!Number.isFinite(n) || n <= 0) {
      removeLine(lineId);
      return;
    }
    setStored((prev) => {
      const i = prev.findIndex((l) => l.lineId === lineId);
      if (i === -1) return prev;
      const copy = [...prev];
      copy[i] = { ...copy[i], qty: n };
      return copy;
    });
  }, [removeLine]);

  const clearService = useCallback((serviceId) => {
    setStored((prev) => prev.filter((l) => l.service !== serviceId));
    setForms((prev) => {
      if (!(serviceId in prev)) return prev;
      const next = { ...prev };
      delete next[serviceId];
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setStored([]);
    setForms({});
  }, []);

  /* ── per-service preference forms ───────────────────────── */

  const setServiceForm = useCallback((serviceId, data) => {
    setForms((prev) => ({ ...prev, [serviceId]: { ...prev[serviceId], ...data } }));
  }, []);

  const replaceServiceForm = useCallback((serviceId, data) => {
    setForms((prev) => ({ ...prev, [serviceId]: data }));
  }, []);

  /* ── derived ────────────────────────────────────────────── */

  const lines = useMemo(
    () => stored.map((l) => ({ ...l, lineTotal: l.qty * l.unitPrice })),
    [stored]
  );

  const byId = useMemo(() => new Map(lines.map((l) => [l.lineId, l])), [lines]);

  const linesByService = useMemo(() => {
    const groups = new Map();
    for (const line of lines) {
      if (!groups.has(line.service)) groups.set(line.service, []);
      groups.get(line.service).push(line);
    }
    /* Ordered by SERVICE_ORDER so the drawer and checkout always agree. */
    return SERVICE_ORDER.filter((id) => groups.has(id)).map((id) => ({
      service: SERVICES[id],
      lines: groups.get(id),
      subtotal: groups.get(id).reduce((sum, l) => sum + l.lineTotal, 0),
    }));
  }, [lines]);

  const subtotal = useMemo(() => lines.reduce((sum, l) => sum + l.lineTotal, 0), [lines]);
  const count = useMemo(() => lines.reduce((sum, l) => sum + l.qty, 0), [lines]);

  const getLine = useCallback((lineId) => byId.get(lineId) ?? null, [byId]);
  const has = useCallback((lineId) => byId.has(lineId), [byId]);
  const getServiceForm = useCallback((serviceId) => serviceForms[serviceId] ?? null, [serviceForms]);

  const value = useMemo(
    () => ({
      lines, linesByService, subtotal, count, lineCount: lines.length,
      getLine, has,
      setLine, addLine, updateLine, removeLine, setQty, clearService, clear,
      serviceForms, getServiceForm, setServiceForm, replaceServiceForm,
      hydrated,
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      toggleCart: () => setIsOpen((v) => !v),
    }),
    [
      lines, linesByService, subtotal, count, getLine, has,
      setLine, addLine, updateLine, removeLine, setQty, clearService, clear,
      serviceForms, getServiceForm, setServiceForm, replaceServiceForm,
      hydrated, isOpen,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
