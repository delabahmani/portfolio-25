import { useState } from "react";

interface EmailWindowProps {
  onClose: () => void;
}

export const EmailWindow: React.FC<EmailWindowProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus("success");
        setTimeout(() => {
          setFormData({ name: "", email: "", subject: "", message: "" });
          onClose();
        }, 2000);
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
      return console.error("Error sending email: ", error);
    }
  };

  return (
    <div className="h-full flex flex-col app-nav-gradient">
      <form
        onSubmit={handleSubmit}
        className="flex-1 flex flex-col overflow-hidden"
      >
        {/* Icon Toolbar */}
        <div className="flex items-center gap-2 px-2 border-b border-gray-400 ">
          <button
            type="submit"
            disabled={status === "sending"}
            className="p-1 rounded border border-transparent border-b-2 border-b-transparent hover:border-b-[#cdc8b5] hover:border-[#d8d2bd] hover:backdrop-brightness-[102%] flex items-center gap-1.5"
          >
            <img
              src="/assets/icons/mail-3.webp"
              alt="Send"
              className="w-4 h-4"
            />
            {status === "sending" ? "Sending..." : "Send"}
          </button>
          <div className="w-px h-6 bg-gray-400" />
          <button
            type="button"
            className="p-1 rounded border border-transparent border-b-2 border-b-transparent hover:border-b-[#cdc8b5] hover:border-[#d8d2bd] hover:backdrop-brightness-[102%] flex items-center"
          >
            <img
              src="/assets/icons/attach.webp"
              alt="Attach"
              className="w-10 h-8"
            />
            <span>Attach</span>
          </button>
        </div>

        {/* Email Form */}
        <div className="flex gap-2 flex-col justify-start px-2 py-3">
          <div className="flex items-center gap-2">
            <label className="w-14 border-b-[1px] border-b-[#d8d2bd] border-r-[1px] border-r-[#d8d2bd] border-l-[1px] border-l-[#FAFAFA] border-t-[1px] border-t-[#FAFAFA] brightness-105 px-2 ">
              From...
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="your.email@example.com"
              required
              className="flex-1 px-2 py-1 border border-gray-400 bg-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="w-14 border-b-[1px] border-b-[#d8d2bd] border-r-[1px] border-r-[#d8d2bd] border-l-[1px] border-l-[#FAFAFA] border-t-[1px] border-t-[#FAFAFA] brightness-105 px-2">
              Name:
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Your Name"
              required
              className="flex-1 px-2 py-1 border border-gray-400 bg-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="w-14 border-b-[1px] border-b-[#d8d2bd] border-r-[1px] border-r-[#d8d2bd] border-l-[1px] border-l-[#FAFAFA] border-t-[1px] border-t-[#FAFAFA] brightness-105 px-2">
              Subject:
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) =>
                setFormData({ ...formData, subject: e.target.value })
              }
              placeholder="Subject"
              required
              className="flex-1 px-2 py-1 border border-gray-400 bg-white"
            />
          </div>
        </div>

        <div className="flex-1 p-3 overflow-auto">
          <textarea
            value={formData.message}
            onChange={(e) =>
              setFormData({ ...formData, message: e.target.value })
            }
            placeholder="Type your message here..."
            required
            className="w-full h-full px-2 py-1 border border-gray-400 bg-white resize"
          />
        </div>

        <div className="px-3 py-2 border-t border-gray-400 flex items-center justify-between bg-xp-window">
          {status === "success" && (
            <span className="text-xp-green text-sm">
              ✓ Message sent successfully!
            </span>
          )}
          {status === "error" && (
            <span className="text-xp-red text-sm">
              ✗ Failed to send. Please try again.
            </span>
          )}
        </div>
      </form>
    </div>
  );
};
