import axios from "axios";

export const axiosInstance = axios.create();

let configurationRequest;

axiosInstance.interceptors.request.use(async (config) => {
  if (!configurationRequest) {
    configurationRequest = axios.get("/api/config")
      .then(({ data }) => {
        if (typeof data.baseURL !== "string" || !data.baseURL) {
          throw new Error("The server returned an invalid API configuration");
        }
        return data.baseURL;
      })
      .catch((error) => {
        configurationRequest = undefined;
        console.error("Unable to load API configuration", error);
        throw error;
      });
  }

  config.baseURL = await configurationRequest;
  return config;
});