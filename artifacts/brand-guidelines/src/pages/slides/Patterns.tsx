import { PageHeader, Sparkle, Star4 } from "../../components/decorations";

const base = import.meta.env.BASE_URL;

export default function Patterns() {
  return (
    <div className="relative w-screen h-screen overflow-hidden slide-bg">
      <PageHeader index="06" label="Patterns &amp; Elements" />

      <Sparkle className="absolute right-[8vw] top-[12vh] w-[1.4vw] h-[1.4vw]" color="#E3ED43" />
      <Star4 className="absolute right-[16vw] top-[18vh] w-[1.4vw] h-[1.4vw]" color="#FF7BD0" />

      <div className="relative h-full w-full px-[6vw] pt-[14vh] pb-[5vh] grid grid-cols-[1fr_1fr] gap-[2.4vw]">
        <div className="flex flex-col gap-[2vh]">
          <h1 className="font-display font-black text-ink text-[4.6vw] leading-[0.95] tracking-tight">
            The squiggle is{" "}
            <span className="relative inline-block">
              <span className="absolute inset-x-[-0.5vw] inset-y-[0.4vh] bg-brand-blue/30 -rotate-[1deg] rounded-[0.5vw]" />
              <span className="relative">our signature.</span>
            </span>
          </h1>
          <p className="font-display text-[1.3vw] text-ink/70 leading-[1.45] max-w-[36vw]">
            One hand-drawn squiggle, used a lot of different ways. It threads
            the brand together — a quiet pencil mark in the corner of every
            screen, post, and sticker.
          </p>

          <div className="relative rounded-[1.2vw] border-[2px] border-ink/10 bg-white overflow-hidden h-[24vh]">
            <img
              src={`${base}brand/pattern_squiggle.png`}
              crossOrigin="anonymous"
              alt="Squiggle pattern at full bleed"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute bottom-[1.2vh] left-[1.2vw] font-display text-[1vw] text-ink/65 tracking-[0.18em] uppercase bg-white/85 px-[0.7vw] py-[0.4vh] rounded-full">
              Full pattern · backgrounds
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-[1.6vh]">
          <div className="relative rounded-[1.2vw] border-[2px] border-ink/10 bg-white overflow-hidden h-[16vh] flex items-center px-[1.6vw] gap-[1.4vw]">
            <span className="font-display font-black text-ink text-[2vw] leading-none">
              Lesson 7
            </span>
            <div className="flex-1 h-[6vh] overflow-hidden rounded-[0.6vw]">
              <img
                src={`${base}brand/pattern_squiggle.png`}
                crossOrigin="anonymous"
                alt="Squiggle UI strip"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-display text-[1vw] text-ink/55 tracking-[0.18em] uppercase">
              UI strip
            </span>
          </div>

          <div className="relative rounded-[1.2vw] border-[2px] border-ink/10 bg-cream overflow-hidden h-[16vh] flex items-center px-[1.6vw] gap-[1vw]">
            <div className="flex flex-col">
              <span className="font-display font-black text-ink text-[1.6vw]">Sticker mark</span>
              <span className="font-display text-[1vw] text-ink/55 tracking-[0.18em] uppercase mt-[0.3vh]">
                Tiny accent · corner
              </span>
            </div>
            <div className="ml-auto w-[10vw] h-[8vh] overflow-hidden rounded-[0.6vw]">
              <img
                src={`${base}brand/pattern_squiggle.png`}
                crossOrigin="anonymous"
                alt="Squiggle sticker"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="relative rounded-[1.2vw] border-[2px] border-ink/10 bg-white overflow-hidden h-[20vh] p-[1.4vw] flex flex-col gap-[1vh]">
            <div className="font-display text-[1vw] text-ink/55 tracking-[0.18em] uppercase">
              Use it lightly
            </div>
            <div className="font-display font-medium text-ink/75 text-[1.2vw] leading-[1.4]">
              Keep the squiggle subtle. One per screen. Never over critical
              text. Always at low contrast against backgrounds.
            </div>
            <div className="mt-auto h-[3vh] overflow-hidden rounded-full">
              <img
                src={`${base}brand/pattern_squiggle.png`}
                crossOrigin="anonymous"
                alt="Squiggle as divider"
                className="w-full h-full object-cover opacity-60"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
