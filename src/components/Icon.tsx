import { useState } from "react";
import type { IconData } from "../types";

interface IconProps {
  data: IconData;
  isSelected: boolean;
  onSelect: () => void;
  onDoubleClick: () => void;
  variant?: "desktop" | "window";
}

const Icon: React.FC<IconProps> = ({
  data,
  isSelected,
  onSelect,
  onDoubleClick,
  variant = "desktop",
}) => {
  const [touchCount, setTouchCount] = useState(0);
  const isMobile = window.innerWidth <= 768;

  const isDesktopFolder = variant === "desktop" && data.type === "folder";
  const isDesktopApp =
    variant === "desktop" &&
    (data.type === "app" || data.type === "media-player");
  const isWindow = variant === "window";

  const DESKTOP_Y_SCALE = isMobile ? 1.25 : 1.1;

  const imgPx = isMobile
    ? isWindow
      ? 55 // mobile, icons inside folders
      : isDesktopFolder || isDesktopApp
      ? 60 // mobile, desktop folder icons
      : 112 // mobile desktop non-folder icons
    : isDesktopFolder || isDesktopApp
    ? 60 // desktop folder icons
    : isWindow
    ? 48 // desktop window icons
    : 80; // desktop non-folder icons

  const outerSizeClass = isWindow
    ? isMobile
      ? "w-28 min-h-28"
      : "w-24 min-h-24"
    : "";

  const labelClass = isMobile
    ? isWindow
      ? "text-base"
      : isDesktopFolder
      ? "text-sm"
      : "text-base"
    : isDesktopFolder
    ? "text-sm"
    : "text-xl";

  const positionClass = variant === "desktop" ? "absolute" : "relative";
  const desktopBoxSize = imgPx + 48;

  // Handle double-tap on mobile
  const handleTouch = () => {
    if (isMobile) {
      setTouchCount((prev) => prev + 1);
      setTimeout(() => setTouchCount(0), 500);

      if (touchCount === 1) {
        onDoubleClick();
      }
    }
  };

  return (
    <div
      className={`${positionClass} flex flex-col p-2 cursor-pointer items-center justify-center ${outerSizeClass} rounded-sm ${
        isSelected
          ? "bg-blue-300/20 border border-blue-300/50 rounded-sm"
          : "border border-transparent"
      } hover:bg-blue-200/30 transition-colors duration-150 hover:rounded-sm`}
      style={
        variant === "desktop"
          ? {
              left: data.x,
              top: (data.y ?? 0) * DESKTOP_Y_SCALE,
              width: desktopBoxSize,
              minHeight: desktopBoxSize,
            }
          : undefined
      }
      onClick={onSelect}
      onDoubleClick={!isMobile ? onDoubleClick : undefined}
      onTouchEnd={isMobile ? handleTouch : undefined}
    >
      <div
        style={{
          width: imgPx,
          height: imgPx,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <img
          src={data.icon}
          alt={data.name}
          className="pointer-events-none"
          style={{
            imageRendering: "pixelated",
            width: "100%",
            height: "100%",
            objectFit: "contain",
            display: "block",
          }}
          draggable={false}
        />
      </div>

      <span
        className={`text-center font-family-tahoma text-xl ${labelClass} ${
          variant === "desktop"
            ? "text-white drop-shadow-[0_1.4px_1.4px_rgba(0,0,0,0.9)]"
            : "text-black text-shadow-sm"
        } mt-2`}
      >
        {data.name}
      </span>
    </div>
  );
};

export default Icon;
