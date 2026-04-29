import { PageHeader, Sparkle, Squiggle, Star4, Blob } from "../../components/decorations";

export default function VisualStyle() {
  return (
    <div className="relative w-screen h-screen overflow-hidden slide-bg">
      <PageHeader index="05" label="Visual Style" />

      <div className="relative h-full w-full px-[6vw] pt-[14vh] pb-[5vh] grid grid-cols-[0.95fr_1.05fr] gap-[3vw]">
        <div className="flex flex-col gap-[2vh]">
          <h1 className="font-display font-black text-ink text-[5vw] leading-[0.92] tracking-tight">
            Modern.{" "}
            <span className="relative inline-block">
              <span className="absolute inset-x-[-0.5vw] inset-y-[0.4vh] bg-brand-pink/45 -rotate-[1deg] rounded-[0.5vw]" />
              <span className="relative">Playful.</span>
            </span>{" "}
            A little Y2K.
          </h1>
          <p className="font-display text-[1.4vw] text-ink/70 leading-[1.45] max-w-[34vw]">
            Soft sky gradients. Crisp ink type. Saturated accents that pop like
            stickers. Tiny sparkles, blobby shapes, and the occasional 4-point
            star — we lean into the wink without overdoing it.
          </p>

          <div className="flex flex-col gap-[1vh] mt-[1vh]">
            <div className="font-display text-[1vw] tracking-[0.3em] uppercase text-ink/55">
              Tone
            </div>
            <div className="flex items-center gap-[0.7vw] flex-wrap">
              <span className="px-[1vw] py-[0.6vh] rounded-full bg-white border-[2px] border-ink/15 font-display font-bold text-[1.1vw] text-ink">
                Soft gradients
              </span>
              <span className="px-[1vw] py-[0.6vh] rounded-full bg-white border-[2px] border-ink/15 font-display font-bold text-[1.1vw] text-ink">
                Rounded shapes
              </span>
              <span className="px-[1vw] py-[0.6vh] rounded-full bg-white border-[2px] border-ink/15 font-display font-bold text-[1.1vw] text-ink">
                Sticker accents
              </span>
              <span className="px-[1vw] py-[0.6vh] rounded-full bg-white border-[2px] border-ink/15 font-display font-bold text-[1.1vw] text-ink">
                Generous spacing
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 grid-rows-2 gap-[1.2vw] h-[64vh]">
          <div className="relative bg-white rounded-[1.2vw] border-[2px] border-ink/10 overflow-hidden flex items-center justify-center">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(140deg, #DCEEFB 0%, #FFFFFF 70%)",
              }}
            />
            <div className="relative font-display font-black text-ink text-[2vw] tracking-tight">
              Soft gradient
            </div>
          </div>

          <div className="relative bg-white rounded-[1.2vw] border-[2px] border-ink/10 overflow-hidden flex items-center justify-center gap-[1vw]">
            <Sparkle className="w-[3vw] h-[3vw]" color="#E3ED43" />
            <Star4 className="w-[2.6vw] h-[2.6vw]" color="#FF7BD0" />
            <Sparkle className="w-[2vw] h-[2vw]" color="#00A4FA" />
            <span className="absolute bottom-[1vh] right-[1vw] font-display text-[1vw] text-ink/55 tracking-[0.18em] uppercase">
              Sticker accents
            </span>
          </div>

          <div className="relative bg-white rounded-[1.2vw] border-[2px] border-ink/10 overflow-hidden flex items-center justify-center">
            <Blob className="w-[14vw] h-[14vw] -rotate-12" color="#00A4FA" />
            <span className="absolute bottom-[1vh] right-[1vw] font-display text-[1vw] text-ink/55 tracking-[0.18em] uppercase">
              Blobby shapes
            </span>
          </div>

          <div className="relative bg-white rounded-[1.2vw] border-[2px] border-ink/10 overflow-hidden flex items-center justify-center">
            <Squiggle
              className="w-[18vw] h-[6vh]"
              color="#21263F"
              width={300}
              height={48}
            />
            <span className="absolute bottom-[1vh] right-[1vw] font-display text-[1vw] text-ink/55 tracking-[0.18em] uppercase">
              Squiggle line
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
