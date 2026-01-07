import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

/* ===== PAGES LAMA (JANGAN DIUBAH) ===== */
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import PortfolioPage from "./pages/PortfolioPage";
import CatalogPage from "./pages/CatalogPage";
import Contact from "./pages/Contact";

/* ===== PAGES JOB (FITUR KARIR) ===== */
import Jobs from "./pages/Jobs";
import JobDetail from "./pages/JobDetail";
import ApplyJob from "./pages/ApplyJob";

/* ===== PROFILE ===== */
import Profile from "./pages/Profile";

/* ===== AUTH ===== */
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./routes/ProtectedRoute";

export default function App() {
  return (
    <div className="bg-white text-[#1d1d1f]">
      <Router>
        <Routes>

          {/* ===============================
              ROUTE PUBLIC (LAMA)
          =============================== */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/contact" element={<Contact />} />

          {/* ===============================
              ROUTE KARIR (PUBLIC)
              Navbar dipanggil di page
          =============================== */}
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetail />} />

          {/* ===============================
              APPLY JOB (WAJIB LOGIN)
          =============================== */}
          <Route
            path="/jobs/:id/apply"
            element={
              <ProtectedRoute>
                <ApplyJob />
              </ProtectedRoute>
            }
          />

          {/* ===============================
              PROFILE USER (WAJIB LOGIN)
          =============================== */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* ===============================
              AUTH
          =============================== */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

        </Routes>
      </Router>
    </div>
  );
}
