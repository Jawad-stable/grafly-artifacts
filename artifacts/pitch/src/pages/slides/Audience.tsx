import {
  Sparkle,
  Cursor,
  BezierPath,
  Heart,
  ColorWheel,
} from "../../components/decorations";

const base = import.meta.env.BASE_URL;

export default function Audience() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-cream">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(155deg, #F8F4DA 0%, #F2EDC8 100%)",
        }}
      />

      <BezierPath className="absolute left-[8vw] bottom-[14vh] w-[22vw] h-[8vh] opacity-55 rotate-[8deg]" />
      <Sparkle className="absolute left-[40vw] top-[14vh] w-[2vw] h-[2vw]" color="#00A4FA" />
      <Sparkle className="absolute right-[8vw] top-[20vh] w-[1.6vw] h-[1.6vw]" color="#E3ED43" />
      <Heart className="absolute right-[10vw] bottom-[18vh] w-[1.8vw] h-[1.8vw] rotate-[10deg]" color="#FF7BD0" />
      <Cursor className="absolute right-[5vw] top-[42vh] w-[2vw] h-[2.4vw] -rotate-[16deg]" color="#21263F" />
      <ColorWheel className="absolute right-[4vw] bottom-[8vh] w-[5vw] h-[5vw] rotate-[10deg]" />

      <img
        src={`${base}brand/wordmark_primary.png`}
        crossOrigin="anonymous"
        alt="Grafly"
        className="absolute top-[5vh] left-[6vw] h-[3.4vh] w-auto"
      />

      <div className="absolute top-[6vh] right-[6vw] font-display text-ink/50 text-[1.4vw] tracking-[0.35em] uppercase">
        Who it's for
      </div>

      <div className="relative h-full w-full grid grid-cols-[0.9fr_1.4fr] items-center px-[7vw]">
        <div className="relative h-full flex items-center justify-center">
          <div
            className="absolute w-[26vw] h-[26vw] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(0,164,250,0.22) 0%, rgba(0,164,250,0) 70%)",
            }}
          />
          <img
            src={`${base}brand/cool_yellow.png`}
            crossOrigin="anonymous"
            alt="Grafly mascot in shades"
            className="relative w-[28vw] h-auto drop-shadow-[0_2vw_3vw_rgba(33,38,63,0.18)]"
          />
        </div>

        <div className="flex flex-col justify-center gap-[3.5vh]">
          <div className="flex items-center gap-[1vw]">
            <span className="inline-block w-[5vw] h-[0.6vh] bg-brand-blue rounded-full" />
            <span className="font-display font-bold text-brand-blue text-[1.6vw] tracking-wide uppercase">
              Who it's for
            </span>
          </div>
          <h1 className="font-display font-black text-ink text-[4.2vw] leading-[1.05] tracking-tight max-w-[48vw] text-balance">
            Aspiring{" "}
            <span className="relative inline-block">
              <span className="absolute inset-x-[-0.4vw] inset-y-[0.4vh] bg-brand-blue/30 -rotate-[1deg] rounded-[0.4vw]" />
              <span className="relative">designers,</span>
            </span>{" "}
            students, and career-switchers
          </h1>
          <p className="font-display font-medium text-ink/75 text-[2.2vw] leading-[1.3] max-w-[48vw] text-pretty">
            who want to actually <span className="italic font-bold text-ink">do</span> design,
            not just read about it.
          </p>
        </div>
      </div>
    </div>
  );
}
