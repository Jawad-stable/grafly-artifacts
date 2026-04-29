import { PageHeader, Sparkle } from "../../components/decorations";

export default function VoiceMessaging() {
  return (
    <div className="relative w-screen h-screen overflow-hidden slide-bg">
      <PageHeader index="10" label="Voice &amp; Messaging" />

      <Sparkle className="absolute right-[10vw] top-[12vh] w-[1.4vw] h-[1.4vw]" color="#E3ED43" />

      <div className="relative h-full w-full px-[6vw] pt-[14vh] pb-[5vh] grid grid-cols-[0.9fr_1.1fr] gap-[3vw]">
        <div className="flex flex-col gap-[2vh]">
          <h1 className="font-display font-black text-ink text-[4.6vw] leading-[0.92] tracking-tight">
            We talk like a{" "}
            <span className="relative inline-block">
              <span className="absolute inset-x-[-0.5vw] inset-y-[0.4vh] bg-brand-blue/35 -rotate-[1deg] rounded-[0.5vw]" />
              <span className="relative">good friend.</span>
            </span>
          </h1>
          <p className="font-display text-[1.3vw] text-ink/70 leading-[1.45] max-w-[34vw]">
            Encouraging, never preachy. We write the way teenagers actually
            speak — short, lowercase, warm. We earn trust by being specific,
            not by being clever.
          </p>

          <div className="font-display text-[1vw] tracking-[0.3em] uppercase text-ink/55 mt-[1vh]">
            Voice attributes
          </div>
          <div className="flex items-center gap-[0.7vw] flex-wrap">
            <span className="px-[1vw] py-[0.6vh] rounded-full bg-white border-[2px] border-ink/15 font-display font-bold text-[1.1vw] text-ink">
              Warm
            </span>
            <span className="px-[1vw] py-[0.6vh] rounded-full bg-white border-[2px] border-ink/15 font-display font-bold text-[1.1vw] text-ink">
              Specific
            </span>
            <span className="px-[1vw] py-[0.6vh] rounded-full bg-white border-[2px] border-ink/15 font-display font-bold text-[1.1vw] text-ink">
              Lowercase
            </span>
            <span className="px-[1vw] py-[0.6vh] rounded-full bg-white border-[2px] border-ink/15 font-display font-bold text-[1.1vw] text-ink">
              Short sentences
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-[1.4vh]">
          <div className="grid grid-cols-2 gap-[1vw]">
            <div className="rounded-[1vw] bg-white border-[2px] border-brand-blue/40 p-[1.2vw] flex flex-col gap-[0.6vh] min-h-[16vh]">
              <span className="font-display font-bold text-brand-blue text-[1vw] tracking-[0.18em] uppercase">
                ✓ We say
              </span>
              <span className="font-display font-black text-ink text-[1.4vw] leading-[1.2]">
                &ldquo;nice — try one more.&rdquo;
              </span>
              <span className="font-display text-[1vw] text-ink/55 leading-[1.3]">
                On a streak nudge
              </span>
            </div>
            <div className="rounded-[1vw] bg-white border-[2px] border-brand-pink/50 p-[1.2vw] flex flex-col gap-[0.6vh] min-h-[16vh]">
              <span className="font-display font-bold text-brand-pink text-[1vw] tracking-[0.18em] uppercase">
                ✗ Never
              </span>
              <span className="font-display font-black text-ink/85 text-[1.4vw] leading-[1.2]">
                &ldquo;Excellent! You should try the next one.&rdquo;
              </span>
              <span className="font-display text-[1vw] text-ink/55 leading-[1.3]">
                Too formal · sounds like a teacher
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-[1vw]">
            <div className="rounded-[1vw] bg-white border-[2px] border-brand-blue/40 p-[1.2vw] flex flex-col gap-[0.6vh] min-h-[16vh]">
              <span className="font-display font-bold text-brand-blue text-[1vw] tracking-[0.18em] uppercase">
                ✓ We say
              </span>
              <span className="font-display font-black text-ink text-[1.4vw] leading-[1.2]">
                &ldquo;close. shift the blue down.&rdquo;
              </span>
              <span className="font-display text-[1vw] text-ink/55 leading-[1.3]">
                On a wrong answer
              </span>
            </div>
            <div className="rounded-[1vw] bg-white border-[2px] border-brand-pink/50 p-[1.2vw] flex flex-col gap-[0.6vh] min-h-[16vh]">
              <span className="font-display font-bold text-brand-pink text-[1vw] tracking-[0.18em] uppercase">
                ✗ Never
              </span>
              <span className="font-display font-black text-ink/85 text-[1.4vw] leading-[1.2]">
                &ldquo;Incorrect. Please review the lesson.&rdquo;
              </span>
              <span className="font-display text-[1vw] text-ink/55 leading-[1.3]">
                Cold · feels like a wrong-answer beep
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-[1vw]">
            <div className="rounded-[1vw] bg-white border-[2px] border-brand-blue/40 p-[1.2vw] flex flex-col gap-[0.6vh] min-h-[16vh]">
              <span className="font-display font-bold text-brand-blue text-[1vw] tracking-[0.18em] uppercase">
                ✓ We say
              </span>
              <span className="font-display font-black text-ink text-[1.4vw] leading-[1.2]">
                &ldquo;new lesson dropping tuesday.&rdquo;
              </span>
              <span className="font-display text-[1vw] text-ink/55 leading-[1.3]">
                On a marketing post
              </span>
            </div>
            <div className="rounded-[1vw] bg-white border-[2px] border-brand-pink/50 p-[1.2vw] flex flex-col gap-[0.6vh] min-h-[16vh]">
              <span className="font-display font-bold text-brand-pink text-[1vw] tracking-[0.18em] uppercase">
                ✗ Never
              </span>
              <span className="font-display font-black text-ink/85 text-[1.4vw] leading-[1.2]">
                &ldquo;Unlock your next breakthrough!&rdquo;
              </span>
              <span className="font-display text-[1vw] text-ink/55 leading-[1.3]">
                Marketing-speak · we just don&apos;t say things like this
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
