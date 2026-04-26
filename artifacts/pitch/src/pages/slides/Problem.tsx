import {
  Sparkle,
  Cursor,
  BezierPath,
  Heart,
} from "../../components/decorations";

const base = import.meta.env.BASE_URL;

export default function Problem() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-cream">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, #F8F4DA 0%, #F2EDC8 100%)",
        }}
      />

      <BezierPath className="absolute right-[3vw] top-[10vh] w-[22vw] h-[8vh] opacity-55 rotate-[10deg]" />
      <Sparkle className="absolute left-[44vw] top-[14vh] w-[2vw] h-[2vw]" color="#FF7BD0" />
      <Sparkle className="absolute right-[8vw] bottom-[14vh] w-[1.6vw] h-[1.6vw]" color="#E3ED43" />
      <Heart className="absolute left-[4vw] bottom-[18vh] w-[1.8vw] h-[1.8vw] -rotate-[12deg]" color="#FFC2E6" />
      <Cursor className="absolute right-[14vw] top-[18vh] w-[2vw] h-[2.4vw] rotate-[14deg]" color="#21263F" />

      <img
        src={`${base}brand/wordmark_primary.png`}
        crossOrigin="anonymous"
        alt="Grafly"
        className="absolute top-[5vh] left-[6vw] h-[3.4vh] w-auto"
      />

      <div className="absolute top-[6vh] right-[6vw] font-display text-ink/50 text-[1.4vw] tracking-[0.35em] uppercase">
        The Problem
      </div>

      <div className="relative h-full w-full grid grid-cols-[1.4fr_1fr] items-center px-[7vw]">
        <div className="flex flex-col justify-center gap-[4vh]">
          <div className="flex items-center gap-[1vw]">
            <span className="inline-block w-[5vw] h-[0.6vh] bg-brand-pink rounded-full" />
            <span className="font-display font-bold text-brand-pink text-[1.6vw] tracking-wide uppercase">
              Why we built Grafly
            </span>
          </div>
          <h1 className="font-display font-black text-ink text-[5vw] leading-[1.05] tracking-tight max-w-[52vw] text-balance">
            Design education is{" "}
            <span className="relative inline-block">
              <span className="absolute inset-x-[-0.4vw] inset-y-[0.4vh] bg-brand-pink/55 -rotate-[1deg] rounded-[0.4vw]" />
              <span className="relative">passive,</span>
            </span>{" "}
            <span className="relative inline-block">
              <span className="absolute inset-x-[-0.4vw] inset-y-[0.4vh] bg-brand-yellow/70 rotate-[1deg] rounded-[0.4vw]" />
              <span className="relative">theory-heavy,</span>
            </span>{" "}
            and intimidating.
          </h1>
          <p className="font-display font-medium text-ink/70 text-[2vw] leading-[1.35] max-w-[42vw] text-pretty">
            People watch lectures, read PDFs, and never actually open the canvas.
          </p>
        </div>

        <div className="relative h-full flex items-end justify-center pb-[6vh]">
          <div
            className="absolute bottom-[8vh] w-[22vw] h-[22vw] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(255,123,208,0.22) 0%, rgba(255,123,208,0) 70%)",
            }}
          />
          <img
            src={`${base}brand/think.png`}
            crossOrigin="anonymous"
            alt="Grafly mascot thinking"
            className="relative w-[26vw] h-auto drop-shadow-[0_2vw_3vw_rgba(33,38,63,0.18)]"
          />
        </div>
      </div>
    </div>
  );
}
