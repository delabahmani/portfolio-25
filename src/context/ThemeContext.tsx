import { createContext } from "react";

export interface ThemeColors {
  taskbar: string;
  windowBorder: string;
  titleBarGradient: string;
  startMenuGradient: string;
}

export interface ThemeContextType {
  wallpaper: string;
  colors: ThemeColors;
  setWallpaper: (wallpaper: string) => void;
  setColors: (colors: Partial<ThemeColors>) => void;
  resetToDefaults: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);