import { Outlet } from "react-router-dom";
import Sidebar from "../../components/ui/SideBar";


export default function AppLayout() {
  return (
    <div className="flex h-screen bg-[#343541]">
      <Sidebar />
        <div className="flex-1 overflow-hidden">
          <Outlet />
        </div>
    
    </div>
  );
}
