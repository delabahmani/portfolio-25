import { useState, useRef, useEffect } from "react";
import "./wmp.css";

interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  src: string;
  artwork?: string;
}

const tracks: Track[] = [
  {
    id: "track-1",
    title: "Almost Blue",
    artist: "Chet Baker",
    album: "Chet Baker Sings",
    duration: 453,
    src: "/assets/audio/Almost-Blue.mp3",
    artwork: "/assets/images/albums/Chet-Baker-Sings.webp",
  },
];

const MediaPlayer: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);

  const currentTrack = tracks[currentTrackIndex];

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ASPECT_W = 400;
    const ASPECT_H = 236;
    const aspect = ASPECT_W / ASPECT_H;

    const resize = () => {
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      const cw = container.clientWidth;
      const ch = container.clientHeight;

      // Fit canvas to container while preserving aspect ratio
      const targetWidth = cw;
      const targetHeight = Math.round(targetWidth / aspect);
      const finalHeight = Math.min(targetHeight, ch);
      const finalWidth = Math.round(finalHeight * aspect);

      // Set CSS size
      canvas.style.width = `${finalWidth}px`;
      canvas.style.height = `${finalHeight}px`;

      // Set drawing buffer size (for crisp rendering)
      canvas.width = Math.round(finalWidth * dpr);
      canvas.height = Math.round(finalHeight * dpr);

      // Scale drawing to account for DPR
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
    };

    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(container);

    // Also update on DPR changes
    const mq = window.matchMedia(
      `(resolution: ${window.devicePixelRatio}dppx)`
    );
    const handleDPRChange = () => resize();
    mq.addEventListener?.("change", handleDPRChange);

    return () => {
      ro.disconnect();
      mq.removeEventListener?.("change", handleDPRChange);
    };
  }, []);

  // Visualization
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    const draw = () => {
      animationId = requestAnimationFrame(draw);

      // Clear using CSS pixel units (we set transform to DPR in resize effect)
      const cssWidth = parseFloat(canvas.style.width) || 400;
      const cssHeight = parseFloat(canvas.style.height) || 236;

      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, cssWidth, cssHeight);

      if (!isPlaying || !analyserRef.current) return;

      const analyser = analyserRef.current;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteFrequencyData(dataArray);

      // Scale bars with canvas size
      const barWidth = Math.max(3, Math.round(cssWidth * 0.01)); // ~1% of width
      const gap = Math.max(2, Math.round(cssWidth * 0.005)); // ~0.5% of width
      const totalBars = Math.floor(cssWidth / (barWidth + gap));

      for (let i = 0; i < totalBars; i++) {
        const dataIndex = Math.floor((i * bufferLength) / totalBars);
        const value = dataArray[dataIndex] / 255;
        const barHeight = value * cssHeight * 0.8;

        const x = i * (barWidth + gap);
        const y = cssHeight - barHeight;

        const gradient = ctx.createLinearGradient(x, cssHeight, x, y);
        gradient.addColorStop(0, "#00f900");
        gradient.addColorStop(0.7, "#00f900");
        gradient.addColorStop(1, "#e6e9e8");

        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth, barHeight);
      }
    };

    draw();
    return () => cancelAnimationFrame(animationId);
  }, [isPlaying]);

  const togglePlay = async () => {
    if (!audioRef.current) return;

    if (!audioContextRef.current) {
      const AudioContextClass =
        window.AudioContext ||
        (window as typeof window & { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      const audioContext = new AudioContextClass();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaElementSource(audioRef.current);

      source.connect(analyser);
      analyser.connect(audioContext.destination);
      analyser.fftSize = 128;

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      audioRef.current.volume = volume;
    }

    try {
      if (audioContextRef.current.state === "suspended") {
        await audioContextRef.current.resume();
      }

      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Play error:", error);
      setIsPlaying(false);
    }
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentTime(0);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleTrackChange = async (index: number) => {
    setCurrentTrackIndex(index);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
    if (isPlaying && audioRef.current) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      try {
        await audioRef.current.play();
      } catch (error) {
        console.error("Track change error:", error);
      }
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#c0c0c0] text-black select-none overflow-hidden">
      <audio
        ref={audioRef}
        src={currentTrack.src}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onEnded={() =>
          handleTrackChange((currentTrackIndex + 1) % tracks.length)
        }
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Visualization area */}
      <div className="flex-1 overflow-hidden bg-black relative">
        <div className="w-full h-full" ref={containerRef}>
          <canvas
            ref={canvasRef}
            width={400}
            height={236}
            className="w-full h-full"
          />
        </div>
        {/* Track info overlay */}
        <div className="absolute top-2 left-2 text-white">
          <div className="text-sm">{currentTrack.artist}</div>
          <div className="text-base font-semibold">{currentTrack.title}</div>
        </div>
      </div>

      {/* Status bar */}
      <div className="flex-shrink-0 flex items-center justify-between px-3 py-1 bg-black text-[#00f900] text-xs font-semibold border-t border-[#cdcdd3]">
        <span>{isPlaying ? "Playing" : "Stopped"}</span>
        <span>
          {formatTime(currentTime)} / {formatTime(currentTrack.duration)}
        </span>
      </div>

      {/* Transport controls */}
      <div className="wmp-controls flex-shrink-0">
        {/* Play/Pause */}
        <button
          className={`wmp-button wmp-button-play ${
            isPlaying ? "wmp-button-pause" : ""
          }`}
          onClick={togglePlay}
          title={isPlaying ? "Pause" : "Play"}
        >
          <span className="wmp-button-body" />
        </button>

        {/* Stop */}
        <button
          className="wmp-button wmp-button-stop"
          onClick={handleStop}
          title="Stop"
        >
          <span className="wmp-button-body" />
        </button>

        {/* Previous */}
        <button
          className="wmp-button wmp-button-prev"
          onClick={() =>
            handleTrackChange(
              (currentTrackIndex - 1 + tracks.length) % tracks.length
            )
          }
          title="Previous"
        >
          <span className="wmp-button-body" />
        </button>

        {/* Next */}
        <button
          className="wmp-button wmp-button-next"
          onClick={() =>
            handleTrackChange((currentTrackIndex + 1) % tracks.length)
          }
          title="Next"
        >
          <span className="wmp-button-body" />
        </button>

        {/* Mute */}
        <button
          className={`wmp-button wmp-button-mute ${isMuted ? "active" : ""}`}
          onClick={toggleMute}
          title={isMuted ? "Unmute" : "Mute"}
        >
          <span className="wmp-button-body" />
        </button>

        {/* Volume */}
        <div className="wmp-volbar">
          <div className="wmp-volbar-bg" />
          <div
            className="wmp-volbar-fill"
            style={{ width: `${volume * 45}px` }}
          />
          <div
            className="wmp-volbar-pointer"
            style={{ left: `${4 + volume * 45}px` }}
          />
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={(e) => {
              const newVol = Number(e.target.value);
              setVolume(newVol);
              if (audioRef.current) audioRef.current.volume = newVol;
            }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default MediaPlayer;
