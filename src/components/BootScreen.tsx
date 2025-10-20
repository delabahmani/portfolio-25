import { useEffect, useState } from "react";

interface BootScreenProps {
  onFinish: () => void;
}

export const BootScreen: React.FC<BootScreenProps> = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);
  const [fadeIn, setFadeIn] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Simulate boot progress
    setTimeout(() => setFadeIn(true), 100);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setFadeOut(true);
          setTimeout(onFinish, 800);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [onFinish]);

  // useEffect(() => {
  //   setTimeout(() => setFadeIn(true), 100);

  //   const interval = setInterval(() => {
  //     setProgress((prev) => {
  //       if (prev >= 100) {
  //         return 0;
  //       }
  //       return prev + 2;
  //     });
  //   }, 30);

  //   return () => clearInterval(interval);
  // }, [onFinish]);

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center transition-opacity duration-700"
      style={{ background: "black", zIndex: 9999, opacity: fadeOut ? 0 : 1, }}
    >
      {/* Windows XP logo */}
      <div
        className="mb-6 md:mb-8 flex justify-center transition-opacity duration-1000"
        style={{ opacity: fadeIn ? 1 : 0 }}
      >
        <img
          src="/icon.webp"
          alt="Windows XP Logo"
          className="w-80 h-auto"
          style={{
            width: "clamp(180px, 50vw, 280px)",
            height: "clamp(180px, 50vw, 280px)",
            imageRendering: "crisp-edges",
          }}
        />
      </div>

      {/* Loading bar container */}
      <div
        className="relative transition-opacity duration-1000"
        style={{
          width: "clamp(180px, 50vw, 280px)",
          height: "12px",
          background: "#000",
          border: "1px solid #3A6BC5",
          borderRadius: "1px",
          overflow: "hidden",
          opacity: fadeIn ? 1 : 0,
        }}
      >
        {/* Loading bar background track */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "repeating-linear-gradient(90deg, #0A1F5C 0px, #0A1F5C 8px, transparent 8px, transparent 16px)",
          }}
        />

        {/* Loading bar fill */}
        <div
          className="absolute left-0 top-0 h-full transition-all duration-100"
          style={{
            width: `${progress}%`,
            background:
              "linear-gradient(90deg, #1A4EC8 0%, #2B63E8 50%, #1A4EC8 100%)",
            boxShadow: "0 0 8px rgba(43, 99, 232, 0.6)",
          }}
        />
      </div>

      {/* Copyright Text */}
      <div className="absolute bottom-3 md:bottom-8 md:left-8 text-white font-family-tahoma text-lg">
        Inspired by Windows XP
        <br />© {new Date().getFullYear()} Delara Bahmani
      </div>
    </div>
  );
};
