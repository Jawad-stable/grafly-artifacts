import VideoTemplate from "@/components/video/VideoTemplate";

export default function App() {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden">
      <div
        className="relative"
        style={{
          width: 'min(100vw, calc(100vh * 16 / 9))',
          height: 'min(100vh, calc(100vw * 9 / 16))',
        }}
      >
        <VideoTemplate />
      </div>
    </div>
  );
}
