import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const login = async (credentials) => {
    const response = await axios.post(`${API_URL}/users/login`, credentials);
    return response.data; // { message, token }
};

export const register = async (userData) => {
    const response = await axios.post(`${API_URL}/users/register`, userData);
    return response.data;
};

export const getProfile = async (token) => {
    const response = await axios.get(`${API_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const updateProfile = async (profileData, token) => {
    const response = await axios.put(`${API_URL}/users/profile`, profileData, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};