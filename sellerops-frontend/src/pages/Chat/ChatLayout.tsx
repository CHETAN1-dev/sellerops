import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import ChatHeader from "../../components/Chat/ChatHeader";
import ChatInput from "../../components/Chat/ChatInput";
import ChatMessages from "../../components/Chat/ChatMessage";
import { apiRequest } from "../../services/api";
import { sendLLMMessage } from "../../services/api/llm";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
};

function makeMessage(role: Message["role"], content: string): Message {
  return {
    id: crypto.randomUUID(),
    role,
    content,
    created_at: new Date().toISOString(),
  };
}

export default function ChatLayout() {
  const { chatId } = useParams<{ chatId: string }>();

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!chatId) {
      setMessages([]);
      return;
    }

    setLoading(true);
    apiRequest<Message[]>(`/chats/${chatId}/messages`, {
      method: "GET",
    })
      .then(setMessages)
      .finally(() => setLoading(false));
  }, [chatId]);

  async function handleSendMessage(message: string) {
    const userMessage = makeMessage("user", message);
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const llmResponse = await sendLLMMessage(message);
      setMessages((prev) => [...prev, makeMessage("assistant", llmResponse.response)]);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch response from assistant.";
      setMessages((prev) => [...prev, makeMessage("assistant", `Error: ${errorMessage}`)]);
    } finally {
      setLoading(false);
    }
  }

  if (!chatId) {
    return (
      <div className="h-full flex flex-col bg-[#343541]">
        <ChatHeader />
        <ChatMessages messages={messages} loading={loading} />
        <ChatInput chatId={null} onSendMessage={handleSendMessage} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#343541]">
      <ChatHeader />
      <ChatMessages messages={messages} loading={loading} />
      <ChatInput chatId={chatId} onSendMessage={handleSendMessage} />
    </div>
  );
}
