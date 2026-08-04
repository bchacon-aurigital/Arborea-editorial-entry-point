"use client";

import { useMemo, useState } from "react";
import { useI18n } from "@/app/context/I18nContext";
import { properties } from "@/data/properties";
import { submitOrder } from "@/lib/orderApi";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { TbCheck, TbLoader2, TbUser, TbHome2, TbCalendarEvent, TbNotes, TbAlertCircle } from "react-icons/tb";

export default function OrderCheckoutForm({ service, lines, infoLines = [], total, notes, onNotesChange }) {
  const { t, locale } = useI18n();

  const [name, setName] = useState("");
  const [casa, setCasa] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("idle");
  const [validationError, setValidationError] = useState(false);

  const casaOptions = useMemo(
    () => Object.values(properties).map((p) => ({ value: p.slug, label: t(`properties.${p.i18nKey}.name`) })),
    [t]
  );

  const summaryLines = [...lines, ...infoLines];
  const todayIso = new Date().toISOString().slice(0, 10);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !casa || !date || lines.length === 0) {
      setValidationError(true);
      setStatus("idle");
      return;
    }
    setValidationError(false);
    setStatus("submitting");

    const result = await submitOrder({
      submissionId: crypto.randomUUID(),
      service,
      name: name.trim(),
      casa,
      dateNeeded: date,
      items: summaryLines.map(({ label, price }) => ({ label, price })),
      total,
      currency: "USD",
      notes: notes || "",
      locale,
    });

    setStatus(result?.ok ? "success" : "error");
  };

  return (
    <div id="checkout" className="flex flex-col gap-6 scroll-mt-24" data-aos="fade-up">
      <div className="border-b border-[#222E2C]/15 pb-4">
        <div className="flex items-center gap-2 w-fit border border-[#222E2C]/20 rounded-full px-4 py-1.5 mb-3">
          <span className="font-sans text-xs text-[#222E2C]">{t("orderForm.pill")}</span>
        </div>
        <h2 className="font-sans font-semibold text-xl md:text-2xl text-[#222E2C] tracking-tight">
          {t("orderForm.heading")}
        </h2>
        <p className="font-sans text-sm text-[#222E2C]/50 mt-1 max-w-2xl">{t("orderForm.subheading")}</p>
      </div>

      <div className="bg-[#213B2F] rounded-2xl px-6 md:px-10 py-8 md:py-10 flex flex-col gap-8">

        {/* Summary */}
        <div className="flex flex-col gap-3">
          <h3 className="font-sans font-semibold text-sm text-[#D8DDB8]">{t("orderForm.summaryHeading")}</h3>
          {summaryLines.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#D8DDB8]/25 px-4 py-5 text-center">
              <p className="font-sans text-sm text-[#D8DDB8]/50 italic">{t("orderForm.emptyCart")}</p>
            </div>
          ) : (
            <div className="rounded-xl bg-white/8 divide-y divide-[#D8DDB8]/10 overflow-hidden">
              {summaryLines.map((line, i) => (
                <div key={i} className="flex items-center justify-between gap-4 px-4 py-2.5">
                  <span className="font-sans text-sm text-[#D8DDB8]/85">{line.label}</span>
                  <span className="font-sans font-medium text-sm text-[#D8DDB8] whitespace-nowrap">
                    {line.price ? `$${line.price.toLocaleString("en-US")}` : "—"}
                  </span>
                </div>
              ))}
              <div className="flex items-center justify-between gap-4 px-4 py-3 bg-white/10">
                <span className="font-sans font-semibold text-sm text-[#D8DDB8]">{t("orderForm.total")}</span>
                <span className="font-sans font-semibold text-base text-[#D8DDB8]">
                  ${total.toLocaleString("en-US")}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FieldInput
            icon={TbUser}
            label={t("orderForm.name")}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("orderForm.namePlaceholder")}
          />

          <label className="flex flex-col gap-1.5">
            <span className="font-sans text-xs font-medium text-[#D8DDB8]/70">{t("orderForm.casa")}</span>
            <Select value={casa} onValueChange={setCasa}>
              <SelectTrigger
                className="w-full h-auto pl-10 pr-4 py-3 rounded-xl bg-white border border-white/0 shadow-sm font-sans text-sm text-[#222E2C] data-[placeholder]:text-[#222E2C]/35 focus:outline-none focus:ring-2 focus:ring-[#D8DDB8]/40 focus:border-transparent transition-all duration-200 relative [&>span]:pl-0"
              >
                <TbHome2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#222E2C]/35 pointer-events-none" />
                <SelectValue placeholder={t("orderForm.casaPlaceholder")} />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-[#222E2C]/10 bg-white shadow-lg">
                {casaOptions.map((opt) => (
                  <SelectItem
                    key={opt.value}
                    value={opt.value}
                    className="font-sans text-sm text-[#222E2C] rounded-lg cursor-pointer focus:bg-[#213B2F]/8 focus:text-[#213B2F] data-[state=checked]:font-medium"
                  >
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>

          <FieldInput
            icon={TbCalendarEvent}
            label={t("orderForm.date")}
            type="date"
            min={todayIso}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <FieldTextarea
          icon={TbNotes}
          label={t("orderForm.notes")}
          rows={3}
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder={t("orderForm.notesPlaceholder")}
        />

        {validationError && (
          <div className="flex items-center gap-2 rounded-xl bg-red-500/15 border border-red-400/30 px-4 py-3">
            <TbAlertCircle size={16} className="text-red-300 shrink-0" />
            <p className="font-sans text-sm text-red-200">{t("orderForm.validation")}</p>
          </div>
        )}
        {status === "success" && (
          <div className="flex items-center gap-2 rounded-xl bg-[#D8DDB8]/15 border border-[#D8DDB8]/30 px-4 py-3">
            <TbCheck size={16} className="text-[#D8DDB8] shrink-0" />
            <p className="font-sans text-sm text-[#D8DDB8] font-medium">{t("orderForm.success")}</p>
          </div>
        )}
        {status === "error" && (
          <div className="flex items-center gap-2 rounded-xl bg-red-500/15 border border-red-400/30 px-4 py-3">
            <TbAlertCircle size={16} className="text-red-300 shrink-0" />
            <p className="font-sans text-sm text-red-200">{t("orderForm.error")}</p>
          </div>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={status === "submitting"}
          className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#D8DDB8] font-sans font-medium text-sm text-[#213B2F] hover:bg-[#D8DDB8]/90 shadow-sm hover:shadow transition-all duration-200 w-fit disabled:opacity-60"
        >
          {status === "submitting" && <TbLoader2 size={16} className="animate-spin" />}
          {status === "submitting" ? t("orderForm.submitting") : t("orderForm.submit")}
        </button>
      </div>
    </div>
  );
}

const inputBase = "w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-white/0 shadow-sm font-sans text-sm text-[#222E2C] placeholder:text-[#222E2C]/35 focus:outline-none focus:ring-2 focus:ring-[#D8DDB8]/40 transition-all duration-200";

function FieldInput({ icon: Icon, label, ...props }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-sans text-xs font-medium text-[#D8DDB8]/70">{label}</span>
      <div className="relative">
        <Icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#222E2C]/35 pointer-events-none" />
        <input {...props} className={inputBase} />
      </div>
    </label>
  );
}

function FieldTextarea({ icon: Icon, label, ...props }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-sans text-xs font-medium text-[#D8DDB8]/70">{label}</span>
      <div className="relative">
        <Icon size={16} className="absolute left-3.5 top-3.5 text-[#222E2C]/35 pointer-events-none" />
        <textarea {...props} className={`${inputBase} resize-none`} />
      </div>
    </label>
  );
}
