import { useState } from "react";
import type { IconData, WindowData } from "../types";
import Icon from "./Icon";

interface WindowProps {
  data: WindowData;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
  onOpenIcon: (icon: IconData) => void;
}

const Window: React.FC<WindowProps> = ({
  data,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onOpenIcon,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [selectedFileIcon, setSelectedFileIcon] = useState<string | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    onFocus();
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - data.x,
      y: e.clientY - data.y,
    });
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
          <div className="bg-white h-full overflow-auto p-4 flex items-center justify-center">
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
      return (
        <div className="bg-white h-full p-4 relative overflow-hidden">
          {data.content.content.map((icon, i) => (
            <Icon
              key={icon.id}
              data={{
                ...icon,
                x: 20 + (i % 4) * 120,
                y: 20 + Math.floor(i / 4) * 80,
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

  return (
    <div
      className="absolute bg-gray-100 border-2 border-[#1852E7] shadow-md rounded-tr-md rounded-tl-md "
      style={{
        left: data.x,
        top: data.y,
        width: data.width,
        height: data.height,
        zIndex: data.zIndex,
      }}
      onClick={onFocus}
    >
      {/* Title Bar */}
      <div
        className="text-white px-1 flex justify-between items-center cursor-move select-none"
        style={{
          background:
            "linear-gradient(to bottom, #3087FB 0%, #1C6AF8 14%, #1753E3 18%, #164EE0 42%, #1852E8 56%, #1A5AF5 70%, #1C64FA 84%, #1A59F2 100%)",
          height: "28px",
          fontFamily: "Tahoma, sans-serif",
          fontSize: "11px",
          borderTop: "1px solid #A6CAF0",
          borderLeft: "1px solid #003C74",
          borderRight: "1px solid #003C74",
          boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.3)",
        }}
        onMouseDown={handleMouseDown}
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
            onClick={(e) => {
              e.stopPropagation();
              onMinimize();
            }}
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
            □
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
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
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
