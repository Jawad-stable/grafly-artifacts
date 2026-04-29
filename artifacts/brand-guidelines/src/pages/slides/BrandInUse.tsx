import { PageHeader, Sparkle, Star4, Squiggle } from "../../components/decorations";

const base = import.meta.env.BASE_URL;

export default function BrandInUse() {
  return (
    <div className="relative w-screen h-screen overflow-hidden slide-bg">
      <PageHeader index="12" label="Brand In Use" />

      <Sparkle className="absolute right-[10vw] top-[12vh] w-[1.4vw] h-[1.4vw]" color="#E3ED43" />
      <Star4 className="absolute right-[18vw] top-[18vh] w-[1.4vw] h-[1.4vw]" color="#FF7BD0" />

      <div className="relative h-full w-full px-[6vw] pt-[14vh] pb-[5vh] flex flex-col gap-[2.4vh]">
        <div className="flex items-end justify-between">
          <h1 className="font-display font-black text-ink text-[4.4vw] leading-[0.95] tracking-tight max-w-[58vw]">
            Brand{" "}
            <span className="relative inline-block">
              <span className="absolute inset-x-[-0.5vw] inset-y-[0.4vh] bg-brand-blue/30 -rotate-[1deg] rounded-[0.5vw]" />
              <span className="relative">in the wild.</span>
            </span>
          </h1>
          <p className="font-display text-[1.2vw] text-ink/65 max-w-[28vw] text-right leading-[1.4]">
            Stickers, totes, laptop swag, school posters — wherever the
            identity needs to land in the real world.
          </p>
        </div>

        <div className="grid grid-cols-4 gap-[1.2vw] flex-1">
          {/* Sticker pack */}
          <div className="bg-white rounded-[1vw] border-[2px] border-ink/10 overflow-hidden flex flex-col">
            <div className="aspect-square bg-brand-sky relative overflow-hidden flex items-center justify-center">
              <div className="absolute top-[2vh] left-[1.4vw] w-[5vw] h-[5vw] rounded-full bg-brand-yellow border-[3px] border-ink/15 flex items-center justify-center">
                <img
                  src={`${base}brand/icon_colored.png`}
                  crossOrigin="anonymous"
                  alt="Sticker icon"
                  className="w-[3vw] h-auto"
                />
              </div>
              <div className="absolute bottom-[1.4vh] right-[1.4vw] w-[6vw] h-[3.4vh] rounded-full bg-brand-pink border-[3px] border-ink/15 flex items-center justify-center">
                <span className="font-display font-black text-ink text-[1.1vw] tracking-tight">
                  ink it.
                </span>
              </div>
              <div className="w-[8vw] h-[8vw] rounded-full bg-white border-[3px] border-ink/15 flex items-center justify-center -rotate-[6deg]">
                <span className="font-display font-black text-ink text-[1.4vw] text-center leading-[1] tracking-tight">
                  draw<br />today.
                </span>
              </div>
            </div>
            <div className="px-[1vw] py-[1vh] flex items-center justify-between">
              <span className="font-display font-bold text-ink text-[1.05vw]">Stickers</span>
              <span className="font-display text-[0.95vw] text-ink/55">die-cut</span>
            </div>
          </div>

          {/* Tote bag */}
          <div className="bg-white rounded-[1vw] border-[2px] border-ink/10 overflow-hidden flex flex-col">
            <div className="aspect-square bg-cream relative overflow-hidden flex items-center justify-center p-[1.2vw]">
              <div className="absolute top-[1vh] left-[3vw] right-[3vw] h-[3vh] flex items-center justify-between">
                <span className="block w-[1.4vw] h-[3vh] border-[3px] border-ink/40 rounded-t-full bg-transparent" />
                <span className="block w-[1.4vw] h-[3vh] border-[3px] border-ink/40 rounded-t-full bg-transparent" />
              </div>
              <div className="mt-[3vh] w-full h-[80%] bg-white rounded-[0.6vw] border-[3px] border-ink/15 flex flex-col items-center justify-center gap-[0.6vh]">
                <img
                  src={`${base}brand/wordmark_primary.png`}
                  crossOrigin="anonymous"
                  alt="Wordmark on tote"
                  className="w-[8vw] h-auto"
                />
                <Squiggle
                  className="w-[6vw] h-[1.4vh]"
                  color="#21263F"
                  width={120}
                  height={20}
                />
                <span className="font-display font-medium text-ink/65 text-[0.9vw] tracking-[0.18em] uppercase mt-[0.4vh]">
                  ink outside the box
                </span>
              </div>
            </div>
            <div className="px-[1vw] py-[1vh] flex items-center justify-between">
              <span className="font-display font-bold text-ink text-[1.05vw]">Tote</span>
              <span className="font-display text-[0.95vw] text-ink/55">cotton · natural</span>
            </div>
          </div>

          {/* T-shirt */}
          <div className="bg-white rounded-[1vw] border-[2px] border-ink/10 overflow-hidden flex flex-col">
            <div className="aspect-square bg-brand-pink relative overflow-hidden flex items-center justify-center p-[1vw]">
              <div className="relative w-full h-full bg-cream rounded-[1vw] flex items-center justify-center">
                <img
                  src={`${base}brand/celebrate.png`}
                  crossOrigin="anonymous"
                  alt="Mascot tee"
                  className="h-[60%] w-auto"
                />
                <span className="absolute bottom-[1.4vh] font-display font-black text-ink text-[1.2vw] tracking-tight">
                  team grafly
                </span>
                <Sparkle className="absolute top-[2vh] right-[1.4vw] w-[1.2vw] h-[1.2vw]" color="#E3ED43" />
              </div>
            </div>
            <div className="px-[1vw] py-[1vh] flex items-center justify-between">
              <span className="font-display font-bold text-ink text-[1.05vw]">T-shirt</span>
              <span className="font-display text-[0.95vw] text-ink/55">cream · screen-print</span>
            </div>
          </div>

          {/* Poster */}
          <div className="bg-white rounded-[1vw] border-[2px] border-ink/10 overflow-hidden flex flex-col">
            <div className="aspect-square bg-brand-yellow relative overflow-hidden p-[1vw] flex flex-col">
              <Star4 className="absolute top-[1.4vh] right-[1.4vw] w-[1.6vw] h-[1.6vw]" color="#FF7BD0" />
              <span className="font-display text-[0.85vw] tracking-[0.3em] uppercase text-ink/55">
                Workshop · Sat
              </span>
              <div className="mt-[1vh]">
                <span className="font-display font-black text-ink text-[2vw] leading-[0.95] tracking-tight">
                  draw something
                </span>
                <div className="font-display font-black text-ink text-[2vw] leading-[0.95] tracking-tight">
                  with us.
                </div>
              </div>
              <img
                src={`${base}brand/idle.png`}
                crossOrigin="anonymous"
                alt="Mascot poster"
                className="absolute bottom-[1vh] right-[1vw] h-[10vh] w-auto"
              />
              <div className="mt-auto font-display font-bold text-ink/70 text-[0.95vw] tracking-[0.18em] uppercase">
                grafly.app/draw
              </div>
            </div>
            <div className="px-[1vw] py-[1vh] flex items-center justify-between">
              <span className="font-display font-bold text-ink text-[1.05vw]">Poster</span>
              <span className="font-display text-[0.95vw] text-ink/55">A2 · school events</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[1vw] border-[2px] border-ink/10 px-[1.6vw] py-[1.4vh] flex items-center gap-[1.4vw]">
          <span className="font-display text-[1vw] tracking-[0.3em] uppercase text-ink/55 whitespace-nowrap">
            Print rules
          </span>
          <span className="font-display font-medium text-ink/75 text-[1.1vw] leading-[1.4]">
            Two brand colors max per piece. Logo always with clear-space.
            Mascot full-body, never cropped. Lowercase headlines, ink color.
          </span>
        </div>
      </div>
    </div>
  );
}
