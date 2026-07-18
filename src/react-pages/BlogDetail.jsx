import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiClock, FiUser, FiTag, FiArrowLeft } from "react-icons/fi";
import { getPostBySlug } from "../lib/content.js";

function formatDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

export default function BlogDetail({ initialData, allPosts = [] }) {
  const [post, setPost] = useState(initialData || null);
  const [loading, setLoading] = useState(!initialData);

  useEffect(() => {
    if (!initialData) {
      const slug = typeof window !== "undefined" ? window.location.pathname.split("/").pop() : "";
      getPostBySlug(slug).then(setPost).catch(() => setPost(null)).finally(() => setLoading(false));
    }
  }, [initialData]);

  if (loading) {
    return (
      <main className="pt-20 bg-[#f5f5f7] dark:bg-[#0a0a1a] min-h-screen">
        <div className="max-w-3xl mx-auto px-6 py-12 text-sm text-[#6e6e73] dark:text-slate-400">Memuat artikel…</div>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="pt-20 bg-[#f5f5f7] dark:bg-[#0a0a1a] min-h-screen">
        <div className="max-w-3xl mx-auto px-6 py-20 text-center">
          <h1 className="text-2xl font-bold text-[#1d1d1f] dark:text-white mb-3">Artikel tidak ditemukan</h1>
          <a href="/blog" className="text-orange-500 hover:underline inline-flex items-center gap-1">
            <FiArrowLeft /> Kembali ke Blog
          </a>
        </div>
      </main>
    );
  }

  const otherPosts = allPosts.filter((p) => p.slug !== post.slug).slice(0, 8);

  return (
    <main className="pt-20 bg-[#f5f5f7] dark:bg-[#0a0a1a] min-h-screen transition-colors">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-10">
          <aside className="lg:w-72 lg:shrink-0 order-2 lg:order-1">
            <div className="lg:sticky lg:top-24">
              <h3 className="text-sm font-bold text-[#1d1d1f] dark:text-white mb-4">Artikel Lainnya</h3>
              <ul className="space-y-3">
                {otherPosts.map((p) => (
                  <li key={p.id}>
                    <a
                      href={`/blog/${p.slug}`}
                      className="group flex gap-3 items-start p-3 rounded-2xl border border-[#e5e5e5] dark:border-slate-700 hover:bg-white dark:hover:bg-[#1a1a2e] transition-colors"
                    >
                      {p.featuredImage ? (
                        <img
                          src={p.featuredImage}
                          alt={p.title}
                          className="w-16 h-16 object-cover rounded-xl shrink-0"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-xl shrink-0 bg-orange-100 dark:bg-orange-500/10 flex items-center justify-center text-orange-500">
                          <FiTag size={18} />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-[13px] font-medium leading-snug text-[#1d1d1f] dark:text-slate-200 group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors line-clamp-2">
                          {p.title}
                        </p>
                        <span className="text-[11px] text-[#6e6e73] dark:text-slate-400">{formatDate(p.createdAt)}</span>
                      </div>
                    </a>
                  </li>
                ))}
                {otherPosts.length === 0 && (
                  <li className="text-xs text-[#6e6e73] dark:text-slate-400">Belum ada artikel lain.</li>
                )}
              </ul>
            </div>
          </aside>

          <article className="flex-1 min-w-0 order-1 lg:order-2">
            <a href="/blog" className="inline-flex items-center gap-1 text-sm text-[#6e6e73] dark:text-slate-400 hover:text-orange-500 transition-colors mb-6">
              <FiArrowLeft /> Kembali ke Blog
            </a>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold text-[#1d1d1f] dark:text-white mb-4"
            >
              {post.title}
            </motion.h1>

            <div className="flex flex-wrap items-center gap-4 text-[12px] text-[#6e6e73] dark:text-slate-400 mb-6">
              <span className="inline-flex items-center gap-1"><FiUser /> {post.author || "Admin"}</span>
              <span className="inline-flex items-center gap-1"><FiClock /> {formatDate(post.createdAt)}</span>
            </div>

            {post.featuredImage && (
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full aspect-[16/9] object-cover rounded-3xl mb-8"
              />
            )}

            <div className="flex flex-wrap gap-1.5 mb-8">
              {(post.tags || []).map((t) => (
                <span key={t} className="inline-flex items-center gap-1 text-[10px] font-semibold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 px-2 py-0.5 rounded-full">
                  <FiTag /> {t}
                </span>
              ))}
            </div>

            <div
              className="prose prose-slate dark:prose-invert max-w-none blog-content text-[#1d1d1f] dark:text-slate-200 leading-relaxed [&_img]:rounded-xl [&_img]:my-4 [&_a]:text-orange-500 [&_h2]:font-bold [&_h2]:text-2xl [&_h2]:mt-8 [&_h3]:font-bold [&_h3]:text-xl [&_h3]:mt-6"
              dangerouslySetInnerHTML={{ __html: post.content || "" }}
            />

            {post.excerpt && (
              <p className="mt-10 text-sm text-[#6e6e73] dark:text-slate-400 border-t border-[#e5e5e5] dark:border-slate-700 pt-6">
                {post.excerpt}
              </p>
            )}
          </article>
        </div>
      </div>
    </main>
  );
}
