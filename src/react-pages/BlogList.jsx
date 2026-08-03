import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiClock, FiUser, FiTag } from "react-icons/fi";
import { getPublishedPosts } from "../lib/content.js";

function formatDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

export default function BlogList({ initialData }) {
  const [posts, setPosts] = useState(initialData || []);
  const [loading, setLoading] = useState(!initialData);

  useEffect(() => {
    if (!initialData) {
      getPublishedPosts().then(setPosts).catch(() => setPosts([])).finally(() => setLoading(false));
    }
  }, [initialData]);

  return (
    <main className="pt-20 bg-white dark:bg-[#09090b] min-h-screen text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <section className="py-10 md:py-14 bg-slate-50 dark:bg-[#09090b] border-b border-slate-200 dark:border-slate-800/80">

        <div className="max-w-7xl mx-auto px-6">
          <span className="text-xs font-bold tracking-widest uppercase text-blue-600 dark:text-blue-500 mb-3 block">
            Insights & Thought Leadership
          </span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6"
          >
            Insights & Perspective
          </motion.h1>
          <p className="text-base md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
            Wawasan strategis, panduan branding korporasi, serta analisa tren periklanan dari para pakar Sidomulyo Advertising.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20">
        {loading && <p className="text-sm text-slate-500 dark:text-slate-400">Memuat artikel…</p>}

        {!loading && posts.length === 0 && (
          <div className="text-center py-20 text-slate-500 dark:text-slate-400 rounded-3xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.08]">
            Belum ada artikel yang dipublikasikan.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((p, i) => (
            <motion.a
              key={p.id}
              href={`/blog/${p.slug}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="group bg-slate-50 dark:bg-white/[0.02] rounded-3xl overflow-hidden border border-slate-200 dark:border-white/[0.08] hover:border-blue-500/40 hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <div className="aspect-[16/9] bg-slate-200 dark:bg-white/5 overflow-hidden">
                {p.featuredImage ? (
                  <img
                    src={p.featuredImage}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-600 text-3xl font-extrabold tracking-widest">
                    SIDOMULYO
                  </div>
                )}
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {(p.tags || []).slice(0, 3).map((t) => (
                    <span key={t} className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2.5 py-1 rounded-full">
                      <FiTag /> {t}
                    </span>
                  ))}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
                  {p.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-6 flex-1 leading-relaxed">
                  {p.excerpt || ""}
                </p>
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-auto pt-4 border-t border-slate-200/60 dark:border-white/[0.06]">
                  <span className="inline-flex items-center gap-1 font-medium"><FiUser /> {p.author || "Editorial Team"}</span>
                  <span className="inline-flex items-center gap-1"><FiClock /> {formatDate(p.createdAt)}</span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </section>
    </main>
  );
}

