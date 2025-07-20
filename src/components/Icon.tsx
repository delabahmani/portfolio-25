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
      className={`absolute flex flex-col p-2 cursor-pointer items-center justify-center lg:w-24 lg:h-24 h-18 w-18 rounded-sm ${
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
      <img
        src={data.icon}
        alt={data.name}
        className="w-20 h-20  pointer-events-none"
        style={{ imageRendering: "pixelated" }}
        draggable={false}
      />
      <span className={`text-center font-family-tahoma text-xl ${textClasses}`}>
        {data.name}
      </span>
    </div>
  );
};

export default Icon;
