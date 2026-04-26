import {
  Sparkle,
  Cursor,
  BezierPath,
  Heart,
  ColorSwatchTrio,
} from "../../components/decorations";

const base = import.meta.env.BASE_URL;

export default function Title() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-cream">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(160deg, #FBF7E0 0%, #F4EFCC 100%)",
        }}
      />

      <BezierPath className="absolute left-[6vw] top-[12vh] w-[24vw] h-[8vh] opacity-60 -rotate-[6deg]" />
      <Sparkle className="absolute left-[40vw] top-[14vh] w-[2vw] h-[2vw]" color="#E3ED43" />
      <Sparkle className="absolute right-[18vw] bottom-[16vh] w-[1.6vw] h-[1.6vw]" color="#FF7BD0" />
      <Heart className="absolute right-[6vw] top-[14vh] w-[2vw] h-[2vw] rotate-[12deg]" color="#FF7BD0" />
      <Cursor className="absolute left-[5vw] bottom-[10vh] w-[2.4vw] h-[2.8vw] -rotate-[18deg]" color="#21263F" />
      <ColorSwatchTrio className="absolute right-[4vw] bottom-[8vh] w-[7vw] h-[5vh] rotate-[10deg]" />

      <div className="relative h-full w-full grid grid-cols-[1.05fr_0.95fr] items-center px-[7vw]">
        <div className="flex flex-col justify-center gap-[3vh]">
          <div className="flex items-center gap-[1vw] text-ink/60 font-display text-[1.5vw] tracking-[0.4em] uppercase">
            <span className="inline-block w-[3vw] h-[2px] bg-ink/40" />
            <span>MVP demo</span>
          </div>
          <img
            src={`${base}brand/wordmark_primary.png`}
            crossOrigin="anonymous"
            alt="Grafly"
            className="w-[42vw] h-auto -ml-[1vw]"
          />
          <p className="font-display font-bold text-ink text-[3.4vw] leading-[1.05] tracking-tight max-w-[44vw] text-balance">
            Ink Outside Of The{" "}
            <span className="relative inline-block">
              <span className="absolute inset-x-[-0.5vw] inset-y-[0.4vh] bg-brand-yellow/70 -rotate-[1deg] rounded-[0.5vw]" />
              <span className="relative">Box.</span>
            </span>
          </p>
          <div className="flex items-center gap-[1.4vw] mt-[1vh]">
            <span className="inline-block w-[1.2vw] h-[1.2vw] rounded-full bg-brand-blue" />
            <span className="font-display font-medium text-[1.6vw] text-ink/70">
              A live walkthrough of the Grafly app
            </span>
          </div>
        </div>

        <div className="relative h-full flex items-center justify-center">
          <div
            className="absolute w-[30vw] h-[30vw] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(0,164,250,0.18) 0%, rgba(0,164,250,0) 70%)",
            }}
          />
          <img
            src={`${base}brand/idle.png`}
            crossOrigin="anonymous"
            alt="Grafly mascot"
            className="relative w-[32vw] h-auto drop-shadow-[0_2vw_3vw_rgba(33,38,63,0.18)]"
          />
        </div>
      </div>
    </div>
  );
}
