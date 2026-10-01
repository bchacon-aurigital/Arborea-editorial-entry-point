"use client";

import ActivityCard from "@/components/ui/ActivityCard";
import { useI18n } from "@/app/context/I18nContext";

export default function ActivitiesGrid() {
  const { t } = useI18n();
  const activities = t("tours.activities");

  if (!Array.isArray(activities)) return null;

  return (
    <div className="flex flex-col gap-3">
      {activities.map((activity, i) => (
        /* `index` feeds skuOf() so the cart id comes from the English title
           rather than this position — see src/lib/sku.js */
        <ActivityCard key={i} activity={activity} index={i} />
      ))}
    </div>
  );
}
