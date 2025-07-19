import React from "react";

interface TitleBarProps {
  title: string;
  icon?: string;
  isMaximized: boolean;
  isMobile: boolean;
  isDragging: boolean;
  onClose: (e: React.MouseEvent) => void;
  onMinimize: (e: React.MouseEvent) => void;
  onMaximize: () => void;
  bind: (...args: any[]) => any;
}

const TitleBar: React.FC<TitleBarProps> = ({
  title,
  icon,
  isMaximized,
  isMobile,
  isDragging,
  onClose,
  onMinimize,
  onMaximize,
  bind,
}) => {
  return (
    <div
      {...bind()}
      className="text-white px-1 flex justify-between items-center select-none"
      style={{
        background:
          "linear-gradient(to bottom, #3087FB 0%, #1C6AF8 14%, #1753E3 18%, #164EE0 42%, #1852E8 56%, #1A5AF5 70%, #1C64FA 84%, #1A59F2 100%)",
        height: "28px",
        fontFamily: "Trebuchet MS, sans-serif",
        fontSize: "11px",
        borderTop: "1px solid #A6CAF0",
        borderLeft: "1px solid #003C74",
        borderRight: "1px solid #003C74",
        boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.3)",
        cursor: isMaximized ? "default" : isDragging ? "grabbing" : "grab",
        touchAction: "none",
      }}
    >
      <div className="flex items-center gap-2">
        {icon && (
          <img
            src={icon}
            className="w-4 h-4"
            style={{ imageRendering: "pixelated" }}
            alt={`${title} icon`}
          />
        )}
        <span
          className="font-bold"
          style={{ textShadow: "1px 1px 0 rgba(0, 0, 0, 0.5)" }}
        >
          {title}
        </span>
      </div>

      <div className="flex">
        {/* Minimize Button */}
        <button
          className="flex justify-center items-center font-bold cursor-pointer"
          style={{
            width: "20px",
            height: "20px",
            marginLeft: "2px",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            borderRadius: "2px",
            boxShadow: "0 1px 0 rgba(0, 0, 0, 0.2)",
            fontSize: "11px",
          }}
          onClick={onMinimize}
        >
          _
        </button>

        {/* Maximize Button */}
        {!isMobile && (
          <button
            className="flex justify-center items-center font-bold cursor-pointer"
            style={{
              width: "20px",
              height: "20px",
              marginLeft: "2px",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              borderRadius: "2px",
              boxShadow: "0 1px 0 rgba(0, 0, 0, 0.2)",
              fontSize: "9px",
            }}
            onClick={(e) => {
              e.stopPropagation();
              onMaximize();
            }}
          >
            {isMaximized ? "⧉" : "□"}
          </button>
        )}

        {/* Close Button */}
        <button
          className="flex justify-center items-center font-bold cursor-pointer"
          style={{
            width: "20px",
            height: "20px",
            marginLeft: "2px",
            background: "linear-gradient(to bottom, #FF8F8F, #CC0000)",
            border: "1px solid #CC0000",
            borderRadius: "2px",
            boxShadow: "0 1px 0 rgba(0, 0, 0, 0.2)",
            fontSize: "20px",
            color: "white",
          }}
          onClick={onClose}
        >
          x
        </button>
      </div>
    </div>
  );
};

export default TitleBar;
