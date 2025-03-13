import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile } from '../../services/api';
import PlantCareRecommendations from './PlantCareRecommendations';
import PlantTracking from './PlantTracking';
import './Notifications.css';

const Notifications = () => {
  const [activeTab, setActiveTab] = useState('recommendations');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const data = await getProfile();
        setUserData(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setError('Failed to load user data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <h2>Plant Management Center</h2>
        <button className="back-button" onClick={() => navigate(-1)}>Back</button>
      </div>

      <div className="tabs">
        <button 
          className={`tab-button ${activeTab === 'recommendations' ? 'active' : ''}`}
          onClick={() => setActiveTab('recommendations')}
        >
          Care Recommendations
        </button>
        <button 
          className={`tab-button ${activeTab === 'tracking' ? 'active' : ''}`}
          onClick={() => setActiveTab('tracking')}
        >
          Plant Tracking
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'recommendations' && (
          <PlantCareRecommendations userData={userData} />
        )}
        {activeTab === 'tracking' && (
          <PlantTracking userData={userData} />
        )}
      </div>
    </div>
  );
};

export default Notifications; 