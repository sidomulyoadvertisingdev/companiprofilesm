export default function Footer() {
  return (
    <footer className="py-14 text-center text-sm text-[#6e6e73] bg-white border-t border-[#e5e5e5]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-10 mb-10 text-left">
          <div>
            <h4 className="font-semibold text-[#1d1d1f] mb-3">Sidomulyo Advertising & Printing</h4>
            <p className="leading-relaxed">
              Jl. Kartini No.108, Sidorejo<br />
              Kota Salatiga, Jawa Tengah 50711
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-[#1d1d1f] mb-3">Kontak</h4>
            <p className="leading-relaxed">
              WhatsApp: <a href="https://wa.me/6288808888880" className="hover:underline text-blue-600">0888 0888 8880</a><br />
              Email: <a href="mailto:sosmedsidomulyo@gmail.com" className="hover:underline text-blue-600">sosmedsidomulyo@gmail.com</a>
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-[#1d1d1f] mb-3">Jam Operasional</h4>
            <p className="leading-relaxed">
              Setiap Hari: 08.00–22.00
            </p>
          </div>
        </div>
        <p className="mb-2">&copy; {new Date().getFullYear()} Sidomulyo Advertising. All rights reserved.</p>
        <p>
          <a href="/privacy-policy" className="hover:underline">Privacy Policy</a>
        </p>
      </div>
    </footer>
  );
}
