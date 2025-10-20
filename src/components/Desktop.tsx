import { useEffect, useState } from "react";
import type { IconData, WindowData } from "../types";
import { desktopIcons } from "../data/portfolioData";
import Icon from "./Icon";
import Window from "./Window";
import Taskbar from "./Taskbar";
import StartMenu from "./StartMenu";
import { useTheme } from "../hooks/UseTheme";

const Desktop: React.FC = () => {
  const [fadeIn, setFadeIn] = useState(false);
  const [windows, setWindows] = useState<WindowData[]>([]);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [nextZIndex, setNextZIndex] = useState(1000);
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const { wallpaper } = useTheme();

  useEffect(() => {
    setTimeout(() => setFadeIn(true), 100);
  });

  const handleDesktopClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedIcon(null);
      if (isStartMenuOpen) {
        setIsStartMenuOpen(false);
      }
    }
  };

  const toggleStartMenu = () => {
    setIsStartMenuOpen((prev) => !prev);
  };

  const isMobile = window.innerWidth <= 768;

  const openWindow = (icon: IconData, parentFolder?: IconData) => {
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

    // Determine window dimensions based on type
    let windowWidth = 625;
    let windowHeight = 437;

    if (icon.type === "folder") {
      windowWidth = 750;
      windowHeight = 500;
    } else if (icon.type === "email") {
      windowWidth = 600;
      windowHeight = 450;
    }

    // If image file and on md+, open a larger window
    const isDesktopViewport = window.innerWidth > 768;
    const isImageFile =
      icon.type === "file" &&
      typeof icon.description === "string" &&
      icon.description.includes("/assets/images/");
    if (isImageFile && isDesktopViewport) {
      windowWidth = Math.min(Math.floor(window.innerWidth * 0.9), 1400);
      windowHeight = Math.min(Math.floor(window.innerHeight * 0.85), 900);
    }

    // Prevent windows from overlapping taskbar on open
    const taskbarHeight = 48;
    const availableHeight = window.innerHeight - taskbarHeight - 8;

    if (windowHeight > availableHeight) {
      windowHeight = Math.max(200, availableHeight);
    }

    const centerX = (window.innerWidth - windowWidth) / 2;
    const centerY = (availableHeight - windowHeight) / 2;

    const offset = windows.length * 30;
    const x = Math.max(8, centerX + offset);
    const y = Math.max(
      8,
      Math.min(centerY + offset, availableHeight - windowHeight)
    );

    const newWindow: WindowData = {
      id: `window-${icon.id}-${Date.now()}`,
      title: icon.name,
      isMinimized: false,
      isMaximized: isMobile,
      x,
      y,
      width: windowWidth,
      height: windowHeight,
      content: icon,
      zIndex: nextZIndex,
      type: icon.type,
      parentFolder: parentFolder,
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

  const resizeWindow = (
    windowId: string,
    newSize: { width: number; height: number },
    newPos?: { x: number; y: number }
  ) => {
    setWindows(
      windows.map((w) =>
        w.id === windowId ? { ...w, ...newSize, ...newPos } : w
      )
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

  const changeWindowContent = (windowId: string, newContent: IconData) => {
    setWindows(
      windows.map((w: WindowData) =>
        w.id === windowId
          ? { ...w, content: newContent, title: newContent.name }
          : w
      )
    );
  };

  return (
    <div
      className="w-full h-screen relative overflow-hidden select-none transition-opacity duration-1000"
      style={{
        backgroundImage: `url('${wallpaper}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        opacity: fadeIn ? 1 : 0,
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
            onDoubleClick={() => openWindow(icon, undefined)}
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
            onResize={resizeWindow}
            onChangeContent={(newContent) =>
              changeWindowContent(window.id, newContent)
            }
          />
        ))}

      {/* Start Menu */}
      <StartMenu
        isOpen={isStartMenuOpen}
        onClose={() => setIsStartMenuOpen(false)}
        onOpenIcon={openWindow}
      />

      {/* Taskbar */}
      <Taskbar
        windows={windows}
        onWindowToggle={toggleWindowFromTaskbar}
        onStartClick={toggleStartMenu}
      />
    </div>
  );
};
export default Desktop;
