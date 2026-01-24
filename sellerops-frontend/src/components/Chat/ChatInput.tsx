export default function ChatInput() {
  return (
    <div className="border-t border-gray-700 p-4">
      <div className="max-w-3xl mx-auto flex items-center gap-3 bg-[#40414F] rounded-xl px-4 py-3">
        
        {/* Upload */}
        <label className="cursor-pointer text-gray-400 hover:text-white">
          📎
          <input type="file" accept=".csv" hidden />
        </label>

        {/* Input */}
        <input
          placeholder="Ask about your sales data..."
          className="flex-1 bg-transparent outline-none text-gray-200"
        />

        {/* Send */}
        <button className="text-gray-400 hover:text-white">
          ➤
        </button>
      </div>
    </div>
  );
}
