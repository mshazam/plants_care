import axios from "axios";
import { getAccessToken, saveTokens, clearTokens } from "../utils/auth";

// Base API URL from environment variable or fallback
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api/";

// Create Axios Instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add JWT Token to Requests
api.interceptors.request.use(
    (config) => {
        const accessToken = getAccessToken();
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Refresh Token if Access Token Expires
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem("refresh");
                if (!refreshToken) {
                    throw new Error("No refresh token available");
                }

                // Make sure the URL is properly formatted with a slash between 'api' and 'token'
                const tokenRefreshURL = `${API_BASE_URL.endsWith('/') ? API_BASE_URL : API_BASE_URL + '/'}token/refresh/`;
                
                const res = await axios.post(tokenRefreshURL, {
                    refresh: refreshToken,
                });

                saveTokens(res.data.access, refreshToken);
                api.defaults.headers.Authorization = `Bearer ${res.data.access}`;
                return api(originalRequest);
            } catch (err) {
                console.error("Token refresh failed", err);
                clearTokens();
                window.location.href = "/login"; // Redirect to login
                return Promise.reject(error);
            }
        }
        return Promise.reject(error);
    }
);

// Register User
export const registerUser = async (userData) => {
    const response = await api.post("register/", userData);
    return response.data;
};

// Login User
export const loginUser = async (credentials) => {
    const response = await api.post("login/", credentials);
    saveTokens(response.data.access, response.data.refresh);
    return response.data;
};

// Fetch Users (Admin Only)
export const fetchUsers = async () => {
    const response = await api.get("users/");
    return response.data;
};

// Fetch Dashboard Data (Only Logged-in User)
export const fetchDashboardData = async () => {
    try {
        const response = await api.get("dashboard/");
        return response.data;
    } catch (error) {
        console.error("Error fetching dashboard data", error);
        throw error;
    }
};

// Get Profile Data
export const getProfile = async () => {
    const response = await api.get("profile/");
    return response.data;
};

// Update Profile Data
export const updateProfile = async (profileData) => {
    const response = await api.put("profile/update/", profileData);
    return response.data;
};

// Logout User
export const logoutUser = async () => {
    try {
        const refreshToken = localStorage.getItem("refresh");
        await api.post("logout/", { refresh: refreshToken });
    } catch (error) {
        console.error("Error during logout:", error);
    } finally {
        clearTokens();
        window.location.href = "/login"; // Redirect after logout
    }
};

// Plant Management
export const createPlant = async (plantData) => {
    const response = await api.post("plants/", plantData);
    return response.data;
};

export const updatePlant = async (id, plantData) => {
    const response = await api.put(`plants/${id}/`, plantData);
    return response.data;
};

export const deletePlant = async (id) => {
    const response = await api.delete(`plants/${id}/`);
    return response.data;
};

export const getPlantById = async (id) => {
    try {
        const response = await api.get(`plants/${id}/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching plant details:', error);
        throw error;
    }
};

// Plant Tracking
export const getTrackedPlants = async () => {
    try {
        const response = await api.get("tracked-plants/");
        return response.data;
    } catch (error) {
        console.error("Error fetching tracked plants:", error);
        throw error;
    }
};

export const addTrackedPlant = async (plantData) => {
    try {
        const response = await api.post("tracked-plants/", plantData);
        return response.data;
    } catch (error) {
        console.error("Error adding tracked plant:", error);
        throw error;
    }
};

export const updateTrackedPlant = async (id, plantData) => {
    try {
        const response = await api.patch(`tracked-plants/${id}/`, plantData);
        return response.data;
    } catch (error) {
        console.error("Error updating tracked plant:", error);
        throw error;
    }
};

export const deleteTrackedPlant = async (id) => {
    try {
        await api.delete(`tracked-plants/${id}/`);
        return true;
    } catch (error) {
        console.error("Error deleting tracked plant:", error);
        throw error;
    }
};

// Plant Reminders
export const getPlantReminders = async () => {
    try {
        const response = await api.get("plant-reminders/");
        return response.data;
    } catch (error) {
        console.error("Error fetching plant reminders:", error);
        throw error;
    }
};

export const getUpcomingReminders = async () => {
    try {
        const response = await api.get("upcoming-reminders/");
        return response.data;
    } catch (error) {
        console.error("Error fetching upcoming reminders:", error);
        throw error;
    }
};

export const addPlantReminder = async (reminderData) => {
    try {
        const response = await api.post("plant-reminders/", reminderData);
        return response.data;
    } catch (error) {
        console.error("Error adding plant reminder:", error);
        throw error;
    }
};

export const updatePlantReminder = async (id, reminderData) => {
    try {
        const response = await api.patch(`plant-reminders/${id}/`, reminderData);
        return response.data;
    } catch (error) {
        console.error("Error updating plant reminder:", error);
        throw error;
    }
};

export const deletePlantReminder = async (id) => {
    try {
        await api.delete(`plant-reminders/${id}/`);
        return true;
    } catch (error) {
        console.error("Error deleting plant reminder:", error);
        throw error;
    }
};
