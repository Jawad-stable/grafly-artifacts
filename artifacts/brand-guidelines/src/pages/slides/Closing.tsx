import { Sparkle, Squiggle, Star4 } from "../../components/decorations";

const base = import.meta.env.BASE_URL;

export default function Closing() {
  return (
    <div className="relative w-screen h-screen overflow-hidden slide-bg">
      <Sparkle className="absolute left-[10vw] top-[14vh] w-[2.2vw] h-[2.2vw]" color="#E3ED43" />
      <Sparkle className="absolute right-[14vw] top-[16vh] w-[1.6vw] h-[1.6vw]" color="#FF7BD0" />
      <Star4 className="absolute right-[8vw] top-[28vh] w-[2vw] h-[2vw] -rotate-12" color="#00A4FA" />
      <Sparkle className="absolute left-[8vw] bottom-[16vh] w-[1.4vw] h-[1.4vw]" color="#00A4FA" />
      <Star4 className="absolute left-[24vw] bottom-[18vh] w-[1.4vw] h-[1.4vw]" color="#FF7BD0" />
      <Squiggle
        className="absolute right-[6vw] bottom-[16vh] w-[24vw] h-[3vh] -rotate-3 opacity-55"
        color="#21263F"
        width={320}
        height={32}
      />

      <div
        className="absolute left-[-12vw] top-[20vh] w-[42vw] h-[42vw] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(0,164,250,0.20) 0%, rgba(0,164,250,0) 65%)",
        }}
      />

      <div className="relative h-full w-full grid grid-cols-[1.05fr_0.95fr] items-center px-[7vw]">
        <div className="flex flex-col justify-center gap-[3vh]">
          <img
            src={`${base}brand/wordmark_primary.png`}
            crossOrigin="anonymous"
            alt="Grafly"
            className="w-[28vw] h-auto -ml-[0.5vw]"
          />

          <h1 className="font-display font-black text-ink text-[7vw] leading-[0.92] tracking-tight max-w-[46vw]">
            Ink Outside{" "}
            <span className="relative inline-block">
              <span className="absolute inset-x-[-0.6vw] inset-y-[0.6vh] bg-brand-yellow/70 -rotate-[1deg] rounded-[0.6vw]" />
              <span className="relative">The Box.</span>
            </span>
          </h1>

          <p className="font-display font-medium text-ink/70 text-[1.5vw] leading-[1.45] max-w-[40vw]">
            That&apos;s the brand. Reuse it, ship it, riff on it — just keep the
            spirit. Questions? Talk to the design team.
          </p>

          <div className="flex items-center gap-[1vw] mt-[1vh] flex-wrap font-display text-[1vw] text-ink/55 tracking-[0.3em] uppercase">
            <span>v1 · 2026</span>
            <span className="inline-block w-[0.6vw] h-[0.6vw] rounded-full bg-ink/30" />
            <span>brand@grafly.app</span>
          </div>
        </div>

        <div className="relative h-full flex items-center justify-center">
          <div
            className="absolute w-[28vw] h-[28vw] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(227,237,67,0.30) 0%, rgba(227,237,67,0) 65%)",
            }}
          />
          <img
            src={`${base}brand/celebrate.png`}
            crossOrigin="anonymous"
            alt="Grafly mascot celebrating"
            className="relative w-[32vw] h-auto drop-shadow-[0_2vw_3vw_rgba(33,38,63,0.18)]"
          />
        </div>
      </div>
    </div>
  );
}
