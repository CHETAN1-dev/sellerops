export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-[#202123] text-gray-200 flex flex-col">
      
      {/* Logo */}
      <div className="px-4 py-4 text-lg font-semibold border-b border-gray-700">
        SellerOps
      </div>

      {/* New Chat */}
      <button className="mx-3 mt-3 mb-2 border border-gray-600 rounded-md px-3 py-2 text-sm hover:bg-gray-700">
        + New Chat
      </button>

      {/* Search */}
      <div className="px-3 mb-2">
        <input
          placeholder="Search chats"
          className="w-full bg-gray-800 text-sm px-3 py-2 rounded-md outline-none"
        />
      </div>

      {/* Chats */}
      <div className="flex-1 overflow-y-auto px-2 space-y-1">
        <ChatItem title="January Sales" />
        <ChatItem title="EU Orders Analysis" />
        <ChatItem title="Q4 Revenue" />
      </div>

      {/* Footer */}
      <div className="border-t border-gray-700 p-3 text-xs text-gray-400">
        © SellerOps
      </div>
    </div>
  );
}

function ChatItem({ title }: { title: string }) {
  return (
    <div className="px-3 py-2 rounded-md hover:bg-gray-700 cursor-pointer text-sm">
      {title}
    </div>
  );
}
