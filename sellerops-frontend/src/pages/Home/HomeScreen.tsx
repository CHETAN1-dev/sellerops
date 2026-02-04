import { useNavigate } from "react-router-dom";


const chats = [
  { id: "1", title: "January Sales Analysis" },
  { id: "2", title: "Q4 Revenue Review" },
];

export default function Home() {
  const navigate = useNavigate();

  const handleNewChat = () => {
    // later → call backend to create chat
    navigate("/chat/new");
  };

  return (
    <div className="min-h-screen bg-gray-50 px-8 py-10">
      
      {/* <ChatLayout/> */}
      
      <div className="mt-10 max-w-2xl">
        <h2 className="text-2xl font-semibold">
          Welcome to SellerOps 👋
        </h2>
        <p className="mt-3 text-gray-600">
          Analyze your sales data by chatting with it.
          Each chat is a dedicated workspace for one CSV file.
        </p>
      </div>

      {/* New Chat */}
      <div className="mt-8">
        <button
          onClick={handleNewChat}
          className="rounded-lg bg-indigo-600 px-5 py-2.5 text-white font-medium hover:bg-indigo-700"
        >
          + New Chat
        </button>
      </div>

      {/* Chat List */}
      <div className="mt-10 max-w-xl">
        <h3 className="mb-4 text-lg font-semibold text-gray-800">
          Your Chats
        </h3>

        {chats.length === 0 ? (
          <p className="text-gray-500">
            No chats yet. Create one to start analyzing your data.
          </p>
        ) : (
          <ul className="space-y-3">
            {chats.map((chat) => (
              <li
                key={chat.id}
                onClick={() => navigate(`/chat/${chat.id}`)}
                className="cursor-pointer rounded-lg bg-white p-4 shadow-sm hover:shadow-md transition"
              >
                {chat.title}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
