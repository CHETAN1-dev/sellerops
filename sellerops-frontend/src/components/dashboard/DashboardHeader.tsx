import { useState } from "react";
import { useMe } from "../../hooks/useMe";
import Avatar from "./Avatar";
import ProfileDrawer from "./ProfileDrawer";

export default function DashboardHeader() {
  const [open, setOpen] = useState(false);
  const { user, loading } = useMe();

  if (loading) return null;

  return (
    <>
      <header className="flex items-center justify-between px-4 py-3 border-b">
        <h1 className="text-lg font-semibold">SellerOps</h1>

        {user && (
          <Avatar
            name={user.name}
            onClick={() => setOpen(true)}
          />
        )}
      </header>

      {user && (
        <ProfileDrawer
          open={open}
          onClose={() => setOpen(false)}
          user={user}
        />
      )}
    </>
  );
}
