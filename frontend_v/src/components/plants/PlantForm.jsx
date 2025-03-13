import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './PlantForm.css';
import { getAccessToken } from '../../utils/auth';

const API_BASE_URL = 'http://localhost:8000/api';

const PlantForm = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // for editing existing plants
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    image: null,
    scientific_name: '',
    category: '',
    soil_type: '',
    sunlight: '',
    watering_schedule: '',
    fertilization_needs: false,
    growth_stages: [],
    pests: [],
    climate_suitability: '',
    care_instructions: '',
    companion_plants: [],
    lifespan: '',
    ideal_temperature: '',
    humidity_needs: '',
    characteristics: '',
    age: '',
    growth_time: '',
    harvest_time: '',
    yield_potential: '',
    disease_resistance: '',
    seasonal_preferences: '',
    propagation_methods: '',
    pruning_needs: '',
    soil_ph_preference: '',
    nutrient_requirements: '',
    special_features: ''
  });

  const CATEGORIES = [
    ['flower', 'Flower Plant'],
    ['vegetable', 'Vegetable Plant'],
    ['fruit', 'Fruit Plant']
  ];

  const SOIL_TYPES = [
    ['sandy', 'Sandy'],
    ['loamy', 'Loamy'],
    ['clay', 'Clay'],
    ['silt', 'Silt']
  ];

  const SUNLIGHT_OPTIONS = [
    ['full_sun', 'Full Sun'],
    ['partial_sun', 'Partial Sun'],
    ['shade', 'Shade']
  ];

  const WATERING_OPTIONS = [
    ['daily', 'Daily'],
    ['weekly', 'Weekly'],
    ['custom', 'Custom']
  ];

  useEffect(() => {
    if (id) {
      fetchPlantDetails();
    }
  }, [id]); // Removed fetchPlantDetails from dependency array

  const fetchPlantDetails = async () => {
    try {
      setLoading(true);
      const token = getAccessToken();
      const response = await axios.get(`${API_BASE_URL}/plants/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Raw plant data:', response.data);
      
      // Ensure arrays are properly initialized
      const plantData = {
        ...response.data,
        growth_stages: response.data.growth_stages || [],
        pests: response.data.pests || [],
        companion_plants: response.data.companion_plants || [],
      };

      // Log all fields to check what we're getting
      console.log('Plant fields:', {
        name: plantData.name,
        scientific_name: plantData.scientific_name,
        category: plantData.category,
        soil_type: plantData.soil_type,
        sunlight: plantData.sunlight,
        watering_schedule: plantData.watering_schedule,
        fertilization_needs: plantData.fertilization_needs,
        growth_stages: plantData.growth_stages,
        pests: plantData.pests,
        climate_suitability: plantData.climate_suitability,
        care_instructions: plantData.care_instructions,
        companion_plants: plantData.companion_plants,
        lifespan: plantData.lifespan,
        ideal_temperature: plantData.ideal_temperature,
        humidity_needs: plantData.humidity_needs,
        characteristics: plantData.characteristics,
        growth_time: plantData.growth_time,
        harvest_time: plantData.harvest_time,
        yield_potential: plantData.yield_potential,
        disease_resistance: plantData.disease_resistance,
        seasonal_preferences: plantData.seasonal_preferences,
        propagation_methods: plantData.propagation_methods,
        pruning_needs: plantData.pruning_needs,
        soil_ph_preference: plantData.soil_ph_preference,
        nutrient_requirements: plantData.nutrient_requirements,
        special_features: plantData.special_features
      });

      // Handle null values for text fields
      const textFields = [
        'name', 'scientific_name', 'category', 'soil_type', 'sunlight',
        'watering_schedule', 'climate_suitability', 'care_instructions',
        'lifespan', 'ideal_temperature', 'humidity_needs', 'characteristics',
        'growth_time', 'harvest_time', 'yield_potential', 'disease_resistance',
        'seasonal_preferences', 'propagation_methods', 'pruning_needs',
        'soil_ph_preference', 'nutrient_requirements', 'special_features'
      ];

      textFields.forEach(field => {
        if (plantData[field] === null || plantData[field] === undefined) {
          plantData[field] = '';
        }
      });

      // Handle boolean fields
      plantData.fertilization_needs = Boolean(plantData.fertilization_needs);

      setFormData(plantData);
      
      // If there's an existing image, set it for preview
      if (plantData.image && typeof plantData.image === 'string') {
        setImagePreview(plantData.image.startsWith('http') ? 
          plantData.image : `${API_BASE_URL}${plantData.image}`);
      }
    } catch (err) {
      console.error('Error fetching plant:', err);
      setError('Failed to load plant details: ' + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      const file = files[0];
      setFormData(prev => ({
        ...prev,
        [name]: file
      }));
      // Create preview URL for the image
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setImagePreview(null);
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleArrayInput = (e, field) => {
    const value = e.target.value;
    const arrayValue = value ? value.split(',').map(item => item.trim()).filter(Boolean) : [];
    setFormData(prev => ({
      ...prev,
      [field]: arrayValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate required fields
    const requiredFields = ['name', 'category', 'soil_type', 'sunlight', 'watering_schedule'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
      setLoading(false);
      return;
    }

    // Set default values for non-required fields
    const nonRequiredFields = [
      'scientific_name', 'climate_suitability', 'care_instructions', 'lifespan', 
      'ideal_temperature', 'humidity_needs', 'characteristics', 'growth_time', 
      'harvest_time', 'yield_potential', 'disease_resistance', 'seasonal_preferences', 
      'propagation_methods', 'pruning_needs', 'soil_ph_preference', 'nutrient_requirements', 
      'special_features'
    ];

    const updatedFormData = { ...formData };
    nonRequiredFields.forEach(field => {
      if (!updatedFormData[field]) {
        updatedFormData[field] = 'Non specified';
      }
    });

    try {
      const token = getAccessToken();
      const headers = { 
        Authorization: `Bearer ${token}`,
      };

      // Create FormData object to handle file upload
      const submitData = new FormData();
      for (const [key, value] of Object.entries(updatedFormData)) {
        if (key === 'growth_stages' || key === 'pests' || key === 'companion_plants') {
          // Ensure arrays are properly handled
          const arrayValue = Array.isArray(value) ? value : [];
          submitData.append(key, JSON.stringify(arrayValue));
        } else if (key === 'image') {
          // Only append image if it's a File object (new upload)
          if (value instanceof File) {
            submitData.append(key, value);
          }
          // If it's a string (existing image URL), don't append it
        } else if (value !== null && value !== undefined) {
          submitData.append(key, value);
        }
      }

      if (id) {
        await axios.put(`${API_BASE_URL}/plants/${id}/`, submitData, { 
          headers: {
            ...headers,
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        await axios.post(`${API_BASE_URL}/plants/`, submitData, { 
          headers: {
            ...headers,
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      
      navigate('/plants');
    } catch (err) {
      console.error('Error saving plant:', err);
      setError(err.response?.data?.detail || 'Failed to save plant');
    } finally {
      setLoading(false);
    }
  };

  if (loading && id) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="plant-form-container">
      <div className="form-header">
        <h2>{id ? 'Edit Plant' : 'Add New Plant'}</h2>
        <button className="back-button" onClick={() => navigate('/plants')}>
          Back to Plants
        </button>
      </div>

      <form onSubmit={handleSubmit} className="plant-form">
        {error && (
          <div className="error-message" style={{ color: 'red', marginBottom: '1rem', padding: '0.5rem' }}>
            {error}
          </div>
        )}
        <div className="form-section">
          <h3>Basic Information</h3>
          <div className="form-group">
            <label>Plant Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleInputChange}
              className="file-input"
            />
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" />
              </div>
            )}
            {!imagePreview && formData.image && typeof formData.image === 'string' && (
              <div className="image-preview">
                <img 
                  src={formData.image.startsWith('http') ? formData.image : `${API_BASE_URL}${formData.image}`} 
                  alt={formData.name} 
                />
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Plant Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Scientific Name</label>
            <input
              type="text"
              name="scientific_name"
              value={formData.scientific_name}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Category</option>
              {CATEGORIES.map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-section">
          <h3>Growing Conditions</h3>
          <div className="form-group">
            <label>Soil Type *</label>
            <select
              name="soil_type"
              value={formData.soil_type}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Soil Type</option>
              {SOIL_TYPES.map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Sunlight Needs *</label>
            <select
              name="sunlight"
              value={formData.sunlight}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Sunlight Needs</option>
              {SUNLIGHT_OPTIONS.map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Watering Schedule *</label>
            <select
              name="watering_schedule"
              value={formData.watering_schedule}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Watering Schedule</option>
              {WATERING_OPTIONS.map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="fertilization_needs"
                checked={formData.fertilization_needs}
                onChange={handleInputChange}
              />
              Requires Fertilization
            </label>
          </div>

          <div className="form-group">
            <label>Ideal Temperature Range</label>
            <input
              type="text"
              name="ideal_temperature"
              value={formData.ideal_temperature}
              onChange={handleInputChange}
              placeholder="e.g., 20-30°C"
            />
          </div>

          <div className="form-group">
            <label>Humidity Needs</label>
            <input
              type="text"
              name="humidity_needs"
              value={formData.humidity_needs}
              onChange={handleInputChange}
              placeholder="e.g., 40-60%"
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Growth Information</h3>
          <div className="form-group">
            <label>Growth Stages (comma-separated)</label>
            <input
              type="text"
              value={Array.isArray(formData.growth_stages) ? formData.growth_stages.join(', ') : ''}
              onChange={(e) => handleArrayInput(e, 'growth_stages')}
              placeholder="e.g., Seedling, Vegetative, Flowering"
            />
          </div>

          <div className="form-group">
            <label>Common Pests (comma-separated)</label>
            <input
              type="text"
              value={Array.isArray(formData.pests) ? formData.pests.join(', ') : ''}
              onChange={(e) => handleArrayInput(e, 'pests')}
              placeholder="e.g., Aphids, Spider Mites"
            />
          </div>

          <div className="form-group">
            <label>Companion Plants (comma-separated)</label>
            <input
              type="text"
              value={Array.isArray(formData.companion_plants) ? formData.companion_plants.join(', ') : ''}
              onChange={(e) => handleArrayInput(e, 'companion_plants')}
              placeholder="e.g., Basil, Marigold"
            />
          </div>

          <div className="form-group">
            <label>Lifespan</label>
            <input
              type="text"
              name="lifespan"
              value={formData.lifespan}
              onChange={handleInputChange}
              placeholder="e.g., Annual, Perennial, 2-3 years"
            />
          </div>

          <div className="form-group">
            <label>Growth Time</label>
            <input
              type="text"
              name="growth_time"
              value={formData.growth_time}
              onChange={handleInputChange}
              placeholder="e.g., 60-90 days"
            />
          </div>

          <div className="form-group">
            <label>Harvest Time</label>
            <input
              type="text"
              name="harvest_time"
              value={formData.harvest_time}
              onChange={handleInputChange}
              placeholder="e.g., Fall, 3 months after planting"
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Care Information</h3>
          <div className="form-group">
            <label>Climate Suitability</label>
            <input
              type="text"
              name="climate_suitability"
              value={formData.climate_suitability}
              onChange={handleInputChange}
              placeholder="e.g., Tropical, Mediterranean"
            />
          </div>

          <div className="form-group">
            <label>Care Instructions</label>
            <textarea
              name="care_instructions"
              value={formData.care_instructions}
              onChange={handleInputChange}
              rows="4"
              placeholder="Detailed care instructions..."
            />
          </div>

          <div className="form-group">
            <label>Disease Resistance</label>
            <input
              type="text"
              name="disease_resistance"
              value={formData.disease_resistance}
              onChange={handleInputChange}
              placeholder="e.g., High resistance to powdery mildew"
            />
          </div>

          <div className="form-group">
            <label>Pruning Needs</label>
            <input
              type="text"
              name="pruning_needs"
              value={formData.pruning_needs}
              onChange={handleInputChange}
              placeholder="e.g., Regular deadheading needed"
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Additional Information</h3>
          <div className="form-group">
            <label>Characteristics</label>
            <textarea
              name="characteristics"
              value={formData.characteristics}
              onChange={handleInputChange}
              rows="3"
              placeholder="Special characteristics or features..."
            />
          </div>

          <div className="form-group">
            <label>Yield Potential</label>
            <input
              type="text"
              name="yield_potential"
              value={formData.yield_potential}
              onChange={handleInputChange}
              placeholder="e.g., 5-7 kg per plant"
            />
          </div>

          <div className="form-group">
            <label>Seasonal Preferences</label>
            <input
              type="text"
              name="seasonal_preferences"
              value={formData.seasonal_preferences}
              onChange={handleInputChange}
              placeholder="e.g., Spring planting, Summer blooming"
            />
          </div>

          <div className="form-group">
            <label>Propagation Methods</label>
            <input
              type="text"
              name="propagation_methods"
              value={formData.propagation_methods}
              onChange={handleInputChange}
              placeholder="e.g., Seeds, Cuttings"
            />
          </div>

          <div className="form-group">
            <label>Soil pH Preference</label>
            <input
              type="text"
              name="soil_ph_preference"
              value={formData.soil_ph_preference}
              onChange={handleInputChange}
              placeholder="e.g., 6.0-7.0"
            />
          </div>

          <div className="form-group">
            <label>Nutrient Requirements</label>
            <input
              type="text"
              name="nutrient_requirements"
              value={formData.nutrient_requirements}
              onChange={handleInputChange}
              placeholder="e.g., High nitrogen feeder"
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/plants')} className="cancel-button">
            Cancel
          </button>
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Saving...' : (id ? 'Update Plant' : 'Add Plant')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PlantForm;

