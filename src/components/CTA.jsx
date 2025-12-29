import { FiArrowRight } from "react-icons/fi";

export default function CTA() {
  return (
    <section className="py-32 bg-[#f5f5f7] text-center">
      <h2 className="text-4xl font-semibold text-[#1d1d1f] mb-6">
        Siap Meningkatkan Branding Bisnis Anda?
      </h2>

      <p className="text-lg text-[#6e6e73] mb-10">
        Konsultasikan kebutuhan percetakan & neon box Anda bersama kami
      </p>

      <a
        href="https://wa.me/6288808888880"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2
                   rounded-full bg-[#1d1d1f] text-white
                   px-8 py-4 text-sm font-medium
                   hover:bg-black transition"
      >
        Hubungi via WhatsApp
        <FiArrowRight />
      </a>
    </section>
  );
}
