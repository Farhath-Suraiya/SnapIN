import { NavLink } from "react-router-dom";
import { Users, LayoutDashboard, BarChart3, Camera, History } from "lucide-react";

const Navbar = () => {
  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Mark Attendance", path: "/take-attendance", icon: <Camera size={18} /> },
    { name: "Records", path: "/attendance-records", icon: <History size={18} /> },
    { name: "Students", path: "/students", icon: <Users size={18} /> },
    { name: "Analytics", path: "/analytics", icon: <BarChart3 size={18} /> },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b h-20 flex items-center shadow-sm font-sans animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto px-6 w-full flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
            <span className="text-xl font-bold">S</span>
          </div>
          <span className="text-xl font-bold text-gray-800 tracking-tight">SnapIN</span>
        </div>

        {/* Nav Links */}
        <div className="hidden lg:flex items-center gap-4 font-semibold text-sm">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                  isActive
                    ? "text-blue-600 bg-blue-50 shadow-sm shadow-blue-50"
                    : "text-gray-500 hover:text-black hover:bg-gray-50"
                }`
              }
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}
        </div>

        {/* User Info / Placeholder */}
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 overflow-hidden shadow-sm">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User Avatar" />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;