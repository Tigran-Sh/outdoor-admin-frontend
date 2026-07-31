import { Outlet } from "react-router-dom";

function DashboardLayout() {
  return (
    <div>
      <header>Header</header>

      <aside>Sidebar</aside>

      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;
