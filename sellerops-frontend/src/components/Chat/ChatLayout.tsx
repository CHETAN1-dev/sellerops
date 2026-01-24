import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessage";

export default function ChatLayout() {
  return (
    <div className="flex-1 h-screen flex flex-col bg-[#343541]">
      <ChatHeader />
      <ChatMessages />
      <ChatInput />
    </div>
  );
}
