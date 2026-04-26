import {
  Sparkle,
  Cursor,
  BezierPath,
  Heart,
  ChatBubble,
} from "../../components/decorations";

const base = import.meta.env.BASE_URL;

export default function Closing() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-ink">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(150deg, #2C3257 0%, #21263F 60%, #161A2E 100%)",
        }}
      />

      <BezierPath className="absolute right-[5vw] bottom-[18vh] w-[22vw] h-[8vh] opacity-50 -rotate-[6deg]" stroke="#F7F4DC" />
      <Sparkle className="absolute left-[10vw] top-[16vh] w-[2.4vw] h-[2.4vw]" color="#E3ED43" />
      <Sparkle className="absolute right-[16vw] top-[20vh] w-[1.6vw] h-[1.6vw]" color="#FF7BD0" />
      <Sparkle className="absolute left-[8vw] bottom-[18vh] w-[1.6vw] h-[1.6vw]" color="#00A4FA" />
      <Heart className="absolute left-[3vw] top-[44vh] w-[2vw] h-[2vw] -rotate-[14deg]" color="#FF7BD0" />
      <Cursor className="absolute right-[5vw] top-[40vh] w-[2vw] h-[2.4vw] -rotate-[18deg]" color="#F7F4DC" />

      <img
        src={`${base}brand/wordmark_white.png`}
        crossOrigin="anonymous"
        alt="Grafly"
        className="absolute top-[5vh] left-[6vw] h-[3.4vh] w-auto"
      />

      <div className="absolute top-[6vh] right-[6vw] font-display text-cream/50 text-[1.4vw] tracking-[0.35em] uppercase">
        Closing
      </div>

      <div className="relative h-full w-full grid grid-cols-[1.1fr_0.9fr] items-center px-[7vw] gap-[3vw]">
        <div className="flex flex-col justify-center gap-[3vh]">
          <h1 className="font-display font-black text-cream text-[10vw] leading-[0.92] tracking-tight">
            Thank{" "}
            <span className="relative inline-block">
              <span className="absolute inset-x-[-0.6vw] inset-y-[1vh] bg-brand-pink/55 -rotate-[2deg] rounded-[0.6vw]" />
              <span className="relative text-cream">you.</span>
            </span>
          </h1>

          <p className="font-display font-medium text-cream/80 text-[2.2vw] leading-[1.25] max-w-[44vw] text-pretty">
            Now go{" "}
            <span className="font-black text-brand-yellow">ink outside the box.</span>
          </p>

          <div className="flex items-center gap-[1vw] mt-[2vh] flex-wrap">
            <span className="inline-flex items-center gap-[0.7vw] px-[1.4vw] py-[1vh] rounded-full bg-brand-blue text-cream font-display font-bold text-[1.4vw]">
              <span className="inline-block w-[0.9vw] h-[0.9vw] rounded-full bg-cream" />
              Try Grafly
            </span>
            <span className="inline-flex items-center gap-[0.7vw] px-[1.4vw] py-[1vh] rounded-full bg-transparent border-[2px] border-cream/40 text-cream font-display font-bold text-[1.4vw]">
              <span className="inline-block w-[0.9vw] h-[0.9vw] rounded-full bg-brand-pink" />
              Questions?
            </span>
          </div>
        </div>

        <div className="relative h-full flex items-center justify-center">
          <div
            className="absolute w-[28vw] h-[28vw] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(227,237,67,0.22) 0%, rgba(227,237,67,0) 70%)",
            }}
          />
          <img
            src={`${base}brand/celebrate.png`}
            crossOrigin="anonymous"
            alt="Grafly mascot celebrating"
            className="relative w-[30vw] h-auto drop-shadow-[0_2vw_3vw_rgba(0,0,0,0.4)]"
          />
        </div>

        <ChatBubble
          className="absolute"
          style={{ top: "18vh", right: "5vw", transform: "rotate(6deg)" }}
          text="see you on the canvas"
          bg="#F7F4DC"
          color="#21263F"
        />
      </div>
    </div>
  );
}
