import { PageHeader, Sparkle } from "../../components/decorations";

export default function Typography() {
  return (
    <div className="relative w-screen h-screen overflow-hidden slide-bg">
      <PageHeader index="04" label="Typography" />

      <Sparkle className="absolute right-[10vw] top-[14vh] w-[1.4vw] h-[1.4vw]" color="#E3ED43" />

      <div className="relative h-full w-full px-[6vw] pt-[14vh] pb-[5vh] grid grid-cols-[0.95fr_1.05fr] gap-[3vw]">
        <div className="flex flex-col gap-[2vh]">
          <h1 className="font-display font-black text-ink text-[4.5vw] leading-[0.92] tracking-tight">
            One family.{" "}
            <span className="relative inline-block">
              <span className="absolute inset-x-[-0.5vw] inset-y-[0.5vh] bg-brand-blue/35 -rotate-[1deg] rounded-[0.5vw]" />
              <span className="relative">Teshrin.</span>
            </span>
          </h1>
          <p className="font-display text-[1.3vw] text-ink/65 leading-[1.45] max-w-[34vw]">
            A friendly, geometric sans with strong weights and a soft eye. We
            use it everywhere — display, body, captions, the whole stack.
          </p>

          <div className="bg-white rounded-[1.4vw] border-[2px] border-ink/10 p-[1.6vw] flex flex-col">
            <span className="font-display font-black text-ink text-[14vw] leading-[0.85] tracking-tight">
              Aa
            </span>
            <div className="flex items-center justify-between mt-[1vh]">
              <span className="font-display text-[1.1vw] text-ink/55 tracking-[0.18em] uppercase">
                Teshrin Black · 900
              </span>
              <span className="font-display text-[1vw] text-ink/45">
                Display headlines
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-[1.6vh]">
          <div className="font-display text-[1vw] tracking-[0.3em] uppercase text-ink/55">
            Weight ladder
          </div>
          <div className="bg-white rounded-[1.2vw] border-[2px] border-ink/10 px-[1.6vw] py-[1.4vh] flex flex-col gap-[0.6vh]">
            <div className="flex items-baseline justify-between">
              <span className="font-display font-light text-ink text-[2vw]">Teshrin Light</span>
              <span className="font-display text-[1vw] text-ink/45">300</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="font-display font-normal text-ink text-[2vw]">Teshrin Regular</span>
              <span className="font-display text-[1vw] text-ink/45">400</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="font-display font-medium text-ink text-[2vw]">Teshrin Medium</span>
              <span className="font-display text-[1vw] text-ink/45">500</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="font-display font-bold text-ink text-[2vw]">Teshrin Bold</span>
              <span className="font-display text-[1vw] text-ink/45">700</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="font-display font-black text-ink text-[2vw]">Teshrin Black</span>
              <span className="font-display text-[1vw] text-ink/45">900</span>
            </div>
          </div>

          <div className="font-display text-[1vw] tracking-[0.3em] uppercase text-ink/55 mt-[0.6vh]">
            Hierarchy
          </div>
          <div className="bg-white rounded-[1.2vw] border-[2px] border-ink/10 px-[1.6vw] py-[1.4vh] flex flex-col gap-[0.8vh]">
            <span className="font-display font-black text-ink text-[2.6vw] leading-[1.05]">
              Lesson 04 · Color theory
            </span>
            <span className="font-display font-bold text-ink/80 text-[1.6vw] leading-[1.2]">
              Pick a primary, then build a friend for it.
            </span>
            <span className="font-display font-medium text-ink/65 text-[1.2vw] leading-[1.4]">
              Body text uses Teshrin Medium at a comfortable reading size.
              Keep line length short and let the warmth of the type breathe.
            </span>
            <span className="font-display text-[1vw] text-ink/45 tracking-[0.12em] uppercase mt-[0.4vh]">
              Caption · 1.0vw · Light
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
