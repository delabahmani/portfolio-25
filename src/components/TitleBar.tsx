import React from "react";
import { useTheme } from "../hooks/UseTheme";

interface TitleBarProps {
  title: string;
  icon?: string;
  isMaximized: boolean;
  isMobile: boolean;
  isDragging: boolean;
  onClose: (e: React.MouseEvent) => void;
  onMinimize: (e: React.MouseEvent) => void;
  onMaximize: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  bind: (...args: any[]) => any;
}

const TitleBar: React.FC<TitleBarProps> = ({
  title,
  icon,
  isMaximized,
  isMobile,
  isDragging,
  onClose,
  onMinimize,
  onMaximize,
  bind,
}) => {
  const { colors } = useTheme();

  return (
    <div
      {...bind()}
      className={`text-white flex justify-between items-center select-none ${
        !isMaximized && (isDragging ? "cursor-grabbing" : "cursor-move")
      } `}
      style={{
        background: colors.titleBarGradient,
        height: "28px",
        fontFamily: "Trebuchet MS, sans-serif",
        fontSize: "12px",
        borderTop: "1px solid #3D95FF",
        touchAction: "none",
        paddingLeft: "4px",
        paddingRight: "4px",
        paddingTop: "2px",
        paddingBottom: "2px",
      }}
    >
      <div className="flex items-center" style={{ gap: "6px", height: "100%" }}>
        {icon && (
          <img
            src={icon}
            className="select-none"
            style={{
              width: 16,
              height: 16,
              objectFit: "contain",
              marginLeft: 3,
            }}
            alt={`${title} icon`}
          />
        )}
        <span
          className="font-bold"
          style={{
            textShadow: "1px 1px 0 rgba(0, 0, 0, 0.5)",
            lineHeight: "1",
          }}
        >
          {title}
        </span>
      </div>

      <div
        className="flex"
        style={{ gap: "2px", height: "100%", alignItems: "center" }}
      >
        {/* Minimize Button */}
        <button
          className="cursor-pointer border-none bg-transparent p-0 hover:brightness-110"
          style={{
            width: "21px",
            height: "21px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={onMinimize}
        >
          <img
            src="/assets/icons/minimize.webp"
            alt="Minimize"
            style={{
              width: "21px",
              height: "21px",
              display: "block",
            }}
            draggable={false}
          />
        </button>

        {/* Maximize Button */}
        {!isMobile && (
          <button
            className="cursor-pointer border-none bg-transparent p-0 hover:brightness-110"
            style={{
              width: "21px",
              height: "21px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={(e) => {
              e.stopPropagation();
              onMaximize();
            }}
          >
            <img
              src="/assets/icons/maximize.webp"
              alt="Maximize"
              style={{
                width: "21px",
                height: "21px",
                display: "block",
              }}
              draggable={false}
            />
          </button>
        )}

        {/* Close Button */}
        <button
          className="cursor-pointer border-none bg-transparent p-0 hover:brightness-110"
          style={{
            width: "21px",
            height: "21px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={onClose}
        >
          <img
            src="/assets/icons/exit.webp"
            alt="Close"
            style={{
              width: "21px",
              height: "21px",
              display: "block",
            }}
            draggable={false}
          />
        </button>
      </div>
    </div>
  );
};

export default TitleBar;
