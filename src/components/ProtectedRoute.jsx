// components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token"); // or use context if you manage auth globally

  if (!token) {
    // Not logged in → redirect to Login
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
