import { useEffect, useState } from "react";
import { getJobDetail } from "../api/jobs";

const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

export default function JobDetail({ id }) {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getJobDetail(id)
      .then((res) => setJob(res.data.data))
      .finally(() => setLoading(false));
  }, [id]);

  const handleApply = () => {
    if (!isAuthenticated()) {
      window.location.href = `/login?redirect=/jobs/${id}/apply`;
      return;
    }
    window.location.href = `/jobs/${id}/apply`;
  };

  return (
    <section className="pt-32 pb-20 bg-white">
      <div className="max-w-4xl mx-auto px-6">

        {loading && (
          <p className="text-[#6e6e73]">
            Memuat detail lowongan...
          </p>
        )}

        {!loading && job && (
          <>
            <h1 className="text-3xl md:text-4xl font-semibold mb-6">
              {job.title}
            </h1>

            {job.thumbnail && (
              <img
                src={job.thumbnail}
                alt={job.title}
                className="w-full h-64 object-cover rounded-lg mb-8"
              />
            )}

            <div
              className="prose prose-lg max-w-none text-gray-700 mb-8"
              dangerouslySetInnerHTML={{
                __html: job.description,
              }}
            />

            <div className="flex flex-wrap gap-6 text-sm text-gray-600 mb-10">
              {job.location && <span>📍 {job.location}</span>}
              {job.job_type && <span>🕒 {job.job_type}</span>}
            </div>

            <button
              onClick={handleApply}
              className="inline-flex items-center gap-2
                         bg-black text-white px-8 py-3
                         rounded-full hover:bg-gray-800 transition"
            >
              Apply Sekarang
            </button>
          </>
        )}

        {!loading && !job && (
          <p className="text-center text-[#6e6e73]">
            Lowongan tidak ditemukan
          </p>
        )}

      </div>
    </section>
  );
}
