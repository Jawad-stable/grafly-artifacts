import { PageHeader, Sparkle, Star4, Squiggle } from "../../components/decorations";

const base = import.meta.env.BASE_URL;

export default function SocialMedia() {
  return (
    <div className="relative w-screen h-screen overflow-hidden slide-bg">
      <PageHeader index="09" label="Social &amp; Marketing" />

      <Sparkle className="absolute right-[10vw] top-[12vh] w-[1.4vw] h-[1.4vw]" color="#E3ED43" />
      <Star4 className="absolute right-[18vw] top-[18vh] w-[1.4vw] h-[1.4vw]" color="#FF7BD0" />

      <div className="relative h-full w-full px-[6vw] pt-[14vh] pb-[5vh] flex flex-col gap-[2.4vh]">
        <div className="flex items-end justify-between">
          <h1 className="font-display font-black text-ink text-[4.4vw] leading-[0.95] tracking-tight max-w-[58vw]">
            Grafly{" "}
            <span className="relative inline-block">
              <span className="absolute inset-x-[-0.5vw] inset-y-[0.4vh] bg-brand-pink/45 -rotate-[1deg] rounded-[0.5vw]" />
              <span className="relative">on the feed.</span>
            </span>
          </h1>
          <p className="font-display text-[1.2vw] text-ink/65 max-w-[26vw] text-right leading-[1.4]">
            Square posts. Big type. One mascot. One sticker accent. Designed
            to be screenshotted and re-shared.
          </p>
        </div>

        <div className="grid grid-cols-4 gap-[1.2vw] flex-1">
          {/* Daily design tip */}
          <div className="bg-white rounded-[1vw] border-[2px] border-ink/10 overflow-hidden flex flex-col">
            <div className="aspect-square bg-cream relative overflow-hidden flex flex-col p-[1vw]">
              <Sparkle className="absolute top-[1vh] right-[1vw] w-[1.4vw] h-[1.4vw]" color="#E3ED43" />
              <div className="font-display text-[0.85vw] tracking-[0.25em] uppercase text-ink/55">
                Tip · 014
              </div>
              <div className="mt-auto">
                <span className="font-display font-black text-ink text-[1.4vw] leading-[1.05] tracking-tight">
                  pick a primary,{" "}
                  <span className="bg-brand-blue/35 px-[0.3vw] rounded-[0.3vw]">
                    then a friend.
                  </span>
                </span>
              </div>
              <img
                src={`${base}brand/idle.png`}
                crossOrigin="anonymous"
                alt="Mascot"
                className="absolute bottom-[0.4vh] right-[-0.4vw] h-[8vh] w-auto"
              />
            </div>
            <div className="px-[1vw] py-[1vh] flex items-center justify-between">
              <span className="font-display font-bold text-ink text-[1.05vw]">Daily tip</span>
              <span className="font-display text-[0.95vw] text-ink/55">@grafly</span>
            </div>
          </div>

          {/* Lesson teaser */}
          <div className="bg-white rounded-[1vw] border-[2px] border-ink/10 overflow-hidden flex flex-col">
            <div className="aspect-square bg-brand-blue relative overflow-hidden flex flex-col p-[1vw]">
              <Star4 className="absolute top-[1vh] right-[1vw] w-[1.4vw] h-[1.4vw]" color="#E3ED43" />
              <div className="font-display text-[0.85vw] tracking-[0.25em] uppercase text-cream/85">
                New lesson · Tue
              </div>
              <div className="mt-auto">
                <span className="font-display font-black text-cream text-[1.6vw] leading-[1] tracking-tight">
                  color theory,
                </span>
                <div className="mt-[0.4vh]">
                  <span className="font-display font-black text-ink bg-brand-yellow px-[0.4vw] py-[0.2vh] rounded-[0.3vw] text-[1.6vw] leading-[1] tracking-tight">
                    in 3 mins.
                  </span>
                </div>
              </div>
              <img
                src={`${base}brand/think.png`}
                crossOrigin="anonymous"
                alt="Mascot thinking"
                className="absolute bottom-[0.4vh] right-[-0.4vw] h-[8vh] w-auto"
              />
            </div>
            <div className="px-[1vw] py-[1vh] flex items-center justify-between">
              <span className="font-display font-bold text-ink text-[1.05vw]">Lesson drop</span>
              <span className="font-display text-[0.95vw] text-ink/55">@grafly</span>
            </div>
          </div>

          {/* Streak celebration */}
          <div className="bg-white rounded-[1vw] border-[2px] border-ink/10 overflow-hidden flex flex-col">
            <div className="aspect-square bg-brand-yellow relative overflow-hidden flex flex-col p-[1vw]">
              <Sparkle className="absolute top-[1vh] left-[1vw] w-[1.4vw] h-[1.4vw]" color="#FF7BD0" />
              <Sparkle className="absolute top-[6vh] right-[1.4vw] w-[1.2vw] h-[1.2vw]" color="#00A4FA" />
              <div className="font-display text-[0.85vw] tracking-[0.25em] uppercase text-ink/55">
                Streak
              </div>
              <div className="mt-auto">
                <div className="font-display font-black text-ink text-[3vw] leading-[0.9] tracking-tight">
                  day 07.
                </div>
                <div className="font-display font-bold text-ink/80 text-[1vw] leading-[1.2] mt-[0.4vh]">
                  one week of inking.
                </div>
              </div>
              <img
                src={`${base}brand/celebrate.png`}
                crossOrigin="anonymous"
                alt="Mascot celebrating"
                className="absolute bottom-[0.4vh] right-[-0.4vw] h-[8vh] w-auto"
              />
            </div>
            <div className="px-[1vw] py-[1vh] flex items-center justify-between">
              <span className="font-display font-bold text-ink text-[1.05vw]">Streak share</span>
              <span className="font-display text-[0.95vw] text-ink/55">@grafly</span>
            </div>
          </div>

          {/* Community quote */}
          <div className="bg-white rounded-[1vw] border-[2px] border-ink/10 overflow-hidden flex flex-col">
            <div className="aspect-square bg-brand-pink relative overflow-hidden flex flex-col p-[1vw]">
              <Squiggle
                className="absolute top-[1.4vh] right-[1vw] w-[5vw] h-[1.4vh] opacity-70"
                color="#21263F"
                width={120}
                height={20}
              />
              <div className="font-display text-[0.85vw] tracking-[0.25em] uppercase text-ink/65">
                Community
              </div>
              <div className="mt-auto pr-[3vw]">
                <span className="font-display font-black text-ink text-[1.3vw] leading-[1.15] tracking-tight">
                  &ldquo;i drew my first poster — never thought i could.&rdquo;
                </span>
                <div className="mt-[0.4vh] font-display text-[0.85vw] text-ink/65 tracking-[0.18em] uppercase">
                  — maya, age 14
                </div>
              </div>
              <img
                src={`${base}brand/cool_yellow.png`}
                crossOrigin="anonymous"
                alt="Mascot cool"
                className="absolute bottom-[0.4vh] right-[-0.4vw] h-[8vh] w-auto"
              />
            </div>
            <div className="px-[1vw] py-[1vh] flex items-center justify-between">
              <span className="font-display font-bold text-ink text-[1.05vw]">Community</span>
              <span className="font-display text-[0.95vw] text-ink/55">@grafly</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[1vw] border-[2px] border-ink/10 px-[1.6vw] py-[1.4vh] flex items-center gap-[1.4vw]">
          <span className="font-display text-[1vw] tracking-[0.3em] uppercase text-ink/55 whitespace-nowrap">
            Marketing rules
          </span>
          <span className="font-display font-medium text-ink/75 text-[1.1vw] leading-[1.4]">
            One headline · one mascot · one accent shape. Sky, cream, yellow,
            or pink background. Wordmark in the bottom corner. Never crop the
            mascot.
          </span>
        </div>
      </div>
    </div>
  );
}
