import { useDrag } from "@use-gesture/react";
import type { WindowData } from "../types";

interface ResizeHandlesProps {
  data: WindowData;
  onResize: (
    id: string,
    newSize: { width: number; height: number },
    newPos?: { x: number; y: number }
  ) => void;
}

const ResizeHandles: React.FC<ResizeHandlesProps> = ({ data, onResize }) => {
  const createResizeBind = (edge: ("top" | "bottom" | "left" | "right")[]) => {
    return useDrag(({ down, movement: [mx, my], memo }) => {
      memo = memo || {
        x: data.x,
        y: data.y,
        width: data.width,
        height: data.height,
      };
      let { width, height, x, y } = memo;
      let newPos;

      if (edge.includes("right")) width += mx;
      if (edge.includes("bottom")) height += my;
      if (edge.includes("left")) {
        width -= mx;
        x += mx;
      }
      if (edge.includes("top")) {
        height -= my;
        y += my;
      }

      width = Math.max(250, width);
      height = Math.max(150, height);

      if (edge.includes("left") || edge.includes("top")) newPos = { x, y };
      if (down) onResize(data.id, { width, height }, newPos);
      return memo;
    });
  };

  const bindTop = createResizeBind(["top"]);
  const bindBottom = createResizeBind(["bottom"]);
  const bindLeft = createResizeBind(["left"]);
  const bindRight = createResizeBind(["right"]);

  const bindTopLeft = createResizeBind(["top", "left"]);
  const bindTopRight = createResizeBind(["top", "right"]);
  const bindBottomLeft = createResizeBind(["bottom", "left"]);
  const bindBottomRight = createResizeBind(["bottom", "right"]);

  if (data.isMaximized) return null;

  return (
    <>
      {/* Edges */}
      <div
        {...bindTop()}
        className="absolute top-[-4px] left-0 w-full h-2 cursor-ns-resize"
      />
      <div
        {...bindBottom()}
        className="absolute bottom-[-4px] left-0 w-full h-2 cursor-ns-resize"
      />
      <div
        {...bindLeft()}
        className="absolute top-0 left-[-4px] w-2 h-full cursor-we-resize"
      />
      <div
        {...bindRight()}
        className="absolute top-0 right-[-4px] w-2 h-full cursor-we-resize"
      />

      {/* Corners */}
      <div
        {...bindTopLeft()}
        className="absolute top-[-4px] left-[-4px] w-4 h-4 cursor-nwse-resize"
      />
      <div
        {...bindTopRight()}
        className="absolute top-[-4px] right-[-4px] w-4 h-4 cursor-nesw-resize"
      />
      <div
        {...bindBottomLeft()}
        className="absolute bottom-[-4px] left-[-4px] w-4 h-4 cursor-nesw-resize"
      />
      <div
        {...bindBottomRight()}
        className="absolute bottom-[-4px] right-[-4px] w-4 h-4 cursor-nwse-resize"
      />
    </>
  );
};

export default ResizeHandles;
