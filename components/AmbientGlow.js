import ScrollParallax from "./ScrollParallax";

export default function AmbientGlow() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <ScrollParallax speed={0.18} mode="scroll" className="absolute inset-0">
        <div
          className="absolute -left-52 top-[-16%] h-[820px] w-[820px] rounded-full opacity-60 blur-[130px]"
          style={{
            background: "radial-gradient(circle, rgba(123,163,204,0.75), transparent 68%)",
            animation: "drift-a 22s ease-in-out infinite",
          }}
        />
      </ScrollParallax>

      <ScrollParallax speed={-0.12} mode="scroll" className="absolute inset-0">
        <div
          className="absolute -right-40 top-[8%] h-[680px] w-[680px] rounded-full opacity-55 blur-[120px]"
          style={{
            background: "radial-gradient(circle, rgba(71,100,152,0.7), transparent 68%)",
            animation: "drift-b 27s ease-in-out infinite",
          }}
        />
      </ScrollParallax>

      <ScrollParallax speed={0.28} mode="scroll" className="absolute inset-0">
        <div
          className="absolute left-1/4 top-[55%] h-[700px] w-[700px] rounded-full opacity-45 blur-[140px]"
          style={{
            background: "radial-gradient(circle, rgba(123,163,204,0.6), transparent 70%)",
            animation: "drift-c 25s ease-in-out infinite",
          }}
        />
      </ScrollParallax>

      <ScrollParallax speed={-0.2} mode="scroll" className="absolute inset-0">
        <div
          className="absolute right-[10%] bottom-[-10%] h-[560px] w-[560px] rounded-full opacity-40 blur-[120px]"
          style={{
            background: "radial-gradient(circle, rgba(150,180,215,0.55), transparent 70%)",
            animation: "drift-a 30s ease-in-out infinite reverse",
          }}
        />
      </ScrollParallax>
    </div>
  );
}
