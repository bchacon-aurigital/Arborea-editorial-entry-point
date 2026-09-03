import { TbPhoto, TbBrandWhatsapp } from "react-icons/tb";

const ARBOREA_WHATSAPP = "50685011042";

export default function ActivityCard({ activity }) {
  const { title, description, image } = activity;

  const waMessage = encodeURIComponent(`Hi! I'm interested in: *${title}*`);
  const waUrl = `https://wa.me/${ARBOREA_WHATSAPP}?text=${waMessage}`;

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-[#4B4D40] rounded-2xl overflow-hidden flex flex-col h-full cursor-pointer hover:bg-[#3E4035] transition-colors duration-200"
    >
      {/* Photo */}
      <div className="h-52 bg-white/10 flex items-center justify-center shrink-0 overflow-hidden">
        {image ? (
          <img src={image} alt={title} className="w-full h-full object-cover" />
        ) : (
          <TbPhoto size={28} className="text-white/30" />
        )}
      </div>

      {/* Title + description */}
      <div className="px-6 pt-5 pb-4 flex flex-col gap-2 flex-1">
        <h3 className="font-sans font-medium text-xl text-white tracking-tight">
          {title}
        </h3>
        <p className="font-sans text-sm text-white/60 leading-relaxed">
          {description}
        </p>
      </div>

      {/* WhatsApp CTA */}
      <div className="px-6 pb-6 pt-5 border-t border-white/10 flex items-center justify-between">
        <span className="font-sans text-sm font-medium text-white/50">Ask about this tour</span>
        <div className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 transition-colors duration-200 rounded-full px-3.5 py-2">
          <TbBrandWhatsapp size={14} className="text-[#D8DDB8]" />
          <span className="font-sans text-xs font-semibold text-[#D8DDB8]">WhatsApp</span>
        </div>
      </div>
    </a>
  );
}
