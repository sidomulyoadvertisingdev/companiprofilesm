import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const location = useLocation();

  // ambil token
  const token = localStorage.getItem("token");

  // kalau token BELUM ADA → redirect ke login
  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  // kalau token ADA → lanjut
  return children;
}
