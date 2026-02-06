import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createChat } from "../../services/api/chats";

type Props = {
  chatId: string | null;
  onSendMessage?: (message: string) => Promise<void>;
};

type Attachment = {
  name: string;
  status: "UPLOADING" | "DONE" | "ERROR";
};

export default function ChatInput({ chatId, onSendMessage }: Props) {
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const [uploading, setUploading] = useState(false);
  const [text, setText] = useState("");

  const navigate = useNavigate();

  async function ensureChatExists(): Promise<string> {
    if (chatId) return chatId;

    const chat = await createChat("New Chat");
    navigate(`/chat/${chat.id}`, { replace: true });
    return chat.id;
  }

  const handleSendMessage = async () => {
    const message = text.trim();
    if (!message) return;

    try {
      if (onSendMessage) {
        await onSendMessage(message);
      } else {
        const activeChatId = await ensureChatExists();
        // TODO: persist chat messages via /chats/:chat_id/messages when this path is re-enabled.
        void activeChatId;
      }

      setText("");
    } catch {
      alert("❌ Failed to send message");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

      <div className="max-w-3xl mx-auto flex items-center gap-3 bg-[#40414F] rounded-xl px-4 py-3">
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

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSendMessage();
          }}
          placeholder={uploading ? "Uploading CSV..." : "Ask about your sales data..."}
          className="flex-1 bg-transparent outline-none text-gray-200"
        />

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
