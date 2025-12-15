/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import type { IconData, WindowData } from "../types";
import Icon from "./Icon";
import { useDrag } from "@use-gesture/react";
import TitleBar from "./TitleBar";
import ResizeHandles from "./ResizeHandles";
import { EmailWindow } from "./EmailWindow";
import { DisplayProperties } from "./DisplayProperties";
import { useTheme } from "../hooks/UseTheme";
import MediaPlayer from "./MediaPlayer";
import AppNavigation from "./AppNavigation";

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
  const { colors } = useTheme();
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

    if (data.type === "display-properties") {
      return <DisplayProperties onClose={onClose} />;
    }

    // Render email form
    if (data.type === "email") {
      return <EmailWindow onClose={onClose} />;
    }

    if (data.type === "media-player") {
      return <MediaPlayer />;
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
      return (
        <div className="bg-white h-full overflow-auto p-3">
          <div
            className="
              grid gap-y-4 justify-items-center content-start
              [grid-template-columns:repeat(auto-fill,minmax(110px,1fr))]
              sm:[grid-template-columns:repeat(auto-fill,minmax(128px,1fr))]
            "
          >
            {data.content.content.map((icon) => (
              <Icon
                key={icon.id}
                data={icon}
                isSelected={selectedFileIcon === icon.id}
                onSelect={() => setSelectedFileIcon(icon.id)}
                onDoubleClick={() => handleIconDoubleClick(icon)}
                variant="window"
              />
            ))}
          </div>
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
          height: "calc(100dvh - 40px)",
          minHeight: data.type === "media-player" ? "440px" : undefined,
        }
      : {
          left: position.x,
          top: position.y,
          width: data.width,
          height: data.height,
          minHeight: data.type === "media-player" ? "440px" : undefined,
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
      className={`absolute bg-gray-100 shadow-md flex flex-col focus:outline-none ${
        data.isMaximized ? "" : "rounded-tr-md rounded-tl-md"
      }`}
      style={{
        ...windowStyle,
        border: `3px solid ${colors.windowBorder}`,
        borderLeft: ` 4px solid ${colors.windowBorder}`,
        borderTop: ` 2px solid ${colors.windowBorder}`,
        borderRight: ` 4px solid ${colors.windowBorder}`,
        borderBottom: ` 4px solid ${colors.windowBorder}`,
        transform: `${windowStyle.transform} translateZ(0)`,
        backfaceVisibility: "hidden",
      }}
    >
      {!isMobile && data.type !== "media-player" && (
        <ResizeHandles data={data} onResize={onResize} />
      )}

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

      {/* Only show address bar for folders/display-properties */}
      {data.type !== "media-player" &&
        (data.content?.type === "folder" ||
          data.type === "display-properties" ||
          data.type === "email") && <AppNavigation data={data} />}

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">{renderContent()}</div>
    </div>
  );
};

export default Window;
