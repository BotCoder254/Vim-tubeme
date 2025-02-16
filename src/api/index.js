import axios from "axios";

const api = axios.create({
  baseURL: "https://yt-api.p.rapidapi.com",
  params: {
    geo: "US",
    lang: "en",
  },
  headers: {
    "x-rapidapi-key": "7b18520e29msh48b76cf15ed13b8p1a3854jsn747aebabad8c",
    "x-rapidapi-host": "yt-api.p.rapidapi.com",
  },
});

// Add request interceptor to format URLs correctly
api.interceptors.request.use((config) => {
  // Handle search endpoint
  if (config.url.startsWith('/search')) {
    const query = config.params.query;
    delete config.params.query;
    config.url = `/search?query=${encodeURIComponent(query)}`;
  }
  // Handle trending endpoint
  else if (config.url === '/tranding') {
    config.url = '/trending';
  }
  // Handle home endpoint
  else if (config.url === '/home') {
    config.url = '/home';
  }
  return config;
});

export default api; 