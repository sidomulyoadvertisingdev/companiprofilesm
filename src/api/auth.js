import api from "./axios";

/**
 * ===============================
 * AUTH API
 * ===============================
 */

/**
 * REGISTER
 * POST /api/register
 */
export const register = (data) => {
  return api.post("/register", data);
};

/**
 * LOGIN
 * POST /api/login
 */
export const login = (email, password) => {
  return api.post("/login", {
    email,
    password,
  });
};

/**
 * LOGOUT
 * POST /api/logout
 */
export const logout = () => {
  return api.post("/logout");
};
