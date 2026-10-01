import en from "@/i18n/en.json";

/*
 * Stable ids for cart lines.
 *
 * Cart ids used to be array indices (`massage-0`, `dish-breakfast-3`), which meant
 * reordering an i18n array silently remapped a cart line to a different product.
 * They were also built from the *active locale's* strings, so switching language
 * mid-flow produced a second id for the same thing.
 *
 * Both problems go away by deriving the slug from the ENGLISH source. en.json is
 * imported directly rather than read through `t()` on purpose — the sku must not
 * depend on the active locale.
 *
 * Trade-off: renaming an English title changes the sku, which orphans any line
 * already sitting in a guest's cart. Acceptable because the cart is session-scoped.
 */

export function slugify(input) {
  return (
    String(input ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "item"
  );
}

/* Walks en.json by dot path. Numeric segments index into arrays. */
function resolve(path) {
  let node = en;
  for (const segment of String(path).split(".")) {
    if (node == null) return undefined;
    node = Array.isArray(node) && /^\d+$/.test(segment) ? node[Number(segment)] : node[segment];
  }
  return node;
}

/**
 * skuOf("wellnessSpa.massages.items", 2, "name")   -> "hot-stone-massage"
 * skuOf("wellnessSpa.facials.addons.items", 0)     -> array of strings, uses the string
 * skuOf("fullFridge.produce.categories.3.items", 1) -> nested arrays work
 *
 * `path` points at the ARRAY. Falls back to `<last-path-segment>-<index>` when the
 * English entry can't be resolved, so a caller always gets a usable id.
 */
export function skuOf(path, index, field = "title") {
  const arr = resolve(path);
  const entry = Array.isArray(arr) ? arr[index] : undefined;

  const name =
    typeof entry === "string"
      ? entry
      : entry && typeof entry === "object"
        ? entry[field] ?? entry.title ?? entry.name ?? entry.label
        : undefined;

  if (name) return slugify(name);

  const tail = String(path).split(".").filter((s) => !/^\d+$/.test(s)).pop() ?? "item";
  return `${slugify(tail)}-${index}`;
}

/** Composite id for a line: "wellness-spa:hot-stone-massage:90-min" */
export function lineIdOf(service, sku, variant) {
  return [service, sku, variant ? slugify(variant) : null].filter(Boolean).join(":");
}
