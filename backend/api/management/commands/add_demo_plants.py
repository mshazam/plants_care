from django.core.management.base import BaseCommand
from api.models import Plant
import random

class Command(BaseCommand):
    help = 'Add 20 demo plants with realistic details'

    def handle(self, *args, **kwargs):
        # Sample data for random generation
        plant_types = [
            ('Rose', 'Rosa', 'flower'),
            ('Tomato', 'Solanum lycopersicum', 'vegetable'),
            ('Apple Tree', 'Malus domestica', 'fruit'),
            ('Lavender', 'Lavandula', 'flower'),
            ('Carrot', 'Daucus carota', 'vegetable'),
            ('Strawberry', 'Fragaria × ananassa', 'fruit'),
            ('Sunflower', 'Helianthus annuus', 'flower'),
            ('Cucumber', 'Cucumis sativus', 'vegetable'),
            ('Lemon Tree', 'Citrus limon', 'fruit'),
            ('Tulip', 'Tulipa', 'flower'),
            ('Bell Pepper', 'Capsicum annuum', 'vegetable'),
            ('Blueberry', 'Vaccinium corymbosum', 'fruit'),
            ('Dahlia', 'Dahlia pinnata', 'flower'),
            ('Lettuce', 'Lactuca sativa', 'vegetable'),
            ('Orange Tree', 'Citrus × sinensis', 'fruit'),
            ('Peony', 'Paeonia', 'flower'),
            ('Spinach', 'Spinacia oleracea', 'vegetable'),
            ('Grape Vine', 'Vitis vinifera', 'fruit'),
            ('Chrysanthemum', 'Chrysanthemum', 'flower'),
            ('Broccoli', 'Brassica oleracea var. italica', 'vegetable'),
        ]

        soil_types = ['sandy', 'loamy', 'clay', 'silt']
        sunlight_options = ['full_sun', 'partial_sun', 'shade']
        watering_schedules = ['daily', 'weekly', 'custom']
        
        growth_stages = [
            ['Seedling', 'Vegetative', 'Flowering', 'Fruiting'],
            ['Germination', 'Leaf Development', 'Maturity'],
            ['Early Growth', 'Establishment', 'Peak Growth', 'Dormancy']
        ]
        
        pests = [
            'Aphids', 'Spider Mites', 'Whiteflies', 'Caterpillars',
            'Japanese Beetles', 'Slugs', 'Scale Insects', 'Thrips'
        ]
        
        companion_plants = [
            'Marigold', 'Basil', 'Nasturtium', 'Garlic', 'Mint',
            'Dill', 'Chamomile', 'Oregano', 'Thyme', 'Chives'
        ]

        for name, scientific_name, category in plant_types:
            plant = Plant.objects.create(
                name=name,
                scientific_name=scientific_name,
                category=category,
                soil_type=random.choice(soil_types),
                sunlight=random.choice(sunlight_options),
                watering_schedule=random.choice(watering_schedules),
                fertilization_needs=random.choice([True, False]),
                growth_stages=random.choice(growth_stages),
                pests=random.sample(pests, k=random.randint(2, 4)),
                climate_suitability=random.choice(['Tropical', 'Mediterranean', 'Temperate', 'Continental']),
                care_instructions=f"1. Plant in well-draining soil\\n2. Water {random.choice(['regularly', 'moderately', 'sparingly'])}\\n3. Fertilize {random.choice(['monthly', 'quarterly', 'annually'])}\\n4. Prune as needed for shape and health",
                companion_plants=random.sample(companion_plants, k=random.randint(2, 4)),
                lifespan=random.choice(['Annual', 'Biennial', 'Perennial', '2-3 years', '5-10 years']),
                ideal_temperature=f"{random.randint(15, 25)}°C - {random.randint(26, 35)}°C",
                humidity_needs=f"{random.randint(40, 60)}% - {random.randint(61, 80)}%",
                characteristics=f"A {random.choice(['hardy', 'delicate', 'robust', 'versatile'])} plant with {random.choice(['beautiful flowers', 'edible fruits', 'aromatic leaves', 'ornamental value'])}.",
                growth_time=f"{random.randint(60, 180)} days",
                harvest_time=random.choice(['Spring', 'Summer', 'Fall', 'Winter', 'Year-round']),
                yield_potential=f"{random.randint(1, 10)} kg per plant" if category in ['vegetable', 'fruit'] else 'N/A',
                disease_resistance=random.choice(['High', 'Medium', 'Low']),
                seasonal_preferences=random.choice(['Spring planting', 'Summer planting', 'Fall planting', 'Year-round planting']),
                propagation_methods=', '.join(random.sample(['Seeds', 'Cuttings', 'Division', 'Layering'], k=random.randint(1, 3))),
                pruning_needs=random.choice(['Regular pruning required', 'Minimal pruning needed', 'Annual pruning recommended']),
                soil_ph_preference=f"{random.randint(5, 7)}.{random.randint(0, 9)} - {random.randint(6, 8)}.{random.randint(0, 9)}",
                nutrient_requirements=random.choice(['High', 'Medium', 'Low'])
            )
            self.stdout.write(self.style.SUCCESS(f'Successfully added {name}'))

        self.stdout.write(self.style.SUCCESS('Successfully added 20 demo plants')) 