import { useEffect, useState } from "react";
import { getSite } from "../lib/content.js";

export default function Footer() {
  const [site, setSite] = useState(null);
  useEffect(() => {
    getSite().then(setSite);
  }, []);

  if (!site) return null;

  const { address, phoneDisplay, email, operationalHours, social, footerLinks, copyrightText } = site;
  const wa = `https://wa.me/${site.phone}`;
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-[#0a0a1a] border-t border-[#e5e5e5] dark:border-slate-700/50 transition-colors">
      <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-10 text-left">
        <div>
          <img src={site.logo} alt={site.name} className="h-10 w-auto mb-4" />
          <h4 className="font-semibold text-[#1d1d1f] dark:text-white mb-3">{site.name}</h4>
          <p className="text-sm text-[#6e6e73] dark:text-slate-400 leading-relaxed">
            {address.street}, {address.city}
            <br />
            {address.region} {address.postalCode}
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-[#1d1d1f] dark:text-white mb-3">Kontak</h4>
          <p className="text-sm text-[#6e6e73] dark:text-slate-400 leading-relaxed">
            WhatsApp:{" "}
            <a href={wa} className="hover:underline text-blue-800" data-track="cta-whatsapp-footer">
              {phoneDisplay}
            </a>
            <br />
            Email:{" "}
            <a href={`mailto:${email}`} className="hover:underline text-blue-800">
              {email}
            </a>
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-[#1d1d1f] dark:text-white mb-3">Jam Operasional</h4>
          <p className="text-sm text-[#6e6e73] dark:text-slate-400 leading-relaxed">
            {operationalHours}
          </p>
          <h4 className="font-semibold text-[#1d1d1f] dark:text-white mt-5 mb-3">Sosial Media</h4>
          <div className="flex flex-wrap gap-3">
            {social.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#6e6e73] dark:text-slate-400 hover:text-blue-800 dark:hover:text-blue-400 transition"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-[#1d1d1f] dark:text-white mb-3">Navigasi</h4>
          <ul className="text-sm text-[#6e6e73] dark:text-slate-400 space-y-2">
            {footerLinks.map((link) => (
              <li key={link.path}>
                <a href={link.path} className="hover:text-blue-800 dark:hover:text-blue-400 transition">{link.name}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-[#e5e5e5] dark:border-slate-700/50 py-6 text-center text-sm text-[#6e6e73] dark:text-slate-400">
        &copy; {year} {site.name}. {copyrightText}{" "}
        <a href="/privacy-policy" className="hover:underline">
          Privacy Policy
        </a>
      </div>
    </footer>
  );
}
