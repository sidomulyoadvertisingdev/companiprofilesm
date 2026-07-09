import { useState } from "react";
import { applyJob } from "../api/jobs";

export default function ApplyJob({ id }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    cv: null,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({
      ...form,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("phone", form.phone);
      formData.append("email", form.email);
      formData.append("cv", form.cv);

      await applyJob(id, formData);

      alert("Lamaran berhasil dikirim");
      window.location.href = "/jobs";
    } catch (err) {
      if (err.response?.status === 401) {
        alert("Session habis, silakan login ulang");
        window.location.href = `/login?redirect=/jobs/${id}/apply`;
      } else {
        alert("Gagal mengirim lamaran");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="pt-32 pb-20 bg-white">
      <div className="max-w-xl mx-auto px-6">

        <h1 className="text-xl md:text-2xl font-semibold mb-6">
          Form Lamaran Pekerjaan
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block mb-1 font-medium">Nama Lengkap</label>
            <input
              type="text"
              name="name"
              required
              className="w-full border p-2 rounded"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Nomor Handphone</label>
            <input
              type="text"
              name="phone"
              required
              className="w-full border p-2 rounded"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Email Aktif</label>
            <input
              type="email"
              name="email"
              required
              className="w-full border p-2 rounded"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Upload CV (PDF)</label>
            <input
              type="file"
              name="cv"
              accept=".pdf"
              required
              className="w-full"
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white px-4 py-2 rounded
                       hover:bg-gray-800 transition"
          >
            {loading ? "Mengirim..." : "Kirim Lamaran"}
          </button>

        </form>
      </div>
    </section>
  );
}
