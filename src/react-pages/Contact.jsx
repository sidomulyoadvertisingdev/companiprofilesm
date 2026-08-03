import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FiPhone, FiMail, FiMapPin, FiSend, FiBriefcase, FiUser, FiMessageSquare } from "react-icons/fi";
import { getSite } from "../lib/content.js";
import { useLanguage } from "../lib/i18n.js";

export default function Contact({ initialData }) {
  const [site, setSite] = useState(initialData || null);
  const [form, setForm] = useState({ name: "", company: "", email: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [error, setError] = useState("");
  const { dict } = useLanguage();
  const cDict = dict.contactPage;

  useEffect(() => {
    if (!initialData) getSite().then(setSite);
  }, [initialData]);

  if (!site) return <main className="pt-24 min-h-screen bg-[#09090b]" />;

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim()) {
      setError("Nama dan pesan wajib diisi");
      return;
    }
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(d.message || "Gagal mengirim pesan");
      setStatus("sent");
      setForm({ name: "", company: "", email: "", message: "" });
    } catch (err) {
      setStatus("error");
      setError(err.message);
    }
  };

  const { address, phoneDisplay, email, phone, mapsEmbed, mapsUrl } = site;
  const wa = `https://wa.me/${phone}`;

  return (
    <main className="pt-20 bg-white dark:bg-[#09090b] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* HERO HEADER */}
      <section className="py-10 md:py-14 bg-slate-50 dark:bg-[#09090b] relative overflow-hidden border-b border-slate-200 dark:border-slate-800/80 transition-colors duration-300">

        <div className="absolute top-0 right-1/3 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <span className="text-xs font-bold tracking-widest uppercase text-blue-600 dark:text-blue-500 mb-4 block">
            {cDict.badge}
          </span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl md:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mb-6"
          >
            {cDict.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed"
          >
            {cDict.sub}
          </motion.p>
        </div>
      </section>

      {/* CONTACT INFO CARDS */}
      <section className="py-24 bg-white dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="rounded-3xl p-8 bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.08] hover:border-blue-500/40 transition-all duration-300 shadow-sm"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xl mb-6">
              <FiPhone />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{cDict.direct}</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">{phoneDisplay}</p>
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              data-track="cta-whatsapp-contact"
              className="text-xs font-bold tracking-wider uppercase text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-2"
            >
              <span>{cDict.chatLine}</span>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="rounded-3xl p-8 bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.08] hover:border-blue-500/40 transition-all duration-300 shadow-sm"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xl mb-6">
              <FiMail />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{cDict.officialEmail}</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">{email}</p>
            <a
              href={`mailto:${email}`}
              className="text-xs font-bold tracking-wider uppercase text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-2"
            >
              <span>{cDict.sendRfp}</span>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="rounded-3xl p-8 bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.08] hover:border-blue-500/40 transition-all duration-300 shadow-sm"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xl mb-6">
              <FiMapPin />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{cDict.hq}</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              {site.name}<br />
              {address.street}<br />
              Kota {address.city}, {address.region} {address.postalCode}
            </p>
          </motion.div>
        </div>
      </section>

      {/* FORM & MAP */}
      <section className="py-28 md:py-36 bg-slate-50 dark:bg-[#09090b] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-16">
          {/* Inquiry Form */}
          <div className="lg:col-span-7">
            <span className="text-xs font-bold tracking-widest uppercase text-blue-600 dark:text-blue-500 mb-3 block">
              {cDict.inquiryBadge}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-8">
              {cDict.inquiryTitle}
            </h2>

            <form className="space-y-6" onSubmit={submit}>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <FiUser className="text-blue-600 dark:text-blue-400" /> {cDict.fullName}
                  </label>
                  <input
                    type="text"
                    placeholder="Nama Anda"
                    value={form.name}
                    onChange={update("name")}
                    className="w-full px-5 py-4 rounded-xl border border-slate-300 dark:border-white/[0.08] bg-white dark:bg-white/[0.03] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-colors shadow-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <FiBriefcase className="text-blue-600 dark:text-blue-400" /> {cDict.companyName}
                  </label>
                  <input
                    type="text"
                    placeholder="PT / Instansi Anda"
                    value={form.company}
                    onChange={update("company")}
                    className="w-full px-5 py-4 rounded-xl border border-slate-300 dark:border-white/[0.08] bg-white dark:bg-white/[0.03] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-colors shadow-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <FiMail className="text-blue-600 dark:text-blue-400" /> {cDict.emailAddress}
                </label>
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={form.email}
                  onChange={update("email")}
                  className="w-full px-5 py-4 rounded-xl border border-slate-300 dark:border-white/[0.08] bg-white dark:bg-white/[0.03] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-colors shadow-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <FiMessageSquare className="text-blue-600 dark:text-blue-400" /> {cDict.messageDetail}
                </label>
                <textarea
                  placeholder="Detail..."
                  rows="5"
                  value={form.message}
                  onChange={update("message")}
                  className="w-full px-5 py-4 rounded-xl border border-slate-300 dark:border-white/[0.08] bg-white dark:bg-white/[0.03] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-colors shadow-xs"
                />
              </div>

              <div className="flex items-center gap-4">
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="inline-flex items-center gap-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 text-xs font-bold tracking-wider uppercase shadow-xl transition disabled:opacity-50"
                >
                  <span>{status === "sending" ? cDict.sending : cDict.submit}</span>
                  <FiSend />
                </button>
                {status === "sent" && (
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">{cDict.sent}</span>
                )}
                {status === "error" && (
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">{error}</span>
                )}
              </div>
            </form>
          </div>

          {/* Location Map */}
          <div className="lg:col-span-5 flex flex-col">
            <span className="text-xs font-bold tracking-widest uppercase text-blue-600 dark:text-blue-500 mb-3 block">
              {cDict.mapBadge}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-8">
              {cDict.mapTitle}
            </h2>

            <div className="rounded-3xl overflow-hidden border border-slate-200 dark:border-white/[0.08] h-[380px] w-full mb-4 shadow-sm">
              <iframe
                title="Lokasi Sidomulyo Advertising"
                src={mapsEmbed}
                className="w-full h-full border-0 filter grayscale contrast-125 opacity-80 hover:opacity-100 transition-opacity"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold tracking-wider uppercase text-blue-600 dark:text-blue-400 hover:underline"
            >
              {cDict.openMaps}
            </a>
          </div>
        </div>
      </section>
    </main>
  );

}


