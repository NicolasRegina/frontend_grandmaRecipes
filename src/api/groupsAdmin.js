import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/groups/admin";

export const getAllGroupsAdmin = (token) =>
  axios.get(`${API_URL}/all`, { headers: { Authorization: `Bearer ${token}` } });

export const getGroupByIdAdmin = (id, token) =>
  axios.get(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } });

export const updateGroupByIdAdmin = (id, data, token) =>
  axios.put(`${API_URL}/${id}`, data, { headers: { Authorization: `Bearer ${token}` } });

export const deleteGroupByIdAdmin = (id, token) =>
  axios.delete(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
