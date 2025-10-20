export interface IconData {
  id: string;
  name: string;
  icon: string;
  type: "folder" | "empty" | "app" | "file" | "email" | "display-properties";
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
  type?: "folder" | "file" | "email" | "app" | "empty" | "display-properties";
  parentFolder?: IconData;
}
