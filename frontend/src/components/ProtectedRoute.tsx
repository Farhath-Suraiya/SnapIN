import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = localStorage.getItem("token");

  if (!token) {
    // If no token exists, redirect to login page
    return <Navigate to="/login" replace />;
  }

  // If token exists, render the protected component
  return <>{children}</>;
};

export default ProtectedRoute;
