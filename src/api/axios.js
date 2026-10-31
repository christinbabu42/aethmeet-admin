import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// Access token exists only in JavaScript memory.
// It is not saved in localStorage or sessionStorage.
let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token || null;
};

export const clearAccessToken = () => {
  accessToken = null;
};

export const getAccessToken = () => accessToken;

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  withCredentials: true,
});

// Separate client prevents refresh requests triggering interceptors.
const refreshClient = axios.create({
  baseURL: `${API_BASE}/api`,
  withCredentials: true,
});

// Share one refresh request when several API requests expire together.
let refreshPromise = null;

// Attach the in-memory access token.
api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

if (!originalRequest) {
  return Promise.reject(error);
}

// A 403 from an ordinary protected API can mean the account
// is suspended or banned. Do not try refreshing in that case.
if (
  error.response?.status === 403 &&
  error.response?.data?.forceLogout === true
) {
  clearAccessToken();

  window.dispatchEvent(
    new Event("admin-auth-expired")
  );

  return Promise.reject(error);
}

if (error.response?.status !== 401) {
  return Promise.reject(error);
}

    // Never refresh the refresh endpoint itself.
    if (originalRequest.url?.includes("/auth/refresh")) {
      return Promise.reject(error);
    }

    // Prevent infinite retry loops.
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = refreshClient
          .post("/auth/refresh", {})
          .then((response) => {
            const newAccessToken =
              response.data?.accessToken;

            if (!newAccessToken) {
              throw new Error("Access token missing in refresh response");
            }

            setAccessToken(newAccessToken);

            return newAccessToken;
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      const newAccessToken = await refreshPromise;

      originalRequest.headers =
        originalRequest.headers || {};

      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      return api(originalRequest);

    } catch (refreshError) {
      const status = refreshError.response?.status;

      // Only a definitive invalid/expired session should log the admin out.
      // A network error or server error (500, 503, etc.) should not.
      if (status === 401 || status === 403) {
        clearAccessToken();

        window.dispatchEvent(
          new Event("admin-auth-expired")
        );
      }

      return Promise.reject(refreshError);
    }
  }
);

export default api;