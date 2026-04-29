import { PageHeader, Sparkle } from "../../components/decorations";

export default function Iconography() {
  return (
    <div className="relative w-screen h-screen overflow-hidden slide-bg">
      <PageHeader index="11" label="Iconography" />

      <Sparkle className="absolute right-[10vw] top-[12vh] w-[1.4vw] h-[1.4vw]" color="#E3ED43" />

      <div className="relative h-full w-full px-[6vw] pt-[14vh] pb-[5vh] grid grid-cols-[0.85fr_1.15fr] gap-[3vw]">
        <div className="flex flex-col gap-[2vh]">
          <h1 className="font-display font-black text-ink text-[4.6vw] leading-[0.92] tracking-tight">
            Round corners.{" "}
            <span className="relative inline-block">
              <span className="absolute inset-x-[-0.5vw] inset-y-[0.4vh] bg-brand-yellow/65 -rotate-[1deg] rounded-[0.5vw]" />
              <span className="relative">Friendly lines.</span>
            </span>
          </h1>
          <p className="font-display text-[1.3vw] text-ink/70 leading-[1.45] max-w-[28vw]">
            Our icons are 2px stroke, fully rounded caps, and never filled.
            They sit happily next to Teshrin and inherit the current text
            color in product.
          </p>

          <div className="bg-white rounded-[1vw] border-[2px] border-ink/10 p-[1.4vw] flex flex-col gap-[1vh]">
            <span className="font-display text-[0.95vw] tracking-[0.3em] uppercase text-ink/55">
              Specs
            </span>
            <div className="flex items-center justify-between font-display text-[1.1vw]">
              <span className="text-ink/70">Stroke</span>
              <span className="font-bold text-ink">2px</span>
            </div>
            <div className="flex items-center justify-between font-display text-[1.1vw]">
              <span className="text-ink/70">Cap &amp; join</span>
              <span className="font-bold text-ink">Round</span>
            </div>
            <div className="flex items-center justify-between font-display text-[1.1vw]">
              <span className="text-ink/70">Grid</span>
              <span className="font-bold text-ink">24 × 24</span>
            </div>
            <div className="flex items-center justify-between font-display text-[1.1vw]">
              <span className="text-ink/70">Color</span>
              <span className="font-bold text-ink">currentColor</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 grid-rows-2 gap-[1vw]">
          <div className="rounded-[1vw] bg-white border-[2px] border-ink/10 px-[1vw] py-[1.4vh] flex flex-col items-center justify-center gap-[1vh] min-h-[28vh] text-brand-blue">
            <svg viewBox="0 0 24 24" className="w-[6vw] h-[6vw]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 5 L4 19 L20 19" />
              <path d="M7 15 L11 11 L14 13 L20 7" />
            </svg>
            <span className="font-display font-bold text-[1.1vw] text-ink">Lesson</span>
          </div>
          <div className="rounded-[1vw] bg-white border-[2px] border-ink/10 px-[1vw] py-[1.4vh] flex flex-col items-center justify-center gap-[1vh] min-h-[28vh] text-brand-pink">
            <svg viewBox="0 0 24 24" className="w-[6vw] h-[6vw]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3 C 12 9, 6 9, 6 14 C 6 18, 9 21, 12 21 C 15 21, 18 18, 18 14 C 18 11, 15 10, 14 7 Z" />
            </svg>
            <span className="font-display font-bold text-[1.1vw] text-ink">Streak</span>
          </div>
          <div className="rounded-[1vw] bg-white border-[2px] border-ink/10 px-[1vw] py-[1.4vh] flex flex-col items-center justify-center gap-[1vh] min-h-[28vh] text-ink">
            <svg viewBox="0 0 24 24" className="w-[6vw] h-[6vw]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="9" r="5" />
              <path d="M8 13 L6 21 L12 18 L18 21 L16 13" />
            </svg>
            <span className="font-display font-bold text-[1.1vw] text-ink">Badge</span>
          </div>
          <div className="rounded-[1vw] bg-white border-[2px] border-ink/10 px-[1vw] py-[1.4vh] flex flex-col items-center justify-center gap-[1vh] min-h-[28vh] text-brand-blue">
            <svg viewBox="0 0 24 24" className="w-[6vw] h-[6vw]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 4 L20 8 L9 19 L4 20 L5 15 Z" />
              <path d="M14 6 L18 10" />
            </svg>
            <span className="font-display font-bold text-[1.1vw] text-ink">Brush</span>
          </div>
          <div className="rounded-[1vw] bg-white border-[2px] border-ink/10 px-[1vw] py-[1.4vh] flex flex-col items-center justify-center gap-[1vh] min-h-[28vh] text-ink">
            <svg viewBox="0 0 24 24" className="w-[6vw] h-[6vw]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3 C 6 3, 3 7, 3 12 C 3 17, 7 21, 12 21 C 13 21, 14 20, 14 19 C 14 17, 13 17, 13 16 C 13 15, 14 14, 16 14 L 18 14 C 20 14, 21 13, 21 11 C 21 6, 17 3, 12 3 Z" />
              <circle cx="7" cy="11" r="1.2" fill="currentColor" />
              <circle cx="11" cy="7" r="1.2" fill="currentColor" />
              <circle cx="16" cy="8" r="1.2" fill="currentColor" />
            </svg>
            <span className="font-display font-bold text-[1.1vw] text-ink">Palette</span>
          </div>
          <div className="rounded-[1vw] bg-white border-[2px] border-ink/10 px-[1vw] py-[1.4vh] flex flex-col items-center justify-center gap-[1vh] min-h-[28vh] text-brand-pink">
            <svg viewBox="0 0 24 24" className="w-[6vw] h-[6vw]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 4 L13.8 9.6 L19.6 9.6 L14.9 13.1 L16.7 18.7 L12 15.2 L7.3 18.7 L9.1 13.1 L4.4 9.6 L10.2 9.6 Z" />
            </svg>
            <span className="font-display font-bold text-[1.1vw] text-ink">Star</span>
          </div>
        </div>
      </div>
    </div>
  );
}
