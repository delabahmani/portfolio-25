import { useState } from "react";
import type { IconData } from "../types";

interface IconProps {
  data: IconData;
  isSelected: boolean;
  onSelect: () => void;
  onDoubleClick: () => void;
}

const Icon: React.FC<IconProps> = ({
  data,
  isSelected,
  onSelect,
  onDoubleClick,
}) => {
  const [touchCount, setTouchCount] = useState(0);
  const isMobile = window.innerWidth <= 768;

  // Handle double-tap on mobile
  const handleTouch = () => {
    if (isMobile) {
      setTouchCount((prev) => prev + 1);

      // Reset count after delay
      setTimeout(() => setTouchCount(0), 500);

      // If double-tap, trigger onDoubleClick
      if (touchCount === 1) {
        onDoubleClick();
      }
    }
  };

  return (
    <div
      className={`absolute flex flex-col cursor-pointer items-center justify-center w-28 h-28 rounded-sm${
        isSelected ? "bg-blue-300/20 border border-blue-300/50" : ""
      } hover:bg-blue-200/30 transition-colors duration-150`}
      style={{
        left: data.x,
        top: data.y,
        width: "80 px",
        padding: "4px",
        borderRadius: "4px",
      }}
      onClick={onSelect}
      onDoubleClick={!isMobile ? onDoubleClick : undefined}
      onTouchEnd={isMobile ? handleTouch : undefined}
    >
      <img
        src={data.icon}
        alt={data.name}
        className="lg:w-20 lg:h-20 w-16 h-16 mb-1 md:mb-0  pointer-events-none"
        style={{ imageRendering: "pixelated" }}
        draggable={false}
      />
      <span className="text-center drop-shadow-sm font-family-tahoma text-3xl">
        {data.name}
      </span>
    </div>
  );
};

export default Icon;
