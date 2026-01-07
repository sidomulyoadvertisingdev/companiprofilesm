import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api", // ⬅️ LOCAL BACKEND
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

/*
|--------------------------------------------------------------------------
| REQUEST INTERCEPTOR
|--------------------------------------------------------------------------
| - Attach Bearer token
| - Attach client type (penting untuk backend kamu)
| - Log request (debug)
*/
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // ⬅️ WAJIB sesuai backend (hindari bentrok token)
    config.headers["X-Client-Type"] = "absensi";

    console.log(
      "API REQUEST:",
      config.method?.toUpperCase(),
      config.baseURL + config.url
    );

    return config;
  },
  (error) => {
    console.error("REQUEST ERROR:", error);
    return Promise.reject(error);
  }
);

/*
|--------------------------------------------------------------------------
| RESPONSE INTERCEPTOR
|--------------------------------------------------------------------------
| - Log response
| - Log error detail (biar tidak silent)
*/
api.interceptors.response.use(
  (response) => {
    console.log("API RESPONSE:", response.data);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error("API ERROR STATUS:", error.response.status);
      console.error("API ERROR DATA:", error.response.data);
    } else {
      console.error("API NO RESPONSE:", error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
