import { useEffect, useState } from "react";
import { fetchDashboardData } from '../../services/api';
import './profile.css';
import { useNavigate } from "react-router-dom";
import { clearTokens } from "../../utils/auth";

function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearTokens();
    navigate("/login");
  };
  
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchDashboardData();
        setUserData(data);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      }
    };

    fetchData();
  }, []);

  if (!userData) return <p>Loading...</p>;

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
}

export default AdminDashboard;
