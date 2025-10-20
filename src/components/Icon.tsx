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
  const isWindow = variant === "window";

  const imgPx = isMobile
    ? isWindow
      ? 72 // mobile, icons inside folders
      : isDesktopFolder
      ? 72 // mobile, desktop folder icons
      : 112 // mobile desktop non-folder icons
    : isDesktopFolder
    ? 56 // desktop folder icons
    : isWindow
    ? 48 // desktop window icons
    : 80; // desktop non-folder icons

  const outerSizeClass = isMobile
    ? isWindow
      ? "w-28 h-28"
      : variant === "desktop"
      ? "lg:w-24 lg:h-24 h-28 w-28"
      : "lg:w-24 lg:h-24 h-18 w-18"
    : "lg:w-24 lg:h-24 h-18 w-18";

  const labelClass = isMobile
    ? isWindow
      ? "text-base"
      : isDesktopFolder
      ? "text-sm"
      : "text-base"
    : isDesktopFolder
    ? "text-sm"
    : "text-xl";

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

  const textClasses =
    variant === "desktop"
      ? "text-white drop-shadow-[0_1.4px_1.4px_rgba(0,0,0,0.9)]"
      : "text-black text-shadow-sm";

  return (
    <div
      className={`absolute flex flex-col p-2 cursor-pointer items-center justify-center ${outerSizeClass} rounded-sm ${
        isSelected
          ? "bg-blue-300/20 border border-blue-300/50 rounded-sm"
          : "border border-transparent"
      } hover:bg-blue-200/30 transition-colors duration-150 hover:rounded-sm`}
      style={{
        left: data.x,
        top: data.y,
      }}
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
        className={`text-center font-family-tahoma text-xl ${labelClass} ${textClasses} mt-2`}
      >
        {data.name}
      </span>
    </div>
  );
};

export default Icon;
