import { PageHeader, Sparkle } from "../../components/decorations";

export default function ColorPalette() {
  return (
    <div className="relative w-screen h-screen overflow-hidden slide-bg">
      <PageHeader index="03" label="Color Palette" />

      <Sparkle className="absolute right-[8vw] top-[10vh] w-[1.4vw] h-[1.4vw]" color="#E3ED43" />
      <Sparkle className="absolute right-[18vw] top-[16vh] w-[1.2vw] h-[1.2vw]" color="#FF7BD0" />

      <div className="relative h-full w-full px-[6vw] pt-[14vh] pb-[5vh] flex flex-col gap-[3vh]">
        <div className="flex items-end justify-between">
          <h1 className="font-display font-black text-ink text-[4.5vw] leading-[0.95] tracking-tight">
            A bright, friendly{" "}
            <span className="relative inline-block">
              <span className="absolute inset-x-[-0.5vw] inset-y-[0.4vh] bg-brand-yellow/70 -rotate-[1deg] rounded-[0.5vw]" />
              <span className="relative">palette.</span>
            </span>
          </h1>
          <p className="font-display text-[1.3vw] text-ink/65 max-w-[28vw] text-right leading-[1.4]">
            Three vivid primaries set the mood. Ink and cream do the heavy
            lifting for type and surfaces.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-[1.4vw]">
          <div className="rounded-[1vw] overflow-hidden border-[2px] border-ink/10 bg-white">
            <div className="h-[26vh] bg-brand-blue flex items-end justify-start p-[1.4vw]">
              <span className="font-display font-black text-cream text-[2vw] leading-none">
                Sky
              </span>
            </div>
            <div className="px-[1.4vw] py-[1.6vh] flex items-center justify-between">
              <span className="font-display font-bold text-[1.1vw] text-ink">Brand Blue</span>
              <span className="font-display text-[1vw] text-ink/55 tracking-[0.1em]">#00A4FA</span>
            </div>
          </div>
          <div className="rounded-[1vw] overflow-hidden border-[2px] border-ink/10 bg-white">
            <div className="h-[26vh] bg-brand-yellow flex items-end justify-start p-[1.4vw]">
              <span className="font-display font-black text-ink text-[2vw] leading-none">
                Spark
              </span>
            </div>
            <div className="px-[1.4vw] py-[1.6vh] flex items-center justify-between">
              <span className="font-display font-bold text-[1.1vw] text-ink">Brand Yellow</span>
              <span className="font-display text-[1vw] text-ink/55 tracking-[0.1em]">#E3ED43</span>
            </div>
          </div>
          <div className="rounded-[1vw] overflow-hidden border-[2px] border-ink/10 bg-white">
            <div className="h-[26vh] bg-brand-pink flex items-end justify-start p-[1.4vw]">
              <span className="font-display font-black text-ink text-[2vw] leading-none">
                Bubble
              </span>
            </div>
            <div className="px-[1.4vw] py-[1.6vh] flex items-center justify-between">
              <span className="font-display font-bold text-[1.1vw] text-ink">Brand Pink</span>
              <span className="font-display text-[1vw] text-ink/55 tracking-[0.1em]">#FF7BD0</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-[1fr_1fr_1.4fr] gap-[1.4vw]">
          <div className="rounded-[1vw] overflow-hidden border-[2px] border-ink/10 bg-white flex">
            <div className="w-[40%] bg-ink" />
            <div className="flex-1 px-[1.2vw] py-[1.4vh] flex flex-col justify-center">
              <span className="font-display font-bold text-[1.1vw] text-ink">Ink</span>
              <span className="font-display text-[1vw] text-ink/55 tracking-[0.1em]">#21263F</span>
              <span className="font-display text-[0.95vw] text-ink/55 mt-[0.4vh]">Body type</span>
            </div>
          </div>
          <div className="rounded-[1vw] overflow-hidden border-[2px] border-ink/10 bg-white flex">
            <div className="w-[40%] bg-cream" />
            <div className="flex-1 px-[1.2vw] py-[1.4vh] flex flex-col justify-center">
              <span className="font-display font-bold text-[1.1vw] text-ink">Cream</span>
              <span className="font-display text-[1vw] text-ink/55 tracking-[0.1em]">#F7F4DC</span>
              <span className="font-display text-[0.95vw] text-ink/55 mt-[0.4vh]">Warm surface</span>
            </div>
          </div>
          <div className="rounded-[1vw] border-[2px] border-ink/10 bg-white px-[1.4vw] py-[1.4vh] flex flex-col gap-[0.6vh] justify-center">
            <div className="font-display text-[0.95vw] tracking-[0.3em] uppercase text-ink/55">
              Usage ratio
            </div>
            <div className="flex items-center gap-[0.4vw] h-[2.2vh]">
              <span className="block bg-brand-blue rounded-full" style={{ width: "32%", height: "100%" }} />
              <span className="block bg-brand-yellow rounded-full" style={{ width: "20%", height: "100%" }} />
              <span className="block bg-brand-pink rounded-full" style={{ width: "14%", height: "100%" }} />
              <span className="block bg-ink rounded-full" style={{ width: "20%", height: "100%" }} />
              <span className="block bg-cream border border-ink/15 rounded-full" style={{ width: "14%", height: "100%" }} />
            </div>
            <div className="font-display text-[0.95vw] text-ink/55 leading-[1.3] mt-[0.4vh]">
              Lead with Sky &amp; Ink. Use Spark and Bubble as accents — never as full backgrounds.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
