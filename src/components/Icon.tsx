import type { IconData } from "../types";

interface IconProps {
  data: IconData;
  isSelected: boolean;
  onSelect: () => void;
  onDoubleClick: () => void;
}

const Icon: React.FC<IconProps> = ({
  data,
  isSelected,
  onSelect,
  onDoubleClick,
}) => {
  return (
    <div
      className={`absolute flex flex-col cursor-pointer items-center justify-center w-28 h-28 rounded-sm${
        isSelected ? "bg-blue-300/20 border border-blue-300/50" : ""
      } hover:bg-blue-200/30 transition-colors duration-150`}
      style={{ left: data.x, top: data.y }}
      onClick={onSelect}
      onDoubleClick={onDoubleClick}
    >
      <img
        src={data.icon}
        alt={data.name}
        className="w-20 h-20 pointer-events-none"
        style={{ imageRendering: "pixelated" }}
        draggable={false}
      />
      <span className="text-center drop-shadow-sm font-family-tahoma text-3xl">
        {data.name}
      </span>
    </div>
  );
};

export default Icon;
