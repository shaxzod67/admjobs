import { Navigate } from "react-router-dom";
import { getAuth } from "firebase/auth";

const ProtectedRoute = ({ children }) => {
  const auth = getAuth();
  const user = auth.currentUser;

  // Agar user yo'q bo‘lsa → login pagega qaytarish
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Agar user bor bo'lsa → sahifani ko‘rsatish
  return children;
};

export default ProtectedRoute;








