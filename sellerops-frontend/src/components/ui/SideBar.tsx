import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import clsx from "clsx";

import { useMe } from "../../hooks/useMe";
import Avatar from "../Header/Avatar";
import { listChats, type Chat } from "../../services/api/chats";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useMe();

  const [collapsed, setCollapsed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    if (!menuOpen) return;
    const timeoutId = setTimeout(() => setMenuOpen(false), 3000);
    return () => clearTimeout(timeoutId);
  }, [menuOpen]);

  useEffect(() => {
    let isMounted = true;

    const loadChats = async () => {
      try {
        const chatList = await listChats();
        if (isMounted) {
          setChats(chatList);
        }
      } catch {
        if (isMounted) {
          setChats([]);
        }
      }
    };

    loadChats();
    const intervalId = window.setInterval(loadChats, 10000);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, [location.pathname]);

  const sortedChats = chats;

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/");
  };

  return (
    <div
      className={clsx(
        "h-screen bg-[#202123] text-gray-200 flex flex-col transition-all duration-300 relative",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div
        className="px-4 py-4 text-lg font-semibold border-b border-gray-700 cursor-pointer"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? "S" : "SellerOps"}
      </div>

      <button
        onClick={() => {
          if (location.pathname === "/chat/new") return;
          navigate("/chat/new", { replace: true });
        }}
        className="mx-3 mt-3 mb-2 border border-gray-600 rounded-md px-3 py-2 text-sm hover:bg-gray-700"
      >
        {collapsed ? "+" : "+ New Chat"}
      </button>

      <div className="flex-1 overflow-y-auto px-2 space-y-1">
        {sortedChats.map((chat) => (
          <ChatItem
            key={chat.id}
            title={chat.title}
            collapsed={collapsed}
            active={location.pathname === `/chat/${chat.id}`}
            onClick={() => navigate(`/chat/${chat.id}`)}
          />
        ))}
      </div>

      {user && (
        <div className="relative">
          {menuOpen && !collapsed && (
            <div className="absolute bottom-16 left-3 right-3 bg-[#2a2b2f] rounded-lg shadow-lg p-3 text-sm z-50">
              <p className="font-medium">{user.name}</p>
              <p className="text-xs text-gray-400 mb-3">{user.email}</p>

              <button
                onClick={logout}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-1.5 rounded text-sm"
              >
                Logout
              </button>
            </div>
          )}

          <div
            onClick={() => setMenuOpen((value) => !value)}
            className="border-t border-gray-700 p-3 flex items-center gap-3 cursor-pointer hover:bg-gray-800"
          >
            <Avatar name={user.name} onClick={() => {}} />

            {!collapsed && (
              <div className="text-sm">
                <p className="font-medium">{user.name}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ChatItem({
  title,
  collapsed,
  active,
  onClick,
}: {
  title: string;
  collapsed: boolean;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        "px-3 py-2 rounded-md cursor-pointer text-sm truncate",
        active ? "bg-gray-700" : "hover:bg-gray-700"
      )}
    >
      {collapsed ? "•" : title}
    </div>
  );
}
