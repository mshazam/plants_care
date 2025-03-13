import { useEffect, useState } from "react";
import { fetchDashboardData } from '../../services/api';
import './profile.css';
import { useNavigate } from "react-router-dom";
import { clearTokens, getAccessToken } from "../../utils/auth";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleLogout = () => {
    clearTokens();
    navigate("/login");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Debug: Check if token exists
        const token = getAccessToken();
        console.log("Current token:", token ? "Token exists" : "No token found");
        console.log("Auth header will be:", token ? `Bearer ${token}` : "No auth header");
        
        const data = await fetchDashboardData();
        console.log("Dashboard data received:", data);
        setUserData(data);
        setError(null);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
        // Log more detailed error information
        if (error.response) {
          console.error("Response status:", error.response.status);
          console.error("Response data:", error.response.data);
        }
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-container">
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="dashboard-container">
        <p>No user data available. Please log in again.</p>
        <button onClick={() => navigate('/login')} className="login-button">
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2 className="username">
          Welcome, {userData.username}
        </h2>
        <div className="dashboard-actions">
          <button 
            className="view-profile-button"
            onClick={() => navigate('/profile')}
          >
            View Profile
          </button>
          <button 
            className="notifications-button"
            onClick={() => navigate('/notifications')}
          >
            Notifications
          </button>
          <button 
            className="plant-database-button"
            onClick={() => navigate('/plants')}
          >
            Plant Database
          </button>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        <p>Email: {userData.email}</p>
        <p>Role: {userData.role}</p>
      </div>
    </div>
  );
};

export default UserDashboard;
