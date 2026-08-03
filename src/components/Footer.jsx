import { useEffect, useState } from "react";
import { getSite } from "../lib/content.js";
import { useLanguage } from "../lib/i18n.js";

export default function Footer() {
  const [site, setSite] = useState(null);
  const { dict } = useLanguage();

  useEffect(() => {
    getSite().then(setSite);
  }, []);

  if (!site) return null;

  const { address, phoneDisplay, email, operationalHours, social, footerLinks } = site;
  const wa = `https://wa.me/${site.phone}`;
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-50 dark:bg-[#09090b] text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800/80 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-4 gap-12 text-left">
        <div>
          <div className="flex flex-col items-start mb-4">
            <img src={site.logo} alt={site.name} className="h-8 md:h-9 w-auto mb-1.5" />
            <p className="text-xs font-semibold tracking-widest uppercase text-blue-600 dark:text-blue-500">
              {dict.footer.tagline}
            </p>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {address.street}, {address.city}
            <br />
            {address.region} {address.postalCode}
          </p>
        </div>

        <div>
          <h4 className="text-xs font-bold tracking-widest uppercase text-slate-900 dark:text-white mb-4">{dict.footer.advisory}</h4>
          <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed space-y-2">
            <div>
              Direct:{" "}
              <a href={wa} className="hover:text-blue-600 dark:hover:text-blue-400 transition font-medium" data-track="cta-whatsapp-footer">
                {phoneDisplay}
              </a>
            </div>
            <div>
              Email:{" "}
              <a href={`mailto:${email}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition font-medium">
                {email}
              </a>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold tracking-widest uppercase text-slate-900 dark:text-white mb-4">{dict.footer.hours}</h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
            {operationalHours}
          </p>
          <h4 className="text-xs font-bold tracking-widest uppercase text-slate-900 dark:text-white mb-3">{dict.footer.connect}</h4>
          <div className="flex flex-wrap gap-3">
            {social.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition font-medium"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold tracking-widest uppercase text-slate-900 dark:text-white mb-4">{dict.footer.navigation}</h4>
          <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2.5">
            {footerLinks.map((link) => (
              <li key={link.path}>
                <a href={link.path} className="hover:text-slate-900 dark:hover:text-white transition font-medium">{link.name}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-200 dark:border-white/[0.06] py-8 text-center text-xs text-slate-500 dark:text-slate-500">
        &copy; {year} {site.name}. All rights reserved.{" "}
        <a href="/privacy-policy" className="hover:underline text-slate-600 dark:text-slate-400 ml-2">
          {dict.footer.privacy}
        </a>
      </div>
    </footer>
  );
}

