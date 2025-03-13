from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = [
        ('Gardener', 'Gardener'),
        ('Supervisor', 'Supervisor'),
        ('Homeowner', 'Homeowner'),
        ('System Admin', 'System Admin'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='Homeowner')

    groups = models.ManyToManyField(Group, related_name="custom_user_groups", blank=True)
    user_permissions = models.ManyToManyField(Permission, related_name="custom_user_permissions", blank=True)

    def __str__(self):
        return self.username

class UserProfile(models.Model):
    # Basic Information
    user = models.OneToOneField('api.User', on_delete=models.CASCADE)
    full_name = models.CharField(max_length=255, blank=True)
    phone_number = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    
    # Climate Information
    average_temperature = models.CharField(max_length=50, blank=True)  # e.g., "20-25°C"
    average_humidity = models.CharField(max_length=50, blank=True)     # e.g., "60-70%"
    annual_rainfall = models.CharField(max_length=50, blank=True)      # e.g., "800-1000mm"
    climate_zone = models.CharField(max_length=100, blank=True)        # e.g., "Tropical", "Mediterranean"
    
    # General Gardening Preferences
    preferred_plant_types = models.JSONField(default=list, blank=True)  # List of plant types (Flowers, Vegetables, Fruits)
    location = models.CharField(max_length=255, blank=True)  # City/Region
    zip_code = models.CharField(max_length=10, blank=True)
    soil_type = models.CharField(max_length=50, blank=True)  # Sandy, Loamy, Clay, Silt
    skill_level = models.CharField(max_length=50, blank=True)  # Beginner, Intermediate, Expert
    watering_frequency = models.CharField(max_length=50, blank=True)  # Daily, Weekly, Custom
    maintenance_reminders = models.BooleanField(default=False)
    pest_alerts = models.BooleanField(default=False)
    disease_alerts = models.BooleanField(default=False)
    community_notifications = models.BooleanField(default=True)
    
    # Existing fields
    gardening_preferences = models.TextField(blank=True)
    
    # Gardener specific fields
    experience_level = models.CharField(max_length=50, blank=True)
    specialization = models.CharField(max_length=100, blank=True)
    availability = models.CharField(max_length=50, blank=True)
    service_area = models.CharField(max_length=255, blank=True)
    certifications = models.TextField(blank=True)
    
    # Supervisor specific fields
    work_experience = models.IntegerField(null=True, blank=True)
    managed_projects = models.TextField(blank=True)
    responsibilities = models.TextField(blank=True)
    
    # Homeowner specific fields
    property_type = models.CharField(max_length=50, blank=True)
    garden_size = models.CharField(max_length=50, blank=True)
    preferred_plants = models.TextField(blank=True)
    organic_fertilizer = models.BooleanField(default=False)
    plant_tracking = models.CharField(max_length=50, blank=True)  # Manual or AI-based
    
    # Admin specific fields
    admin_level = models.CharField(max_length=50, blank=True)
    assigned_responsibilities = models.TextField(blank=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"

class Plant(models.Model):
    CATEGORY_CHOICES = [
        ('flower', 'Flower Plant'),
        ('vegetable', 'Vegetable Plant'),
        ('fruit', 'Fruit Plant'),
    ]
    
    SOIL_TYPES = [
        ('sandy', 'Sandy'),
        ('loamy', 'Loamy'),
        ('clay', 'Clay'),
        ('silt', 'Silt'),
    ]

    SUNLIGHT_CHOICES = [
        ('full_sun', 'Full Sun'),
        ('partial_sun', 'Partial Sun'),
        ('shade', 'Shade'),
    ]

    WATERING_CHOICES = [
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('custom', 'Custom'),
    ]

    name = models.CharField(max_length=100)
    image = models.ImageField(upload_to='plant_images/', null=True, blank=True)
    scientific_name = models.CharField(max_length=150, blank=True, null=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    soil_type = models.CharField(max_length=20, choices=SOIL_TYPES)
    sunlight = models.CharField(max_length=50, choices=SUNLIGHT_CHOICES)
    watering_schedule = models.CharField(max_length=20, choices=WATERING_CHOICES)
    fertilization_needs = models.BooleanField(default=True)
    growth_stages = models.JSONField(default=list)  # ["Seedling", "Vegetative", "Flowering"]
    pests = models.JSONField(default=list)  # List of common pests
    climate_suitability = models.CharField(max_length=255)
    care_instructions = models.TextField()
    companion_plants = models.JSONField(default=list)  # List of companion plants
    lifespan = models.CharField(max_length=100)  # e.g., "Annual", "Perennial", "2-3 years"
    ideal_temperature = models.CharField(max_length=100)  # e.g., "20-30°C"
    humidity_needs = models.CharField(max_length=100)  # e.g., "40-60%"
    
    # New fields
    characteristics = models.TextField(blank=True, null=True)
    growth_time = models.CharField(max_length=100, blank=True, null=True)  # e.g., "60-90 days"
    harvest_time = models.CharField(max_length=100, blank=True, null=True)  # e.g., "Fall", "3 months after planting"
    yield_potential = models.CharField(max_length=100, blank=True, null=True)  # e.g., "5-7 kg per plant"
    disease_resistance = models.CharField(max_length=50, blank=True, null=True)  # High, Medium, Low
    seasonal_preferences = models.CharField(max_length=100, blank=True, null=True)
    propagation_methods = models.CharField(max_length=255, blank=True, null=True)
    pruning_needs = models.CharField(max_length=255, blank=True, null=True)
    soil_ph_preference = models.CharField(max_length=100, blank=True, null=True)
    nutrient_requirements = models.CharField(max_length=50, blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.get_category_display()})"

    class Meta:
        ordering = ['name']

# New models for plant tracking
class TrackedPlant(models.Model):
    user = models.ForeignKey('api.User', on_delete=models.CASCADE, related_name='tracked_plants')
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=100, blank=True, null=True)
    planted_date = models.DateField()
    last_watered = models.DateField()
    last_fertilized = models.DateField()
    notes = models.TextField(blank=True, null=True)
    health_status = models.CharField(max_length=20, default='Good')  # Excellent, Good, Fair, Poor
    growth_stage = models.CharField(max_length=20, default='Seedling')  # Seedling, Vegetative, Flowering, Fruiting, Mature
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.user.username}"

class PlantReminder(models.Model):
    REMINDER_TYPES = [
        ('Watering', 'Watering'),
        ('Fertilizing', 'Fertilizing'),
        ('Pruning', 'Pruning'),
        ('Repotting', 'Repotting'),
        ('Pest Check', 'Pest Check'),
        ('Harvesting', 'Harvesting'),
        ('Other', 'Other'),
    ]
    
    user = models.ForeignKey('api.User', on_delete=models.CASCADE, related_name='plant_reminders')
    tracked_plant = models.ForeignKey(TrackedPlant, on_delete=models.CASCADE, related_name='reminders')
    type = models.CharField(max_length=20, choices=REMINDER_TYPES)
    due_date = models.DateField()
    notes = models.TextField(blank=True, null=True)
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.type} for {self.tracked_plant.name} - {self.due_date}"

    class Meta:
        ordering = ['due_date']
