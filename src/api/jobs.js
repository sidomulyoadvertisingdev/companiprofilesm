import api from "./axios";

/**
 * ===============================
 * JOB PUBLIC
 * ===============================
 */
export const getJobs = () => api.get("/jobs");

export const getJobDetail = (id) => api.get(`/jobs/${id}`);

/**
 * ===============================
 * APPLY JOB (PROTECTED)
 * ===============================
 */
export const applyJob = (jobId, data) =>
  api.post(`/jobs/${jobId}/apply`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
