import axios from "axios";

const api = axios.create({
  baseURL: "https://cv-automation-api.onrender.com",
  headers: {
    "x-api-key": "2a663930-c9e7-4bce-a45c-66fb85791295",
  },
});

export default api;
