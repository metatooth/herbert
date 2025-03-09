import axios from "axios";
import process from "process";

const HTTP = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  headers: { "Content-Type": "application/json" },
});
export default HTTP;
