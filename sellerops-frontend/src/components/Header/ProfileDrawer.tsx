import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Sidebar from "../ui/SideBar";

type Props = {
  open: boolean;
  onClose: () => void;
  user: {
    name: string;
    email: string;
  };
};

export default function ProfileDrawer({ open, onClose, user }: Props) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    onClose();
    navigate("/");
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Drawer */}
          <motion.div
            className="fixed right-0 top-0 h-full w-72 bg-white z-50 p-6 shadow-lg"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="space-y-4">
              <div>
                <p className="text-lg font-semibold">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>

              <hr />
              

              <button
                onClick={logout}
                className="w-full bg-red-500 text-white py-2 rounded"
              >
                Logout
              </button>
              <Sidebar/>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
