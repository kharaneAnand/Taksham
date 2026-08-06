import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-neutral-100">
      <Outlet />
    </div>
  );
};

export default AdminLayout;