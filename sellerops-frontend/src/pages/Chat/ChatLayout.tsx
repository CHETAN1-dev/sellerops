import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import ChatHeader from "../../components/Chat/ChatHeader";
import ChatInput from "../../components/Chat/ChatInput";
import ChatMessages from "../../components/Chat/ChatMessage";
import { apiRequest } from "../../services/api";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
};

export default function ChatLayout() {
  const { chatId } = useParams<{ chatId: string }>();

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  /**
   * Load messages ONLY when a real chatId exists
   */
  useEffect(() => {
    if (!chatId) return;

    setLoading(true);
    apiRequest<Message[]>(`/chats/${chatId}/messages`, {
      method: "GET",
    })
      .then(setMessages)
      .finally(() => setLoading(false));
  }, [chatId]);

  /**
   * Draft state — no chat created yet
   */
  if (!chatId) {
    return (
      <div className="h-full flex flex-col bg-[#343541]">
        <ChatHeader />
        <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
          Start a conversation or upload a file
        </div>
        <ChatInput chatId={null} />
      </div>
    );
  }

  /**
   * Active chat state
   */
  return (
    <div className="flex flex-col h-full bg-[#343541]">
      <ChatHeader />
      <ChatMessages messages={messages} loading={loading} />
      <ChatInput chatId={chatId} />
    </div>
  );
}
