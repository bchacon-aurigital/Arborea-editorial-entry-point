export default function Loading() {
  return (
    <div className="fixed inset-0 bg-[#EDE5D8] flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-6">
        <object
          type="image/svg+xml"
          data="/assets/logos/LogoHero.svg"
          aria-label="Arbórea Experiences"
          className="w-[220px] max-w-full h-auto pointer-events-none animate-pulse"
        />
      </div>
    </div>
  );
}
