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
    <div className="h-full flex flex-col bg-xp-window">
      <form
        onSubmit={handleSubmit}
        className="flex-1 flex flex-col overflow-hidden"
      >
        {/* Icon Toolbar */}
        <div className="flex items-center gap-2 px-2 py-2 border-b border-gray-400 bg-gradient-to-b from-white to-[#ece9d8]">
          <button
            type="submit"
            disabled={status === "sending"}
            className="p-1 hover:bg-blue-100 border border-transparent hover:border-blue-300 flex items-center gap-2"
          >
            <img
              src="/assets/icons/mail-3.webp"
              alt="Send"
              className="w-6 h-6"
            />
            {status === "sending" ? "Sending..." : "Send"}
          </button>
          <div className="w-px h-6 bg-gray-400" />
          <button
            type="button"
            className="p-1 hover:bg-blue-100 border border-transparent hover:border-blue-300 flex items-center"
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
        <div className="flex gap-2 flex-col justify-start px-6.5 py-3">
          <div className="flex items-center gap-2">
            <label className="w-16 font-bold">From:</label>
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
            <label className="w-16 font-bold">Name:</label>
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
            <label className="w-16 font-bold">Subject:</label>
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
