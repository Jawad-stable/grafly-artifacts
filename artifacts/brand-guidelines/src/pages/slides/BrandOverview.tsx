import { PageHeader, Sparkle, Star4, Squiggle } from "../../components/decorations";

const base = import.meta.env.BASE_URL;

export default function BrandOverview() {
  return (
    <div className="relative w-screen h-screen overflow-hidden slide-bg">
      <PageHeader index="01" label="Brand Overview" />

      <Sparkle className="absolute right-[14vw] top-[10vh] w-[1.4vw] h-[1.4vw]" color="#E3ED43" />
      <Star4 className="absolute right-[8vw] top-[18vh] w-[1.6vw] h-[1.6vw]" color="#FF7BD0" />
      <Squiggle
        className="absolute left-[6vw] bottom-[10vh] w-[18vw] h-[3vh] opacity-50"
        color="#00A4FA"
        width={280}
        height={32}
      />

      <div className="relative h-full w-full grid grid-cols-[1.15fr_0.85fr] items-center px-[7vw] pt-[14vh] pb-[8vh] gap-[4vw]">
        <div className="flex flex-col gap-[3vh]">
          <h1 className="font-display font-black text-ink text-[6vw] leading-[0.95] tracking-tight">
            We make design{" "}
            <span className="relative inline-block">
              <span className="absolute inset-x-[-0.6vw] inset-y-[0.6vh] bg-brand-pink/45 -rotate-[1deg] rounded-[0.6vw]" />
              <span className="relative">playable.</span>
            </span>
          </h1>

          <p className="font-display font-medium text-ink/75 text-[1.7vw] leading-[1.45] max-w-[44vw] text-pretty">
            Grafly is a hands-on design tutor for the next generation of creators —
            tiny lessons, real canvases, instant feedback. We turn intimidating
            design theory into something you can actually do on your phone.
          </p>

          <div className="flex flex-col gap-[1.4vh] mt-[1vh]">
            <div className="flex items-center gap-[1vw] font-display text-[1.2vw] tracking-[0.3em] uppercase text-ink/55">
              Brand personality
            </div>
            <div className="flex items-center gap-[0.8vw] flex-wrap">
              <span className="inline-flex items-center px-[1.2vw] py-[0.8vh] rounded-full bg-ink text-cream font-display font-bold text-[1.3vw]">
                Playful
              </span>
              <span className="inline-flex items-center px-[1.2vw] py-[0.8vh] rounded-full bg-brand-blue text-cream font-display font-bold text-[1.3vw]">
                Friendly
              </span>
              <span className="inline-flex items-center px-[1.2vw] py-[0.8vh] rounded-full bg-brand-yellow text-ink font-display font-bold text-[1.3vw]">
                Energetic
              </span>
              <span className="inline-flex items-center px-[1.2vw] py-[0.8vh] rounded-full bg-brand-pink text-ink font-display font-bold text-[1.3vw]">
                Modern
              </span>
              <span className="inline-flex items-center px-[1.2vw] py-[0.8vh] rounded-full bg-cream text-ink border-[2px] border-ink/15 font-display font-bold text-[1.3vw]">
                Subtly Y2K
              </span>
            </div>
          </div>
        </div>

        <div className="relative h-full flex items-end justify-center">
          <div
            className="absolute bottom-[8vh] w-[26vw] h-[26vw] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(255,123,208,0.22) 0%, rgba(255,123,208,0) 65%)",
            }}
          />
          <img
            src={`${base}brand/cool_yellow.png`}
            crossOrigin="anonymous"
            alt="Grafly mascot, cool pose"
            className="relative w-[26vw] h-auto drop-shadow-[0_2vw_3vw_rgba(33,38,63,0.18)]"
          />
        </div>
      </div>
    </div>
  );
}
