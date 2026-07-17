import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiClock, FiUser, FiTag, FiArrowLeft } from "react-icons/fi";
import { getPostBySlug } from "../lib/content.js";

function formatDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

export default function BlogDetail({ initialData }) {
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

  return (
    <main className="pt-20 bg-[#f5f5f7] dark:bg-[#0a0a1a] min-h-screen transition-colors">
      <article className="max-w-3xl mx-auto px-6 py-12">
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
    </main>
  );
}
