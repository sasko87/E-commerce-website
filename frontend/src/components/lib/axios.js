import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://mystore.stevkovski.xyz",
  withCredentials: true, //send cookies
});

export default axiosInstance;
