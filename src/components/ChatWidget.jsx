import { useEffect, useRef, useState } from "react";
import { FiMessageSquare, FiX, FiSend, FiUser, FiCpu, FiSmartphone } from "react-icons/fi";

const WHATSAPP_URL = "https://wa.me/6288808888880";

const WELCOME = "Halo! 👋 Saya asisten virtual Sidomulyo Advertising. Ada yang bisa saya bantu seputar produk, layanan, atau pemesanan?";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: "assistant", content: WELCOME }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, open]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    const next = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const d = await res.json();
      setMessages([...next, { role: "assistant", content: d.reply || "Maaf, saya tidak bisa menjawab saat ini." }]);
    } catch {
      setMessages([...next, { role: "assistant", content: "Maaf, terjadi gangguan. Silakan hubungi kami via WhatsApp." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Buka chat customer service"
        className="fixed bottom-5 right-5 z-[60] h-14 w-14 rounded-full bg-orange-500 hover:bg-orange-600 text-white shadow-lg flex items-center justify-center transition-colors"
      >
        {open ? <FiX size={22} /> : <FiMessageSquare size={22} />}
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-24 right-5 z-[60] w-[calc(100vw-2.5rem)] max-w-sm h-[28rem] bg-white dark:bg-[#1a1a2e] rounded-3xl border border-[#e5e5e5] dark:border-slate-700 shadow-2xl flex flex-col overflow-hidden transition-colors">
          <div className="px-4 py-3 bg-orange-500 text-white flex items-center justify-between">
            <div>
              <p className="font-bold text-sm">Customer Service</p>
              <p className="text-[11px] text-orange-50">Sidomulyo Advertising · AI</p>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Tutup chat" className="text-white/90 hover:text-white">
              <FiX size={18} />
            </button>
          </div>

          <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex items-end gap-2 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 ${m.role === "user" ? "bg-slate-200 dark:bg-slate-700 text-[#6e6e73] dark:text-slate-300" : "bg-orange-100 dark:bg-orange-500/20 text-orange-500"}`}>
                  {m.role === "user" ? <FiUser size={14} /> : <FiCpu size={14} />}
                </div>
                <div className={`max-w-[78%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${m.role === "user" ? "bg-orange-500 text-white rounded-br-sm" : "bg-[#f5f5f7] dark:bg-slate-800 text-[#1d1d1f] dark:text-slate-200 rounded-bl-sm"}`}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-end gap-2">
                <div className="h-7 w-7 rounded-full bg-orange-100 dark:bg-orange-500/20 text-orange-500 flex items-center justify-center"><FiCpu size={14} /></div>
                <div className="px-3 py-2 rounded-2xl bg-[#f5f5f7] dark:bg-slate-800 text-[#6e6e73] dark:text-slate-400 text-sm">Mengetik…</div>
              </div>
            )}
          </div>

          <div className="px-3 py-2 border-t border-[#e5e5e5] dark:border-slate-700">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mb-2 hover:underline"
            >
              <FiSmartphone size={13} /> Butuh bantuan manusia? Chat via WhatsApp
            </a>
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Tulis pertanyaan…"
                className="flex-1 px-3 py-2 text-sm rounded-full bg-[#f5f5f7] dark:bg-slate-800 text-[#1d1d1f] dark:text-white outline-none border border-transparent focus:border-orange-400"
              />
              <button
                onClick={send}
                disabled={loading || !input.trim()}
                className="h-9 w-9 rounded-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center disabled:opacity-40 transition-colors shrink-0"
                aria-label="Kirim"
              >
                <FiSend size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
