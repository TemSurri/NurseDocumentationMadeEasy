import axios from 'axios';
import type { AxiosInstance } from 'axios';

const axiosInstance: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/',
    headers: {
        'Content-Type': 'applicatation/json'
    },
    timeout: 10000,
})

export default axiosInstance;



