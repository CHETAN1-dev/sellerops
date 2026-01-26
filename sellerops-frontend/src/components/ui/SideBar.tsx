import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMe } from "../../hooks/useMe";
import Avatar from "../Header/Avatar";
import clsx from "clsx";

export default function Sidebar() {
  const navigate = useNavigate();
  const { user } = useMe();

  const [collapsed, setCollapsed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // ⏱ auto close after 3s
  useEffect(() => {
    if (!menuOpen) return;
    const t = setTimeout(() => setMenuOpen(false), 3000);
    return () => clearTimeout(t);
  }, [menuOpen]);

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
      {/* Logo */}
      <div
        className="px-4 py-4 text-lg font-semibold border-b border-gray-700 cursor-pointer"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? "S" : "SellerOps"}
      </div>

      {/* New Chat */}
      <button
        onClick={() => navigate("/chat/new")}
        className="mx-3 mt-3 mb-2 border border-gray-600 rounded-md px-3 py-2 text-sm hover:bg-gray-700"
      >
        {collapsed ? "+" : "+ New Chat"}
      </button>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto px-2 space-y-1">
        <ChatItem title="January Sales" collapsed={collapsed} />
        <ChatItem title="EU Orders Analysis" collapsed={collapsed} />
        <ChatItem title="Q4 Revenue" collapsed={collapsed} />
      </div>

      {/* USER SECTION */}
      {user && (
        <div className="relative">
          {/* dropdown */}
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

          {/* user bar */}
          <div
            onClick={() => setMenuOpen((v) => !v)}
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
}: {
  title: string;
  collapsed: boolean;
}) {
  return (
    <div className="px-3 py-2 rounded-md hover:bg-gray-700 cursor-pointer text-sm truncate">
      {collapsed ? "•" : title}
    </div>
  );
}
