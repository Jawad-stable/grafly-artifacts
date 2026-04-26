import {
  Sparkle,
  Cursor,
  BezierPath,
  Heart,
  GCube,
} from "../../components/decorations";

const base = import.meta.env.BASE_URL;

export default function FuturePlans() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-cream">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(165deg, #F8F4DA 0%, #F0EBC4 100%)",
        }}
      />

      <BezierPath className="absolute right-[3vw] top-[10vh] w-[22vw] h-[8vh] opacity-55 -rotate-[8deg]" />
      <Sparkle className="absolute left-[26vw] top-[12vh] w-[2vw] h-[2vw]" color="#FF7BD0" />
      <Sparkle className="absolute right-[42vw] bottom-[10vh] w-[1.6vw] h-[1.6vw]" color="#FF7BD0" />
      <Heart
        className="absolute left-[36vw] top-[12vh] w-[1.6vw] h-[1.6vw] -rotate-[8deg] opacity-80"
        color="#FFC2E6"
      />
      <Heart
        className="absolute right-[6vw] top-[42vh] w-[1.8vw] h-[1.8vw] rotate-[12deg]"
        color="#FF7BD0"
      />
      <Cursor
        className="absolute left-[2vw] bottom-[20vh] w-[2.4vw] h-[2.8vw] -rotate-[18deg]"
        color="#21263F"
      />
      <Cursor
        className="absolute right-[8vw] top-[40vh] w-[2vw] h-[2.4vw] rotate-[16deg] opacity-80"
        color="#21263F"
      />
      <GCube
        className="absolute right-[40vw] top-[10vh] w-[5vw] h-[5vw] -rotate-[12deg]"
        color="#E3ED43"
      />

      <img
        src={`${base}brand/wordmark_primary.png`}
        crossOrigin="anonymous"
        alt="Grafly"
        className="absolute top-[5vh] left-[6vw] h-[3.4vh] w-auto"
      />

      <div className="absolute top-[6vh] right-[6vw] flex items-center gap-[0.7vw] font-display text-ink/55 text-[1.3vw] tracking-[0.35em] uppercase">
        <span className="inline-block w-[0.6vw] h-[0.6vw] rounded-full bg-brand-pink" />
        04 · If we had more time
      </div>

      <div className="relative h-full w-full flex flex-col justify-center px-[7vw] gap-[3vh]">
        <div className="flex items-center gap-[1.2vw]">
          <span className="inline-flex items-center gap-[0.7vw] px-[1.2vw] py-[0.7vh] rounded-full bg-ink text-cream font-display font-bold text-[1.2vw] tracking-[0.3em] uppercase">
            <span className="inline-block w-[0.7vw] h-[0.7vw] rounded-full bg-brand-pink" />
            Stretch goals
          </span>
          <span className="font-display font-medium text-ink/55 text-[1.2vw] tracking-[0.3em] uppercase">
            · the dream list
          </span>
        </div>

        <h1 className="font-display font-black text-ink text-[5vw] leading-[1.0] tracking-tight max-w-[78vw] text-balance">
          What we'd build{" "}
          <span className="relative inline-block">
            <span className="absolute inset-x-[-0.5vw] inset-y-[0.6vh] bg-brand-pink/55 -rotate-[1deg] rounded-[0.5vw]" />
            <span className="relative">if we had more time.</span>
          </span>
        </h1>

        <div className="grid grid-cols-3 gap-[1.2vw] max-w-[82vw] mt-[1vh]">
          <div className="flex items-start gap-[1vw] p-[1.4vw] rounded-[1.2vw] bg-cream border-[2px] border-ink/15 shadow-[0_1vh_2vw_rgba(33,38,63,0.06)]">
            <span className="font-display font-black text-brand-blue text-[2.2vw] leading-none w-[3vw] shrink-0">
              01
            </span>
            <div className="flex flex-col gap-[0.6vh]">
              <div className="font-display font-bold text-ink text-[1.5vw] leading-[1.15]">
                AI design tutor
              </div>
              <p className="font-display font-medium text-ink/65 text-[1.1vw] leading-[1.3]">
                Personalized feedback on every canvas.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-[1vw] p-[1.4vw] rounded-[1.2vw] bg-cream border-[2px] border-ink/15 shadow-[0_1vh_2vw_rgba(33,38,63,0.06)]">
            <span className="font-display font-black text-brand-pink text-[2.2vw] leading-none w-[3vw] shrink-0">
              02
            </span>
            <div className="flex flex-col gap-[0.6vh]">
              <div className="font-display font-bold text-ink text-[1.5vw] leading-[1.15]">
                Multiplayer canvas
              </div>
              <p className="font-display font-medium text-ink/65 text-[1.1vw] leading-[1.3]">
                Design together, live, with friends.
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
                Native mobile app
              </div>
              <p className="font-display font-medium text-ink/65 text-[1.1vw] leading-[1.3]">
                Practice on the go, with daily streaks.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-[1vw] p-[1.4vw] rounded-[1.2vw] bg-cream border-[2px] border-ink/15 shadow-[0_1vh_2vw_rgba(33,38,63,0.06)]">
            <span className="font-display font-black text-brand-yellow text-[2.2vw] leading-none w-[3vw] shrink-0">
              04
            </span>
            <div className="flex flex-col gap-[0.6vh]">
              <div className="font-display font-bold text-ink text-[1.5vw] leading-[1.15]">
                Community templates
              </div>
              <p className="font-display font-medium text-ink/65 text-[1.1vw] leading-[1.3]">
                A marketplace of remixable lessons.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-[1vw] p-[1.4vw] rounded-[1.2vw] bg-cream border-[2px] border-ink/15 shadow-[0_1vh_2vw_rgba(33,38,63,0.06)]">
            <span className="font-display font-black text-brand-blue text-[2.2vw] leading-none w-[3vw] shrink-0">
              05
            </span>
            <div className="flex flex-col gap-[0.6vh]">
              <div className="font-display font-bold text-ink text-[1.5vw] leading-[1.15]">
                Career & jobs
              </div>
              <p className="font-display font-medium text-ink/65 text-[1.1vw] leading-[1.3]">
                Portfolios, certifications, hiring partners.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-[1vw] p-[1.4vw] rounded-[1.2vw] bg-cream border-[2px] border-ink/15 shadow-[0_1vh_2vw_rgba(33,38,63,0.06)]">
            <span className="font-display font-black text-brand-pink text-[2.2vw] leading-none w-[3vw] shrink-0">
              06
            </span>
            <div className="flex flex-col gap-[0.6vh]">
              <div className="font-display font-bold text-ink text-[1.5vw] leading-[1.15]">
                Live workshops
              </div>
              <p className="font-display font-medium text-ink/65 text-[1.1vw] leading-[1.3]">
                Pro designers teaching in real time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
