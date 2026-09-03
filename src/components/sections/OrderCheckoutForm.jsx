"use client";

import { useMemo, useState } from "react";
import { useI18n } from "@/app/context/I18nContext";
import { properties } from "@/data/properties";
import { submitOrder } from "@/lib/orderApi";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { TbCheck, TbLoader2, TbUser, TbHome2, TbCalendarEvent, TbNotes, TbAlertCircle } from "react-icons/tb";

const THEMES = {
  light: {
    panel: "bg-[#213B2F]",
    heading: "text-[#D8DDB8]",
    textPrimary: "text-[#D8DDB8]/85",
    textMuted: "text-[#D8DDB8]/75",
    textFaint: "text-[#D8DDB8]/50",
    textFainter: "text-[#D8DDB8]/45",
    border: "border-[#D8DDB8]/15",
    dashedBorder: "border-[#D8DDB8]/25",
    divide: "divide-[#D8DDB8]/10",
    checkIcon: "text-[#D8DDB8]/45",
    fieldLabel: "text-[#D8DDB8]/70",
    inputBase: "w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/10 shadow-sm font-sans text-sm text-[#D8DDB8] placeholder:text-[#D8DDB8]/40 data-[placeholder]:text-[#D8DDB8]/40 focus:outline-none focus:ring-2 focus:ring-[#D8DDB8]/40 focus:border-transparent transition-all duration-200",
    inputIcon: "text-[#D8DDB8]/40",
    selectContent: "rounded-xl border-[#222E2C]/10 bg-[#EDE5D8] shadow-lg",
    selectItem: "font-sans text-sm text-[#222E2C] rounded-lg cursor-pointer focus:bg-[#213B2F]/8 focus:text-[#213B2F] data-[state=checked]:font-medium",
    successBg: "bg-[#D8DDB8]/15 border-[#D8DDB8]/30",
    successText: "text-[#D8DDB8]",
    submitBtn: "bg-[#D8DDB8] text-[#213B2F] hover:bg-[#D8DDB8]/90",
  },
  dark: {
    panel: "bg-[#241606] border border-[#C9974F]/15",
    heading: "text-[#F3E6CE]",
    textPrimary: "text-[#F3E6CE]/85",
    textMuted: "text-[#F3E6CE]/70",
    textFaint: "text-[#F3E6CE]/50",
    textFainter: "text-[#F3E6CE]/45",
    border: "border-[#C9974F]/15",
    dashedBorder: "border-[#C9974F]/25",
    divide: "divide-[#C9974F]/10",
    checkIcon: "text-[#C9974F]/50",
    fieldLabel: "text-[#F3E6CE]/60",
    inputBase: "w-full pl-10 pr-4 py-3 rounded-xl bg-[#2E1D0B] border border-[#C9974F]/15 shadow-sm font-sans text-sm text-[#F3E6CE] placeholder:text-[#F3E6CE]/35 data-[placeholder]:text-[#F3E6CE]/35 focus:outline-none focus:ring-2 focus:ring-[#C9974F]/40 focus:border-transparent transition-all duration-200",
    inputIcon: "text-[#F3E6CE]/35",
    selectContent: "rounded-xl border-[#C9974F]/15 bg-[#2E1D0B] shadow-lg",
    selectItem: "font-sans text-sm text-[#F3E6CE] rounded-lg cursor-pointer focus:bg-[#C9974F]/15 focus:text-[#C9974F] data-[state=checked]:font-medium",
    successBg: "bg-[#C9974F]/15 border-[#C9974F]/30",
    successText: "text-[#C9974F]",
    submitBtn: "bg-[#8B5A3C] text-[#F3E6CE] hover:bg-[#8B5A3C]/90",
  },
};

export default function OrderCheckoutForm({ service, lines, infoLines = [], total, notes, onNotesChange, compact = false, extra = null, dark = false }) {
  const { t, locale } = useI18n();
  const c = dark ? THEMES.dark : THEMES.light;

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
      {!compact && (
        <div className="border-b border-[#222E2C]/15 pb-4">
          <div className="flex items-center gap-2 w-fit border border-[#222E2C]/20 rounded-full px-4 py-1.5 mb-3">
            <span className="font-sans text-xs text-[#222E2C]">{t("orderForm.pill")}</span>
          </div>
          <h2 className="font-sans font-semibold text-xl md:text-2xl text-[#222E2C] tracking-tight">
            {t("orderForm.heading")}
          </h2>
          <p className="font-sans text-sm text-[#222E2C]/50 mt-1 max-w-2xl">{t("orderForm.subheading")}</p>
        </div>
      )}

      <div className={`${c.panel} rounded-2xl flex flex-col gap-8 ${compact ? "px-6 py-6" : "px-6 md:px-10 py-8 md:py-10"}`}>

        {extra && (
          <div className="pb-8 border-b border-white/10">{extra}</div>
        )}

        {/* Summary — priced items only */}
        <div className="flex flex-col gap-3">
          <h3 className={`font-sans font-semibold text-sm ${c.heading}`}>{t("orderForm.summaryHeading")}</h3>
          {lines.length === 0 ? (
            <div className={`rounded-xl border border-dashed ${c.dashedBorder} px-4 py-5 text-center`}>
              <p className={`font-sans text-sm italic ${c.textFaint}`}>{t("orderForm.emptyCart")}</p>
            </div>
          ) : (
            <div className={`rounded-xl bg-white/8 divide-y ${c.divide} overflow-hidden`}>
              {lines.map((line, i) => (
                <div key={i} className="flex items-center justify-between gap-4 px-4 py-2.5">
                  <span className={`font-sans text-sm ${c.textPrimary}`}>{line.label}</span>
                  <span className={`font-sans font-medium text-sm whitespace-nowrap ${c.heading}`}>
                    ${(line.price || 0).toLocaleString("en-US")}
                  </span>
                </div>
              ))}
              <div className="flex items-center justify-between gap-4 px-4 py-3 bg-white/10">
                <span className={`font-sans font-semibold text-sm ${c.heading}`}>{t("orderForm.total")}</span>
                <span className={`font-sans font-semibold text-base ${c.heading}`}>
                  ${total.toLocaleString("en-US")}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Selections & preferences — no price, not part of the total */}
        {infoLines.length > 0 && (
          <div className="flex flex-col gap-3">
            <h3 className={`font-sans font-semibold text-sm ${c.heading}`}>{t("orderForm.detailsHeading")}</h3>
            <div className={`rounded-xl border ${c.border} px-4 py-3 flex flex-col gap-2`}>
              {infoLines.map((line, i) => (
                <div key={i} className="flex items-start gap-2">
                  <TbCheck size={14} className={`shrink-0 mt-0.5 ${c.checkIcon}`} />
                  <span className={`font-sans text-sm leading-relaxed ${c.textMuted}`}>{line.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Fields */}
        <div className={`grid grid-cols-1 gap-4 ${compact ? "" : "sm:grid-cols-3"}`}>
          <FieldInput
            icon={TbUser}
            label={t("orderForm.name")}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("orderForm.namePlaceholder")}
            c={c}
          />

          <label className="flex flex-col gap-1.5">
            <span className={`font-sans text-xs font-medium ${c.fieldLabel}`}>{t("orderForm.casa")}</span>
            <Select value={casa} onValueChange={setCasa}>
              <SelectTrigger
                className={`w-full h-auto pl-10 pr-4 py-3 rounded-xl shadow-sm font-sans text-sm relative [&>span]:pl-0 transition-all duration-200 ${c.inputBase}`}
              >
                <TbHome2 size={16} className={`absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none ${c.inputIcon}`} />
                <SelectValue placeholder={t("orderForm.casaPlaceholder")} />
              </SelectTrigger>
              <SelectContent className={c.selectContent}>
                {casaOptions.map((opt) => (
                  <SelectItem
                    key={opt.value}
                    value={opt.value}
                    className={c.selectItem}
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
            c={c}
          />
        </div>

        <FieldTextarea
          icon={TbNotes}
          label={t("orderForm.notes")}
          rows={3}
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder={t("orderForm.notesPlaceholder")}
          c={c}
        />

        {validationError && (
          <div className="flex items-center gap-2 rounded-xl bg-red-500/15 border border-red-400/30 px-4 py-3">
            <TbAlertCircle size={16} className="text-red-300 shrink-0" />
            <p className="font-sans text-sm text-red-200">{t("orderForm.validation")}</p>
          </div>
        )}
        {status === "success" && (
          <div className={`flex items-center gap-2 rounded-xl border px-4 py-3 ${c.successBg}`}>
            <TbCheck size={16} className={`shrink-0 ${c.successText}`} />
            <p className={`font-sans text-sm font-medium ${c.successText}`}>{t("orderForm.success")}</p>
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
          className={`flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-sans font-medium text-sm shadow-sm hover:shadow transition-all duration-200 w-fit disabled:opacity-60 ${c.submitBtn}`}
        >
          {status === "submitting" && <TbLoader2 size={16} className="animate-spin" />}
          {status === "submitting" ? t("orderForm.submitting") : t("orderForm.submit")}
        </button>
      </div>
    </div>
  );
}

function FieldInput({ icon: Icon, label, c, ...props }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className={`font-sans text-xs font-medium ${c.fieldLabel}`}>{label}</span>
      <div className="relative">
        <Icon size={16} className={`absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none ${c.inputIcon}`} />
        <input {...props} className={`${c.inputBase} ${props.type === "date" ? "[color-scheme:dark]" : ""}`} />
      </div>
    </label>
  );
}

function FieldTextarea({ icon: Icon, label, c, ...props }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className={`font-sans text-xs font-medium ${c.fieldLabel}`}>{label}</span>
      <div className="relative">
        <Icon size={16} className={`absolute left-3.5 top-3.5 pointer-events-none ${c.inputIcon}`} />
        <textarea {...props} className={`${c.inputBase} resize-none`} />
      </div>
    </label>
  );
}
