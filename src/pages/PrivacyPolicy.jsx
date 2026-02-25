import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function PrivacyPolicy() {
  return (
    <>
      <Navbar />

      <main className="pt-20 bg-white text-[#1d1d1f]">
        <section className="py-20 md:py-24 border-b border-[#e5e5e5]">
          <div className="max-w-4xl mx-auto px-6">
            <h1 className="text-4xl md:text-5xl font-semibold mb-4">
              Privacy Policy
            </h1>
            <p className="text-[#6e6e73]">
              Terakhir diperbarui: 25 Februari 2026
            </p>
          </div>
        </section>

        <section className="py-14 md:py-16">
          <div className="max-w-4xl mx-auto px-6 space-y-8 leading-relaxed text-[15px] md:text-base">
            <p>
              Sidomulyo Advertising menghargai privasi Anda. Kebijakan ini
              menjelaskan informasi yang kami kumpulkan, bagaimana kami
              menggunakannya, serta hak Anda terkait data pribadi.
            </p>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold">1. Informasi yang Kami Kumpulkan</h2>
              <p>Kami dapat mengumpulkan data berikut saat Anda menggunakan layanan:</p>
              <ul className="list-disc pl-6 space-y-1 text-[#3a3a3c]">
                <li>Data identitas dasar, seperti nama, nomor telepon, dan email.</li>
                <li>Data perangkat, termasuk izin akses kamera bila Anda memberikan izin.</li>
                <li>Foto absen atau dokumentasi kehadiran yang Anda unggah.</li>
                <li>Riwayat chat/percakapan untuk kebutuhan layanan pelanggan.</li>
                <li>Data teknis dasar seperti waktu akses, browser, dan alamat IP.</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold">2. Tujuan Penggunaan Data</h2>
              <p>Data digunakan untuk:</p>
              <ul className="list-disc pl-6 space-y-1 text-[#3a3a3c]">
                <li>proses absensi dan verifikasi kehadiran,</li>
                <li>komunikasi operasional melalui chat/WhatsApp/email,</li>
                <li>pemrosesan permintaan layanan dan tindak lanjut pelanggan,</li>
                <li>peningkatan keamanan serta kualitas layanan,</li>
                <li>kepatuhan terhadap kewajiban hukum yang berlaku.</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold">3. Penyimpanan Data</h2>
              <p>
                Data disimpan selama masih diperlukan untuk tujuan operasional,
                layanan pelanggan, audit internal, dan/atau kewajiban hukum.
                Setelah tidak diperlukan, data akan dihapus atau dianonimkan
                secara bertahap sesuai kebijakan internal.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold">4. Keamanan Data</h2>
              <p>
                Kami menerapkan langkah pengamanan teknis dan administratif untuk
                melindungi data dari akses tanpa izin, perubahan, kehilangan, atau
                penyalahgunaan. Akses data dibatasi hanya untuk pihak internal yang
                membutuhkan sesuai tugasnya.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold">5. Kontak</h2>
              <p>
                Jika Anda memiliki pertanyaan terkait kebijakan privasi ini,
                silakan hubungi:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-[#3a3a3c]">
                <li>Email: sosmedsidomulyo@gmail.com</li>
                <li>WhatsApp: 0888 0888 8880</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold">6. Perubahan Kebijakan</h2>
              <p>
                Kebijakan ini dapat diperbarui sewaktu-waktu. Perubahan terbaru
                akan ditampilkan pada halaman ini beserta tanggal pembaruan.
              </p>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
