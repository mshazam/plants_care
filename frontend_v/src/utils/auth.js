// frontend/src/utils/auth.js

const ACCESS_TOKEN_KEY = "access";
const REFRESH_TOKEN_KEY = "refresh";

// Save tokens to localStorage
export const saveTokens = (access, refresh) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, access);
  localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
};

// Get access token
export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);

// Get refresh token
export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);

// Remove tokens on logout
export const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem("role");
  localStorage.removeItem("username");
  localStorage.removeItem("email");
};

// Check if user is authenticated
export const isAuthenticated = () => !!getAccessToken();

// Refresh the access token
export const refreshToken = async () => {
  const refresh = getRefreshToken();
  if (!refresh) return null;

  try {
    // Make sure there's a slash between 'api' and 'token'
    const response = await fetch("http://localhost:8000/api/token/refresh/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });

    if (response.ok) {
      const data = await response.json();
      saveTokens(data.access, refresh);
      return data.access;
    } else {
      clearTokens();
      return null;
    }
  } catch (error) {
    console.error("Error refreshing token:", error);
    return null;
  }
};
