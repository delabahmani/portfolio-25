import { useState } from "react";
import type { IconData, WindowData } from "../types";
import { desktopIcons } from "../data/portfolioData";
import Icon from "./Icon";
import Window from "./Window";
import Taskbar from "./Taskbar";

const Desktop: React.FC = () => {
  const [windows, setWindows] = useState<WindowData[]>([]);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [nextZIndex, setNextZIndex] = useState(10);

  const handleDesktopClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedIcon(null);
    }
  };

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

    const newWindow: WindowData = {
      id: `window-${icon.id}-${Date.now()}`,
      title: icon.name,
      isMinimized: false,
      isMaximized: false,
      x: Math.max(50, 100 + windows.length * 30),
      y: Math.max(50, 100 + windows.length * 30),
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

  const maximizeWindow = (windowId: string) => {
    setWindows(
      windows.map((w) =>
        w.id === windowId
          ? {
              ...w,
              isMaximized: !w.isMaximized,
              x: w.isMaximized ? w.x : 0,
              y: w.isMaximized ? w.y : 0,
              width: w.isMaximized ? w.width : window.innerWidth,
              height: w.isMaximized ? w.height : window.innerHeight - 30,
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
          />
        ))}

      {/* Taskbar */}
      <Taskbar
        windows={windows}
        onWindowToggle={toggleWindowFromTaskbar}
        onWindowFocus={focusWindow}
      />
    </div>
  );
};
export default Desktop;
