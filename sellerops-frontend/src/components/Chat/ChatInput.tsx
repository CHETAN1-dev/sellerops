import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createChat, sendMessage } from "../../services/api/chats";

type Props = {
  chatId: string | null;
};

type Attachment = {
  name: string;
  status: "UPLOADING" | "DONE" | "ERROR";
};

export default function ChatInput({ chatId }: Props) {
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const [uploading, setUploading] = useState(false);
  const [text, setText] = useState("");

  const navigate = useNavigate();

  /* ---------------------------------- */
  /* Ensure chat exists (draft → active) */
  /* ---------------------------------- */
  async function ensureChatExists(): Promise<string> {
    if (chatId) return chatId;

    const chat = await createChat("New Chat");
    navigate(`/chat/${chat.id}`, { replace: true });
    return chat.id;
  }

  /* ---------------- */
  /* Send text message */
  /* ---------------- */
  const handleSendMessage = async () => {
    if (!text.trim()) return;

    try {
      const activeChatId = await ensureChatExists();
      await sendMessage(activeChatId, text.trim());

      setText(""); // clear input
    } catch {
      alert("❌ Failed to send message");
    }
  };

  /* ---------------- */
  /* Upload CSV file  */
  /* ---------------- */
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAttachment({
      name: file.name,
      status: "UPLOADING",
    });

    try {
      setUploading(true);

      const activeChatId = await ensureChatExists();

      const formData = new FormData();
      formData.append("file", file);

      await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/uploads/csv?chat_id=${activeChatId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: formData,
        }
      );

      setAttachment({
        name: file.name,
        status: "DONE",
      });

      // 🔥 Later: trigger AI response / refresh messages here

    } catch {
      setAttachment({
        name: file.name,
        status: "ERROR",
      });
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="border-t border-gray-700 p-4">

      {/* Attachment card */}
      {attachment && (
        <div className="max-w-3xl mx-auto mb-2">
          <div className="flex items-center justify-between bg-[#2F303A] text-gray-200 px-3 py-2 rounded-lg text-sm">
            <span>📄 {attachment.name}</span>

            {attachment.status === "UPLOADING" && (
              <span className="text-yellow-400">Uploading…</span>
            )}
            {attachment.status === "DONE" && (
              <span className="text-green-400">Uploaded</span>
            )}
            {attachment.status === "ERROR" && (
              <span className="text-red-400">Failed</span>
            )}
          </div>
        </div>
      )}

      {/* Input row */}
      <div className="max-w-3xl mx-auto flex items-center gap-3 bg-[#40414F] rounded-xl px-4 py-3">

        {/* Upload */}
        <label className="cursor-pointer text-gray-400 hover:text-white">
          📎
          <input
            type="file"
            accept=".csv"
            hidden
            onChange={handleFileUpload}
            disabled={uploading}
          />
        </label>

        {/* Text input */}
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSendMessage();
          }}
          placeholder={
            uploading
              ? "Uploading CSV..."
              : "Ask about your sales data..."
          }
          className="flex-1 bg-transparent outline-none text-gray-200"
        />

        {/* Send */}
        <button
          onClick={handleSendMessage}
          disabled={!text.trim()}
          className="text-gray-300 hover:text-white disabled:opacity-40"
        >
          ➤
        </button>
      </div>
    </div>
  );
}
