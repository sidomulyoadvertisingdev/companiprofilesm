import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import ServiceHighlight from "../components/ServiceHighlight";
import ServiceHighlightSecond from "../components/ServiceHighlightSecond";
import Portfolio from "../components/Portfolio";
import ClientsNetwork from "../components/ClientsNetwork";
import Catalog from "../components/Catalog";
import CTA from "../components/CTA";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      {/* Navbar Apple-style (auto hide on scroll) */}
      <Navbar />

      {/* Main wrapper
          pt-20 wajib agar konten tidak ketutup navbar fixed */}
      <main className="pt-20">
        <Hero />

        {/* Highlight Layanan */}
        <ServiceHighlight />
        <ServiceHighlightSecond />

        {/* Portofolio */}
        <Portfolio />

        {/* Jaringan Perusahaan / Partner */}
        <ClientsNetwork />

        {/* Katalog Produk */}
        <Catalog />

        {/* Call To Action */}
        <CTA />

        {/* Footer */}
        <Footer />
      </main>
    </>
  );
}
