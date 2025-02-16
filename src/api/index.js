import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://youtube-clone-backend-dqkx.onrender.com',
  timeout: 10000,
});

export default api; 