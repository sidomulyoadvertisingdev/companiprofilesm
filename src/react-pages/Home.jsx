import Hero from "../components/Hero";
import ServiceHighlight from "../components/ServiceHighlight";
import ServiceHighlightSecond from "../components/ServiceHighlightSecond";
import Portfolio from "../components/Portfolio";
import ClientsNetwork from "../components/ClientsNetwork";
import Catalog from "../components/Catalog";
import CTA from "../components/CTA";

export default function Home() {
  return (
    <main className="pt-20">
      <Hero />
      <ServiceHighlight />
      <ServiceHighlightSecond />
      <Portfolio />
      <ClientsNetwork />
      <Catalog />
      <CTA />
    </main>
  );
}
