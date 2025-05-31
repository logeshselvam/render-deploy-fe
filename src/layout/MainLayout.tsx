import { Outlet } from "react-router-dom";

export default function MainLayout() {

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500 p-6">
      <Outlet />
    </div>
  );
}
