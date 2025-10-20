/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import type { IconData, WindowData } from "../types";
import Icon from "./Icon";
import { useDrag } from "@use-gesture/react";
import TitleBar from "./TitleBar";
import ResizeHandles from "./ResizeHandles";
import { EmailWindow } from "./EmailWindow";

interface WindowProps {
  data: WindowData;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
  onOpenIcon: (icon: IconData, parentFolder?: IconData) => void;
  onChangeContent: (newContent: IconData) => void;
  onMove: (id: string, x: number, y: number) => void;
  onResize: (
    id: string,
    newSize: { width: number; height: number },
    newPos?: { x: number; y: number }
  ) => void;
}

const Window: React.FC<WindowProps> = ({
  data,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onOpenIcon,
  onMove,
  onResize,
  onChangeContent,
}) => {
  const [selectedFileIcon, setSelectedFileIcon] = useState<string | null>(null);
  const [isOpening, setIsOpening] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: data.x, y: data.y });
  const windowRef = useRef<HTMLDivElement>(null);

  const isMobile = window.innerWidth <= 768;

  useEffect(() => {
    if (!isDragging) {
      setPosition({ x: data.x, y: data.y });
    }
  }, [data.x, data.y, isDragging]);

  useEffect(() => {
    const timer = setTimeout(() => setIsOpening(false), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (windowRef.current) {
      windowRef.current.focus();
    }
  }, []);

  // Arrow key navigation for image files
  useEffect(() => {
    if (
      data.type !== "file" ||
      !data.content?.description?.includes("/assets/images/")
    ) {
      return;
    }

    if (!data.parentFolder?.content) {
      return;
    }

    const imageFiles = data.parentFolder.content.filter(
      (item) =>
        item.type === "file" && item.description?.includes("/assets/images/")
    );

    if (imageFiles.length <= 1) return;

    // Find current image index
    const currentIndex = imageFiles.findIndex(
      (img) => img.id === data.content?.id
    );

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key !== "ArrowRight" && e.key !== "ArrowLeft") ||
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      if (e.key === "ArrowRight") {
        const nextIndex = (currentIndex + 1) % imageFiles.length;
        const nextImage = imageFiles[nextIndex];
        onChangeContent(nextImage);
      } else if (e.key === "ArrowLeft") {
        const prevIndex =
          (currentIndex - 1 + imageFiles.length) % imageFiles.length;
        const prevImage = imageFiles[prevIndex];
        onChangeContent(prevImage);
      }
    };

    const windowElement = windowRef.current;
    if (windowElement) {
      windowElement.addEventListener("keydown", handleKeyDown as any);
      return () =>
        windowElement.removeEventListener("keydown", handleKeyDown as any);
    }
  }, [data, onChangeContent]);

  const bind = useDrag(
    ({ active, movement: [mx, my], down, memo = [data.x, data.y] }) => {
      setIsDragging(active);

      if (active && !isDragging) {
        onFocus();
      }

      if (data.isMaximized) return memo;

      const newX = Math.max(
        0,
        Math.min(window.innerWidth - data.width, memo[0] + mx)
      );
      const newY = Math.max(
        0,
        Math.min(window.innerHeight - data.height - 30, memo[1] + my)
      );

      setPosition({ x: newX, y: newY });

      if (!down) {
        onMove(data.id, newX, newY);
      }
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
      onOpenIcon(icon, data.content);
    }
  };

  const renderContent = () => {
    if (!data.content) return null;

    // Render email form
    if (data.type === "email") {
      return <EmailWindow onClose={onClose} />;
    }

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
        <div className="bg-white h-full relative overflow-auto">
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
              variant="window"
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
          left: position.x,
          top: position.y,
          width: data.width,
          height: data.height,
        }),
    zIndex: data.zIndex,
    transform: isOpening || isClosing ? "scale(0.8)" : "scale(1)",
    opacity: isOpening || isClosing ? 0 : 1,
    transition: isDragging ? "none" : "all 0.15s ease-out",
  };

  return (
    <div
      ref={windowRef}
      data-window-id={data.id}
      tabIndex={0}
      className={`absolute bg-gray-100 border-[3px] border-[#1852E7] shadow-md flex flex-col focus:outline-none ${
        data.isMaximized ? "" : "rounded-tr-md rounded-tl-md"
      }`}
      style={windowStyle}
      onClick={() => {
        onFocus();
        if (windowRef.current) windowRef.current.focus();
      }}
    >
      {!isMobile && <ResizeHandles data={data} onResize={onResize} />}

      {/* Title Bar */}
      <TitleBar
        title={data.title}
        icon={data.content?.icon}
        isMaximized={data.isMaximized}
        onClose={handleClose}
        onMinimize={handleMinimize}
        onMaximize={onMaximize}
        isDragging={isDragging}
        isMobile={isMobile}
        bind={bind}
      />

      {/* Menu Bar */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1 px-2 py-1 border-b border-gray-400 bg-gradient-to-b from-white to-xp-gray">
          <button className="px-3 py-1 text-sm hover:bg-blue-100 border border-transparent hover:border-blue-300">
            File
          </button>
          <button className="px-3 py-1 text-sm hover:bg-blue-100 border border-transparent hover:border-blue-300">
            Edit
          </button>
          <button className="px-3 py-1 text-sm hover:bg-blue-100 border border-transparent hover:border-blue-300">
            View
          </button>
          <button className="px-3 py-1 text-sm hover:bg-blue-100 border border-transparent hover:border-blue-300">
            Tools
          </button>
          <button className="px-3 py-1 text-sm hover:bg-blue-100 border border-transparent hover:border-blue-300">
            Help
          </button>
        </div>
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
