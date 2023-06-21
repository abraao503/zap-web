import axios from 'axios';

const api = axios.create({
    // baseURL: 'http://89.117.33.56/v1'
    baseURL: process.env.REACT_APP_API_URL
});

export default api;
