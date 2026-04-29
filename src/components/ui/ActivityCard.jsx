import { TbBrandWhatsapp, TbUsers, TbMapPin, TbClock, TbStar } from "react-icons/tb";

const FEATURE_ICONS = [TbStar, TbUsers, TbMapPin, TbClock, TbUsers];

export default function ActivityCard({ activity }) {
  const {
    title,
    description,
    features = [],
    pricing = [],
    commission,
    contactName,
    whatsapp,
  } = activity;

  return (
    <div className="bg-[#f4e9dc] rounded-2xl px-8 pt-10 pb-8 flex flex-col gap-0 h-full">

      {/* Title + description */}
      <div className="pb-6 border-b border-[#381d14]/15 flex flex-col gap-2">
        <h3 className="font-sans font-medium text-xl text-[#381d14] tracking-tight">
          {title}
        </h3>
        <p className="font-sans text-sm text-[#381d14]/50 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Features */}
      <div className="py-6 border-b border-[#381d14]/15 flex flex-col gap-3">
        {features.map((feat, i) => {
          const Icon = FEATURE_ICONS[i % FEATURE_ICONS.length];
          return (
            <div key={i} className="flex items-center gap-3">
              <div className="bg-[#381d14]/10 rounded-xl size-8 flex items-center justify-center shrink-0">
                <Icon size={16} className="text-[#381d14]/70" />
              </div>
              <span className="font-sans text-sm text-[#381d14]/70">{feat}</span>
            </div>
          );
        })}
      </div>

      {/* Pricing */}
      <div className="py-6 border-b border-[#381d14]/15 flex flex-col gap-3">
        {pricing.map((row, i) => (
          <div key={i} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
            <span className="font-sans text-sm text-[#381d14]/70">{row.label}</span>
            <span className="font-sans font-medium text-sm text-[#381d14]">{row.price}</span>
          </div>
        ))}
        {commission && (
          <p className="font-sans text-xs text-[#381d14]/40 italic mt-1">{commission}</p>
        )}
      </div>

      {/* Contact */}
      <div className="pt-6 flex items-center justify-between gap-4">
        <span className="font-sans font-medium text-sm text-[#381d14]">{contactName}</span>
        {whatsapp && (
          <a
            href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-[#381d14]/70 hover:text-[#381d14] transition-colors duration-200"
          >
            <TbBrandWhatsapp size={16} />
            <span className="font-sans">{whatsapp}</span>
          </a>
        )}
      </div>

    </div>
  );
}
