import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/recipes/admin";

export const getAllRecipesAdmin = (token) =>
  axios.get(`${API_URL}/all`, { headers: { Authorization: `Bearer ${token}` } });

export const getRecipeByIdAdmin = (id, token) =>
  axios.get(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } });

export const updateRecipeByIdAdmin = (id, data, token) =>
  axios.put(`${API_URL}/${id}`, data, { headers: { Authorization: `Bearer ${token}` } });

export const deleteRecipeByIdAdmin = (id, token) =>
  axios.delete(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
