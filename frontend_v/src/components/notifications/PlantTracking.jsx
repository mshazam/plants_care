import React, { useState, useEffect } from 'react';
import './PlantTracking.css';
import { 
  getTrackedPlants, addTrackedPlant, updateTrackedPlant, deleteTrackedPlant,
  getPlantReminders, addPlantReminder, updatePlantReminder, deletePlantReminder,
  getUpcomingReminders
} from '../../services/api';

const PlantTracking = ({ userData }) => {
  const [plants, setPlants] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [upcomingReminders, setUpcomingReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newPlant, setNewPlant] = useState({
    name: '',
    species: '',
    acquisition_date: '',
    health_status: 'healthy',
    growth_stage: 'seedling',
    notes: '',
    last_watered: '',
    last_fertilized: '',
  });
  const [newReminder, setNewReminder] = useState({
    title: '',
    description: '',
    due_date: '',
    tracked_plant: '',
    completed: false
  });
  const [showPlantForm, setShowPlantForm] = useState(false);
  const [showReminderForm, setShowReminderForm] = useState(false);

  // Fetch plants and reminders from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch tracked plants
        const plantsData = await getTrackedPlants();
        setPlants(plantsData);
        
        // Fetch all reminders
        const remindersData = await getPlantReminders();
        setReminders(remindersData);
        
        // Fetch upcoming reminders
        const upcomingData = await getUpcomingReminders();
        setUpcomingReminders(upcomingData);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching plant tracking data:', err);
        setError('Failed to load plant tracking data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handlePlantInputChange = (e) => {
    const { name, value } = e.target;
    setNewPlant(prev => ({ ...prev, [name]: value }));
  };

  const handleReminderInputChange = (e) => {
    const { name, value } = e.target;
    setNewReminder(prev => ({ ...prev, [name]: value }));
  };

  const addPlant = async (e) => {
    e.preventDefault();
    
    if (!newPlant.name || !newPlant.species) {
      setError('Plant name and species are required');
      return;
    }
    
    try {
      setLoading(true);
      
      // Prepare plant data with default values for required fields
      const plantData = {
        ...newPlant,
        acquisition_date: newPlant.acquisition_date || new Date().toISOString().split('T')[0],
        health_status: newPlant.health_status || 'healthy',
        growth_stage: newPlant.growth_stage || 'seedling'
      };
      
      // Add plant to database
      await addTrackedPlant(plantData);
      
      // Fetch all plants again to ensure we have the latest data
      const plantsData = await getTrackedPlants();
      setPlants(plantsData);
      
      // Reset form
      setNewPlant({
        name: '',
        species: '',
        acquisition_date: new Date().toISOString().split('T')[0],
        health_status: 'healthy',
        growth_stage: 'seedling',
        notes: ''
      });
      
      // Hide form
      setShowPlantForm(false);
      setLoading(false);
    } catch (err) {
      console.error('Error adding plant:', err);
      setError('Failed to add plant. Please try again.');
      setLoading(false);
    }
  };

  const addReminder = async (e) => {
    e.preventDefault();
    
    if (!newReminder.title || !newReminder.due_date || !newReminder.tracked_plant) {
      setError('Reminder title, due date, and plant are required');
      return;
    }
    
    try {
      setLoading(true);
      
      // Add reminder to database
      await addPlantReminder(newReminder);
      
      // Fetch all reminders again to ensure we have the latest data
      const remindersData = await getPlantReminders();
      setReminders(remindersData);
      
      // Fetch upcoming reminders again
      const upcomingData = await getUpcomingReminders();
      setUpcomingReminders(upcomingData);
      
      // Reset form
      setNewReminder({
        title: '',
        description: '',
        due_date: '',
        tracked_plant: '',
        completed: false
      });
      
      // Hide form
      setShowReminderForm(false);
      setLoading(false);
    } catch (err) {
      console.error('Error adding reminder:', err);
      setError('Failed to add reminder. Please try again.');
      setLoading(false);
    }
  };

  const updatePlantStatus = async (id, field, value) => {
    try {
      // Update plant in database
      const updateData = {};
      
      // Handle different types of updates
      if (field === 'last_watered' || field === 'last_fertilized') {
        // For watering and fertilizing, set the date to today
        updateData[field] = new Date().toISOString().split('T')[0];
      } else {
        // For other fields like health_status and growth_stage, use the provided value
        updateData[field] = value;
      }
      
      await updateTrackedPlant(id, updateData);
      
      // Fetch all plants again to ensure we have the latest data
      const plantsData = await getTrackedPlants();
      setPlants(plantsData);
    } catch (err) {
      console.error('Error updating plant:', err);
      setError('Failed to update plant. Please try again.');
    }
  };

  const toggleReminderComplete = async (id, currentStatus) => {
    try {
      // Update reminder in database
      await updatePlantReminder(id, { completed: !currentStatus });
      
      // Fetch all reminders again to ensure we have the latest data
      const remindersData = await getPlantReminders();
      setReminders(remindersData);
      
      // Fetch upcoming reminders again
      const upcomingData = await getUpcomingReminders();
      setUpcomingReminders(upcomingData);
    } catch (err) {
      console.error('Error toggling reminder completion:', err);
      setError('Failed to update reminder. Please try again.');
    }
  };

  const deletePlant = async (id) => {
    try {
      // Delete plant from database
      await deleteTrackedPlant(id);
      
      // Fetch all plants again to ensure we have the latest data
      const plantsData = await getTrackedPlants();
      setPlants(plantsData);
      
      // Fetch all reminders again to ensure we have the latest data
      const remindersData = await getPlantReminders();
      setReminders(remindersData);
      
      // Fetch upcoming reminders again
      const upcomingData = await getUpcomingReminders();
      setUpcomingReminders(upcomingData);
    } catch (err) {
      console.error('Error deleting plant:', err);
      setError('Failed to delete plant. Please try again.');
    }
  };

  const deleteReminder = async (id) => {
    try {
      // Delete reminder from database
      await deletePlantReminder(id);
      
      // Fetch all reminders again to ensure we have the latest data
      const remindersData = await getPlantReminders();
      setReminders(remindersData);
      
      // Fetch upcoming reminders again
      const upcomingData = await getUpcomingReminders();
      setUpcomingReminders(upcomingData);
    } catch (err) {
      console.error('Error deleting reminder:', err);
      setError('Failed to delete reminder. Please try again.');
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return <div className="loading">Loading plant tracking data...</div>;
  }

  if (error) {
    return (
      <div className="error-message">
        {error}
        <button onClick={() => window.location.reload()} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="plant-tracking-container">
      <div className="intro-section">
        <h3>Plant Tracking and Monitoring</h3>
        <p>
          Keep track of your plants' growth, set reminders for care tasks, 
          and record observations to ensure your garden thrives.
        </p>
      </div>

      <div className="tracking-sections">
        <div className="tracked-plants-section">
          <div className="section-header">
            <h4>My Plants</h4>
            <button 
              className="add-button"
              onClick={() => setShowPlantForm(!showPlantForm)}
            >
              {showPlantForm ? 'Cancel' : '+ Add Plant'}
            </button>
          </div>

          {showPlantForm && (
            <form className="add-form" onSubmit={addPlant}>
              <div className="form-group">
                <label htmlFor="name">Plant Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newPlant.name}
                  onChange={handlePlantInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="species">Plant Species</label>
                <input
                  type="text"
                  id="species"
                  name="species"
                  value={newPlant.species}
                  onChange={handlePlantInputChange}
                  placeholder="e.g., Tomato, Rose, Succulent"
                />
              </div>
              <div className="form-group">
                <label htmlFor="acquisition_date">Acquisition Date</label>
                <input
                  type="date"
                  id="acquisition_date"
                  name="acquisition_date"
                  value={newPlant.acquisition_date}
                  onChange={handlePlantInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="notes">Notes</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={newPlant.notes}
                  onChange={handlePlantInputChange}
                  placeholder="Any initial observations or special care needs"
                ></textarea>
              </div>
              <div className="form-actions">
                <button type="submit" className="submit-button">Add Plant</button>
              </div>
            </form>
          )}

          <div className="plants-list">
            {plants.length === 0 ? (
              <p className="empty-message">No plants added yet. Add your first plant to start tracking!</p>
            ) : (
              plants.map(plant => (
                <div key={plant.id} className="plant-card">
                  <div className="plant-header">
                    <h5>{plant.name}</h5>
                    <span className={`health-status ${plant.health_status.toLowerCase()}`}>
                      {plant.health_status}
                    </span>
                  </div>
                  <div className="plant-details">
                    <p><strong>Species:</strong> {plant.species || 'Not specified'}</p>
                    <p><strong>Acquired:</strong> {formatDate(plant.acquisition_date)}</p>
                    <p><strong>Last Watered:</strong> {formatDate(plant.last_watered)}</p>
                    <p><strong>Last Fertilized:</strong> {formatDate(plant.last_fertilized)}</p>
                    <p><strong>Growth Stage:</strong> {plant.growth_stage}</p>
                    {plant.notes && <p><strong>Notes:</strong> {plant.notes}</p>}
                  </div>
                  <div className="plant-actions">
                    <button 
                      onClick={() => updatePlantStatus(plant.id, 'last_watered', plant.last_watered)}
                      className="action-button water"
                    >
                      💧 Water
                    </button>
                    <button 
                      onClick={() => updatePlantStatus(plant.id, 'last_fertilized', plant.last_fertilized)}
                      className="action-button fertilize"
                    >
                      🌱 Fertilize
                    </button>
                    <select 
                      value={plant.health_status}
                      onChange={(e) => updatePlantStatus(plant.id, 'health_status', e.target.value)}
                      className="health-select"
                    >
                      <option value="Excellent">Excellent</option>
                      <option value="Good">Good</option>
                      <option value="Fair">Fair</option>
                      <option value="Poor">Poor</option>
                    </select>
                    <select 
                      value={plant.growth_stage}
                      onChange={(e) => updatePlantStatus(plant.id, 'growth_stage', e.target.value)}
                      className="stage-select"
                    >
                      <option value="Seedling">Seedling</option>
                      <option value="Vegetative">Vegetative</option>
                      <option value="Flowering">Flowering</option>
                      <option value="Fruiting">Fruiting</option>
                      <option value="Mature">Mature</option>
                    </select>
                    <button 
                      onClick={() => deletePlant(plant.id)}
                      className="action-button delete"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="reminders-section">
          <div className="section-header">
            <h4>Care Reminders</h4>
            <button 
              className="add-button"
              onClick={() => setShowReminderForm(!showReminderForm)}
              disabled={plants.length === 0}
            >
              {showReminderForm ? 'Cancel' : '+ Add Reminder'}
            </button>
          </div>

          {showReminderForm && (
            <form onSubmit={addReminder} className="add-form">
              <div className="form-group">
                <label htmlFor="title">Reminder Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newReminder.title}
                  onChange={handleReminderInputChange}
                  placeholder="e.g., Water Plant, Fertilize, Repot"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description (Optional)</label>
                <textarea
                  id="description"
                  name="description"
                  value={newReminder.description}
                  onChange={handleReminderInputChange}
                  placeholder="Additional details about this reminder"
                />
              </div>
              <div className="form-group">
                <label htmlFor="tracked_plant">Plant</label>
                <select
                  id="tracked_plant"
                  name="tracked_plant"
                  value={newReminder.tracked_plant}
                  onChange={handleReminderInputChange}
                  required
                >
                  <option value="">Select a plant</option>
                  {plants.map(plant => (
                    <option key={plant.id} value={plant.id}>{plant.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="due_date">Due Date</label>
                <input
                  type="date"
                  id="due_date"
                  name="due_date"
                  value={newReminder.due_date}
                  onChange={handleReminderInputChange}
                  required
                />
              </div>
              <button type="submit" className="submit-button">Add Reminder</button>
            </form>
          )}

          <div className="reminders-list">
            {reminders.length === 0 ? (
              <p className="no-items">No reminders added yet.</p>
            ) : (
              reminders.map(reminder => {
                const plant = plants.find(p => p.id === reminder.tracked_plant);
                return (
                  <div key={reminder.id} className={`reminder-item ${reminder.completed ? 'completed' : ''}`}>
                    <div className="reminder-header">
                      <h4>{reminder.title}</h4>
                      <div className="reminder-actions">
                        <button 
                          onClick={() => toggleReminderComplete(reminder.id, reminder.completed)}
                          className="action-button toggle"
                        >
                          {reminder.completed ? '↩️ Undo' : '✅ Complete'}
                        </button>
                        <button 
                          onClick={() => deleteReminder(reminder.id)}
                          className="action-button delete"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                    <div className="reminder-details">
                      <p><strong>Plant:</strong> {plant ? plant.name : 'Unknown plant'}</p>
                      <p><strong>Due Date:</strong> {formatDate(reminder.due_date)}</p>
                      {reminder.description && <p><strong>Description:</strong> {reminder.description}</p>}
                      <p><strong>Status:</strong> {reminder.completed ? 'Completed' : 'Pending'}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <div className="upcoming-reminders">
        <h3>Upcoming Reminders</h3>
        {upcomingReminders.length === 0 ? (
          <p className="no-items">No upcoming reminders for the next week.</p>
        ) : (
          upcomingReminders.map(reminder => {
            const plant = plants.find(p => p.id === reminder.tracked_plant);
            return (
              <div key={reminder.id} className="upcoming-reminder-item">
                <div className="reminder-header">
                  <h4>{reminder.title}</h4>
                  <span className="due-date">{formatDate(reminder.due_date)}</span>
                </div>
                <p><strong>Plant:</strong> {plant ? plant.name : 'Unknown plant'}</p>
                {reminder.description && <p><strong>Description:</strong> {reminder.description}</p>}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default PlantTracking; 