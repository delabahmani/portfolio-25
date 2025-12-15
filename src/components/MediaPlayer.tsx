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

type VisualizationType = "bars" | "alchemy" | "album";

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
  {
    id: "track-2",
    title: "Inner City Blues",
    artist: "Marvin Gaye",
    album: "What's Going On",
    duration: 314.4,
    src: "/assets/audio/Inner-City-Blues.mp3",
    artwork: "/assets/images/albums/Whats-Going-On.webp",
  },
  {
    id: "track-3",
    title: "It Never Entered My Mind",
    artist: "Miles Davis",
    album: "Working With The Miles Davis Quintet",
    duration: 318,
    src: "/assets/audio/It-Never-Entered-My-Mind.mp3",
    artwork: "/assets/images/albums/Working-With-The-Miles-Davis-Quintet.webp",
  },
  {
    id: "track-4",
    title: "Showdown",
    artist: "Electric Light Orchestra",
    album: "On the Third Day",
    duration: 245.5,
    src: "/assets/audio/Showdown.mp3",
    artwork: "/assets/images/albums/On-The-Third-Day.webp",
  },
];

const MediaPlayer: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const seekBarRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const [visualization, setVisualization] = useState<VisualizationType>("bars");
  const [albumImages, setAlbumImages] = useState<Map<string, HTMLImageElement>>(
    new Map()
  );

  const currentTrack = tracks[currentTrackIndex];

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resize = () => {
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      const isMobile = window.innerWidth <= 768;

      let finalWidth, finalHeight;

      if (isMobile) {
        // Mobile: use container dimensions
        finalWidth = container.clientWidth;
        finalHeight = container.clientHeight;
      } else {
        // Desktop: maintain 400:236 aspect ratio
        const ASPECT_W = 400;
        const ASPECT_H = 236;
        const aspect = ASPECT_W / ASPECT_H;

        const cw = container.clientWidth;
        const ch = container.clientHeight;

        const targetWidth = cw;
        const targetHeight = Math.round(targetWidth / aspect);
        finalHeight = Math.min(targetHeight, ch);
        finalWidth = Math.round(finalHeight * aspect);
      }

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

    const mq = window.matchMedia(
      `(resolution: ${window.devicePixelRatio}dppx)`
    );
    const handleDPRChange = () => resize();
    mq.addEventListener?.("change", handleDPRChange);

    window.addEventListener("resize", resize);

    return () => {
      ro.disconnect();
      mq.removeEventListener?.("change", handleDPRChange);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // Visualization
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      color: string;
    }> = [];

    const drawBars = (
      dataArray: Uint8Array,
      cssWidth: number,
      cssHeight: number
    ) => {
      const barWidth = Math.max(3, Math.round(cssWidth * 0.01));
      const gap = Math.max(2, Math.round(cssWidth * 0.005));
      const totalBars = Math.floor(cssWidth / (barWidth + gap));

      for (let i = 0; i < totalBars; i++) {
        const dataIndex = Math.floor((i * dataArray.length) / totalBars);
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

    const drawAlchemy = (
      dataArray: Uint8Array,
      cssWidth: number,
      cssHeight: number
    ) => {
      const centerX = cssWidth / 2;
      const centerY = cssHeight / 2;
      const maxRadius = Math.min(cssWidth, cssHeight) * 0.65;

      // Animated background gradient based on audio
      const time = Date.now() / 1000;
      const avgFreq =
        dataArray.reduce((a, b) => a + b, 0) / dataArray.length / 255;

      // Create moving gradient background
      const bgGradient = ctx.createRadialGradient(
        centerX + Math.cos(time * 0.3) * 50,
        centerY + Math.sin(time * 0.5) * 50,
        0,
        centerX,
        centerY,
        Math.max(cssWidth, cssHeight) * 0.8
      );

      const hue1 = (time * 20) % 360;
      const hue2 = (time * 20 + 120) % 360;
      const hue3 = (time * 20 + 240) % 360;

      bgGradient.addColorStop(
        0,
        `hsla(${hue1}, 70%, ${15 + avgFreq * 25}%, 0.4)`
      );
      bgGradient.addColorStop(
        0.5,
        `hsla(${hue2}, 60%, ${10 + avgFreq * 20}%, 0.3)`
      );
      bgGradient.addColorStop(
        1,
        `hsla(${hue3}, 50%, ${5 + avgFreq * 15}%, 0.2)`
      );

      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, cssWidth, cssHeight);

      // Add some subtle moving shapes in background
      for (let i = 0; i < 3; i++) {
        const angle = time * 0.2 + (i * Math.PI * 2) / 3;
        const radius = 100 + Math.sin(time + i) * 30;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        const shapeGradient = ctx.createRadialGradient(x, y, 0, x, y, 60);
        const hue = (time * 30 + i * 120) % 360;
        shapeGradient.addColorStop(
          0,
          `hsla(${hue}, 80%, 50%, ${0.1 + avgFreq * 0.2})`
        );
        shapeGradient.addColorStop(1, "hsla(0, 0%, 0%, 0)");

        ctx.fillStyle = shapeGradient;
        ctx.beginPath();
        ctx.arc(x, y, 60, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw multiple layers for smoother, more fluid appearance
      const slices = 128;

      // Outer flowing ring
      for (let layer = 0; layer < 3; layer++) {
        ctx.beginPath();
        for (let i = 0; i <= slices; i++) {
          const angle = (i / slices) * Math.PI * 2;
          const dataIndex = Math.floor((i * dataArray.length) / slices);
          const nextDataIndex = Math.floor(
            ((i + 1) * dataArray.length) / slices
          );
          const value = dataArray[dataIndex] / 255;
          const nextValue = dataArray[nextDataIndex] / 255;
          const smoothValue = (value + nextValue) / 2;

          const radius = smoothValue * maxRadius * 0.5 + layer * 6;
          const x = centerX + Math.cos(angle) * radius;
          const y = centerY + Math.sin(angle) * radius;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.closePath();

        // Create smooth gradient stroke
        const hue = (Date.now() / 50 + layer * 40) % 360;
        ctx.strokeStyle = `hsla(${hue}, 80%, 60%, ${0.4 - layer * 0.1})`;
        ctx.lineWidth = 3 - layer;
        ctx.stroke();
      }

      // Flowing particles around the circle
      for (let i = 0; i < slices / 2; i++) {
        const angle = (i / (slices / 2)) * Math.PI * 2;
        const dataIndex = Math.floor((i * dataArray.length) / (slices / 2));
        const value = dataArray[dataIndex] / 255;
        const radius = value * maxRadius * 0.5;

        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        // Soft, glowing orbs instead of hard dots
        const hue = (i / (slices / 2)) * 360;
        const orbSize = 3 + value * 8;

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, orbSize);
        gradient.addColorStop(0, `hsla(${hue}, 100%, 70%, ${0.8 * value})`);
        gradient.addColorStop(0.4, `hsla(${hue}, 100%, 60%, ${0.5 * value})`);
        gradient.addColorStop(1, `hsla(${hue}, 100%, 50%, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, orbSize, 0, Math.PI * 2);
        ctx.fill();
      }

      // Smooth flowing lines from center
      ctx.globalAlpha = 0.15;
      for (let i = 0; i < slices / 4; i++) {
        const angle = (i / (slices / 4)) * Math.PI * 2;
        const dataIndex = Math.floor((i * dataArray.length) / (slices / 4));
        const value = dataArray[dataIndex] / 255;
        const radius = value * maxRadius * 0.5;

        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        const hue = (i / (slices / 4)) * 360;

        const gradient = ctx.createLinearGradient(centerX, centerY, x, y);
        gradient.addColorStop(0, `hsla(${hue}, 100%, 70%, 0)`);
        gradient.addColorStop(0.5, `hsla(${hue}, 100%, 60%, 0.3)`);
        gradient.addColorStop(1, `hsla(${hue}, 100%, 50%, 0.1)`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // Add particles based on bass frequencies
      const bassValue =
        dataArray.slice(0, 8).reduce((a, b) => a + b, 0) / 8 / 255;
      if (bassValue > 0.85 && Math.random() > 0.95) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.5 + Math.random() * 1;
        particles.push({
          x: centerX,
          y: centerY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 0.5,
          color: `hsl(${Math.random() * 360}, 100%, 60%)`,
        });
      }

      // Update and draw particles with soft glow
      particles = particles.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.015;
        p.vx *= 0.98; // Slow down over time
        p.vy *= 0.98;

        if (p.life > 0) {
          const size = 4 + p.life * 6;
          const gradient = ctx.createRadialGradient(
            p.x,
            p.y,
            0,
            p.x,
            p.y,
            size
          );
          gradient.addColorStop(
            0,
            p.color.replace("60%", `70%, ${p.life * 0.9})`).replace(")", "")
          );
          gradient.addColorStop(
            0.5,
            p.color.replace("60%", `60%, ${p.life * 0.5})`).replace(")", "")
          );
          gradient.addColorStop(
            1,
            p.color.replace("60%", "50%, 0)").replace(")", "")
          );

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
          ctx.fill();
          return true;
        }
        return false;
      });

      // Pulsing center glow
      const pulse = Math.sin(Date.now() / 300) * 0.2 + 0.3;
      const centerGlow = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        maxRadius * 0.4
      );
      centerGlow.addColorStop(0, `rgba(255, 255, 255, ${0.2 + pulse})`);
      centerGlow.addColorStop(
        0.3,
        `rgba(150, 220, 255, ${0.15 + pulse * 0.5})`
      );
      centerGlow.addColorStop(0.6, `rgba(100, 180, 255, ${0.05})`);
      centerGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = centerGlow;
      ctx.fillRect(0, 0, cssWidth, cssHeight);
    };

    const drawAlbum = (
      dataArray: Uint8Array,
      cssWidth: number,
      cssHeight: number
    ) => {
      const centerX = cssWidth / 2;
      const centerY = cssHeight / 2;

      // Audio-reactive background
      const avgFreq =
        dataArray.reduce((a, b) => a + b, 0) / dataArray.length / 255;
      const bassValue =
        dataArray.slice(0, 8).reduce((a, b) => a + b, 0) / 8 / 255;
      const midValue =
        dataArray.slice(8, 32).reduce((a, b) => a + b, 0) / 24 / 255;
      const trebleValue =
        dataArray.slice(32).reduce((a, b) => a + b, 0) /
        (dataArray.length - 32) /
        255;

      // Subtle color glow based on frequencies
      const time = Date.now() / 1000;
      const bgGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        Math.max(cssWidth, cssHeight) * 0.7
      );

      bgGradient.addColorStop(
        0,
        `rgba(${Math.floor(bassValue * 255)}, ${Math.floor(
          midValue * 180
        )}, ${Math.floor(trebleValue * 255)}, ${0.5 + avgFreq * 0.4})`
      );
      bgGradient.addColorStop(
        0.5,
        `rgba(${Math.floor(trebleValue * 200)}, ${Math.floor(
          bassValue * 150
        )}, ${Math.floor(midValue * 255)}, ${0.4 + avgFreq * 0.3})`
      );
      bgGradient.addColorStop(1, "rgba(0, 0, 0, 0.5)");

      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, cssWidth, cssHeight);

      // Draw album artwork
      const img = albumImages.get(currentTrack.id);

      if (img && img.complete) {
        const maxSize = Math.min(cssWidth, cssHeight) * 0.75;
        const aspectRatio = img.width / img.height;
        let drawWidth = maxSize;
        let drawHeight = maxSize;

        if (aspectRatio > 1) {
          drawHeight = maxSize / aspectRatio;
        } else {
          drawWidth = maxSize * aspectRatio;
        }

        const x = centerX - drawWidth / 2;
        const y = centerY - drawHeight / 2;

        // Pulsing glow behind artwork
        const pulse = Math.sin(time * 2) * 0.2 + 0.8;
        const glowSize =
          Math.max(drawWidth, drawHeight) * (1.1 + avgFreq * 0.3);
        const glow = ctx.createRadialGradient(
          centerX,
          centerY,
          0,
          centerX,
          centerY,
          glowSize / 2
        );
        glow.addColorStop(0, `rgba(255, 255, 255, ${0.4 * pulse * avgFreq})`);
        glow.addColorStop(0.5, `rgba(200, 150, 255, ${0.2 * avgFreq})`);
        glow.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, cssWidth, cssHeight);

        // Draw the artwork with subtle shadow
        ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
        ctx.shadowBlur = 20;
        ctx.drawImage(img, x, y, drawWidth, drawHeight);
        ctx.shadowBlur = 0;
      }
    };

    const draw = () => {
      animationId = requestAnimationFrame(draw);

      const cssWidth = parseFloat(canvas.style.width) || 400;
      const cssHeight = parseFloat(canvas.style.height) || 236;

      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, cssWidth, cssHeight);

      if (!isPlaying || !analyserRef.current) return;

      const analyser = analyserRef.current;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteFrequencyData(dataArray);

      if (visualization === "bars") {
        drawBars(dataArray, cssWidth, cssHeight);
      } else if (visualization === "alchemy") {
        drawAlchemy(dataArray, cssWidth, cssHeight);
      } else if (visualization === "album") {
        drawAlbum(dataArray, cssWidth, cssHeight);
      }
    };

    draw();
    return () => cancelAnimationFrame(animationId);
  }, [isPlaying, visualization, currentTrack, albumImages]);

  // Preload album artwork
  useEffect(() => {
    const imageMap = new Map<string, HTMLImageElement>();
    tracks.forEach((track) => {
      if (track.artwork) {
        const img = new Image();
        img.src = track.artwork;
        imageMap.set(track.id, img);
      }
    });
    setAlbumImages(imageMap);
  }, []);

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

  const handleSeek = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    if (!audioRef.current || !seekBarRef.current) return;

    const rect = seekBarRef.current.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const newTime = percentage * duration;

    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleSeekStart = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    setIsSeeking(true);
    handleSeek(e);
  };

  const handleSeekMove = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    if (isSeeking) {
      handleSeek(e);
    }
  };

  const handleSeekEnd = () => {
    setIsSeeking(false);
  };

  useEffect(() => {
    if (isSeeking) {
      const handleGlobalMouseUp = () => setIsSeeking(false);
      const handleGlobalTouchEnd = () => setIsSeeking(false);

      window.addEventListener("mouseup", handleGlobalMouseUp);
      window.addEventListener("touchend", handleGlobalTouchEnd);

      return () => {
        window.removeEventListener("mouseup", handleGlobalMouseUp);
        window.removeEventListener("touchend", handleGlobalTouchEnd);
      };
    }
  }, [isSeeking]);

  return (
    <div className="flex flex-col h-full bg-[#c0c0c0] text-black select-none overflow-hidden">
      <audio
        ref={audioRef}
        src={currentTrack.src}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
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
        <div className="absolute top-2 left-2 text-white z-10">
          <div className="text-base">{currentTrack.artist}</div>
          <div className="text-base font-semibold">{currentTrack.title}</div>
        </div>
        {/* Visualization selector */}
        <div className="absolute top-2 right-2 z-10">
          <select
            value={visualization}
            onChange={(e) =>
              setVisualization(e.target.value as VisualizationType)
            }
            className="bg-black/70 text-white text-base px-2 py-1 rounded border border-white/30 cursor-pointer hover:bg-black/90 transition-colors"
            style={{ outline: "none" }}
          >
            <option value="bars">Bars</option>
            <option value="alchemy">Alchemy</option>
            <option value="album">Album Art</option>
          </select>
        </div>
      </div>

      {/* Seek bar */}
      <div className="flex-shrink-0 px-3 py-2 bg-[#c0c0c0]">
        <div
          ref={seekBarRef}
          className="relative h-4 bg-black border border-[#808080] cursor-pointer select-none"
          onMouseDown={handleSeekStart}
          onMouseMove={handleSeekMove}
          onMouseUp={handleSeekEnd}
          onTouchStart={handleSeekStart}
          onTouchMove={handleSeekMove}
          onTouchEnd={handleSeekEnd}
          style={{ touchAction: "none" }}
        >
          {/* Progress fill */}
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#00f900] to-[#00aa00] pointer-events-none"
            style={{
              width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
            }}
          />
          {/* Position indicator */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-2 h-full bg-[#e6e9e8] border border-[#5066ae] pointer-events-none"
            style={{
              left: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
              transform: "translate(-50%, -50%)",
            }}
          />
        </div>
      </div>

      {/* Status bar */}
      <div className="flex-shrink-0 flex items-center justify-between px-3 py-1 bg-black text-[#00f900] text-xs font-semibold border-t border-[#cdcdd3]">
        <span>{isPlaying ? "Playing" : "Stopped"}</span>
        <span>
          {formatTime(currentTime)} /{" "}
          {formatTime(duration || currentTrack.duration)}
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
            style={{ width: `${volume * 39}px` }}
          />
          <div
            className="wmp-volbar-pointer"
            style={{ left: `${4 + volume * 39}px` }}
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
