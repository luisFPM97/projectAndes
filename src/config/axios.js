import axios from 'axios';

const api = axios.create({
    baseURL: 'http://172.16.0.59:8080/',
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api; 