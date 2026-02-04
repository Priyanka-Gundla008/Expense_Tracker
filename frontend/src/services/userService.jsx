import axios from "axios";
import api from "./api";

export const createUser = async (data) => {
    try {
        const response = await api.post("users/create-user", data);
        return response.data;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

export const getUserById = async (userId) => {
    try {
        const response = await api.get(`users/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

export const updateUser = async (userId, data) => {
    try {
        const response = await api.patch(`users/${userId}`, data, {
             headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

export const changePassword = async (userId, data) => {
    try {
        const response = await api.post(`users/change-password/${userId}`, data);
        return response.data;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}