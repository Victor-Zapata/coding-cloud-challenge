import axios from 'axios';

const api = axios.create({
    baseURL: 'https://pizza-backend-j8w0.onrender.com'
})

export default api;