import { desktopIcons } from "../data/portfolioData";
import type { IconData } from "../types";

interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenIcon: (icon: IconData) => void;
}

const StartMenu: React.FC<StartMenuProps> = ({
  isOpen,
  onClose,
  onOpenIcon,
}) => {
  if (!isOpen) return null;

  const handleItemClick = (itemName: string) => {
    const item = desktopIcons.find(
      (i) => i.name.toLowerCase() === itemName.toLowerCase()
    );
    if (item) {
      onOpenIcon(item);
    }
    onClose();
  };

  const MenuItem = ({
    icon,
    title,
    subtitle,
    onClick,
    href,
    isLarge,
    isRightPanel,
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    onClick?: () => void;
    href?: string;
    isLarge?: boolean;
    isRightPanel?: boolean;
  }) => {
    const content = (
      <div className="group relative flex items-center gap-3 px-2 py-1.5 hover:bg-[#316AC5] hover:text-white rounded-sm cursor-pointer text-shadow-sm">
        <img
          src={icon}
          alt={title}
          className={` ${isLarge ? "w-10 h-10" : "w-16 h-16"}`}
        />
        <div>
          <p
            className={`text-xl ${
              isRightPanel ? "font-semibold text-base" : ""
            }`}
          >
            {title}
          </p>
          {subtitle && (
            <p className="text-sm text-gray-500 group-hover:text-white ">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    );

    if (href) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
          className="w-full text-left"
        >
          {content}
        </a>
      );
    }
    return (
      <button onClick={onClick} className="w-full text-left">
        {content}
      </button>
    );
  };

  return (
    <div
      className="absolute bottom-[30px] left-0 w-[420px] h-[520px] flex flex-col font-family-tahoma text-sm shadow-xl z-50"
      style={{
        background: "linear-gradient(to right, #ffffff 55%, #d4e5f7 55%)",
        borderRight: "3px solid #1852E7",
        borderLeft: "3px solid #1852E7",
        borderTop: "2px solid #1852E7",
        borderRadius: "8px 8px 0 0 ",
        boxShadow: "3px -3px 10px rgba(0,0,0,0.2)",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div
        className="flex items-center text-white rounded-tl-sm rounded-tr-sm"
        style={{
          background:
            "linear-gradient(to bottom, #3087FB 0%, #1C6AF8 14%, #1753E3 18%, #164EE0 42%, #1852E8 56%, #1A5AF5 70%, #1C64FA 84%, #1A59F2 100%)",
          height: "60px",
          fontFamily: "Trebuchet MS, sans-serif",
          fontSize: "11px",
          borderTop: "1px solid #3D95FF",
          touchAction: "none",
        }}
      >
        <div className="w-18 h-18 rounded-md flex items-center justify-center">
          <img
            src="/assets/icons/user-avatar.webp"
            alt="User"
            className="w-16 h-16 drop-shadow-2xl"
          />
        </div>
        <span
          className="font-medium text-xl"
          style={{ textShadow: "1px 1px 1px rgba(0,0,0,0.5)" }}
        >
          Delara
        </span>
      </div>
      <div
        style={{
          height: "2px",
          background:
            "linear-gradient(90deg,rgba(255, 255, 255, 1) 0%, rgba(251, 143, 43, 1) 50%, rgba(255, 255, 255, 1) 100%)",
        }}
      />

      {/* Main Content */}
      <div className="flex-1 flex text-black">
        {/* Left Panel */}
        <div className="w-[55%] flex flex-col p-1.5 text-black">
          <MenuItem
            isLarge
            icon="/assets/icons/github-icon-2.svg"
            title="Github"
            subtitle="View my source code"
            href="https://github.com/delabahmani"
          />
          <MenuItem
            isLarge
            icon="/assets/icons/linkedin-logo.webp"
            title="LinkedIn"
            subtitle="Connect with me"
            href="https://linkedin.com/in/delara-bahmani-0418b727b/"
          />
          <div className="flex-1"></div>
          <div className="border-t border-gray-300 my-1.5 mx-2"></div>{" "}
          <button className="w-full text-left">
            <div className="flex items-center justify-center gap-3 px-3 py-2 hover:bg-[#316AC5] hover:text-white rounded-sm cursor-pointer">
              <p className="font-bold">All Programs</p>

              <svg
                width="20"
                height="20"
                viewBox="0 0 16 16"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <radialGradient id="grad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#7bf877" />
                    <stop offset="100%" stopColor="#1d9a00" />
                  </radialGradient>
                </defs>
                <polygon
                  points="4,2 12,8 4,14"
                  fill="url(#grad)"
                  stroke="#006400"
                  strokeWidth="1"
                />
              </svg>
            </div>
          </button>
        </div>

        {/* Right Panel */}
        <div className="w-[45%] flex flex-col p-1">
          <MenuItem
            isRightPanel
            icon="/assets/icons/folder-open-note.webp"
            title="Projects"
            onClick={() => handleItemClick("projects")}
          />
          <MenuItem
            isRightPanel
            icon="/assets/icons/notepad.webp"
            title="About Me"
            onClick={() => handleItemClick("about me")}
          />
          <MenuItem
            isRightPanel
            icon="/assets/icons/mail.webp"
            title="Contact"
            onClick={() => handleItemClick("contact")}
          />
          <div className="border-t border-xp-light-blue my-1 mx-2"></div>
          <MenuItem
            isRightPanel
            icon="/assets/icons/control-panel.webp"
            title="Control Panel"
            onClick={() => handleItemClick("")}
          />
          <div className="flex-1"></div>
        </div>
      </div>

      {/* Footer */}
      <div
        className="flex justify-end items-center p-2" // CHANGE: Adjusted padding
        style={{
          background:
            "linear-gradient(to bottom, #005CFD, #0054E3 4%, #0054E3 96%, #0042B3)", // CHANGE: More accurate gradient
        }}
      >
        <button
          className="flex items-center  text-white hover:opacity-80"
        >
          <img
            src="/assets/icons/log-off.webp"
            alt="Log Off"
            className="w-10 h-10"
          />
          <span className="">Log Off</span>
        </button>
        <button
          className="flex items-center text-white hover:opacity-80 ml-4"
          onClick={() => window.close()}
        >
          <img
            src="/assets/icons/shut-down.webp"
            alt="Turn Off"
            className="w-10 h-10"
          />
          <span className="">Turn Off Browser</span>
        </button>
      </div>
    </div>
  );
};

export default StartMenu;
