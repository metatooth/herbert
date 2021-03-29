import axios from "axios";

const HTTP = axios.create({
  baseURL: `${process.env.VUE_APP_API_URL}?ssl=true`,
  headers: { "Content-Type": "application/json" }
});
export default HTTP;
