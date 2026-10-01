/** `$1,240` — matches the formatting used across the service pages. */
export function money(value) {
  return `$${Math.round(Number(value) || 0).toLocaleString("en-US")}`;
}

/*
 * "2026-10-04" -> "Oct 4" / "4 oct"
 *
 * Parsed field by field on purpose. `new Date("2026-10-04")` is interpreted as
 * UTC midnight, which renders as the PREVIOUS day everywhere west of Greenwich —
 * Costa Rica included. Same trap as the `min` attribute fixed in DateField.
 */
export function formatDateLabel(iso, locale = "en") {
  if (typeof iso !== "string") return "";
  const match = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return "";

  const [, y, m, d] = match;
  const date = new Date(Number(y), Number(m) - 1, Number(d));
  if (Number.isNaN(date.getTime())) return "";

  try {
    return new Intl.DateTimeFormat(locale === "es" ? "es-CR" : "en-US", {
      month: "short",
      day: "numeric",
    }).format(date);
  } catch {
    return iso;
  }
}

/**
 * Turns a cart line's `options` + `date` into one muted caption:
 *   { duration: "90 min", days: 3 } + "2026-10-04"  ->  "90 min · 3 days · Oct 4"
 * Values are rendered as-is; keys are never shown, so option values should read
 * as labels on their own ("90 min", not "90").
 */
export function describeLine(line, locale = "en") {
  const parts = Object.values(line?.options ?? {})
    .filter((v) => v !== null && v !== undefined && v !== "")
    .map(String);

  const dateLabel = formatDateLabel(line?.date, locale);
  if (dateLabel) parts.push(dateLabel);

  return parts.join(" · ");
}
