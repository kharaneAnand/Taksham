import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Outlet />
    </div>
  );
};

export default MainLayout;