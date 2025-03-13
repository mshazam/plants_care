import React, { useState, useEffect } from 'react';
import './PlantCareRecommendations.css';

const PlantCareRecommendations = ({ userData }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching recommendations based on user data
    const generateRecommendations = () => {
      setLoading(true);
      
      // Get user's climate and soil data
      const climate = userData?.climate_zone || 'Temperate';
      const soilType = userData?.soil_type || 'Loamy';
      const location = userData?.location || 'Unknown';
      
      // Generate personalized recommendations
      const personalizedRecommendations = [
        {
          id: 1,
          title: 'Watering Schedule',
          description: `Based on your ${climate} climate and ${soilType} soil, we recommend the following watering schedule:`,
          details: getWateringRecommendation(climate, soilType),
          icon: '💧'
        },
        {
          id: 2,
          title: 'Fertilization Plan',
          description: `For optimal plant growth in ${soilType} soil and ${climate} climate:`,
          details: getFertilizationRecommendation(climate, soilType),
          icon: '🌱'
        },
        {
          id: 3,
          title: 'Pest Control Measures',
          description: `Common pests in ${location} and how to manage them:`,
          details: getPestControlRecommendation(climate, location),
          icon: '🐛'
        },
        {
          id: 4,
          title: 'Seasonal Care Tips',
          description: `Seasonal care tips for your garden in ${climate} climate:`,
          details: getSeasonalCareTips(climate),
          icon: '🌡️'
        }
      ];
      
      setRecommendations(personalizedRecommendations);
      setLoading(false);
    };
    
    if (userData) {
      generateRecommendations();
    }
  }, [userData]);

  // Helper functions to generate recommendations based on user data
  const getWateringRecommendation = (climate, soilType) => {
    let recommendation = [];
    
    if (climate === 'Tropical' || climate === 'Subtropical') {
      recommendation.push('Water most plants 2-3 times per week during dry periods');
      recommendation.push('Reduce watering during rainy seasons');
    } else if (climate === 'Mediterranean' || climate === 'Temperate') {
      recommendation.push('Water deeply once or twice a week during growing season');
      recommendation.push('Reduce watering in fall and winter');
    } else if (climate === 'Arid' || climate === 'Desert') {
      recommendation.push('Water deeply but infrequently (once every 7-10 days)');
      recommendation.push('Consider drip irrigation to minimize water loss');
    } else {
      recommendation.push('Water when the top inch of soil feels dry');
      recommendation.push('Adjust frequency based on temperature and rainfall');
    }
    
    if (soilType === 'Sandy') {
      recommendation.push('Sandy soil drains quickly, so water more frequently but in smaller amounts');
    } else if (soilType === 'Clay') {
      recommendation.push('Clay soil retains water, so water less frequently but deeply');
    } else if (soilType === 'Loamy') {
      recommendation.push('Loamy soil has good water retention, maintain consistent moisture');
    }
    
    return recommendation;
  };
  
  const getFertilizationRecommendation = (climate, soilType) => {
    let recommendation = [];
    
    if (climate === 'Tropical' || climate === 'Subtropical') {
      recommendation.push('Apply balanced fertilizer every 4-6 weeks during growing season');
      recommendation.push('Use slow-release fertilizers to prevent nutrient leaching in heavy rains');
    } else if (climate === 'Mediterranean' || climate === 'Temperate') {
      recommendation.push('Apply balanced fertilizer in spring and mid-summer');
      recommendation.push('Consider compost application in fall to prepare for next season');
    } else if (climate === 'Arid' || climate === 'Desert') {
      recommendation.push('Use low-nitrogen fertilizers to prevent excessive growth and water needs');
      recommendation.push('Apply fertilizer in early morning or evening to prevent burning');
    } else {
      recommendation.push('Apply balanced fertilizer according to plant needs');
      recommendation.push('Follow package instructions for application rates');
    }
    
    if (soilType === 'Sandy') {
      recommendation.push('Use slow-release fertilizers as nutrients leach quickly from sandy soil');
    } else if (soilType === 'Clay') {
      recommendation.push('Avoid over-fertilizing clay soils as nutrients tend to accumulate');
    } else if (soilType === 'Loamy') {
      recommendation.push('Standard fertilization schedules work well with loamy soil');
    }
    
    return recommendation;
  };
  
  const getPestControlRecommendation = (climate, location) => {
    let recommendation = [];
    
    if (climate === 'Tropical' || climate === 'Subtropical') {
      recommendation.push('Monitor for aphids, mealybugs, and fungal diseases due to high humidity');
      recommendation.push('Use neem oil spray preventatively during humid periods');
    } else if (climate === 'Mediterranean' || climate === 'Temperate') {
      recommendation.push('Watch for slugs, snails, and caterpillars in spring and summer');
      recommendation.push('Use diatomaceous earth around vulnerable plants');
    } else if (climate === 'Arid' || climate === 'Desert') {
      recommendation.push('Monitor for spider mites and scale insects which thrive in dry conditions');
      recommendation.push('Regularly spray plants with water to discourage spider mites');
    } else {
      recommendation.push('Inspect plants regularly for signs of pest damage');
      recommendation.push('Consider introducing beneficial insects like ladybugs and lacewings');
    }
    
    recommendation.push('Practice crop rotation and companion planting to naturally deter pests');
    recommendation.push('Remove affected plant parts promptly to prevent spread of pests and diseases');
    
    return recommendation;
  };
  
  const getSeasonalCareTips = (climate) => {
    let recommendation = [];
    
    if (climate === 'Tropical' || climate === 'Subtropical') {
      recommendation.push('Spring: Prepare for rainy season by improving drainage');
      recommendation.push('Summer: Provide shade for sensitive plants during peak heat');
      recommendation.push('Fall: Plant cool-season crops as temperatures moderate');
      recommendation.push('Winter: Protect sensitive plants from occasional cold snaps');
    } else if (climate === 'Mediterranean' || climate === 'Temperate') {
      recommendation.push('Spring: Prune winter damage and prepare soil for new plantings');
      recommendation.push('Summer: Mulch to conserve moisture during dry periods');
      recommendation.push('Fall: Clean up garden debris to prevent overwintering pests');
      recommendation.push('Winter: Protect perennials with mulch and consider frost cloths');
    } else if (climate === 'Arid' || climate === 'Desert') {
      recommendation.push('Spring: Plant heat-tolerant varieties before summer heat');
      recommendation.push('Summer: Provide afternoon shade and increase watering frequency');
      recommendation.push('Fall: Ideal planting season for many plants as temperatures cool');
      recommendation.push('Winter: Protect sensitive plants from frost on cold nights');
    } else {
      recommendation.push('Spring: Prepare soil and plant after last frost date');
      recommendation.push('Summer: Monitor water needs during hot periods');
      recommendation.push('Fall: Clean up garden and prepare for winter');
      recommendation.push('Winter: Plan for next season and maintain tools');
    }
    
    return recommendation;
  };

  if (loading) {
    return <div className="loading">Generating personalized recommendations...</div>;
  }

  return (
    <div className="recommendations-container">
      <div className="intro-section">
        <h3>Personalized Plant Care Recommendations</h3>
        <p>
          Based on your profile information (location, climate, soil type), 
          we've generated the following personalized recommendations to help 
          your plants thrive.
        </p>
      </div>

      <div className="recommendations-list">
        {recommendations.map(recommendation => (
          <div key={recommendation.id} className="recommendation-card">
            <div className="recommendation-header">
              <span className="recommendation-icon">{recommendation.icon}</span>
              <h4>{recommendation.title}</h4>
            </div>
            <p className="recommendation-description">{recommendation.description}</p>
            <ul className="recommendation-details">
              {recommendation.details.map((detail, index) => (
                <li key={index}>{detail}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="disclaimer">
        <p>
          <strong>Note:</strong> These recommendations are generated based on the information 
          in your profile. For more specific advice, consider consulting with a local gardening 
          expert or agricultural extension service.
        </p>
      </div>
    </div>
  );
};

export default PlantCareRecommendations; 