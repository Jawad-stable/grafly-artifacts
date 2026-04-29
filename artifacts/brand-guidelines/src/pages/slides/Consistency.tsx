import { PageHeader, Sparkle } from "../../components/decorations";

export default function Consistency() {
  return (
    <div className="relative w-screen h-screen overflow-hidden slide-bg">
      <PageHeader index="14" label="Consistency Guidelines" />

      <Sparkle className="absolute right-[10vw] top-[12vh] w-[1.4vw] h-[1.4vw]" color="#E3ED43" />

      <div className="relative h-full w-full px-[6vw] pt-[14vh] pb-[5vh] flex flex-col gap-[3vh]">
        <h1 className="font-display font-black text-ink text-[4.4vw] leading-[0.95] tracking-tight max-w-[60vw]">
          Same rules,{" "}
          <span className="relative inline-block">
            <span className="absolute inset-x-[-0.5vw] inset-y-[0.4vh] bg-brand-yellow/65 -rotate-[1deg] rounded-[0.5vw]" />
            <span className="relative">every screen.</span>
          </span>
        </h1>

        <div className="grid grid-cols-3 gap-[1.6vw] flex-1">
          <div className="bg-white rounded-[1.2vw] border-[2px] border-ink/10 px-[1.6vw] py-[2vh] flex flex-col gap-[1.2vh]">
            <div className="flex items-center gap-[0.7vw]">
              <span className="inline-flex items-center justify-center w-[2.6vw] h-[2.6vw] rounded-full bg-brand-blue text-cream font-display font-black text-[1.1vw]">
                1
              </span>
              <span className="font-display font-black text-ink text-[1.7vw] tracking-tight">
                Spacing
              </span>
            </div>
            <div className="flex flex-col gap-[0.7vh] font-display font-medium text-[1.1vw] text-ink/75 leading-[1.35]">
              <span>· 8px base grid for everything</span>
              <span>· Min 24px outer padding on cards</span>
              <span>· Min 16px between text blocks</span>
              <span>· Generous · never cramped</span>
            </div>
            <div className="mt-auto pt-[1vh] flex items-end gap-[0.6vw] h-[10vh]">
              <span className="block w-[1.6vw] h-[3vh] bg-brand-blue/20 rounded-[0.3vw]" />
              <span className="block w-[1.6vw] h-[5vh] bg-brand-blue/40 rounded-[0.3vw]" />
              <span className="block w-[1.6vw] h-[7vh] bg-brand-blue/60 rounded-[0.3vw]" />
              <span className="block w-[1.6vw] h-[9vh] bg-brand-blue rounded-[0.3vw]" />
            </div>
          </div>

          <div className="bg-white rounded-[1.2vw] border-[2px] border-ink/10 px-[1.6vw] py-[2vh] flex flex-col gap-[1.2vh]">
            <div className="flex items-center gap-[0.7vw]">
              <span className="inline-flex items-center justify-center w-[2.6vw] h-[2.6vw] rounded-full bg-brand-yellow text-ink font-display font-black text-[1.1vw]">
                2
              </span>
              <span className="font-display font-black text-ink text-[1.7vw] tracking-tight">
                Alignment
              </span>
            </div>
            <div className="flex flex-col gap-[0.7vh] font-display font-medium text-[1.1vw] text-ink/75 leading-[1.35]">
              <span>· Lead with the left edge</span>
              <span>· Headlines aligned to body type</span>
              <span>· Buttons stack — never split</span>
              <span>· One accent shape per layout</span>
            </div>
            <div className="mt-auto pt-[1vh] flex flex-col gap-[0.6vh]">
              <span className="block h-[1.4vh] w-[80%] bg-ink/15 rounded-full" />
              <span className="block h-[1.4vh] w-[64%] bg-ink/15 rounded-full" />
              <span className="block h-[1.4vh] w-[40%] bg-brand-yellow rounded-full" />
            </div>
          </div>

          <div className="bg-white rounded-[1.2vw] border-[2px] border-ink/10 px-[1.6vw] py-[2vh] flex flex-col gap-[1.2vh]">
            <div className="flex items-center gap-[0.7vw]">
              <span className="inline-flex items-center justify-center w-[2.6vw] h-[2.6vw] rounded-full bg-brand-pink text-ink font-display font-black text-[1.1vw]">
                3
              </span>
              <span className="font-display font-black text-ink text-[1.7vw] tracking-tight">
                Tone of voice
              </span>
            </div>
            <div className="flex flex-col gap-[0.7vh] font-display font-medium text-[1.1vw] text-ink/75 leading-[1.35]">
              <span>· Friendly · never patronising</span>
              <span>· Short sentences · plain words</span>
              <span>· Lowercase for warmth</span>
              <span>· Encourage, then teach</span>
            </div>
            <div className="mt-auto pt-[1vh] flex flex-col gap-[0.6vh]">
              <div className="rounded-[0.6vw] bg-cream px-[0.9vw] py-[0.6vh]">
                <span className="font-display font-bold text-ink text-[1vw]">
                  &ldquo;nice — try one more.&rdquo;
                </span>
              </div>
              <div className="rounded-[0.6vw] bg-cream px-[0.9vw] py-[0.6vh]">
                <span className="font-display font-bold text-ink text-[1vw]">
                  &ldquo;close. shift the blue down.&rdquo;
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
