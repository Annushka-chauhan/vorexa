import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { LogOut, Briefcase, LayoutDashboard, BarChart2 } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  return (
    <nav className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center shadow-md">
      {/* Brand Logo & Navigation Tabs */}
      <div className="flex items-center space-x-8">
        <Link to="/dashboard" className="flex items-center space-x-2">
          <Briefcase className="w-6 h-6 text-indigo-400" />
          <span className="text-xl font-bold tracking-wide text-white">Vorexa</span>
        </Link>

        <div className="flex items-center space-x-2 text-sm font-medium">
          <Link
            to="/dashboard"
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md transition ${
              location.pathname === "/dashboard"
                ? "bg-indigo-600 text-white font-semibold"
                : "text-gray-300 hover:text-white hover:bg-slate-800"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Board</span>
          </Link>

          <Link
            to="/analytics"
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md transition ${
              location.pathname === "/analytics"
                ? "bg-indigo-600 text-white font-semibold"
                : "text-gray-300 hover:text-white hover:bg-slate-800"
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            <span>Analytics</span>
          </Link>
        </div>
      </div>

      {/* User Info & Logout */}
      <div className="flex items-center space-x-4">
        {user && (
          <span className="text-sm text-gray-300 font-medium hidden sm:inline">
            {user.email}
          </span>
        )}
        <button
          onClick={logout}
          className="flex items-center space-x-1.5 bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1.5 rounded-md transition duration-200"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;