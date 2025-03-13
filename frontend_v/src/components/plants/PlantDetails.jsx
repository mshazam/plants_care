import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './PlantDetails.css';
import { getPlantById } from '../../services/api';

const PlantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPlantDetails = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getPlantById(id);
      setPlant(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching plant details:', err);
      setError('Failed to load plant details. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPlantDetails();
  }, [fetchPlantDetails]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!plant) return <div className="error">Plant not found</div>;

  return (
    <div className="plant-details-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Back to Plant Database
      </button>

      <div className="plant-header">
        <h1>{plant.name}</h1>
        {plant.scientific_name && (
          <h2 className="scientific-name"><em>{plant.scientific_name}</em></h2>
        )}
      </div>

      <div className="plant-content">
        <div className="plant-section">
          <h3>Basic Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <strong>Category:</strong>
              <span>{plant.category}</span>
            </div>
            <div className="info-item">
              <strong>Soil Type:</strong>
              <span>{plant.soil_type}</span>
            </div>
            <div className="info-item">
              <strong>Sunlight Needs:</strong>
              <span>{plant.sunlight}</span>
            </div>
            <div className="info-item">
              <strong>Watering Schedule:</strong>
              <span>{plant.watering_schedule}</span>
            </div>
            <div className="info-item">
              <strong>Lifespan:</strong>
              <span>{plant.lifespan || 'Not specified'}</span>
            </div>
            <div className="info-item">
              <strong>Fertilization Needs:</strong>
              <span>{plant.fertilization_needs ? 'Yes' : 'No'}</span>
            </div>
          </div>
        </div>

        <div className="plant-section">
          <h3>Climate Requirements</h3>
          <div className="info-grid">
            <div className="info-item">
              <strong>Ideal Temperature:</strong>
              <span>{plant.ideal_temperature || 'Not specified'}</span>
            </div>
            <div className="info-item">
              <strong>Humidity Needs:</strong>
              <span>{plant.humidity_needs || 'Not specified'}</span>
            </div>
            <div className="info-item">
              <strong>Climate Suitability:</strong>
              <span>{plant.climate_suitability || 'Not specified'}</span>
            </div>
            <div className="info-item">
              <strong>Soil pH Preference:</strong>
              <span>{plant.soil_ph_preference || 'Not specified'}</span>
            </div>
            <div className="info-item">
              <strong>Nutrient Requirements:</strong>
              <span>{plant.nutrient_requirements || 'Not specified'}</span>
            </div>
          </div>
        </div>

        <div className="plant-section">
          <h3>Growth Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <strong>Growth Time:</strong>
              <span>{plant.growth_time || 'Not specified'}</span>
            </div>
            <div className="info-item">
              <strong>Harvest Time:</strong>
              <span>{plant.harvest_time || 'Not specified'}</span>
            </div>
            <div className="info-item">
              <strong>Yield Potential:</strong>
              <span>{plant.yield_potential || 'Not specified'}</span>
            </div>
            <div className="info-item">
              <strong>Propagation Methods:</strong>
              <span>{plant.propagation_methods || 'Not specified'}</span>
            </div>
          </div>
        </div>

        {plant.growth_stages && plant.growth_stages.length > 0 && (
          <div className="plant-section">
            <h3>Growth Stages</h3>
            <ul className="growth-stages">
              {plant.growth_stages.map((stage, index) => (
                <li key={index}>{stage}</li>
              ))}
            </ul>
          </div>
        )}

        {plant.care_instructions && (
          <div className="plant-section">
            <h3>Care Instructions</h3>
            <div className="care-instructions">
              {plant.care_instructions.split('\n').map((instruction, index) => (
                <p key={index}>{instruction}</p>
              ))}
            </div>
          </div>
        )}

        <div className="plant-section">
          <h3>Disease & Pest Management</h3>
          <div className="info-grid">
            <div className="info-item">
              <strong>Disease Resistance:</strong>
              <span>{plant.disease_resistance || 'Not specified'}</span>
            </div>
            <div className="info-item">
              <strong>Pruning Needs:</strong>
              <span>{plant.pruning_needs || 'Not specified'}</span>
            </div>
          </div>
          {plant.pests && plant.pests.length > 0 && (
            <div className="pest-info">
              <h4>Common Pests:</h4>
              <ul>
                {plant.pests.map((pest, index) => (
                  <li key={index}>{pest}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {plant.companion_plants && plant.companion_plants.length > 0 && (
          <div className="plant-section">
            <h3>Companion Plants</h3>
            <ul className="companion-plants">
              {plant.companion_plants.map((companion, index) => (
                <li key={index}>{companion}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="plant-section">
          <h3>Additional Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <strong>Characteristics:</strong>
              <span>{plant.characteristics || 'Not specified'}</span>
            </div>
            <div className="info-item">
              <strong>Seasonal Preferences:</strong>
              <span>{plant.seasonal_preferences || 'Not specified'}</span>
            </div>
            {plant.special_features && (
              <div className="info-item">
                <strong>Special Features:</strong>
                <span>{plant.special_features}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantDetails; 