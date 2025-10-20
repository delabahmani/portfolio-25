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
        fontSize: "11px",
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
          className="font-medium"
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
          className="flex justify-center items-center font-bold cursor-pointer"
          style={{
            width: "20px",
            height: "20px",
            marginLeft: "2px",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            borderRadius: "2px",
            boxShadow: "0 1px 0 rgba(0, 0, 0, 0.2)",
            fontSize: "11px",
            lineHeight: "1",
            padding: "0",
          }}
          onClick={onMinimize}
        >
          _
        </button>

        {/* Maximize Button */}
        {!isMobile && (
          <button
            className="flex justify-center items-center font-bold cursor-pointer"
            style={{
              width: "20px",
              height: "20px",
              marginLeft: "2px",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              borderRadius: "2px",
              boxShadow: "0 1px 0 rgba(0, 0, 0, 0.2)",
              fontSize: "9px",
              lineHeight: "1",
              padding: "0",
            }}
            onClick={(e) => {
              e.stopPropagation();
              onMaximize();
            }}
          >
            {isMaximized ? (
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="1"
                  y="1"
                  width="4"
                  height="4"
                  stroke="white"
                  strokeWidth="1"
                />
                <rect
                  x="5"
                  y="5"
                  width="4"
                  height="4"
                  stroke="white"
                  strokeWidth="1"
                />
              </svg>
            ) : (
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="1"
                  y="1"
                  width="8"
                  height="8"
                  stroke="white"
                  strokeWidth="1"
                />
              </svg>
            )}
          </button>
        )}

        {/* Close Button */}
        <button
          className="flex justify-center items-center font-bold cursor-pointer"
          style={{
            width: "20px",
            height: "20px",
            marginLeft: "2px",
            background: "linear-gradient(to bottom, #FF8F8F, #CC0000)",
            border: "1px solid #CC0000",
            borderRadius: "2px",
            boxShadow: "0 1px 0 rgba(0, 0, 0, 0.2)",
            fontSize: "20px",
            color: "white",
            lineHeight: "1",
            padding: "0",
          }}
          onClick={onClose}
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 1L9 9M9 1L1 9"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TitleBar;
