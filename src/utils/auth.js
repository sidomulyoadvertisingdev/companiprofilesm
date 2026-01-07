export function isAuthenticated() {
  try {
    const token = localStorage.getItem("auth_token");
    return !!token;
  } catch (error) {
    console.error("Auth error:", error);
    return false;
  }
}
