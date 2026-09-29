import {
  TbChefHat, TbFridge, TbSparkles, TbAnchor, TbCar, TbCompass,
} from "react-icons/tb";

/*
 * Single source of per-service identity.
 *
 * The cart drawer and /checkout/ render lines from all six services on one surface,
 * so they need a stable id -> {label, colour, route, icon} map. Before this, that
 * identity was scattered across SPA_COLOR, CARD_PALETTE, the THEMES object in
 * OrderCheckoutForm, and inline hex in every page.
 *
 * `id` is what lands in the outbound payload as `cart[].service` and as the
 * `serviceForms` key — see docs/ORDERS-BACKEND.md. Don't rename ids casually.
 *
 * `href` is where "edit this" in the cart sends the guest. Home-page sections use
 * a hash; `trailingSlash: true` means standalone routes need the trailing slash.
 */

export const SERVICES = {
  "private-chef": {
    id: "private-chef",
    labelKey: "services.privateChef.label",
    color: "#213B2F",
    href: "/private-chef/",
    icon: TbChefHat,
    hasPreferenceForm: true,
  },
  "full-fridge": {
    id: "full-fridge",
    labelKey: "services.fullFridge.label",
    color: "#5C3324",
    href: "/full-fridge/",
    icon: TbFridge,
    hasPreferenceForm: true,
  },
  "wellness-spa": {
    id: "wellness-spa",
    labelKey: "services.wellnessSpa.label",
    color: "#8B5A3C",
    href: "/wellness-spa/",
    icon: TbSparkles,
    hasPreferenceForm: true,
  },
  "fishing-tours": {
    id: "fishing-tours",
    labelKey: "services.fishingTours.label",
    color: "#6B5A2E",
    href: "/fishing-tours/",
    icon: TbAnchor,
    hasPreferenceForm: false,
  },
  transport: {
    id: "transport",
    labelKey: "services.transport.label",
    color: "#4B4D40",
    href: "/#transport",
    icon: TbCar,
    hasPreferenceForm: false,
  },
  tours: {
    id: "tours",
    labelKey: "services.tours.label",
    color: "#222E2C",
    href: "/#tours",
    icon: TbCompass,
    hasPreferenceForm: false,
  },
};

/* Display order in the cart drawer and on the checkout page. */
export const SERVICE_ORDER = [
  "private-chef",
  "full-fridge",
  "wellness-spa",
  "fishing-tours",
  "tours",
  "transport",
];

export const getService = (id) => SERVICES[id] ?? null;
