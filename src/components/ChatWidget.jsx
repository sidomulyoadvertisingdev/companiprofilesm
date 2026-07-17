import { useEffect, useRef, useState } from "react";
import { FiMessageSquare, FiX, FiSend, FiUser, FiCpu, FiSmartphone } from "react-icons/fi";

const WHATSAPP_URL = "https://wa.me/6288808888880";

const WELCOME = "Halo! Saya Hani dari Sidomulyo Advertising. Ada yang bisa saya bantu seputar produk, layanan, atau pemesanan?";

const HANDOFF_PHRASE = "[BUTUH_CS]";

const ORDER_KEYWORDS = ["order", "pesan", "pemesanan", "beli", "purchase", "checkout", "booking", "reservasi", "harga", "biaya", "quote", "penawaran", "estimasi"];

function isOrderQuestion(text) {
  const t = text.toLowerCase();
  return ORDER_KEYWORDS.some((k) => t.includes(k));
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: "assistant", content: WELCOME }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, open]);

  // Show handoff button when: AI flagged handoff, AI not configured, or user asks about ordering.
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  const lastReply = [...messages].reverse().find((m) => m.role === "assistant");
  const replyWantsHandoff = lastReply && lastReply.content.includes(HANDOFF_PHRASE);
  const orderAsked = lastUser && isOrderQuestion(lastUser.content);
  const showHandoff = replyWantsHandoff || orderAsked;

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    const next = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);

    const start = Date.now();
    let reply = "Maaf, saya tidak bisa menjawab saat ini.";
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const d = await res.json();
      reply = d.reply || reply;
    } catch {
      reply = "Maaf, terjadi gangguan. Silakan hubungi kami via WhatsApp.";
    }

    // Keep the "typing" indicator visible for a natural minimum delay
    // (so fast responses don't pop in instantly and feel robotic).
    const elapsed = Date.now() - start;
    const minTyping = 900;
    if (elapsed < minTyping) {
      await new Promise((r) => setTimeout(r, minTyping - elapsed));
    }

    // Reveal the reply progressively, character by character.
    const base = [...next, { role: "assistant", content: "" }];
    setMessages(base);
    setLoading(false);
    const clean = reply.replace("[BUTUH_CS]", "").trim();
    let shown = "";
    for (let i = 0; i < clean.length; i++) {
      shown += clean[i];
      setMessages([...base.slice(0, -1), { role: "assistant", content: shown }]);
      // Vary speed slightly for a more human feel; pause longer at sentence ends.
      const ch = clean[i];
      const delay = ch === " " ? 12 : ch === "." || ch === "?" || ch === "!" ? 90 : 18 + Math.random() * 22;
      await new Promise((r) => setTimeout(r, delay));
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Buka chat"
        className="fixed bottom-5 right-5 z-[60] h-14 w-14 rounded-full bg-orange-500 hover:bg-orange-600 text-white shadow-lg flex items-center justify-center transition-colors"
      >
        {open ? <FiX size={22} /> : <FiMessageSquare size={22} />}
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-24 right-5 z-[60] w-[calc(100vw-2.5rem)] max-w-sm h-[28rem] bg-white dark:bg-[#1a1a2e] rounded-3xl border border-[#e5e5e5] dark:border-slate-700 shadow-2xl flex flex-col overflow-hidden transition-colors">
          <div className="px-4 py-3 bg-orange-500 text-white flex items-center justify-between">
            <div>
              <p className="font-bold text-sm">Hani</p>
              <p className="text-[11px] text-orange-50">Customer Service · Sidomulyo Advertising</p>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Tutup chat" className="text-white/90 hover:text-white">
              <FiX size={18} />
            </button>
          </div>

          <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map((m, i) => {
              const clean = m.content.replace(HANDOFF_PHRASE, "").trim();
              return (
                <div key={i} className={`flex items-end gap-2 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 ${m.role === "user" ? "bg-slate-200 dark:bg-slate-700 text-[#6e6e73] dark:text-slate-300" : "bg-orange-100 dark:bg-orange-500/20 text-orange-500"}`}>
                    {m.role === "user" ? <FiUser size={14} /> : <FiCpu size={14} />}
                  </div>
                  <div className={`max-w-[78%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${m.role === "user" ? "bg-orange-500 text-white rounded-br-sm" : "bg-[#f5f5f7] dark:bg-slate-800 text-[#1d1d1f] dark:text-slate-200 rounded-bl-sm"}`}>
                    {clean}
                  </div>
                </div>
              );
            })}
            {loading && (
              <div className="flex items-end gap-2">
                <div className="h-7 w-7 rounded-full bg-orange-100 dark:bg-orange-500/20 text-orange-500 flex items-center justify-center"><FiCpu size={14} /></div>
                <div className="px-3 py-2 rounded-2xl bg-[#f5f5f7] dark:bg-slate-800 text-[#6e6e73] dark:text-slate-400 text-sm">Mengetik…</div>
              </div>
            )}
          </div>

          {showHandoff && (
            <div className="mx-3 mb-2 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
              <p className="text-xs text-[#1d1d1f] dark:text-slate-200 mb-2">
                {orderAsked && !replyWantsHandoff
                  ? "Untuk pemesanan, silakan hubungi CS kami langsung via WhatsApp agar bisa dikonsultasikan lebih lanjut:"
                  : "Maaf, pertanyaan ini sebaiknya langsung ditangani oleh tim kami. Silakan hubungi CS kami:"}
              </p>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 text-[12px] font-semibold text-white bg-emerald-500 hover:bg-emerald-600 px-3 py-2 rounded-full transition-colors"
              >
                <FiSmartphone size={14} /> Hubungi CS via WhatsApp
              </a>
            </div>
          )}

          <div className="px-3 py-2 border-t border-[#e5e5e5] dark:border-slate-700">
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
