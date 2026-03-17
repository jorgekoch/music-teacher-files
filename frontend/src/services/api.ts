import axios from "axios";

const DASHBOARD_CACHE_KEY = "Arquivapp:dashboardInitCache";

let isRedirectingToLogin = false;

function clearSessionAndRedirect() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  sessionStorage.removeItem(DASHBOARD_CACHE_KEY);

  if (!isRedirectingToLogin && window.location.pathname !== "/login") {
    isRedirectingToLogin = true;
    window.location.href = "/login";
  }
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      clearSessionAndRedirect();
    }

    return Promise.reject(error);
  }
);