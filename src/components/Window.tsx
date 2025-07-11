import { useEffect, useState } from "react";
import type { IconData, WindowData } from "../types";
import Icon from "./Icon";
import { useDrag } from "@use-gesture/react";

interface WindowProps {
  data: WindowData;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
  onOpenIcon: (icon: IconData) => void;
  onMove: (id: string, x: number, y: number) => void;
}

const Window: React.FC<WindowProps> = ({
  data,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onOpenIcon,
  onMove,
}) => {
  const [selectedFileIcon, setSelectedFileIcon] = useState<string | null>(null);
  const [isOpening, setIsOpening] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsOpening(false), 50);
    return () => clearTimeout(timer);
  }, []);

  const bind = useDrag(
    ({ movement: [mx, my], memo = [data.x, data.y] }) => {
      if (data.isMaximized) return memo;

      const newX = Math.max(
        0,
        Math.min(window.innerWidth - data.width, memo[0] + mx)
      );
      const newY = Math.max(
        0,
        Math.min(window.innerHeight - data.height - 30, memo[1] + my)
      );

      onMove(data.id, newX, newY);
      return memo;
    },
    {
      filterTaps: true, // Prevents dragging when clicking btns
      axis: undefined, // Allow dragging in both directions
      threshold: 1, // Minimum movement to trigger drag
      rubberband: false,
    }
  );

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 150);
  };

  const handleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsClosing(true);
    setTimeout(() => {
      onMinimize();
    }, 150);
  };

  const handleIconDoubleClick = (icon: IconData) => {
    if (icon.type === "app" && icon.url) {
      window.open(icon.url, "_blank");
    } else {
      onOpenIcon(icon);
    }
  };

  const renderContent = () => {
    if (!data.content) return null;

    // Render text file content
    if (data.content.type === "file") {
      // Check if it's an image file
      if (data.content.description?.includes("/assets/images/")) {
        return (
          <div
            className="bg-white h-full overflow-auto p-4 flex items-center justify-center"
            style={{ touchAction: "pinch-zoom" }}
          >
            <img
              src={data.content.description}
              alt={data.content.name}
              className="max-w-full max-h-full object-contain"
              style={{ imageRendering: "pixelated" }}
            />
          </div>
        );
      }

      // Otherwise, render as text file
      return (
        <div className="bg-white h-full overflow-auto p-4 font-family-tahoma text-sm">
          <pre className="whitespace-pre-wrap text-black leading-relaxed">
            {data.content.description || "No description available."}
          </pre>
        </div>
      );
    }

    // Render folder content (icon grid)
    if (data.content.type === "folder" && data.content.content) {
      const isMobile = window.innerWidth <= 768;

      return (
        <div className="bg-white h-full p-4 relative overflow-hidden">
          {data.content.content.map((icon, i) => (
            <Icon
              key={icon.id}
              data={{
                ...icon,
                x: isMobile
                  ? 30 + Math.floor(i / 3) * 150 // New column every 3 items
                  : 30 + (i % 4) * 150, // 4 items per row
                y: isMobile
                  ? 30 + (i % 3) * 120 // 3 items per column
                  : 30 + Math.floor(i / 4) * 100, // New row every 4 items
              }}
              isSelected={selectedFileIcon === icon.id}
              onSelect={() => setSelectedFileIcon(icon.id)}
              onDoubleClick={() => handleIconDoubleClick(icon)}
            />
          ))}
        </div>
      );
    }

    return null;
  };

  // Calculate window styles based on maximize state
  const windowStyle = {
    ...(data.isMaximized
      ? {
          left: 0,
          top: 0,
          width: "100vw",
          height: "calc(100vh - 30px)",
        }
      : {
          left: data.x,
          top: data.y,
          width: data.width,
          height: data.height,
        }),
    zIndex: data.zIndex,
    transform: isOpening || isClosing ? "scale(0.8)" : "scale(1)",
    opacity: isOpening || isClosing ? 0 : 1,
  };

  return (
    <div
      className={`absolute bg-gray-100 border-2 border-[#1852E7] shadow-md ${
        data.isMaximized ? "" : "rounded-tr-md rounded-tl-md"
      }`}
      style={{ ...windowStyle, transition: "all 0.15s ease-out" }}
      onClick={onFocus}
    >
      {/* Title Bar */}
      <div
        {...bind()}
        className="text-white px-1 flex justify-between items-center cursor-move select-none"
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
          cursor: data.isMaximized ? "default" : "move",
          touchAction: "none", // Disable touch actions for dragging
        }}
      >
        <div className="flex items-center gap-2">
          <img
            src={data.content?.icon}
            className="w-4 h-4"
            style={{ imageRendering: "pixelated" }}
          />
          <span
            className="font-bold"
            style={{ textShadow: "1px 1px 0 rgba(0, 0, 0, 0.5)" }}
          >
            {data.title}
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
            onClick={handleMinimize}
          >
            _
          </button>

          {/* Maximize Button */}
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
            {data.isMaximized ? "⧉" : "□"}
          </button>

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
            onClick={handleClose}
          >
            x
          </button>
        </div>
      </div>

      {/* Menu Bar */}
      <div className="bg-gray-100 border-b border-gray-300 px-2 py-1 text-xs">
        <span className="hover:bg-blue-500 hover:text-white px-2 py-1 cursor-pointer">
          File
        </span>
        <span className="hover:bg-blue-500 hover:text-white px-2 py-1 cursor-pointer ml-2">
          Edit
        </span>
        <span className="hover:bg-blue-500 hover:text-white px-2 py-1 cursor-pointer ml-2">
          View
        </span>
        <span className="hover:bg-blue-500 hover:text-white px-2 py-1 cursor-pointer ml-2">
          Help
        </span>
      </div>

      {/* Address Bar (for folders) */}
      {data.content?.type === "folder" && (
        <div className="bg-white border-b border-gray-300 px-2 py-1 flex items-center">
          <span className="text-xs mr-2">Address:</span>
          <div className="bg-white border border-gray-400 px-2 py-1 text-xs flex-1">
            {data.content.name === "projects" && data.content.content
              ? `C:\\Desktop\\${data.content.name}`
              : `C:\\Desktop\\${data.title}`}
          </div>
        </div>
      )}

      {/* Content Area */}
      <div
        className="h-full"
        style={{
          height:
            data.content?.type === "folder"
              ? "calc(100% - 80px)"
              : "calc(100% - 60px)",
        }}
      >
        {renderContent()}
      </div>
    </div>
  );
};

export default Window;
