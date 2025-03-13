from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import UserProfile, Plant, TrackedPlant, PlantReminder

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'role')

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = UserProfile
        fields = (
            'user', 'full_name', 'phone_number', 'address',
            'average_temperature', 'average_humidity', 'annual_rainfall', 'climate_zone',
            'gardening_preferences', 'experience_level', 'specialization',
            'availability', 'service_area', 'certifications',
            'work_experience', 'managed_projects', 'responsibilities',
            'property_type', 'garden_size', 'preferred_plants',
            'admin_level', 'assigned_responsibilities',
            'preferred_plant_types', 'location', 'zip_code', 'soil_type',
            'skill_level', 'watering_frequency', 'maintenance_reminders',
            'pest_alerts', 'disease_alerts', 'community_notifications',
            'organic_fertilizer', 'plant_tracking'
        )

class PlantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plant
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')

class TrackedPlantSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrackedPlant
        fields = ['id', 'name', 'type', 'planted_date', 'last_watered', 'last_fertilized', 
                 'notes', 'health_status', 'growth_stage', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def create(self, validated_data):
        tracked_plant = TrackedPlant.objects.create(**validated_data)
        return tracked_plant

class PlantReminderSerializer(serializers.ModelSerializer):
    plant_name = serializers.CharField(source='tracked_plant.name', read_only=True)
    
    class Meta:
        model = PlantReminder
        fields = ['id', 'tracked_plant', 'plant_name', 'type', 'due_date', 
                 'notes', 'completed', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        reminder = PlantReminder.objects.create(**validated_data)
        return reminder
