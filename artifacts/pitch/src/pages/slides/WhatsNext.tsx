import {
  Sparkle,
  Cursor,
  BezierPath,
  ColorSwatchTrio,
} from "../../components/decorations";

const base = import.meta.env.BASE_URL;

export default function WhatsNext() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-cream">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #F8F4DA 0%, #F1ECC6 100%)",
        }}
      />

      <BezierPath className="absolute right-[5vw] top-[10vh] w-[22vw] h-[8vh] opacity-55 rotate-[10deg]" />
      <Sparkle className="absolute left-[38vw] top-[14vh] w-[2vw] h-[2vw]" color="#E3ED43" />
      <Sparkle className="absolute right-[6vw] bottom-[18vh] w-[1.6vw] h-[1.6vw]" color="#FF7BD0" />
      <Cursor className="absolute left-[3vw] bottom-[14vh] w-[2.2vw] h-[2.6vw] -rotate-[18deg]" color="#21263F" />
      <ColorSwatchTrio className="absolute right-[5vw] bottom-[6vh] w-[7vw] h-[5vh] rotate-[12deg]" />

      <img
        src={`${base}brand/wordmark_primary.png`}
        crossOrigin="anonymous"
        alt="Grafly"
        className="absolute top-[5vh] left-[6vw] h-[3.4vh] w-auto"
      />

      <div className="absolute top-[6vh] right-[6vw] flex items-center gap-[0.7vw] font-display text-ink/55 text-[1.3vw] tracking-[0.35em] uppercase">
        <span className="inline-block w-[0.6vw] h-[0.6vw] rounded-full bg-brand-yellow" />
        03 · What's next
      </div>

      <div className="relative h-full w-full flex flex-col justify-center px-[7vw] gap-[3vh]">
        <div className="flex items-center gap-[1vw]">
          <span className="inline-flex items-center gap-[0.7vw] px-[1.2vw] py-[0.7vh] rounded-full bg-ink text-cream font-display font-bold text-[1.2vw] tracking-[0.3em] uppercase">
            <span className="inline-block w-[0.7vw] h-[0.7vw] rounded-full bg-brand-yellow" />
            Roadmap
          </span>
          <span className="font-display font-medium text-ink/55 text-[1.2vw] tracking-[0.3em] uppercase">
            · what's next
          </span>
        </div>

        <h1 className="font-display font-black text-ink text-[5vw] leading-[1] tracking-tight max-w-[78vw] text-balance">
          What's{" "}
          <span className="relative inline-block">
            <span className="absolute inset-x-[-0.5vw] inset-y-[0.6vh] bg-brand-yellow/70 -rotate-[1deg] rounded-[0.5vw]" />
            <span className="relative">next.</span>
          </span>
        </h1>

        <p className="font-display font-medium text-ink/70 text-[1.7vw] leading-[1.3] max-w-[64vw] text-pretty">
          Keep developing the app, ship more ways to learn, and open it up to
          more people.
        </p>

        <div className="grid grid-cols-3 gap-[1.4vw] max-w-[80vw] mt-[1vh]">
          <div className="flex items-start gap-[1vw] p-[1.4vw] rounded-[1.2vw] bg-cream border-[2px] border-ink/15 shadow-[0_1vh_2vw_rgba(33,38,63,0.06)]">
            <span className="font-display font-black text-brand-blue text-[2.2vw] leading-none w-[3vw] shrink-0">
              01
            </span>
            <div className="flex flex-col gap-[0.6vh]">
              <div className="font-display font-bold text-ink text-[1.5vw] leading-[1.15]">
                More games
              </div>
              <p className="font-display font-medium text-ink/65 text-[1.1vw] leading-[1.3]">
                Add more mini-games and challenges to keep practice fun.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-[1vw] p-[1.4vw] rounded-[1.2vw] bg-cream border-[2px] border-ink/15 shadow-[0_1vh_2vw_rgba(33,38,63,0.06)]">
            <span className="font-display font-black text-brand-pink text-[2.2vw] leading-none w-[3vw] shrink-0">
              02
            </span>
            <div className="flex flex-col gap-[0.6vh]">
              <div className="font-display font-bold text-ink text-[1.5vw] leading-[1.15]">
                Arabic & more
              </div>
              <p className="font-display font-medium text-ink/65 text-[1.1vw] leading-[1.3]">
                Full Arabic with RTL support, then more languages.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-[1vw] p-[1.4vw] rounded-[1.2vw] bg-cream border-[2px] border-ink/15 shadow-[0_1vh_2vw_rgba(33,38,63,0.06)]">
            <span
              className="font-display font-black text-[2.2vw] leading-none w-[3vw] shrink-0"
              style={{ color: "#A56AE6" }}
            >
              03
            </span>
            <div className="flex flex-col gap-[0.6vh]">
              <div className="font-display font-bold text-ink text-[1.5vw] leading-[1.15]">
                More features
              </div>
              <p className="font-display font-medium text-ink/65 text-[1.1vw] leading-[1.3]">
                Sharper canvas tools and deeper feedback.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
