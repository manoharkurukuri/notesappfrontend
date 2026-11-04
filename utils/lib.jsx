import axios from "axios";

export const axiosInstance = axios.create();

let apiUrlPromise;

axiosInstance.interceptors.request.use(async (config) => {
  if (!apiUrlPromise) {
    apiUrlPromise = axios
      .get("/api/runtime-config")
      .then(({ data }) => {
        if (typeof data.apiUrl !== "string" || !data.apiUrl) {
          throw new Error("The server returned an invalid API URL");
        }
        return data.apiUrl;
      })
      .catch((error) => {
        apiUrlPromise = undefined;
        console.error("Failed to load runtime API configuration", error);
        throw error;
      });
  }

  config.baseURL = await apiUrlPromise;
  return config;
});