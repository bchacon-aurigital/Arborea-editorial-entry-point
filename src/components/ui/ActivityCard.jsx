import { TbUsers, TbMapPin, TbClock, TbStar } from "react-icons/tb";

const FEATURE_ICONS = [TbStar, TbUsers, TbMapPin, TbClock, TbUsers];

const ARBOREA_WHATSAPP = "50685011042";

export default function ActivityCard({ activity }) {
  const { title, description, features = [] } = activity;

  return (
    <a
      href={`https://wa.me/${ARBOREA_WHATSAPP}`}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-[#f4e9dc] rounded-2xl px-8 pt-10 pb-8 flex flex-col gap-0 h-full cursor-pointer hover:bg-[#ecdcc9] transition-colors duration-200"
    >
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
      <div className="py-6 flex flex-col gap-3">
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
    </a>
  );
}
