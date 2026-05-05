import axios from "axios";
 const BASE_URL = "https://notesapi-4gcc.onrender.com/api";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
});