import axios from "axios";

const Openweathermap = axios.create({
  baseURL: "https://api.openweathermap.org",
});

export default Openweathermap;
