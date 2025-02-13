import axios from "axios";

const api = axios.create({
  baseURL: "https://yt-api.p.rapidapi.com",
  params: {
    geo: "TR",
    lang: "tr",
  },
  headers: {
    "x-rapidapi-key": "7b18520e29msh48b76cf15ed13b8p1a3854jsn747aebabad8c",
    "x-rapidapi-host": "yt-api.p.rapidapi.com",
  },
});
export default api;
