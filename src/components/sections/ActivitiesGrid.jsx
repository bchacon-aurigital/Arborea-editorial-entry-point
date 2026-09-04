"use client";

import ActivityCard from "@/components/ui/ActivityCard";
import { useI18n } from "@/app/context/I18nContext";

export default function ActivitiesGrid() {
  const { t } = useI18n();
  const activities = t("tours.activities");

  if (!Array.isArray(activities)) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
      {activities.map((activity, i) => (
        <ActivityCard key={i} activity={activity} />
      ))}
    </div>
  );
}
