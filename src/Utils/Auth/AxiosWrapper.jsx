import axios from "axios";

let isRefreshing = false;
let refreshSubscribers = [];

// Function to add subscribers
const subscribeTokenRefresh = (cb) => {
  refreshSubscribers.push(cb);
};

// Function to notify subscribers
const onRefreshed = (newAccessToken) => {
  refreshSubscribers.forEach((cb) => cb(newAccessToken));
  refreshSubscribers = [];
};

export const AxiosWrapper = async (method, route, data = {}) => {
  const userData = JSON.parse(localStorage.getItem("userData"));
  if (!userData?.access) {
    throw new Error("No access token found");
  }

  const url = `${import.meta.env.VITE_BACKEND_API}/api/${route}`;

  const config = {
    method: method.toLowerCase(),
    url: url,
    headers: {
      Authorization: `Bearer ${userData.access}`,
    },
  };

  if (method.toLowerCase() === "get" || method.toLowerCase() === "delete") {
    config.params = data; // Use params for GET and DELETE requests
  } else {
    config.data = data; // Use data for POST, PUT, PATCH requests
  }

  try {
    const res = await axios(config);
    return res.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const newAccessToken = await refreshAccessToken(userData.refresh);
          if (newAccessToken) {
            userData.access = newAccessToken;
            localStorage.setItem("userData", JSON.stringify(userData));
            config.headers.Authorization = `Bearer ${userData.access}`;
            isRefreshing = false;
            onRefreshed(newAccessToken);
            const res = await axios(config);
            return res.data;
          }
        } catch (refreshError) {
          console.error("Error refreshing access token:", refreshError);
          localStorage.removeItem("userData");
          window.location.href = "/login";
          throw refreshError;
        }
      } else {
        // If refreshing, subscribe to the token refresh and retry once it's done
        return new Promise((resolve, reject) => {
          subscribeTokenRefresh((newAccessToken) => {
            config.headers.Authorization = `Bearer ${newAccessToken}`;
            axios(config)
              .then((response) => resolve(response.data))
              .catch((err) => reject(err));
          });
        });
      }
    }
    console.error("Error fetching data:", error);
    throw error;
  }
};

// Function to refresh the access token
const refreshAccessToken = async (refreshToken) => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_API}/api/token/refresh`,
      { refresh: refreshToken }
    );
    return res.data.access; // Assuming the new access token is in res.data.access
  } catch (error) {
    console.error("Error refreshing access token:", error);
    throw error;
  }
};
