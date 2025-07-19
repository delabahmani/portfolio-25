import { useState } from "react";
import type { IconData, WindowData } from "../types";
import { desktopIcons } from "../data/portfolioData";
import Icon from "./Icon";
import Window from "./Window";
import Taskbar from "./Taskbar";

const Desktop: React.FC = () => {
  const [windows, setWindows] = useState<WindowData[]>([]);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [nextZIndex, setNextZIndex] = useState(1000);

  const handleDesktopClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedIcon(null);
    }
  };

  const isMobile = window.innerWidth <= 768;

  const openWindow = (icon: IconData) => {
    const existingWindow = windows.find((w) => w.content?.id === icon.id);
    if (existingWindow) {
      if (existingWindow.isMinimized) {
        // Restore minimized window
        setWindows(
          windows.map((w) =>
            w.id === existingWindow.id
              ? { ...w, isMinimized: false, zIndex: nextZIndex }
              : w
          )
        );
        setNextZIndex(nextZIndex + 1);
      } else {
        focusWindow(existingWindow.id);
      }
      return;
    }

    const windowWidth = icon.type === "folder" ? 750 : 625;
    const windowHeight = icon.type === "folder" ? 500 : 437;

    const centerX = (window.innerWidth - windowWidth) / 2;  
    const centerY = (window.innerHeight - windowHeight) / 2; 

    const newWindow: WindowData = {
      id: `window-${icon.id}-${Date.now()}`,
      title: icon.name,
      isMinimized: false,
      isMaximized: isMobile,
      x: Math.max(0, centerX + windows.length * 30),
      y: Math.max(0, centerY + windows.length * 30),
      width: icon.type === "folder" ? 750 : 625,
      height: icon.type === "folder" ? 500 : 437,
      content: icon,
      zIndex: nextZIndex,
    };

    setWindows([...windows, newWindow]);
    setNextZIndex(nextZIndex + 1);
  };

  const closeWindow = (windowId: string) => {
    setWindows(windows.filter((w) => w.id !== windowId));
  };

  const minimizeWindow = (windowId: string) => {
    setWindows(
      windows.map((w) => (w.id === windowId ? { ...w, isMinimized: true } : w))
    );
  };

  const moveWindow = (windowId: string, x: number, y: number) => {
    setWindows(windows.map((w) => (w.id === windowId ? { ...w, x, y } : w)));
  };

  const maximizeWindow = (windowId: string) => {
    setWindows(
      windows.map((w) =>
        w.id === windowId
          ? {
              ...w,
              isMaximized: !w.isMaximized,

              ...(w.isMaximized
                ? {
                    x: w.originalX || w.x,
                    y: w.originalY || w.y,
                    width: w.originalWidth || w.width,
                    height: w.originalHeight || w.height,
                  }
                : {
                    originalX: w.x,
                    originalY: w.y,
                    originalWidth: w.width,
                    originalHeight: w.height,
                  }),
            }
          : w
      )
    );
  };

  const focusWindow = (windowId: string) => {
    setWindows(
      windows.map((w) => (w.id === windowId ? { ...w, zIndex: nextZIndex } : w))
    );
    setNextZIndex(nextZIndex + 1);
  };

  const toggleWindowFromTaskbar = (windowId: string) => {
    const window = windows.find((w) => w.id === windowId);
    if (!window) return;

    if (window.isMinimized) {
      // Restore window
      setWindows(
        windows.map((w) =>
          w.id === windowId
            ? { ...w, isMinimized: false, zIndex: nextZIndex }
            : w
        )
      );
      setNextZIndex(nextZIndex + 1);
    } else {
      // Minimize window
      minimizeWindow(windowId);
    }
  };

  return (
    <div
      className="w-full h-screen relative overflow-hidden select-none"
      style={{
        backgroundImage: "url('/assets/images/hills-bg.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      onClick={handleDesktopClick}
    >
      {/* Desktop Icons */}
      <div className="absolute inset-0 p-4 text-white">
        {desktopIcons.map((icon) => (
          <Icon
            key={icon.id}
            data={icon}
            isSelected={selectedIcon === icon.id}
            onSelect={() => setSelectedIcon(icon.id)}
            onDoubleClick={() => openWindow(icon)}
          />
        ))}
      </div>

      {/* Windows */}
      {windows
        .filter((window) => !window.isMinimized)
        .map((window) => (
          <Window
            key={window.id}
            data={window}
            onClose={() => closeWindow(window.id)}
            onMinimize={() => minimizeWindow(window.id)}
            onMaximize={() => maximizeWindow(window.id)}
            onFocus={() => focusWindow(window.id)}
            onOpenIcon={openWindow}
            onMove={moveWindow}
          />
        ))}

      {/* Taskbar */}
      <Taskbar windows={windows} onWindowToggle={toggleWindowFromTaskbar} />
    </div>
  );
};
export default Desktop;
