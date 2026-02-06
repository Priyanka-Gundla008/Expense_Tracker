import api from "./api";

export const login = async (data) => {
    try {
        const response = await api.post("auth/login", data);
        return response;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

export const forgotPassword = async (email) => {
    try {
        const response = await api.post("auth/forgot-password", email);
        return response
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

export const resetPassword = async (data) => {
    try {
        const response = await api.post("auth/reset-password", data);
        return response
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

export const googleLogin = async (idToken) => {
    try {
        const response = await api.post("auth/google-login", { idToken });
        return response;
    } catch (error) {
        console.error("Google login error:", error);
        throw error;
    }
};
