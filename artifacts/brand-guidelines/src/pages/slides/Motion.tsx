import { PageHeader, Sparkle } from "../../components/decorations";

export default function Motion() {
  return (
    <div className="relative w-screen h-screen overflow-hidden slide-bg">
      <PageHeader index="13" label="Motion Principles" />

      <Sparkle className="absolute right-[10vw] top-[12vh] w-[1.4vw] h-[1.4vw]" color="#E3ED43" />

      <div className="relative h-full w-full px-[6vw] pt-[14vh] pb-[5vh] flex flex-col gap-[3vh]">
        <div className="flex items-end justify-between">
          <h1 className="font-display font-black text-ink text-[4.4vw] leading-[0.95] tracking-tight max-w-[58vw]">
            Things move{" "}
            <span className="relative inline-block">
              <span className="absolute inset-x-[-0.5vw] inset-y-[0.4vh] bg-brand-pink/45 -rotate-[1deg] rounded-[0.5vw]" />
              <span className="relative">like they mean it.</span>
            </span>
          </h1>
          <p className="font-display text-[1.2vw] text-ink/65 max-w-[28vw] text-right leading-[1.4]">
            Snappy easing. Short durations. Always purposeful — never
            decorative for its own sake.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-[1.4vw] flex-1">
          <div className="bg-white rounded-[1.2vw] border-[2px] border-ink/10 px-[1.6vw] py-[2vh] flex flex-col gap-[1.2vh]">
            <div className="flex items-center gap-[0.7vw]">
              <span className="inline-flex items-center justify-center w-[2.6vw] h-[2.6vw] rounded-full bg-brand-blue text-cream font-display font-black text-[1.1vw]">
                1
              </span>
              <span className="font-display font-black text-ink text-[1.7vw] tracking-tight">
                Snap, don&apos;t slide
              </span>
            </div>
            <p className="font-display font-medium text-[1.1vw] text-ink/75 leading-[1.4]">
              We use a sharp ease-out curve. Things arrive quickly and settle.
              No long, slow ramps — they read as laggy.
            </p>
            <div className="mt-auto pt-[1vh] bg-cream rounded-[0.6vw] p-[1vw]">
              <svg viewBox="0 0 200 80" className="w-full h-[10vh]" fill="none">
                <path d="M 10 70 Q 30 70, 50 30 T 190 10" stroke="#21263F" strokeWidth="3" strokeLinecap="round" />
                <circle cx="190" cy="10" r="5" fill="#00A4FA" />
                <text x="10" y="78" fontFamily="Teshrin" fontSize="10" fill="#21263F" opacity="0.55">0ms</text>
                <text x="170" y="78" fontFamily="Teshrin" fontSize="10" fill="#21263F" opacity="0.55">200ms</text>
              </svg>
              <div className="font-display text-[0.95vw] text-ink/55 tracking-[0.18em] uppercase">
                ease-out · 200ms
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[1.2vw] border-[2px] border-ink/10 px-[1.6vw] py-[2vh] flex flex-col gap-[1.2vh]">
            <div className="flex items-center gap-[0.7vw]">
              <span className="inline-flex items-center justify-center w-[2.6vw] h-[2.6vw] rounded-full bg-brand-yellow text-ink font-display font-black text-[1.1vw]">
                2
              </span>
              <span className="font-display font-black text-ink text-[1.7vw] tracking-tight">
                Short and short
              </span>
            </div>
            <p className="font-display font-medium text-[1.1vw] text-ink/75 leading-[1.4]">
              Three durations only. Anything longer than 400ms feels heavy on
              a mobile screen and gets in the way.
            </p>
            <div className="mt-auto pt-[1vh] flex flex-col gap-[0.8vh]">
              <div className="flex items-center gap-[0.8vw]">
                <span className="font-display font-bold text-ink text-[1.05vw] w-[5vw]">120ms</span>
                <span className="block h-[1.2vh] bg-brand-blue rounded-full" style={{ width: "20%" }} />
                <span className="font-display text-[0.95vw] text-ink/55">tap feedback</span>
              </div>
              <div className="flex items-center gap-[0.8vw]">
                <span className="font-display font-bold text-ink text-[1.05vw] w-[5vw]">200ms</span>
                <span className="block h-[1.2vh] bg-brand-blue rounded-full" style={{ width: "40%" }} />
                <span className="font-display text-[0.95vw] text-ink/55">enter / exit</span>
              </div>
              <div className="flex items-center gap-[0.8vw]">
                <span className="font-display font-bold text-ink text-[1.05vw] w-[5vw]">400ms</span>
                <span className="block h-[1.2vh] bg-brand-blue rounded-full" style={{ width: "70%" }} />
                <span className="font-display text-[0.95vw] text-ink/55">celebrations</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[1.2vw] border-[2px] border-ink/10 px-[1.6vw] py-[2vh] flex flex-col gap-[1.2vh]">
            <div className="flex items-center gap-[0.7vw]">
              <span className="inline-flex items-center justify-center w-[2.6vw] h-[2.6vw] rounded-full bg-brand-pink text-ink font-display font-black text-[1.1vw]">
                3
              </span>
              <span className="font-display font-black text-ink text-[1.7vw] tracking-tight">
                One thing at a time
              </span>
            </div>
            <p className="font-display font-medium text-[1.1vw] text-ink/75 leading-[1.4]">
              One element moves per moment. The mascot bounces, or a card
              slides — never both at once. Calm is a feature.
            </p>
            <div className="mt-auto pt-[1vh] bg-cream rounded-[0.6vw] p-[1vw] flex items-center gap-[0.8vw]">
              <span className="block w-[2vw] h-[2vw] rounded-[0.4vw] bg-brand-pink" />
              <span className="font-display font-black text-ink text-[1.4vw] tracking-tight">→</span>
              <span className="block w-[2vw] h-[2vw] rounded-[0.4vw] bg-brand-pink" />
              <div className="ml-auto font-display text-[0.95vw] text-ink/55 tracking-[0.18em] uppercase text-right leading-[1.2]">
                One element<br />moves
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[1vw] border-[2px] border-ink/10 px-[1.6vw] py-[1.4vh] flex items-center gap-[1.4vw]">
          <span className="font-display text-[1vw] tracking-[0.3em] uppercase text-ink/55 whitespace-nowrap">
            Reduce motion
          </span>
          <span className="font-display font-medium text-ink/75 text-[1.1vw] leading-[1.4]">
            Respect the OS-level &ldquo;reduce motion&rdquo; setting. Replace
            transitions with instant state changes — never disable feedback
            entirely.
          </span>
        </div>
      </div>
    </div>
  );
}
