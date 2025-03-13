import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from api.models import Plant, User, UserProfile
from django.contrib.auth.models import Group

def create_sample_plants():
    # Sample Plants
    plants_data = [
        {
            'name': 'Tomato',
            'scientific_name': 'Solanum lycopersicum',
            'category': 'vegetable',
            'soil_type': 'loamy',
            'sunlight': 'full_sun',
            'watering_schedule': 'daily',
            'fertilization_needs': True,
            'growth_stages': ['Seedling', 'Vegetative', 'Flowering', 'Fruiting'],
            'pests': ['Aphids', 'Whiteflies'],
            'climate_suitability': 'Warm temperate',
            'care_instructions': 'Water regularly, provide support for vines, prune suckers',
            'companion_plants': ['Basil', 'Marigolds'],
            'lifespan': 'Annual',
            'ideal_temperature': '20-30°C',
            'humidity_needs': '40-60%',
            'characteristics': 'Vining plant with red fruits',
            'growth_time': '60-90 days',
            'harvest_time': 'Summer',
            'yield_potential': 'High',
            'disease_resistance': 'Moderate'
        },
        {
            'name': 'Rose',
            'scientific_name': 'Rosa hybrid',
            'category': 'flower',
            'soil_type': 'loamy',
            'sunlight': 'full_sun',
            'watering_schedule': 'weekly',
            'fertilization_needs': True,
            'growth_stages': ['Dormant', 'Leafing', 'Flowering'],
            'pests': ['Aphids', 'Japanese Beetles'],
            'climate_suitability': 'Temperate',
            'care_instructions': 'Regular pruning, winter protection, deadheading spent blooms',
            'companion_plants': ['Lavender', 'Garlic'],
            'lifespan': 'Perennial',
            'ideal_temperature': '15-25°C',
            'humidity_needs': '50-70%',
            'characteristics': 'Fragrant flowers with thorny stems',
            'growth_time': '120-180 days',
            'harvest_time': 'Spring-Fall',
            'yield_potential': 'Medium',
            'disease_resistance': 'Varies by variety'
        },
        {
            'name': 'Apple Tree',
            'scientific_name': 'Malus domestica',
            'category': 'fruit',
            'soil_type': 'loamy',
            'sunlight': 'full_sun',
            'watering_schedule': 'weekly',
            'fertilization_needs': True,
            'growth_stages': ['Dormant', 'Budding', 'Flowering', 'Fruiting'],
            'pests': ['Codling Moth', 'Apple Maggot'],
            'climate_suitability': 'Temperate',
            'care_instructions': 'Annual pruning, pest monitoring, fruit thinning',
            'companion_plants': ['Daffodils', 'Chives'],
            'lifespan': 'Perennial',
            'ideal_temperature': '15-25°C',
            'humidity_needs': '40-70%',
            'characteristics': 'Deciduous tree with spring blossoms',
            'growth_time': '3-5 years to fruit',
            'harvest_time': 'Fall',
            'yield_potential': 'High',
            'disease_resistance': 'Moderate'
        }
    ]

    for plant_data in plants_data:
        Plant.objects.get_or_create(**plant_data)
    print("Sample plants created successfully!")

def create_user_groups():
    # Create user groups
    groups = ['Gardener', 'Supervisor', 'Homeowner', 'System Admin']
    for group_name in groups:
        Group.objects.get_or_create(name=group_name)
    print("User groups created successfully!")

def create_sample_users():
    # Sample Users with different roles
    users_data = [
        {
            'username': 'gardener1',
            'email': 'gardener1@example.com',
            'password': 'gardener123',
            'role': 'Gardener',
            'first_name': 'John',
            'last_name': 'Green'
        },
        {
            'username': 'supervisor1',
            'email': 'supervisor1@example.com',
            'password': 'supervisor123',
            'role': 'Supervisor',
            'first_name': 'Sarah',
            'last_name': 'Brown'
        },
        {
            'username': 'homeowner1',
            'email': 'homeowner1@example.com',
            'password': 'homeowner123',
            'role': 'Homeowner',
            'first_name': 'Mike',
            'last_name': 'Wilson'
        }
    ]

    for user_data in users_data:
        role = user_data.pop('role')
        user = User.objects.create_user(**user_data)
        user.role = role
        user.save()

        # Create user profile
        UserProfile.objects.get_or_create(
            user=user,
            defaults={
                'full_name': f"{user.first_name} {user.last_name}",
                'phone_number': '1234567890',
                'address': '123 Garden Street',
                'preferred_plant_types': ['Vegetables', 'Flowers'],
                'location': 'New York',
                'zip_code': '10001',
                'soil_type': 'Loamy',
                'skill_level': 'Intermediate',
                'gardening_preferences': 'Organic gardening',
                'experience_level': '5 years'
            }
        )
    print("Sample users and profiles created successfully!")

if __name__ == '__main__':
    print("Starting to populate database...")
    create_user_groups()
    create_sample_users()
    create_sample_plants()
    print("Database population completed!") 