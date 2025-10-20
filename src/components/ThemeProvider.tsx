import { useState, useEffect, type ReactNode } from "react";
import { ThemeContext, type ThemeColors } from "../context/ThemeContext";

const defaultColors: ThemeColors = {
  taskbar: "#245edb",
  windowBorder: "#1852E7",
  titleBarGradient:
    "linear-gradient(to bottom, #3087FB 0%, #1C6AF8 14%, #1753E3 18%, #164EE0 42%, #1852E8 56%, #1A5AF5 70%, #1C64FA 84%, #1A59F2 100%)",
  startMenuGradient:
    "linear-gradient(to bottom, #005CFD, #0054E3 4%, #0054E3 96%, #0042B3)",
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [wallpaper, setWallpaperState] = useState<string>(
    "/assets/images/bliss.webp"
  );
  const [colors, setColorsState] = useState<ThemeColors>(defaultColors);

  // Load from localStorage on mount
  useEffect(() => {
    const savedWallpaper = localStorage.getItem("xp-wallpaper");
    const savedColors = localStorage.getItem("xp-colors");

    if (savedWallpaper) setWallpaperState(savedWallpaper);
    if (savedColors) setColorsState(JSON.parse(savedColors));
  }, []);

  const setWallpaper = (newWallpaper: string) => {
    setWallpaperState(newWallpaper);
    localStorage.setItem("xp-wallpaper", newWallpaper);
  };

  const setColors = (newColors: Partial<ThemeColors>) => {
    const updated = { ...colors, ...newColors };
    setColorsState(updated);
    localStorage.setItem("xp-colors", JSON.stringify(updated));
  };

  const resetToDefaults = () => {
    setWallpaperState("/assets/images/bliss.webp");
    setColorsState(defaultColors);
    localStorage.removeItem("xp-wallpaper");
    localStorage.removeItem("xp-colors");
  };

  return (
    <ThemeContext.Provider
      value={{ wallpaper, colors, setWallpaper, setColors, resetToDefaults }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
