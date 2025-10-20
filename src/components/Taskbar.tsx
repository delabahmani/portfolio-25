import { useEffect, useState } from "react";
import type { WindowData } from "../types";
import { useTheme } from "../hooks/UseTheme";

interface TaskbarProps {
  windows: WindowData[];
  onWindowToggle: (windowId: string) => void;
  onStartClick: () => void;
}

const Taskbar: React.FC<TaskbarProps> = ({
  windows,
  onWindowToggle,
  onStartClick,
}) => {
  const { colors } = useTheme();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showStartMenu, _setShowStartMenu] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const isMobile = window.innerWidth <= 768;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const formatTime = () => {
    return currentTime.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleStartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onStartClick();
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 flex items-center justify-between px-1 select-none"
      style={{
        height: "35px",
        background: `linear-gradient(to bottom, ${colors.taskbar} 0%, ${colors.taskbar}dd 50%, ${colors.taskbar}dd 100%)`,
        borderTop: "1px solid #4A9EFF",
        zIndex: 1000,
      }}
    >
      {/* Start Button */}
      <button
        className="flex items-center px-4 py-1 text-white font-bold text-xs rounded-sm border border-green-600"
        style={{
          background: showStartMenu
            ? "linear-gradient(to bottom, #2F5F2F 0%, #1F4F1F 100%)"
            : "linear-gradient(to bottom, #4F8F4F 0%, #2F5F2F 100%)",
          height: "24px",
          boxShadow: "inset 1px 1px 0 rgba(255,255,255,0.3)",
        }}
        onClick={handleStartClick}
      >
        start
      </button>

      {/* Window Buttons */}
      <div className="flex-1 flex items-center gap-2 px-2">
        {windows.map((window) => (
           <button
            key={window.id}
            className={`flex items-center px-1 md:px-2 py-1 text-white text-[13px] md:text-sm rounded-sm border truncate cursor-pointer ${
              window.isMinimized
                ? "border-gray-400 bg-gray-600"
                : "border-blue-300 bg-blue-700"
            } ${isMobile ? "max-w-28 min-w-10" : "max-w-40 min-w-32"} `}
            style={{
              height: isMobile ? "24px" : "30px",
              background: window.isMinimized
                ? "linear-gradient(to bottom, #666 0%, #444 100%)"
                : `linear-gradient(to bottom, ${colors.taskbar}cc 0%, ${colors.windowBorder} 100%)`,
              boxShadow: window.isMinimized
                ? "inset 1px 1px 2px rgba(0,0,0,0.3)"
                : "inset 1px 1px 0 rgba(255,255,255,0.3)",
              alignItems: "center",
            }}
            onClick={() => {
              onWindowToggle(window.id);
            }}
          >
            <img
              src={window.content?.icon}
              alt={window.title}
              className="md:mr-2 mr-[2px] flex-shrink-0"
              style={{
                display: "block",
                width: "auto",
                marginTop: 0,
                marginBottom: 0,
                height: isMobile ? 16 : 20,
                objectFit: "contain",
                objectPosition: "center",
              }}
            />
            <span
              className="truncate custom-text-shadow leading-none"
              style={{ fontSize: isMobile ? "15px" : "18px", marginBottom: 2 }}
            >
              {window.title}
            </span>
          </button>
        ))}
      </div>

      {/* System Tray */}
      <div
        className="flex items-center px-2 py-1 border-l border-blue-300"
        style={{
          background: `linear-gradient(to bottom, ${colors.taskbar} 0%, ${colors.taskbar}cc 100%)`,
          height: "26px",
        }}
      >
        <div className="flex items-center text-white md:text-xl">
          <span className="md:ml-2">{formatTime()}</span>
        </div>
      </div>
    </div>
  );
};

export default Taskbar;
