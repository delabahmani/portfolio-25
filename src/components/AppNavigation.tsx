import type { WindowData } from "../types";

interface AppNavigationProps {
  data: WindowData;
}

export default function AppNavigation({ data }: AppNavigationProps) {
  const getAddressPath = () => {
    if (data.type === "display-properties") {
      return "Control Panel\\Display Properties";
    }

    if (data.content?.type === "folder") {
      if (data.content?.name === "projects" && data.content?.content) {
        return `C:\\Desktop\\${data.content.name}`;
      }
      return `C:\\Desktop\\${data.title}`;
    }

    return `C:\\Desktop\\${data.title}`;
  };

  return (
    <div className="flex flex-col app-nav-gradient">
      {/* Menu Bar */}
      <div className="flex justify-between items-center px-0.5 border-b-[1px] border-b-[#d8d2bd]">
        <div>
          <button className="px-1.5 hover:bg-[#316ac5] hover:text-white">
            File
          </button>
          <button className="px-1.5 hover:bg-[#316ac5] hover:text-white">
            Edit
          </button>
          <button className="px-1.5 hover:bg-[#316ac5] hover:text-white">
            View
          </button>
          <button className="px-1.5 hover:bg-[#316ac5] hover:text-white">
            Favorites
          </button>
          <button className="px-1.5 hover:bg-[#316ac5] hover:text-white">
            Tools
          </button>
          <button className="px-1.5 hover:bg-[#316ac5] hover:text-white">
            Help
          </button>
        </div>
        <div className="bg-[#FAFAFA] border-l-[#D8D2BD] border-l w-10 h-full items-center flex justify-center">
          <img
            src="/assets/icons/logo.webp"
            alt="Windows Logo"
            className="h-5 w-5"
          />
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center px-0.5 py-1 gap-1 border-t-[1px] border-t-[#fff] border-b-[1px] border-b-[#d8d2bd] overflow-x-hidden">
        {/* Back Button */}
        <button className="flex items-center gap-1 px-1 py-1 rounded border border-transparent border-b-2 border-b-transparent hover:border-b-[#cdc8b5] hover:border-[#d8d2bd] hover:backdrop-brightness-[102%] group min-w-fit">
          <img
            src="/assets/icons/back.webp"
            alt="Back"
            className="w-4 h-4 md:w-6 md:h-6"
          />
          <span className="text-base">Back</span>
          <div className="w-px h-6 bg-transparent group-hover:bg-[#d8d2bd]"></div>
          <span className="text-[8px] transform scale-y-[0.75] inline-block">
            ▼
          </span>
        </button>

        {/* Forward Button (with dropdown) */}
        <button className="flex items-center gap-1 px-2 py-1 rounded border border-transparent border-b-2 border-b-transparent hover:border-b-[#cdc8b5] hover:border-[#d8d2bd] hover:backdrop-brightness-[102%] group min-w-fit shrink-0">
          <img
            src="/assets/icons/forward.webp"
            alt="Forward"
            className="w-4 h-4 md:w-6 md:h-6"
          />
          <div className="w-[0.5px] h-6 bg-transparent group-hover:bg-[#d8d2bd]"></div>
          <span className="text-[8px] transform scale-y-[0.75] inline-block">
            ▼
          </span>
        </button>

        {/* Up Button */}
        <button className="px-2 py-1 rounded border border-transparent border-b-2 border-b-transparent hover:border-b-[#cdc8b5] hover:border-[#d8d2bd] hover:backdrop-brightness-[102%] min-w-fit shrink-0">
          <img src="/assets/icons/up.webp" alt="Up" className="w-6 h-6" />
        </button>

        {/* Separator */}
        <div className="w-px h-6 bg-gray-400 mx-1"></div>

        {/* Search Button */}
        <button className="flex items-center gap-1 px-2 py-1 rounded border border-transparent border-b-2 border-b-transparent hover:border-b-[#cdc8b5] hover:border-[#d8d2bd] hover:backdrop-brightness-[102%]">
          <img
            src="/assets/icons/search.webp"
            alt="Search"
            className="w-4 h-4 md:w-6 md:h-6"
          />
          <span className="text-base">Search</span>
        </button>

        {/* Folders Button */}
        <button className="hidden md:flex items-center gap-1 px-2 py-1 rounded border border-transparent border-b-2 border-b-transparent hover:border-b-[#cdc8b5] hover:border-[#d8d2bd] hover:backdrop-brightness-[102%]">
          <img
            src="/assets/icons/folders.webp"
            alt="Folders"
            className="w-4 h-4 md:w-6 md:h-6"
          />
          <span className="text-base">Folders</span>
        </button>

        {/* Separator */}
        <div className="w-px h-6 bg-gray-400 mx-1"></div>

        {/* Views Button (with dropdown) */}
        <button className="hidden md:flex items-center gap-1 px-2 py-1 rounded border border-transparent border-b-2 border-b-transparent hover:border-b-[#cdc8b5] hover:border-[#d8d2bd] hover:backdrop-brightness-[102%] group">
          <img
            src="/assets/icons/views.webp"
            alt="Views"
            className="w-4 h-4 md:w-6 md:h-6"
          />
          <div className="w-[0.5px] h-6 bg-transparent group-hover:bg-[#d8d2bd]"></div>
          <span className="text-[8px] transform scale-y-[0.75] inline-block">
            ▼
          </span>
        </button>
      </div>

      {/* Address Bar */}
      <div className="flex items-center px-2 py-0.5 gap-2  border-t-[1px] border-t-[#fff] border-b-[1px] border-b-[#d8d2bd]">
        <span className="">Address</span>
        <div className="flex-1 flex items-center px-2 bg-white border-[0.5px] border-[#7F9DB9]">
          <img
            src="/assets/icons/folders.webp"
            alt="Folder"
            className="w-4 h-4 mr-2"
          />
          <span className="text-base">{getAddressPath()}</span>
        </div>
        <button className="flex items-center gap-1 px-0.5 rounded border border-transparent border-b-2 border-b-transparent hover:border-b-[#cdc8b5] hover:border-[#d8d2bd] hover:backdrop-brightness-[102%] text-sm">
          <img
            src="/assets/icons/go.webp"
            alt="Go Symbol"
            className="w-5 h-5 md:w-6 md:h-6"
          />
          <span className="text-lg">Go</span>
        </button>
      </div>
    </div>
  );
}
