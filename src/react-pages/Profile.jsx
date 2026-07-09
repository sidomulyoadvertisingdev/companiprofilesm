import { useEffect, useState } from "react";
import {
  getProfile,
  updateProfile,
  getMyApplications,
} from "../api/profile";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [applications, setApplications] = useState([]);
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

    Promise.all([getProfile(), getMyApplications()])
      .then(([profileRes, appRes]) => {
        setUser(profileRes.data.data);
        setApplications(appRes.data.data);
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

        <div>
          <h2 className="text-xl font-semibold mb-4">Riwayat Lamaran</h2>
          {applications.length === 0 && (
            <p className="text-gray-500">Belum ada lamaran.</p>
          )}
          <ul className="space-y-4">
            {applications.map((item) => (
              <li
                key={item.id}
                className="border p-4 rounded flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{item.job?.title}</p>
                  <p className="text-sm text-gray-500">Status: {item.status}</p>
                </div>
                <span className="text-sm text-gray-400">
                  {new Date(item.created_at).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </section>
  );
}
