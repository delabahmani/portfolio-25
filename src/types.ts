export interface IconData {
  id: string;
  name: string;
  icon: string;
  type: "folder" | "empty" | "app" | "file";
  x: number;
  y: number;
  content?: IconData[];
  url?: string;
  description?: string;
  isOpen?: boolean;
  isSelected?: boolean;
}

export interface WindowData {
  id: string;
  title: string;
  isMinimized: boolean;
  isMaximized: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  originalX?: number;
  originalY?: number;
  originalWidth?: number;
  originalHeight?: number;
  content?: IconData;
  zIndex: number;
}
