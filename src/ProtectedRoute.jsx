// ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { ErrorToaster } from "./utils/toaster";

const ProtectedRoute = ({ isAuthenticated, children }) => {
  const location = useLocation();

  if (!isAuthenticated) {
    ErrorToaster("Please login to continue");
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;
