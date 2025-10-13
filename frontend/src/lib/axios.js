import axios from "axios"

const api = axios.create({
    baseURL: 'https://127.0.0.1:5000',
    headers: {'Content-Type': 'application/json'},
    withCredentials: true
})

export default api;