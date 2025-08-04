// Funciones CRUD para recetas
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const getRecipes = async (token, params = {}) => {
    const response = await axios.get(`${API_URL}/recipes`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
    });
    return response.data;
};

export const getRecipeById = async (id, token) => {
    const response = await axios.get(`${API_URL}/recipes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const createRecipe = async (data, token) => {
    const response = await axios.post(`${API_URL}/recipes`, data, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const updateRecipe = async (id, data, token) => {
    const response = await axios.put(`${API_URL}/recipes/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const deleteRecipe = async (id, token) => {
    const response = await axios.delete(`${API_URL}/recipes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const searchRecipes = async (params, token) => {
    const query = new URLSearchParams();
    if (params.q) query.append("q", params.q);
    if (params.category) query.append("category", params.category);
    if (params.difficulty) query.append("difficulty", params.difficulty);
    // TODO: Agregar más filtros a futuro

    const response = await axios.get(`${API_URL}/recipes/search?${query.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};