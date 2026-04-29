import { Sparkle, Squiggle, Star4 } from "../../components/decorations";

const base = import.meta.env.BASE_URL;

export default function Cover() {
  return (
    <div className="relative w-screen h-screen overflow-hidden slide-bg">
      <Sparkle className="absolute left-[8vw] top-[12vh] w-[2vw] h-[2vw]" color="#E3ED43" />
      <Sparkle className="absolute left-[36vw] top-[18vh] w-[1.4vw] h-[1.4vw]" color="#FF7BD0" />
      <Sparkle className="absolute right-[12vw] top-[14vh] w-[1.6vw] h-[1.6vw]" color="#00A4FA" />
      <Star4 className="absolute right-[7vw] top-[24vh] w-[1.6vw] h-[1.6vw] -rotate-12" color="#E3ED43" />
      <Squiggle
        className="absolute left-[5vw] bottom-[18vh] w-[20vw] h-[3vh] -rotate-3 opacity-60"
        color="#21263F"
        width={300}
        height={32}
      />
      <Sparkle className="absolute left-[10vw] bottom-[10vh] w-[1.4vw] h-[1.4vw]" color="#FF7BD0" />

      <div
        className="absolute right-[-8vw] top-[18vh] w-[40vw] h-[40vw] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(0,164,250,0.20) 0%, rgba(0,164,250,0) 65%)",
        }}
      />

      <div className="relative h-full w-full grid grid-cols-[1.05fr_0.95fr] items-center px-[7vw]">
        <div className="flex flex-col justify-center gap-[2.5vh]">
          <div className="flex items-center gap-[1vw] text-ink/60 font-display text-[1.3vw] tracking-[0.4em] uppercase">
            <span className="inline-block w-[3vw] h-[2px] bg-ink/40" />
            <span>Brand Guidelines · v1</span>
          </div>

          <img
            src={`${base}brand/wordmark_primary.png`}
            crossOrigin="anonymous"
            alt="Grafly"
            className="w-[36vw] h-auto -ml-[0.5vw]"
          />

          <p className="font-display font-bold text-ink text-[3.2vw] leading-[1.05] tracking-tight max-w-[42vw] text-balance">
            Visual identity &amp;{" "}
            <span className="relative inline-block">
              <span className="absolute inset-x-[-0.5vw] inset-y-[0.4vh] bg-brand-yellow/70 -rotate-[1deg] rounded-[0.5vw]" />
              <span className="relative">brand book.</span>
            </span>
          </p>

          <div className="flex items-center gap-[1.4vw] mt-[1vh]">
            <span className="inline-block w-[1.2vw] h-[1.2vw] rounded-full bg-brand-blue" />
            <span className="font-display font-medium text-[1.5vw] text-ink/70">
              Ink Outside The Box.
            </span>
          </div>
        </div>

        <div className="relative h-full flex items-center justify-center">
          <img
            src={`${base}brand/idle.png`}
            crossOrigin="anonymous"
            alt="Grafly mascot"
            className="relative w-[34vw] h-auto drop-shadow-[0_2vw_3vw_rgba(33,38,63,0.18)]"
          />
        </div>
      </div>

      <div className="absolute bottom-[4vh] left-[6vw] font-display text-[1vw] text-ink/50 tracking-[0.3em] uppercase">
        Grafly · A field guide to our visual world
      </div>
    </div>
  );
}
