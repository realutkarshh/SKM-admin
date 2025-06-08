// src/components/Sidebar.jsx
import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const navItems = [
    { name: "Dashboard", path: "/" },
    { name: "Admission Queries", path: "/admissions" },
    { name: "Messages", path: "/messages" },
    { name: "News & Notifications", path: "/news" },
    { name: "Bank Details", path: "/bank" },
  ];

  return (
    <aside className="w-64 h-screen bg-teal-800 text-white fixed left-0 top-0 p-6 shadow-md">
      <h2 className="text-2xl font-bold mb-8">SKM Admin</h2>
      <nav className="flex flex-col gap-3">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `p-2 rounded ${isActive ? "bg-white text-teal-800" : "hover:bg-teal-700"}`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
      <button
        onClick={logout}
        className="mt-10 text-sm text-red-300 hover:text-white"
      >
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;
