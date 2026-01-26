import ChatHeader from "../../components/Chat/ChatHeader";
import ChatInput from "../../components/Chat/ChatInput";
import ChatMessages from "../../components/Chat/ChatMessage";


export default function ChatLayout() {
  return (
     <div className="flex flex-col h-full bg-[#343541]">
      <ChatHeader />
      <ChatMessages />
      <ChatInput />
    </div>
  );
}
