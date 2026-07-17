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
    <main className="pt-20 bg-[#f5f5f7] dark:bg-[#0a0a1a] min-h-screen transition-colors">
      <section className="max-w-6xl mx-auto px-6 py-12">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold mb-3 text-[#1d1d1f] dark:text-white"
        >
          Blog
        </motion.h1>
        <p className="text-[#6e6e73] dark:text-slate-400 mb-10 max-w-2xl">
          Artikel, tips, dan informasi terbaru seputar advertising, branding, dan solusi pemasaran dari Sido Mulyo.
        </p>

        {loading && <p className="text-sm text-[#6e6e73] dark:text-slate-400">Memuat artikel…</p>}

        {!loading && posts.length === 0 && (
          <div className="text-center py-20 text-[#6e6e73] dark:text-slate-400">
            Belum ada artikel yang dipublikasikan.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((p, i) => (
            <motion.a
              key={p.id}
              href={`/blog/${p.slug}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="group bg-white dark:bg-[#1a1a2e] rounded-3xl overflow-hidden border border-[#e5e5e5] dark:border-slate-700 hover:shadow-lg transition-shadow flex flex-col"
            >
              <div className="aspect-[16/9] bg-[#e5e5e5] dark:bg-slate-800 overflow-hidden">
                {p.featuredImage ? (
                  <img
                    src={p.featuredImage}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#6e6e73] dark:text-slate-500 text-3xl font-bold">
                    SM
                  </div>
                )}
              </div>
              <div className="p-5 flex flex-col flex-1">
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {(p.tags || []).slice(0, 3).map((t) => (
                    <span key={t} className="inline-flex items-center gap-1 text-[10px] font-semibold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 px-2 py-0.5 rounded-full">
                      <FiTag /> {t}
                    </span>
                  ))}
                </div>
                <h3 className="font-bold text-[#1d1d1f] dark:text-white mb-2 group-hover:text-orange-500 transition-colors line-clamp-2">
                  {p.title}
                </h3>
                <p className="text-sm text-[#6e6e73] dark:text-slate-400 line-clamp-3 mb-4 flex-1">
                  {p.excerpt || ""}
                </p>
                <div className="flex items-center justify-between text-[11px] text-[#6e6e73] dark:text-slate-500 mt-auto">
                  <span className="inline-flex items-center gap-1"><FiUser /> {p.author || "Admin"}</span>
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
