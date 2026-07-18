import { useEffect, useState } from "react";
import {
  getProfile,
  updateProfile,
} from "../api/profile";

export default function Profile() {
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    phone: "",
  });

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      window.location.href = "/login?redirect=/profile";
      return;
    }

    getProfile()
      .then((profileRes) => {
        setForm({
          name: profileRes.data.data.name,
          phone: profileRes.data.data.phone || "",
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateProfile(form);
    alert("Profile berhasil diperbarui");
  };

  if (loading) return <p className="pt-32 text-center">Loading...</p>;

  return (
    <section className="pt-32 pb-20 bg-white">
      <div className="max-w-4xl mx-auto px-6 space-y-12">

        <div>
          <h1 className="text-2xl font-semibold mb-4">Profile Saya</h1>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
            <div>
              <label className="block mb-1">Nama</label>
              <input
                type="text"
                className="w-full border p-2 rounded"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block mb-1">Nomor HP</label>
              <input
                type="text"
                className="w-full border p-2 rounded"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <button className="bg-black text-white px-4 py-2 rounded">
              Simpan Profile
            </button>
          </form>
        </div>

      </div>
    </section>
  );
}
