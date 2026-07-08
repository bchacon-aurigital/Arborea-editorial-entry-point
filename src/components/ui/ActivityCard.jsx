import { TbUsers, TbMapPin, TbClock, TbStar } from "react-icons/tb";

const FEATURE_ICONS = [TbStar, TbUsers, TbMapPin, TbClock, TbUsers];

const ARBOREA_WHATSAPP = "50685011042";

export default function ActivityCard({ activity }) {
  const { title, description, features = [] } = activity;

  const waMessage = encodeURIComponent(`Hi! I'm interested in: *${title}*`);
  const waUrl = `https://wa.me/${ARBOREA_WHATSAPP}?text=${waMessage}`;

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-[#4B4D40] rounded-2xl px-8 pt-10 pb-8 flex flex-col gap-0 h-full cursor-pointer hover:bg-[#3E4035] transition-colors duration-200"
    >
      {/* Title + description */}
      <div className="pb-6 border-b border-white/15 flex flex-col gap-2">
        <h3 className="font-sans font-medium text-xl text-white tracking-tight">
          {title}
        </h3>
        <p className="font-sans text-sm text-white/60 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Features */}
      <div className="py-6 flex flex-col gap-3">
        {features.map((feat, i) => {
          const Icon = FEATURE_ICONS[i % FEATURE_ICONS.length];
          return (
            <div key={i} className="flex items-center gap-3">
              <div className="bg-white/10 rounded-xl size-8 flex items-center justify-center shrink-0">
                <Icon size={16} className="text-white/70" />
              </div>
              <span className="font-sans text-sm text-white/70">{feat}</span>
            </div>
          );
        })}
      </div>
    </a>
  );
}
