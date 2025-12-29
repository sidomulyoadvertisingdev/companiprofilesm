import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import PortfolioPage from "./pages/PortfolioPage";
import CatalogPage from "./pages/CatalogPage";
import Contact from "./pages/Contact";

export default function App() {
  return (
    <div className="bg-white text-[#1d1d1f]">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Router>
    </div>
  );
}
