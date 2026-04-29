import { PageHeader } from "../../components/decorations";

const base = import.meta.env.BASE_URL;

export default function LogoSystem() {
  return (
    <div className="relative w-screen h-screen overflow-hidden slide-bg">
      <PageHeader index="02" label="Logo System" />

      <div className="relative h-full w-full px-[6vw] pt-[14vh] pb-[5vh] grid grid-cols-[1.1fr_0.9fr] gap-[3vw]">
        <div className="flex flex-col gap-[2vh]">
          <div className="font-display text-[1vw] tracking-[0.3em] uppercase text-ink/55">
            Primary lockup
          </div>
          <div className="relative bg-white rounded-[1.4vw] border-[2px] border-ink/10 px-[3vw] py-[5vh] flex items-center justify-center min-h-[28vh]">
            <img
              src={`${base}brand/wordmark_primary.png`}
              crossOrigin="anonymous"
              alt="Grafly primary wordmark"
              className="w-[26vw] h-auto"
            />
          </div>

          <div className="font-display text-[1vw] tracking-[0.3em] uppercase text-ink/55 mt-[1vh]">
            Lockup variations
          </div>
          <div className="grid grid-cols-3 gap-[1vw]">
            <div className="bg-white rounded-[0.9vw] border-[2px] border-ink/10 px-[1vw] py-[2vh] flex flex-col items-center justify-center gap-[1vh] min-h-[16vh]">
              <img
                src={`${base}brand/wordmark_horizontal.png`}
                crossOrigin="anonymous"
                alt="Horizontal lockup"
                className="w-[10vw] h-auto"
              />
              <span className="font-display text-[0.95vw] text-ink/55 tracking-[0.2em] uppercase">
                Horizontal
              </span>
            </div>
            <div className="bg-white rounded-[0.9vw] border-[2px] border-ink/10 px-[1vw] py-[2vh] flex flex-col items-center justify-center gap-[1vh] min-h-[16vh]">
              <img
                src={`${base}brand/wordmark_vertical.png`}
                crossOrigin="anonymous"
                alt="Vertical lockup"
                className="h-[10vh] w-auto"
              />
              <span className="font-display text-[0.95vw] text-ink/55 tracking-[0.2em] uppercase">
                Vertical
              </span>
            </div>
            <div className="bg-white rounded-[0.9vw] border-[2px] border-ink/10 px-[1vw] py-[2vh] flex flex-col items-center justify-center gap-[1vh] min-h-[16vh]">
              <img
                src={`${base}brand/icon_colored.png`}
                crossOrigin="anonymous"
                alt="Icon mark"
                className="h-[8vh] w-auto"
              />
              <span className="font-display text-[0.95vw] text-ink/55 tracking-[0.2em] uppercase">
                Icon
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-[2vh]">
          <div className="font-display text-[1vw] tracking-[0.3em] uppercase text-ink/55">
            Clear space
          </div>
          <div className="relative bg-white rounded-[1.4vw] border-[2px] border-ink/10 px-[2vw] py-[3vh] flex items-center justify-center min-h-[24vh]">
            <div className="relative inline-flex items-center justify-center border-[2px] border-dashed border-brand-blue/60 rounded-[0.6vw] p-[2vh]">
              <img
                src={`${base}brand/icon_colored.png`}
                crossOrigin="anonymous"
                alt="Icon clear-space"
                className="h-[10vh] w-auto"
              />
            </div>
            <div className="absolute bottom-[1.4vh] right-[1.4vw] font-display text-[0.95vw] text-ink/55">
              Margin = ½ icon height
            </div>
          </div>

          <div className="font-display text-[1vw] tracking-[0.3em] uppercase text-ink/55 mt-[1vh]">
            Do &amp; don&apos;t
          </div>
          <div className="grid grid-cols-2 gap-[1vw]">
            <div className="rounded-[0.9vw] bg-white border-[2px] border-brand-blue/40 px-[1vw] py-[1.6vh] flex flex-col items-center gap-[1vh] min-h-[14vh]">
              <img
                src={`${base}brand/wordmark_primary.png`}
                crossOrigin="anonymous"
                alt="Correct logo usage"
                className="w-[8vw] h-auto"
              />
              <span className="font-display font-bold text-[1.1vw] text-brand-blue tracking-[0.18em] uppercase">
                ✓ Do
              </span>
              <span className="font-display text-[0.95vw] text-ink/65 text-center leading-[1.3]">
                Use approved colors on light backgrounds.
              </span>
            </div>
            <div className="rounded-[0.9vw] bg-white border-[2px] border-brand-pink/50 px-[1vw] py-[1.6vh] flex flex-col items-center gap-[1vh] min-h-[14vh]">
              <div className="relative w-[8vw] h-[5vh] flex items-center justify-center">
                <img
                  src={`${base}brand/wordmark_primary.png`}
                  crossOrigin="anonymous"
                  alt="Incorrect skewed logo"
                  className="w-[8vw] h-auto skew-x-[-12deg] opacity-70"
                />
                <div className="absolute inset-0 border-[3px] border-brand-pink rounded-[0.4vw] rotate-[2deg]" />
              </div>
              <span className="font-display font-bold text-[1.1vw] text-brand-pink tracking-[0.18em] uppercase">
                ✗ Don&apos;t
              </span>
              <span className="font-display text-[0.95vw] text-ink/65 text-center leading-[1.3]">
                Stretch, skew, or recolor the wordmark.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
