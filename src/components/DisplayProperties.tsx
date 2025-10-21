import { useState } from "react";
import { useTheme } from "../hooks/UseTheme";

const wallpapers = [
  { name: "Bliss", path: "/assets/images/bliss.webp" },
  { name: "Azul", path: "/assets/images/azul.webp" },
  { name: "Ascent", path: "/assets/images/ascent.webp" },
  { name: "OSX", path: "/assets/images/osx.webp" },
  { name: "Ueno", path: "/assets/images/ueno.webp" },
];

const colorPresets = [
  {
    name: "Default (Blue)",
    taskbar: "#245edb",
    border: "#1852E7",
    titleBarGradient:
      "linear-gradient(to bottom, #3087FB 0%, #1C6AF8 14%, #1753E3 18%, #164EE0 42%, #1852E8 56%, #1A5AF5 70%, #1C64FA 84%, #1A59F2 100%)",
    startMenuGradient:
      "linear-gradient(to bottom, #005CFD, #0054E3 4%, #0054E3 96%, #0042B3)",
  },
  {
    name: "Olive Green",
    taskbar: "#6B8E23",
    border: "#556B2F",
    titleBarGradient: "linear-gradient(to bottom, #8FBC8F, #6B8E23)",
    startMenuGradient: "linear-gradient(to bottom, #6B8E23, #556B2F)",
  },
  {
    name: "Silver",
    taskbar: "#708090",
    border: "#2F4F4F",
    titleBarGradient: "linear-gradient(to bottom, #B0C4DE, #708090)",
    startMenuGradient: "linear-gradient(to bottom, #708090, #2F4F4F)",
  },
  {
    name: "Energy Blue",
    taskbar: "#1E90FF",
    border: "#104E8B",
    titleBarGradient: "linear-gradient(to bottom, #87CEEB, #1E90FF)",
    startMenuGradient: "linear-gradient(to bottom, #1E90FF, #104E8B)",
  },
  {
    name: "Homestead",
    taskbar: "#8B7355",
    border: "#654321",
    titleBarGradient: "linear-gradient(to bottom, #D2B48C, #8B7355)",
    startMenuGradient: "linear-gradient(to bottom, #8B7355, #654321)",
  },
];

interface DisplayPropertiesProps {
  onClose: () => void;
}

export const DisplayProperties: React.FC<DisplayPropertiesProps> = ({
  onClose,
}) => {
  const { wallpaper, colors, setWallpaper, setColors, resetToDefaults } =
    useTheme();
  const [activeTab, setActiveTab] = useState<"appearance" | "desktop">(
    "appearance"
  );

  const handleColorPreset = (preset: (typeof colorPresets)[0]) => {
    setColors({
      taskbar: preset.taskbar,
      windowBorder: preset.border,
      titleBarGradient: preset.titleBarGradient,
      startMenuGradient: preset.startMenuGradient,
    });
  };

  return (
    <div className="h-full flex flex-col bg-xp-gray font-family-tahoma">
      {/* Tabs */}
      <div className="flex border-b border-gray-400 bg-xp-gray px-2 pt-2">
        <button
          className={`px-4 py-2 text-sm border border-gray-400 ${
            activeTab === "appearance"
              ? "bg-xp-gray border-b-xp-gray -mb-px z-10"
              : "bg-gray-200 border-b-gray-400"
          }`}
          style={{
            borderTopLeftRadius: "4px",
            borderTopRightRadius: "4px",
          }}
          onClick={() => setActiveTab("appearance")}
        >
          Appearance
        </button>
        <button
          className={`px-4 py-2 text-sm border border-gray-400 ${
            activeTab === "desktop"
              ? "bg-xp-gray border-b-xp-gray -mb-px z-10"
              : "bg-gray-200 border-b-gray-400"
          }`}
          style={{
            borderTopLeftRadius: "4px",
            borderTopRightRadius: "4px",
          }}
          onClick={() => setActiveTab("desktop")}
        >
          Desktop
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {activeTab === "appearance" && (
          <div>
            {/* Preview Monitor */}
            <div
              className="bg-gradient-to-b from-[#0054E3] to-[#0A2A6F] border-2 border-gray-400 rounded p-4 mb-4"
              style={{ height: "180px" }}
            >
              <div className="bg-white border border-gray-400 h-full flex items-center justify-center">
                <div className="text-center">
                  <div
                    className="w-32 h-20 mx-auto mb-2 border-2 rounded"
                    style={{
                      background: colors.titleBarGradient,
                      borderColor: colors.windowBorder,
                    }}
                  >
                    <div className="text-white text-xs p-1">Preview Window</div>
                  </div>
                  <p className="text-xs text-gray-600">Window Preview</p>
                </div>
              </div>
            </div>

            {/* Color Scheme Section */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">
                Color scheme:
              </label>
              <select
                className="w-full border border-gray-400 px-2 py-1 bg-white"
                value={
                  colorPresets.find((p) => p.taskbar === colors.taskbar)
                    ?.name || "Custom"
                }
                onChange={(e) => {
                  const preset = colorPresets.find(
                    (p) => p.name === e.target.value
                  );
                  if (preset) handleColorPreset(preset);
                }}
              >
                {colorPresets.map((preset) => (
                  <option key={preset.name} value={preset.name}>
                    {preset.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Color Preset Buttons */}
            <div className="space-y-2">
              {colorPresets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => handleColorPreset(preset)}
                  className={`w-full flex items-center gap-3 p-2 border rounded hover:bg-blue-50 hover:border-blue-400 transition ${
                    colors.taskbar === preset.taskbar
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  <div className="flex gap-1">
                    <div
                      className="w-8 h-8 rounded border border-gray-400"
                      style={{ background: preset.taskbar }}
                    />
                    <div
                      className="w-8 h-8 rounded border border-gray-400"
                      style={{ background: preset.border }}
                    />
                  </div>
                  <span className="text-sm">{preset.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === "desktop" && (
          <div>
            <h3 className="text-sm font-semibold mb-3">
              Select a background for your desktop:
            </h3>
            <div
              className="border border-gray-400 bg-white p-2 mb-3"
              style={{ maxHeight: "200px", overflowY: "auto" }}
            >
              {wallpapers.map((wp) => (
                <button
                  key={wp.path}
                  onClick={() => setWallpaper(wp.path)}
                  className={`w-full flex items-center gap-3 p-2 mb-1 hover:bg-blue-100 ${
                    wallpaper === wp.path ? "bg-blue-200" : ""
                  }`}
                >
                  <img
                    src={wp.path}
                    alt={wp.name}
                    className="w-16 h-12 object-cover border border-gray-400"
                  />
                  <span className="text-base md:text-xl tracking-wide">
                    {wp.name}
                  </span>
                </button>
              ))}
            </div>

            {/* Preview */}
            <div className="border border-gray-400 bg-white p-2">
              <img
                src={wallpaper}
                alt="Preview"
                className="w-full h-32 md:h-40 object-cover"
              />
            </div>
          </div>
        )}
      </div>

      {/* Footer Buttons */}
      <div className="flex justify-end gap-2 p-3 border-t border-gray-400 bg-xp-gray">
        <button
          onClick={onClose}
          className="px-6 py-1.5 bg-gradient-to-b from-white to-gray-200 border border-gray-500 rounded text-sm hover:bg-gray-100 shadow-sm"
        >
          OK
        </button>
        <button
          onClick={onClose}
          className="px-6 py-1.5 bg-gradient-to-b from-white to-gray-200 border border-gray-500 rounded text-sm hover:bg-gray-100 shadow-sm"
        >
          Cancel
        </button>
        <button className="px-6 py-1.5 bg-gradient-to-b from-white to-gray-200 border border-gray-500 rounded text-sm hover:bg-gray-100 shadow-sm">
          Apply
        </button>
      </div>

      {/* Reset Button */}
      <div className="px-3 pb-2">
        <button
          onClick={resetToDefaults}
          className="text-xs text-blue-600 hover:underline"
        >
          Reset to default settings
        </button>
      </div>
    </div>
  );
};
