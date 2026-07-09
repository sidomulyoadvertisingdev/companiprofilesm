import { useEffect, useState } from "react";
import { getJobs } from "../api/jobs";
import JobCard from "../components/JobCard";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getJobs()
      .then((res) => {
        setJobs(res.data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="pt-32 pb-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">

        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Karir di Sidomulyo
          </h1>
          <p className="mt-3 text-[#6e6e73] max-w-2xl">
            Bergabunglah bersama tim kami dan berkembang bersama Sidomulyo Advertising.
          </p>
        </div>

        {loading && (
          <p className="text-[#6e6e73]">
            Memuat lowongan pekerjaan...
          </p>
        )}

        {!loading && jobs.length === 0 && (
          <p className="text-center py-20 text-[#6e6e73]">
            Belum ada lowongan tersedia
          </p>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>

      </div>
    </section>
  );
}
