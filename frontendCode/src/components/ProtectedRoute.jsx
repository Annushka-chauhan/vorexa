import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const token = localStorage.getItem("token");

  if (loading) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading...</div>;
  }

  // If neither context user nor localStorage token exists, redirect to login
  if (!user && !token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;