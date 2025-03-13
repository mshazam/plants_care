import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileManagement from './ProfileManagement';
import './ProfileView.css';
import { getProfile } from '../../services/api';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/';

const ProfileView = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const data = await getProfile();
      console.log('Profile data:', data);
      setUserData(data);
    } catch (error) {
      console.error('Error:', error);
      setError('Error loading profile');
    } finally {
      setLoading(false);
    }
  };

  const renderRoleSpecificInfo = () => {
    if (!userData) return null;

    const role = userData.user?.role || localStorage.getItem('role');
    switch (role) {
      case 'Gardener':
        return (
          <div className="info-section">
            <h3>Gardener Information</h3>
            <p><strong>Experience Level:</strong> {userData.experience_level || 'Not specified'}</p>
            <p><strong>Specialization:</strong> {userData.specialization || 'Not specified'}</p>
            <p><strong>Availability:</strong> {userData.availability || 'Not specified'}</p>
            <p><strong>Service Area:</strong> {userData.service_area || 'Not specified'}</p>
            {userData.certifications && (
              <>
                <p><strong>Certifications:</strong></p>
                <div className="text-block">{userData.certifications}</div>
              </>
            )}
          </div>
        );

      case 'Supervisor':
        return (
          <div className="info-section">
            <h3>Supervisor Information</h3>
            <p><strong>Work Experience:</strong> {userData.work_experience ? `${userData.work_experience} years` : 'Not specified'}</p>
            {userData.managed_projects && (
              <>
                <p><strong>Managed Projects:</strong></p>
                <div className="text-block">{userData.managed_projects}</div>
              </>
            )}
            {userData.responsibilities && (
              <>
                <p><strong>Responsibilities:</strong></p>
                <div className="text-block">{userData.responsibilities}</div>
              </>
            )}
          </div>
        );

      case 'Homeowner':
        return (
          <div className="info-section">
            <h3>Homeowner Information</h3>
            <p><strong>Property Type:</strong> {userData.property_type || 'Not specified'}</p>
            <p><strong>Garden Size:</strong> {userData.garden_size || 'Not specified'}</p>
            {userData.preferred_plants && (
              <>
                <p><strong>Preferred Plants:</strong></p>
                <div className="text-block">{userData.preferred_plants}</div>
              </>
            )}
            <div className="preference-item">
              <strong>Organic Fertilizer:</strong>
              <span className={userData?.organic_fertilizer ? 'enabled' : 'disabled'}>
                {userData?.organic_fertilizer ? '✅' : '❌'}
              </span>
            </div>
            <p><strong>Plant Growth Tracking:</strong> {userData?.plant_tracking || 'Not specified'}</p>
          </div>
        );

      case 'System Admin':
        return (
          <div className="info-section">
            <h3>Admin Information</h3>
            <p><strong>Admin Level:</strong> {userData.admin_level || 'Not specified'}</p>
            {userData.assigned_responsibilities && (
              <>
                <p><strong>Assigned Responsibilities:</strong></p>
                <div className="text-block">{userData.assigned_responsibilities}</div>
              </>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  if (isEditMode) {
    return (
      <div className="edit-modal">
        <div className="edit-modal-content">
          <button className="close-button" onClick={() => setIsEditMode(false)}>×</button>
          <ProfileManagement 
            onSave={() => {
              setIsEditMode(false);
              fetchUserProfile();
            }}
            onCancel={() => setIsEditMode(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="profile-view-container">
      <div className="profile-header">
        <h2>Profile Information</h2>
        <button className="back-button" onClick={() => navigate(-1)}>Back</button>
      </div>

      {userData?.profile_picture && (
        <div className="profile-picture-container">
          <img 
            src={`http://localhost:8000${userData.profile_picture}`}
            alt="Profile" 
            className="profile-picture"
          />
        </div>
      )}

      <div className="info-section">
        <h3>Climate Information</h3>
        <p><strong>Average Temperature:</strong> {userData?.average_temperature || 'Not specified'}</p>
        <p><strong>Average Humidity:</strong> {userData?.average_humidity || 'Not specified'}</p>
        <p><strong>Annual Rainfall:</strong> {userData?.annual_rainfall || 'Not specified'}</p>
        <p><strong>Climate Zone:</strong> {userData?.climate_zone || 'Not specified'}</p>
      </div>

      <div className="info-section">
        <h3>Basic Information</h3>
        <p><strong>Username:</strong> {userData?.user?.username || 'Not specified'}</p>
        <p><strong>Email:</strong> {userData?.user?.email || 'Not specified'}</p>
        <p><strong>Full Name:</strong> {userData?.full_name || 'Not specified'}</p>
        <p><strong>Phone Number:</strong> {userData?.phone_number || 'Not specified'}</p>
        <p><strong>Address:</strong></p>
        <div className="text-block">{userData?.address || 'Not specified'}</div>
      </div>

      <div className="info-section">
        <h3>Gardening Preferences</h3>
        {userData?.preferred_plant_types?.length > 0 && (
          <>
            <p><strong>Preferred Plant Types:</strong></p>
            <div className="text-block">
              {userData.preferred_plant_types.map((type, index) => (
                <span key={index} className="plant-type-tag">
                  {type === 'Flowers' ? '🌸' : type === 'Vegetables' ? '🥦' : '🍎'} {type}
                </span>
              ))}
            </div>
          </>
        )}
        <p><strong>Location:</strong> {userData?.location || 'Not specified'}</p>
        <p><strong>ZIP Code:</strong> {userData?.zip_code || 'Not specified'}</p>
        <p><strong>Soil Type:</strong> {userData?.soil_type || 'Not specified'}</p>
        <p><strong>Skill Level:</strong> {userData?.skill_level || 'Not specified'}</p>
        <p><strong>Watering Frequency:</strong> {userData?.watering_frequency || 'Not specified'}</p>
        
        <div className="preferences-grid">
          <div className="preference-item">
            <strong>Maintenance Reminders:</strong>
            <span className={userData?.maintenance_reminders ? 'enabled' : 'disabled'}>
              {userData?.maintenance_reminders ? '✅' : '❌'}
            </span>
          </div>
          <div className="preference-item">
            <strong>Pest Alerts:</strong>
            <span className={userData?.pest_alerts ? 'enabled' : 'disabled'}>
              {userData?.pest_alerts ? '✅' : '❌'}
            </span>
          </div>
          <div className="preference-item">
            <strong>Disease Alerts:</strong>
            <span className={userData?.disease_alerts ? 'enabled' : 'disabled'}>
              {userData?.disease_alerts ? '✅' : '❌'}
            </span>
          </div>
          <div className="preference-item">
            <strong>Community Notifications:</strong>
            <span className={userData?.community_notifications ? 'enabled' : 'disabled'}>
              {userData?.community_notifications ? '✅' : '❌'}
            </span>
          </div>
        </div>
      </div>

      {renderRoleSpecificInfo()}

      <div className="actions">
        <button 
          className="edit-button"
          onClick={() => setIsEditMode(true)}
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default ProfileView; 