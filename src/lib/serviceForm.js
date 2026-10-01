/*
 * Renders a service's preference blob (cart `serviceForms[serviceId]`) as readable
 * label/value pairs, so the guest can actually see that their allergies and answers
 * were captured instead of just a "saved" chip.
 *
 * Values are whatever the service page put there, so the formatter is shape-driven
 * rather than key-driven: strings pass through, arrays join, `{option: count}` maps
 * become "Vegetarian (2)", and `{meal: [dishes]}` becomes "Breakfast: A, B".
 */

/* Display order. Unknown keys keep their own order after these. */
const ORDER = [
  "adults", "children", "days",
  "restrictions", "restrictionOther", "dietary", "dietaryAllergies",
  "allergies", "preferences", "dishes",
  "cooking", "groceries", "snacksFor", "preferredSnacks",
  "produce",
  "notes",
];

/* Keys that are long id lists — shown as a count, never as raw slugs. */
const COUNT_ONLY = new Set(["produce"]);

function isBlank(value) {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.trim() === "";
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") return Object.keys(value).length === 0;
  return false;
}

function formatValue(key, value, t) {
  if (COUNT_ONLY.has(key) && Array.isArray(value)) {
    return t("cart.formLabels.itemsSelected").replace("{n}", String(value.length));
  }

  if (Array.isArray(value)) return value.join(", ");

  if (value && typeof value === "object") {
    return Object.entries(value)
      .filter(([, v]) => !isBlank(v))
      .map(([k, v]) => {
        /* { breakfast: ["Gallo Pinto"] } -> "Breakfast: Gallo Pinto" */
        if (Array.isArray(v)) {
          const mealLabel = t(`cart.formLabels.${k}`);
          const name = mealLabel === `cart.formLabels.${k}` ? k : mealLabel;
          return `${name}: ${v.join(", ")}`;
        }
        /* { Vegetarian: 2 } -> "Vegetarian (2)" */
        return `${k} (${v})`;
      })
      .join(" · ");
  }

  return String(value);
}

/** Returns `[{ key, label, value }]`, already filtered and ordered. */
export function describeServiceForm(form, t) {
  if (!form || typeof form !== "object") return [];

  const keys = Object.keys(form);
  const ordered = [
    ...ORDER.filter((k) => keys.includes(k)),
    ...keys.filter((k) => !ORDER.includes(k)),
  ];

  const out = [];
  for (const key of ordered) {
    const raw = form[key];
    if (isBlank(raw)) continue;

    const value = formatValue(key, raw, t);
    if (isBlank(value)) continue;

    /* Fall back to the key itself if no label is defined, rather than printing
     * the raw i18n path. */
    const label = t(`cart.formLabels.${key}`);
    out.push({ key, label: label === `cart.formLabels.${key}` ? key : label, value });
  }
  return out;
}
