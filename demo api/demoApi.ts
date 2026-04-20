import axios from "axios";

/* DEMO ONLY – DOES NOT TOUCH REAL BACKEND */
const demoApi = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
});

export const getDemoPosts = () => demoApi.get("/posts");
