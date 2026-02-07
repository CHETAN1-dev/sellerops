import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import ChatHeader from "../../components/Chat/ChatHeader";
import ChatInput from "../../components/Chat/ChatInput";
import ChatMessages from "../../components/Chat/ChatMessage";

import { getChat, getMessages } from "../../services/api/chats";
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
  const [thinkingText, setThinkingText] = useState<string | null>(null);
  const [chatTitle, setChatTitle] = useState("Sales Assistant");

  const refreshMessages = async () => {
    if (!chatId) {
      setMessages([]);
      return;
    }
    const nextMessages = await getMessages(chatId);
    setMessages(nextMessages);
  };

  useEffect(() => {
    if (!chatId) {
      setChatTitle("Sales Assistant");
      setMessages([]);
      return;
    }

    setLoading(true);
    Promise.all([getChat(chatId), getMessages(chatId)])
      .then(([chat, nextMessages]) => {
        setChatTitle(chat.title);
        setMessages(nextMessages);
      })
      .finally(() => setLoading(false));
  }, [chatId]);

  async function handleSendMessage(message: string) {
    const userMessage = makeMessage("user", message);
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const llmResponse = await sendLLMMessage(message);
      setMessages((prev) => [
        ...prev,
        makeMessage("assistant", llmResponse.response),
      ]);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to fetch response from assistant.";
      setMessages((prev) => [
        ...prev,
        makeMessage("assistant", `Error: ${errorMessage}`),
      ]);
    } finally {
      setLoading(false);
    }
  }

  const handleSetThinking = (
    thinking: boolean,
    text = "🔄 Structuring your data..."
  ) => {
    setThinkingText(thinking ? text : null);
  };

  if (!chatId) {
    return (
      <div className="h-full flex flex-col bg-[#343541]">
        <ChatHeader title="Sales Assistant" />
        <ChatMessages
          messages={messages}
          loading={loading}
          thinkingText={thinkingText}
        />
        <ChatInput
          chatId={null}
          onSendMessage={handleSendMessage}
          onRefreshMessages={refreshMessages}
          onSetThinking={handleSetThinking}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#343541]">
      <ChatHeader title={chatTitle} />
      <ChatMessages
        messages={messages}
        loading={loading}
        thinkingText={thinkingText}
      />
      <ChatInput
        chatId={chatId}
        onSendMessage={handleSendMessage}
        onRefreshMessages={refreshMessages}
        onSetThinking={handleSetThinking}
      />
    </div>
  );
}
