import { PageHeader, Sparkle } from "../../components/decorations";

const base = import.meta.env.BASE_URL;

export default function Mascot() {
  return (
    <div className="relative w-screen h-screen overflow-hidden slide-bg">
      <PageHeader index="07" label="Character / Mascot" />

      <Sparkle className="absolute right-[10vw] top-[12vh] w-[1.4vw] h-[1.4vw]" color="#E3ED43" />
      <Sparkle className="absolute left-[40vw] top-[16vh] w-[1.2vw] h-[1.2vw]" color="#FF7BD0" />

      <div className="relative h-full w-full px-[6vw] pt-[14vh] pb-[5vh] grid grid-cols-[0.85fr_1.15fr] gap-[2.6vw]">
        <div className="flex flex-col gap-[2vh]">
          <h1 className="font-display font-black text-ink text-[5vw] leading-[0.92] tracking-tight">
            Meet{" "}
            <span className="relative inline-block">
              <span className="absolute inset-x-[-0.5vw] inset-y-[0.5vh] bg-brand-yellow/65 -rotate-[1deg] rounded-[0.5vw]" />
              <span className="relative">Grafly.</span>
            </span>
          </h1>
          <p className="font-display text-[1.3vw] text-ink/70 leading-[1.45] max-w-[28vw]">
            Our mascot is a tiny pencil character with big feelings. They cheer
            you on, they think out loud, they shrug when something breaks. They
            are the friendliest part of the product.
          </p>
          <div className="font-display text-[1vw] tracking-[0.3em] uppercase text-ink/55 mt-[1vh]">
            Where they show up
          </div>
          <div className="flex flex-col gap-[0.6vh] font-display font-medium text-[1.15vw] text-ink/75">
            <span>· Onboarding &amp; tutorials</span>
            <span>· Empty states &amp; encouragement</span>
            <span>· Right and wrong feedback</span>
            <span>· Marketing &amp; social</span>
          </div>
        </div>

        <div className="grid grid-cols-3 grid-rows-2 gap-[1vw]">
          <div className="rounded-[1vw] bg-white border-[2px] border-ink/10 px-[1vw] py-[1.4vh] flex flex-col items-center justify-end gap-[0.6vh] min-h-[28vh]">
            <img
              src={`${base}brand/idle.png`}
              crossOrigin="anonymous"
              alt="Idle pose"
              className="h-[18vh] w-auto"
            />
            <span className="font-display font-bold text-[1.1vw] text-ink">Idle</span>
            <span className="font-display text-[0.95vw] text-ink/55 text-center leading-[1.25]">
              Waiting · default
            </span>
          </div>
          <div className="rounded-[1vw] bg-white border-[2px] border-ink/10 px-[1vw] py-[1.4vh] flex flex-col items-center justify-end gap-[0.6vh] min-h-[28vh]">
            <img
              src={`${base}brand/celebrate.png`}
              crossOrigin="anonymous"
              alt="Celebrate pose"
              className="h-[18vh] w-auto"
            />
            <span className="font-display font-bold text-[1.1vw] text-ink">Celebrate</span>
            <span className="font-display text-[0.95vw] text-ink/55 text-center leading-[1.25]">
              Lesson complete
            </span>
          </div>
          <div className="rounded-[1vw] bg-white border-[2px] border-ink/10 px-[1vw] py-[1.4vh] flex flex-col items-center justify-end gap-[0.6vh] min-h-[28vh]">
            <img
              src={`${base}brand/think.png`}
              crossOrigin="anonymous"
              alt="Think pose"
              className="h-[18vh] w-auto"
            />
            <span className="font-display font-bold text-[1.1vw] text-ink">Think</span>
            <span className="font-display text-[0.95vw] text-ink/55 text-center leading-[1.25]">
              Hint · loading
            </span>
          </div>
          <div className="rounded-[1vw] bg-white border-[2px] border-ink/10 px-[1vw] py-[1.4vh] flex flex-col items-center justify-end gap-[0.6vh] min-h-[28vh]">
            <img
              src={`${base}brand/cool_yellow.png`}
              crossOrigin="anonymous"
              alt="Cool pose"
              className="h-[18vh] w-auto"
            />
            <span className="font-display font-bold text-[1.1vw] text-ink">Cool</span>
            <span className="font-display text-[0.95vw] text-ink/55 text-center leading-[1.25]">
              Streaks · hero moments
            </span>
          </div>
          <div className="rounded-[1vw] bg-white border-[2px] border-ink/10 px-[1vw] py-[1.4vh] flex flex-col items-center justify-end gap-[0.6vh] min-h-[28vh]">
            <img
              src={`${base}brand/oops.png`}
              crossOrigin="anonymous"
              alt="Oops pose"
              className="h-[18vh] w-auto"
            />
            <span className="font-display font-bold text-[1.1vw] text-ink">Oops</span>
            <span className="font-display text-[0.95vw] text-ink/55 text-center leading-[1.25]">
              Errors · empty states
            </span>
          </div>
          <div className="rounded-[1vw] bg-white border-[2px] border-ink/10 px-[1vw] py-[1.4vh] flex flex-col items-center justify-end gap-[0.6vh] min-h-[28vh]">
            <img
              src={`${base}brand/correct.png`}
              crossOrigin="anonymous"
              alt="Correct pose"
              className="h-[18vh] w-auto"
            />
            <span className="font-display font-bold text-[1.1vw] text-ink">Correct</span>
            <span className="font-display text-[0.95vw] text-ink/55 text-center leading-[1.25]">
              Right answer feedback
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
