import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PlantSearch.css';
import { getAccessToken } from '../../utils/auth';
import { deletePlant } from '../../services/api';

const API_BASE_URL = 'http://localhost:8000/api';

const PlantSearch = () => {
  const navigate = useNavigate();
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    soil_type: '',
    sunlight: '',
    watering_schedule: ''
  });
  const [categories, setCategories] = useState({});
  const [soilTypes, setSoilTypes] = useState({});
  const [sunlightOptions, setSunlightOptions] = useState({});
  const [wateringOptions, setWateringOptions] = useState({});
  const [initialLoad, setInitialLoad] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchFilterOptions = useCallback(async () => {
    try {
      const token = getAccessToken();
      if (!token) {
        console.error('No access token found');
        setError('Please log in to access the plant database');
        return;
      }
      
      const headers = { Authorization: `Bearer ${token}` };
      console.log('Fetching filter options with token:', token);
      
      const [categoriesRes, soilTypesRes, sunlightRes, wateringRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/plants/categories/`, { headers }),
        axios.get(`${API_BASE_URL}/plants/soil-types/`, { headers }),
        axios.get(`${API_BASE_URL}/plants/sunlight-options/`, { headers }),
        axios.get(`${API_BASE_URL}/plants/watering-options/`, { headers })
      ]);

      setCategories(categoriesRes.data);
      setSoilTypes(soilTypesRes.data);
      setSunlightOptions(sunlightRes.data);
      setWateringOptions(wateringRes.data);
      
      await fetchPlants();
      setInitialLoad(false);
    } catch (err) {
      console.error('Error fetching filter options:', err);
      if (err.response) {
        console.error('Error response:', err.response.data);
        setError(`Failed to fetch filter options: ${err.response.data.detail || 'Unknown error'}`);
      } else {
        setError('Failed to fetch filter options');
      }
      setInitialLoad(false);
    }
  }, []);

  const fetchPlants = useCallback(async () => {
    try {
      setLoading(true);
      const token = getAccessToken();
      if (!token) {
        console.error('No access token found');
        setError('Please log in to access the plant database');
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };
      
      const params = new URLSearchParams();
      if (searchQuery) params.append('q', searchQuery);
      if (filters.category) params.append('category', filters.category);
      if (filters.soil_type) params.append('soil_type', filters.soil_type);
      if (filters.sunlight) params.append('sunlight', filters.sunlight);
      if (filters.watering_schedule) params.append('watering_schedule', filters.watering_schedule);

      const response = await axios.get(`${API_BASE_URL}/plants/?${params}`, { headers });
      setPlants(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching plants:', err);
      if (err.response) {
        console.error('Error response:', err.response.data);
        setError(`Failed to fetch plants: ${err.response.data.detail || 'Unknown error'}`);
      } else {
        setError('Failed to fetch plants');
      }
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filters]);

  useEffect(() => {
    fetchFilterOptions();
  }, [fetchFilterOptions]);

  useEffect(() => {
    const checkAdminStatus = () => {
      const userRole = localStorage.getItem('role');
      setIsAdmin(userRole === 'System Admin');
    };
    checkAdminStatus();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = () => {
    fetchPlants();
  };

  const handlePlantClick = (plantId) => {
    navigate(`/plants/${plantId}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this plant?')) {
      try {
        await deletePlant(id);
        // Refresh the plant list after deletion
        fetchPlants();
      } catch (error) {
        console.error('Error deleting plant:', error);
        setError('Failed to delete plant. Please try again.');
      }
    }
  };

  if (initialLoad) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="plant-search-container">
      <div className="header-section">
        <h2>Plant Database</h2>
        {isAdmin && (
          <button 
            className="add-plant-button"
            onClick={() => navigate('/plants/add')}
          >
            Add New Plant
          </button>
        )}
      </div>
      
      <div className="search-filters">
        <div className="search-input-group">
          <input
            type="text"
            className="search-input"
            placeholder="Search plants..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <button 
            className="search-button"
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
        
        <select
          name="category"
          className="filter-select"
          value={filters.category}
          onChange={handleFilterChange}
        >
          <option value="">All Categories</option>
          {Object.entries(categories).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>

        <select
          name="soil_type"
          className="filter-select"
          value={filters.soil_type}
          onChange={handleFilterChange}
        >
          <option value="">All Soil Types</option>
          {Object.entries(soilTypes).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>

        <select
          name="sunlight"
          className="filter-select"
          value={filters.sunlight}
          onChange={handleFilterChange}
        >
          <option value="">All Sunlight Needs</option>
          {Object.entries(sunlightOptions).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>

        <select
          name="watering_schedule"
          className="filter-select"
          value={filters.watering_schedule}
          onChange={handleFilterChange}
        >
          <option value="">All Watering Schedules</option>
          {Object.entries(wateringOptions).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      <div className="plants-grid">
        {loading ? (
          <div className="loading">Searching...</div>
        ) : plants.length === 0 ? (
          <div className="no-data">
            <p>No plants found matching your search criteria</p>
            <small>Try adjusting your search terms or filters</small>
          </div>
        ) : (
          plants.map(plant => (
            <div key={plant.id} className="plant-card">
              {plant.image && typeof plant.image === 'string' && (
                <div className="plant-image">
                  <img 
                    src={plant.image.startsWith('http') ? plant.image : `${API_BASE_URL}${plant.image}`} 
                    alt={plant.name} 
                  />
                </div>
              )}
              <h3>{plant.name}</h3>
              {plant.scientific_name && (
                <p className="scientific-name"><em>{plant.scientific_name}</em></p>
              )}
              <div className="plant-details">
                <p><strong>Category:</strong> {plant.category}</p>
                <p><strong>Soil Type:</strong> {plant.soil_type}</p>
                <p><strong>Sunlight:</strong> {plant.sunlight}</p>
                <p><strong>Watering:</strong> {plant.watering_schedule}</p>
              </div>
              {isAdmin && (
                <div className="admin-actions">
                  <button 
                    className="edit-button"
                    onClick={() => navigate(`/plants/edit/${plant.id}`)}
                  >
                    Edit
                  </button>
                  <button 
                    className="delete-button"
                    onClick={() => handleDelete(plant.id)}
                  >
                    Delete
                  </button>
                </div>
              )}
              <div className="plant-actions">
                <button
                  className="view-details-btn"
                  onClick={() => handlePlantClick(plant.id)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PlantSearch; 