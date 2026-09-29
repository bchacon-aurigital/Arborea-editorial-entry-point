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
        <ActivityCard key={i} activity={activity} />
      ))}
    </div>
  );
}
