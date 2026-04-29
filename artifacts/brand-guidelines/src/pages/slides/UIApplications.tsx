import { PageHeader, Sparkle, Star4 } from "../../components/decorations";

const base = import.meta.env.BASE_URL;

export default function UIApplications() {
  return (
    <div className="relative w-screen h-screen overflow-hidden slide-bg">
      <PageHeader index="08" label="UI Applications" />

      <Sparkle className="absolute right-[10vw] top-[12vh] w-[1.4vw] h-[1.4vw]" color="#E3ED43" />

      <div className="relative h-full w-full px-[6vw] pt-[14vh] pb-[5vh] grid grid-cols-[0.95fr_1.05fr] gap-[3vw]">
        <div className="flex flex-col gap-[2vh]">
          <h1 className="font-display font-black text-ink text-[4.6vw] leading-[0.92] tracking-tight">
            The brand{" "}
            <span className="relative inline-block">
              <span className="absolute inset-x-[-0.5vw] inset-y-[0.4vh] bg-brand-blue/35 -rotate-[1deg] rounded-[0.5vw]" />
              <span className="relative">in product.</span>
            </span>
          </h1>
          <p className="font-display text-[1.3vw] text-ink/70 leading-[1.45] max-w-[34vw]">
            Cards, buttons, and chips all sit on cream surfaces with rounded
            corners. Sky blue is the primary action. Ink does the typography.
            One mascot per screen, never two.
          </p>

          <div className="bg-white rounded-[1.2vw] border-[2px] border-ink/10 p-[1.6vw] flex flex-col gap-[1.2vh]">
            <div className="font-display text-[1vw] tracking-[0.3em] uppercase text-ink/55">
              Buttons
            </div>
            <div className="flex items-center gap-[0.8vw] flex-wrap">
              <span className="px-[1.4vw] py-[1vh] rounded-full bg-brand-blue text-cream font-display font-black text-[1.2vw]">
                Continue
              </span>
              <span className="px-[1.4vw] py-[1vh] rounded-full bg-ink text-cream font-display font-black text-[1.2vw]">
                Start lesson
              </span>
              <span className="px-[1.4vw] py-[1vh] rounded-full bg-white border-[2px] border-ink text-ink font-display font-black text-[1.2vw]">
                Skip
              </span>
            </div>
            <div className="font-display text-[1vw] tracking-[0.3em] uppercase text-ink/55 mt-[0.6vh]">
              Chips
            </div>
            <div className="flex items-center gap-[0.6vw] flex-wrap">
              <span className="px-[1vw] py-[0.6vh] rounded-full bg-brand-yellow text-ink font-display font-bold text-[1.1vw]">
                Beginner
              </span>
              <span className="px-[1vw] py-[0.6vh] rounded-full bg-brand-pink text-ink font-display font-bold text-[1.1vw]">
                3 min
              </span>
              <span className="px-[1vw] py-[0.6vh] rounded-full bg-cream border-[2px] border-ink/15 text-ink font-display font-bold text-[1.1vw]">
                Color theory
              </span>
            </div>
          </div>
        </div>

        <div className="relative h-full flex items-center justify-center">
          <Star4 className="absolute left-[2vw] top-[6vh] w-[1.6vw] h-[1.6vw]" color="#FF7BD0" />
          <div
            className="absolute w-[24vw] h-[24vw] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(0,164,250,0.18) 0%, rgba(0,164,250,0) 65%)",
            }}
          />
          <div className="relative w-[22vw] h-[68vh] bg-cream rounded-[3vw] border-[3px] border-ink/15 shadow-[0_2vw_3vw_rgba(33,38,63,0.18)] overflow-hidden flex flex-col">
            <div className="bg-white px-[1.6vw] pt-[2.5vh] pb-[1.5vh] flex items-center gap-[0.8vw]">
              <img
                src={`${base}brand/icon_colored.png`}
                crossOrigin="anonymous"
                alt="App icon"
                className="h-[3.4vh] w-auto"
              />
              <span className="font-display font-black text-ink text-[1.4vw] tracking-tight">
                Grafly
              </span>
              <span className="ml-auto px-[0.8vw] py-[0.3vh] rounded-full bg-brand-yellow text-ink font-display font-bold text-[0.95vw]">
                7
              </span>
            </div>

            <div className="px-[1.6vw] pt-[1.4vh] flex flex-col gap-[1vh]">
              <span className="font-display text-[0.95vw] tracking-[0.25em] uppercase text-ink/55">
                Today
              </span>
              <span className="font-display font-black text-ink text-[2vw] leading-[1.05] tracking-tight">
                Build your{" "}
                <span className="text-brand-blue">first canvas</span>
              </span>
            </div>

            <div className="px-[1.6vw] mt-[1.4vh] flex flex-col gap-[1vh]">
              <div className="rounded-[1vw] bg-white border-[2px] border-ink/10 px-[1.2vw] py-[1.2vh] flex items-center gap-[0.8vw]">
                <span className="w-[2.6vh] h-[2.6vh] rounded-full bg-brand-blue" />
                <div className="flex flex-col">
                  <span className="font-display font-bold text-ink text-[1.05vw]">Pick a primary</span>
                  <span className="font-display text-[0.9vw] text-ink/55">2 min · in progress</span>
                </div>
                <span className="ml-auto font-display font-bold text-brand-blue text-[1vw]">→</span>
              </div>
              <div className="rounded-[1vw] bg-white border-[2px] border-ink/10 px-[1.2vw] py-[1.2vh] flex items-center gap-[0.8vw]">
                <span className="w-[2.6vh] h-[2.6vh] rounded-full bg-brand-yellow" />
                <div className="flex flex-col">
                  <span className="font-display font-bold text-ink text-[1.05vw]">Add a friend color</span>
                  <span className="font-display text-[0.9vw] text-ink/55">3 min · locked</span>
                </div>
                <span className="ml-auto font-display font-bold text-ink/40 text-[1vw]">→</span>
              </div>
              <div className="rounded-[1vw] bg-white border-[2px] border-ink/10 px-[1.2vw] py-[1.2vh] flex items-center gap-[0.8vw]">
                <span className="w-[2.6vh] h-[2.6vh] rounded-full bg-brand-pink" />
                <div className="flex flex-col">
                  <span className="font-display font-bold text-ink text-[1.05vw]">Ship the canvas</span>
                  <span className="font-display text-[0.9vw] text-ink/55">5 min · locked</span>
                </div>
                <span className="ml-auto font-display font-bold text-ink/40 text-[1vw]">→</span>
              </div>
            </div>

            <div className="mt-auto px-[1.6vw] pb-[2vh] flex items-end gap-[0.6vw]">
              <img
                src={`${base}brand/idle.png`}
                crossOrigin="anonymous"
                alt="Mascot"
                className="h-[10vh] w-auto"
              />
              <div className="flex-1 mb-[1.6vh] bg-ink rounded-[0.8vw] px-[0.9vw] py-[0.7vh]">
                <span className="font-display font-bold text-cream text-[0.95vw]">
                  let&apos;s ink it
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
