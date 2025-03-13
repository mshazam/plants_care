import React, { useState, useEffect } from 'react';
import './ProfileManagement.css';
import { getProfile, updateProfile } from '../../services/api';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/';

const ProfileManagement = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: '',
    address: '',
    average_temperature: '',
    average_humidity: '',
    annual_rainfall: '',
    climate_zone: '',
    gardening_preferences: '',
    experience_level: '',
    specialization: '',
    availability: '',
    service_area: '',
    certifications: '',
    work_experience: '',
    managed_projects: '',
    responsibilities: '',
    property_type: '',
    garden_size: '',
    preferred_plants: '',
    admin_level: '',
    assigned_responsibilities: '',
    preferred_plant_types: [],
    location: '',
    zip_code: '',
    soil_type: '',
    skill_level: '',
    watering_frequency: '',
    maintenance_reminders: false,
    pest_alerts: false,
    disease_alerts: false,
    community_notifications: true,
    organic_fertilizer: false,
    plant_tracking: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const role = localStorage.getItem('role');

  useEffect(() => {
    fetchCurrentProfile();
  }, []);

  const fetchCurrentProfile = async () => {
    try {
      const data = await getProfile();
      console.log('Current profile data:', data);
      setFormData(prevData => ({
        ...prevData,
        ...data
      }));
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to load profile data');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePlantTypeChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prevData => {
      const currentTypes = [...prevData.preferred_plant_types];
      if (checked) {
        currentTypes.push(value);
      } else {
        const index = currentTypes.indexOf(value);
        if (index > -1) {
          currentTypes.splice(index, 1);
        }
      }
      return {
        ...prevData,
        preferred_plant_types: currentTypes
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await updateProfile(formData);
      console.log('Profile updated:', data);
      onSave();
    } catch (error) {
      console.error('Error updating profile:', error);
      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="profile-form">
      <h2>Edit Profile</h2>
      {error && <div className="error-message">{error}</div>}

      <div className="form-section">
        <h3>Basic Information</h3>
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            name="full_name"
            value={formData.full_name || ''}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="tel"
            name="phone_number"
            value={formData.phone_number || ''}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Address</label>
          <textarea
            name="address"
            value={formData.address || ''}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      <div className="form-section">
        <h3>Climate Information</h3>
        <div className="form-group">
          <label>Average Temperature Range</label>
          <input
            type="text"
            name="average_temperature"
            value={formData.average_temperature || ''}
            onChange={handleInputChange}
            placeholder="e.g., 20-25°C"
          />
        </div>

        <div className="form-group">
          <label>Average Humidity</label>
          <input
            type="text"
            name="average_humidity"
            value={formData.average_humidity || ''}
            onChange={handleInputChange}
            placeholder="e.g., 60-70%"
          />
        </div>

        <div className="form-group">
          <label>Annual Rainfall</label>
          <input
            type="text"
            name="annual_rainfall"
            value={formData.annual_rainfall || ''}
            onChange={handleInputChange}
            placeholder="e.g., 800-1000mm"
          />
        </div>

        <div className="form-group">
          <label>Climate Zone</label>
          <select
            name="climate_zone"
            value={formData.climate_zone || ''}
            onChange={handleInputChange}
          >
            <option value="">Select Climate Zone</option>
            <option value="Tropical">Tropical</option>
            <option value="Mediterranean">Mediterranean</option>
            <option value="Temperate">Temperate</option>
            <option value="Continental">Continental</option>
            <option value="Arid">Arid</option>
            <option value="Polar">Polar</option>
          </select>
        </div>
      </div>

      <div className="form-section">
        <h3>Gardening Preferences</h3>
        <div className="form-group">
          <label>Preferred Plant Types</label>
          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                value="Flowers"
                checked={formData.preferred_plant_types.includes('Flowers')}
                onChange={handlePlantTypeChange}
              />
              🌸 Flowers
            </label>
            <label>
              <input
                type="checkbox"
                value="Vegetables"
                checked={formData.preferred_plant_types.includes('Vegetables')}
                onChange={handlePlantTypeChange}
              />
              🥦 Vegetables
            </label>
            <label>
              <input
                type="checkbox"
                value="Fruits"
                checked={formData.preferred_plant_types.includes('Fruits')}
                onChange={handlePlantTypeChange}
              />
              🍎 Fruits
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            name="location"
            value={formData.location || ''}
            onChange={handleInputChange}
            placeholder="City/Region"
          />
        </div>

        <div className="form-group">
          <label>ZIP Code</label>
          <input
            type="text"
            name="zip_code"
            value={formData.zip_code || ''}
            onChange={handleInputChange}
            placeholder="Enter ZIP code"
          />
        </div>

        <div className="form-group">
          <label>Soil Type</label>
          <select 
            name="soil_type" 
            value={formData.soil_type || ''} 
            onChange={handleInputChange}
          >
            <option value="">Select Soil Type</option>
            <option value="Sandy">🏜 Sandy Soil</option>
            <option value="Loamy">🌿 Loamy Soil</option>
            <option value="Clay">🌾 Clay Soil</option>
            <option value="Silt">🌱 Silt Soil</option>
          </select>
        </div>

        <div className="form-group">
          <label>Skill Level</label>
          <select 
            name="skill_level" 
            value={formData.skill_level || ''} 
            onChange={handleInputChange}
          >
            <option value="">Select Skill Level</option>
            <option value="Beginner">🟢 Beginner</option>
            <option value="Intermediate">🟡 Intermediate</option>
            <option value="Expert">🔴 Expert</option>
          </select>
        </div>

        <div className="form-group">
          <label>Watering Frequency</label>
          <select 
            name="watering_frequency" 
            value={formData.watering_frequency || ''} 
            onChange={handleInputChange}
          >
            <option value="">Select Frequency</option>
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Custom">Custom</option>
          </select>
        </div>

        <div className="form-group">
          <label>Notifications</label>
          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                name="maintenance_reminders"
                checked={formData.maintenance_reminders}
                onChange={handleInputChange}
              />
              Maintenance Reminders
            </label>
            <label>
              <input
                type="checkbox"
                name="pest_alerts"
                checked={formData.pest_alerts}
                onChange={handleInputChange}
              />
              Pest Alerts
            </label>
            <label>
              <input
                type="checkbox"
                name="disease_alerts"
                checked={formData.disease_alerts}
                onChange={handleInputChange}
              />
              Disease Alerts
            </label>
            <label>
              <input
                type="checkbox"
                name="community_notifications"
                checked={formData.community_notifications}
                onChange={handleInputChange}
              />
              Community Notifications
            </label>
          </div>
        </div>
      </div>

      {/* Role-specific fields */}
      {role === 'Gardener' && (
        <div className="form-section">
          <h3>Gardener Information</h3>
          <div className="form-group">
            <label>Experience Level</label>
            <select 
              name="experience_level" 
              value={formData.experience_level || ''} 
              onChange={handleInputChange}
            >
              <option value="">Select Level</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Expert">Expert</option>
            </select>
          </div>
          <div className="form-group">
            <label>Specialization</label>
            <select 
              name="specialization" 
              value={formData.specialization || ''} 
              onChange={handleInputChange}
            >
              <option value="">Select Specialization</option>
              <option value="Flower Gardening">Flower Gardening</option>
              <option value="Vegetable Gardening">Vegetable Gardening</option>
              <option value="Landscaping">Landscaping</option>
            </select>
          </div>
          <div className="form-group">
            <label>Availability</label>
            <select 
              name="availability" 
              value={formData.availability || ''} 
              onChange={handleInputChange}
            >
              <option value="">Select Availability</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Freelance">Freelance</option>
            </select>
          </div>
          <div className="form-group">
            <label>Service Area</label>
            <input
              type="text"
              name="service_area"
              value={formData.service_area || ''}
              onChange={handleInputChange}
              placeholder="City/Region"
            />
          </div>
          <div className="form-group">
            <label>Certifications</label>
            <textarea
              name="certifications"
              value={formData.certifications || ''}
              onChange={handleInputChange}
              placeholder="List your certifications"
            />
          </div>
        </div>
      )}

      {role === 'Supervisor' && (
        <div className="form-section">
          <h3>Supervisor Information</h3>
          <div className="form-group">
            <label>Work Experience (years)</label>
            <input
              type="number"
              name="work_experience"
              value={formData.work_experience || ''}
              onChange={handleInputChange}
              min="0"
            />
          </div>
          <div className="form-group">
            <label>Managed Projects</label>
            <textarea
              name="managed_projects"
              value={formData.managed_projects || ''}
              onChange={handleInputChange}
              placeholder="List your managed projects"
            />
          </div>
          <div className="form-group">
            <label>Responsibilities</label>
            <textarea
              name="responsibilities"
              value={formData.responsibilities || ''}
              onChange={handleInputChange}
              placeholder="Describe your responsibilities"
            />
          </div>
        </div>
      )}

      {role === 'Homeowner' && (
        <div className="form-section">
          <h3>Homeowner Information</h3>
          <div className="form-group">
            <label>Property Type</label>
            <select 
              name="property_type" 
              value={formData.property_type || ''} 
              onChange={handleInputChange}
            >
              <option value="">Select Property Type</option>
              <option value="House">House</option>
              <option value="Apartment">Apartment</option>
              <option value="Farmhouse">Farmhouse</option>
            </select>
          </div>
          <div className="form-group">
            <label>Garden Size</label>
            <select 
              name="garden_size" 
              value={formData.garden_size || ''} 
              onChange={handleInputChange}
            >
              <option value="">Select Garden Size</option>
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
            </select>
          </div>
          <div className="form-group">
            <label>Preferred Plants</label>
            <textarea
              name="preferred_plants"
              value={formData.preferred_plants || ''}
              onChange={handleInputChange}
              placeholder="List your preferred plants"
            />
          </div>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="organic_fertilizer"
                checked={formData.organic_fertilizer}
                onChange={handleInputChange}
              />
              Use Organic Fertilizer
            </label>
          </div>
          <div className="form-group">
            <label>Plant Growth Tracking</label>
            <select 
              name="plant_tracking" 
              value={formData.plant_tracking || ''} 
              onChange={handleInputChange}
            >
              <option value="">Select Tracking Method</option>
              <option value="Manual">Manual Logging</option>
              <option value="AI">AI-based Tracking</option>
            </select>
          </div>
        </div>
      )}

      {role === 'System Admin' && (
        <div className="form-section">
          <h3>Admin Information</h3>
          <div className="form-group">
            <label>Admin Level</label>
            <select 
              name="admin_level" 
              value={formData.admin_level || ''} 
              onChange={handleInputChange}
            >
              <option value="">Select Admin Level</option>
              <option value="Super Admin">Super Admin</option>
              <option value="Moderator">Moderator</option>
            </select>
          </div>
          <div className="form-group">
            <label>Assigned Responsibilities</label>
            <textarea
              name="assigned_responsibilities"
              value={formData.assigned_responsibilities || ''}
              onChange={handleInputChange}
              placeholder="List your assigned responsibilities"
            />
          </div>
        </div>
      )}

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="cancel-button">
          Cancel
        </button>
        <button type="submit" className="save-button" disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
};

export default ProfileManagement; 