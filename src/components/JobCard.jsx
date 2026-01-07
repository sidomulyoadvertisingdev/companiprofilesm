import { Link } from "react-router-dom";

export default function JobCard({ job }) {
  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-md transition">

      {/* THUMBNAIL */}
      {job.thumbnail ? (
        <img
          src={job.thumbnail}
          alt={job.title}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
          No Image
        </div>
      )}

      {/* CONTENT */}
      <div className="p-5">
        <h3 className="text-lg font-semibold mb-1">
          {job.title}
        </h3>

        <p className="text-sm text-gray-500 mb-4">
          {job.location} • {job.job_type}
        </p>

        <Link
          to={`/jobs/${job.id}`}
          className="inline-block text-sm font-medium text-black hover:underline"
        >
          Lihat Detail →
        </Link>
      </div>
    </div>
  );
}
