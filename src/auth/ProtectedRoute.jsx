import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ children, roles }) => {
  const auth = useAuth();

  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  const { user } = auth;

  // 🔐 Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 🔒 Role check (FIXED)
  if (roles && user.role) {
    // Convert ROLE_ADMIN -> ADMIN
    const normalizedRole = user.role.replace("ROLE_", "");

    if (!roles.includes(normalizedRole)) {
      return <Navigate to="/login" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
