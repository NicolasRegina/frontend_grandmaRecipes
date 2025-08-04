// Funciones CRUD para grupos
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const getGroups = async (token) => {
    const response = await axios.get(`${API_URL}/groups`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const getUserGroups = async (token) => {
    const response = await axios.get(`${API_URL}/groups/user`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const getGroupById = async (id, token) => {
    const response = await axios.get(`${API_URL}/groups/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const createGroup = async (data, token) => {
    const response = await axios.post(`${API_URL}/groups`, data, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const updateGroup = async (id, data, token) => {
    const response = await axios.put(`${API_URL}/groups/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const deleteGroup = async (id, token) => {
    const response = await axios.delete(`${API_URL}/groups/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

// ========== NUEVAS FUNCIONES DE BÚSQUEDA E INVITACIONES ==========

// Buscar grupos por nombre
export const searchGroups = async (query, token) => {
    const response = await axios.get(`${API_URL}/groups/search?q=${encodeURIComponent(query)}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

// Buscar grupo por código de invitación
export const findGroupByInviteCode = async (code, token) => {
    const response = await axios.get(`${API_URL}/groups/invite/${code}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

// Solicitar unirse a un grupo
export const requestJoinGroup = async (code, token) => {
    const response = await axios.post(`${API_URL}/groups/invite/${code}/join`, {}, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

// Aprobar solicitud de unirse
export const approveJoinRequest = async (groupId, userId, token) => {
    const response = await axios.post(`${API_URL}/groups/${groupId}/approve/${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

// Rechazar solicitud de unirse
export const rejectJoinRequest = async (groupId, userId, token) => {
    const response = await axios.post(`${API_URL}/groups/${groupId}/reject/${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

// Cambiar rol de miembro
export const changeMemberRole = async (groupId, userId, role, token) => {
    const response = await axios.put(`${API_URL}/groups/${groupId}/members/${userId}/role`, 
        { role }, 
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
};

// Remover miembro
export const removeMember = async (groupId, userId, token) => {
    const response = await axios.delete(`${API_URL}/groups/${groupId}/members/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};