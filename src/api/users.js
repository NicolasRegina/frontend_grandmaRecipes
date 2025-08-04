import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/users";

export const getAllUsers = (token) =>
  axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } });

export const getUserById = (id, token) =>
  axios.get(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } });

export const updateUserById = (id, data, token) =>
  axios.put(`${API_URL}/${id}`, data, { headers: { Authorization: `Bearer ${token}` } });

export const deleteUserById = (id, token) =>
  axios.delete(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } });

export const registerUserByAdmin = (data, token) =>
  axios.post(`${API_URL}/admin/register`, data, { headers: { Authorization: `Bearer ${token}` } });
