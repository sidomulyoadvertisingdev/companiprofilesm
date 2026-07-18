import api from "./axios";

/**
 * GET /api/profile
 */
export const getProfile = () => api.get("/profile");

/**
 * PUT /api/profile
 */
export const updateProfile = (data) => api.put("/profile", data);
