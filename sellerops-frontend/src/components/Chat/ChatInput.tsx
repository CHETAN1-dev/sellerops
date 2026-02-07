import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createChat } from "../../services/api/chats";
import { getUploadStatus, processUpload, uploadCsv } from "../../services/api/uploads";

type Props = {
  chatId: string | null;
  onSendMessage?: (message: string) => Promise<void>;
  onRefreshMessages?: () => Promise<void>;
  onSetThinking?: (thinking: boolean, text?: string) => void;
};

type Attachment = {
  name: string;
  status: "READY" | "UPLOADING" | "ERROR";
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function ChatInput({
  chatId,
  onSendMessage,
  onRefreshMessages,
  onSetThinking,
}: Props) {
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [text, setText] = useState("");

  const navigate = useNavigate();

  async function ensureChatExists(): Promise<string> {
    if (chatId) return chatId;

    const chat = await createChat("New Chat");
    navigate(`/chat/${chat.id}`, { replace: true });
    return chat.id;
  }

  const waitForProcessingResult = async (uploadId: number) => {
    for (let attempt = 0; attempt < 45; attempt += 1) {
      await wait(2000);
      const status = await getUploadStatus(uploadId);
      if (status.status === "completed" || status.status === "failed") {
        return status.status;
      }
    }

    return "processing";
  };

  const handleSendMessage = async () => {
    const message = text.trim();
    if (!message && !selectedFile) return;

    if (selectedFile) {
      const file = selectedFile;
      setSelectedFile(null);
      setAttachment({
        name: file.name,
        status: "UPLOADING",
      });
      setText("");

      try {
        setUploading(true);

        const activeChatId = await ensureChatExists();
        const upload = await uploadCsv(activeChatId, file);
        await onRefreshMessages?.();

        onSetThinking?.(true, "🔄 Structuring your data...");
        await processUpload(upload.upload_id);
        await waitForProcessingResult(upload.upload_id);
        await onRefreshMessages?.();
      } catch {
        setAttachment({
          name: file.name,
          status: "ERROR",
        });
      } finally {
        onSetThinking?.(false);
        setUploading(false);
      }

      return;
    }

    try {
      if (onSendMessage) {
        await onSendMessage(message);
      } else {
        const activeChatId = await ensureChatExists();
        void activeChatId;
      }

      setText("");
    } catch {
      alert("❌ Failed to send message");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setAttachment({
      name: file.name,
      status: "READY",
    });

    e.target.value = "";
  };

  return (
    <div className="border-t border-gray-700 p-4">
      {attachment && (
        <div className="max-w-3xl mx-auto mb-2">
          <div className="flex items-center justify-between bg-[#2F303A] text-gray-200 px-3 py-2 rounded-lg text-sm">
            <span>📄 {attachment.name}</span>

            {attachment.status === "READY" && (
              <span className="text-blue-400">Ready to send</span>
            )}
            {attachment.status === "UPLOADING" && (
              <span className="text-yellow-400">Uploading…</span>
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
          disabled={!text.trim() && !selectedFile}
          className="text-gray-300 hover:text-white disabled:opacity-40"
        >
          ➤
        </button>
      </div>
    </div>
  );
}
