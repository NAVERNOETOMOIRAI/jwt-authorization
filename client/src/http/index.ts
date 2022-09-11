import axios from "axios";
import {AuthResponse} from "../models/response/authResponse";
export  const API_URL = "http://localhost:1997/api"
const $api = axios.create({
    withCredentials:true,
    baseURL:API_URL,
})
$api.interceptors.request.use((config:any) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    return config;
})

$api.interceptors.response.use((config:any)=> {
    return config;
}, async (error) => {
    const originalRequest = error.config;
    if(error.response.status === 401 && originalRequest && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
            const response = await axios.get<AuthResponse>(`${API_URL}/refresh`,{withCredentials:true});
            localStorage.setItem('token', response.data.accessToken);
            return $api.request(originalRequest);
        }catch (e) {
            console.log(e,"NO AUTHORIZE")
        }
    }
    throw error;
})

export default $api;