from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import get_user_model, authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.db.utils import IntegrityError
from rest_framework import status, serializers
from rest_framework.viewsets import ReadOnlyModelViewSet, ModelViewSet
from django.db.models import Q
from .models import User, UserProfile, Plant, TrackedPlant, PlantReminder
from .serializers import UserSerializer, UserProfileSerializer, PlantSerializer, TrackedPlantSerializer, PlantReminderSerializer
from rest_framework.decorators import api_view, permission_classes

User = get_user_model()

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_users(request):
    users = User.objects.all()
    role_filter = request.query_params.get('role', None)  # Filter by role
    if role_filter:
        users = users.filter(role=role_filter)
    
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    try:
        # Get or create the profile
        profile, created = UserProfile.objects.get_or_create(
            user=request.user,
            defaults={
                'full_name': request.user.username,
                'address': '',
                'phone_number': ''
            }
        )
        serializer = UserProfileSerializer(profile, context={'request': request})
        print("Profile data being sent:", serializer.data)  # Debug print
        return Response(serializer.data)
    except Exception as e:
        print("Error in get_user_profile:", str(e))  # Debug print
        return Response({
            'error': 'Failed to get profile data'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_user_profile(request):
    try:
        profile, created = UserProfile.objects.get_or_create(user=request.user)
        
        # Update text fields
        fields_to_update = [
            'full_name', 'phone_number', 'address', 'gardening_preferences',
            'experience_level', 'specialization', 'availability', 'service_area',
            'certifications', 'work_experience', 'managed_projects', 'responsibilities',
            'property_type', 'garden_size', 'preferred_plants', 'admin_level',
            'assigned_responsibilities', 'location', 'zip_code', 'soil_type',
            'skill_level', 'watering_frequency', 'plant_tracking',
            'average_temperature', 'average_humidity', 'annual_rainfall', 'climate_zone'
        ]

        print("Received data:", request.data)  # Debug print

        for field in fields_to_update:
            if field in request.data:
                value = request.data[field]
                if value not in [None, 'null', '']:  # Only update if value is not empty
                    setattr(profile, field, value)

        # Handle JSON fields
        if 'preferred_plant_types' in request.data:
            profile.preferred_plant_types = request.data['preferred_plant_types']

        # Handle boolean fields
        boolean_fields = [
            'maintenance_reminders', 'pest_alerts', 'disease_alerts',
            'community_notifications', 'organic_fertilizer'
        ]
        for field in boolean_fields:
            if field in request.data:
                setattr(profile, field, request.data[field])

        profile.save()
        serializer = UserProfileSerializer(profile, context={'request': request})
        print("Updated profile data:", serializer.data)  # Debug print
        return Response(serializer.data)
    except Exception as e:
        print("Error in update_user_profile:", str(e))  # Debug print
        return Response({
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        role = request.data.get('role')

        if not username or not email or not password or not role:
            return Response({'error': 'All fields are required'}, status=status.HTTP_400_BAD_REQUEST)

        if role not in dict(User.ROLE_CHOICES):
            return Response({'error': 'Invalid role'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email=email).exists():
            return Response({'error': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.create_user(username=username, email=email, password=password, role=role)
            return Response({'message': 'User registered successfully', 'user_id': user.id}, status=status.HTTP_201_CREATED)
        except IntegrityError:
            return Response({'error': 'Failed to create user'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    email = request.data.get('email')
    password = request.data.get('password')
    
    if not email or not password:
        return Response({
            'error': 'Please provide both email and password'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = User.objects.get(email=email)
        if user.check_password(password):
            refresh = RefreshToken.for_user(user)
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'username': user.username,
                'email': user.email,
                'role': user.role
            })
        else:
            return Response({
                'error': 'Invalid credentials'
            }, status=status.HTTP_401_UNAUTHORIZED)
    except User.DoesNotExist:
        return Response({
            'error': 'Invalid credentials'
        }, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
def register_view(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        user.set_password(request.data['password'])
        user.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user  # Get the logged-in user
        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role,
            "message": f"Welcome to your {user.role} dashboard!"
        })

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            'username': request.user.username,
            'email': request.user.email,
            'role': request.user.role
        })

class UserInfoView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        users = User.objects.all().values("id", "username", "email", "role")  # Fetch all users
        return Response(users)  # Return as JSON response

class UserViewSet(ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()  # Add token to the blacklist
            return Response({"message": "Logout successful"}, status=200)
        except Exception as e:
            return Response({"error": "Invalid token"}, status=400)

class PlantViewSet(ModelViewSet):
    queryset = Plant.objects.all()
    serializer_class = PlantSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Plant.objects.all()
        query = self.request.query_params.get('q', None)
        category = self.request.query_params.get('category', None)
        soil_type = self.request.query_params.get('soil_type', None)
        sunlight = self.request.query_params.get('sunlight', None)
        watering_schedule = self.request.query_params.get('watering_schedule', None)

        if query:
            queryset = queryset.filter(
                Q(name__icontains=query) |
                Q(scientific_name__icontains=query)
            )
        if category:
            queryset = queryset.filter(category=category)
        if soil_type:
            queryset = queryset.filter(soil_type=soil_type)
        if sunlight:
            queryset = queryset.filter(sunlight=sunlight)
        if watering_schedule:
            queryset = queryset.filter(watering_schedule=watering_schedule)

        return queryset

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_plant_categories(request):
    return Response(dict(Plant.CATEGORY_CHOICES))

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_soil_types(request):
    return Response(dict(Plant.SOIL_TYPES))

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_sunlight_options(request):
    return Response(dict(Plant.SUNLIGHT_CHOICES))

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_watering_options(request):
    return Response(dict(Plant.WATERING_CHOICES))

class TrackedPlantViewSet(ModelViewSet):
    serializer_class = TrackedPlantSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return TrackedPlant.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class PlantReminderViewSet(ModelViewSet):
    serializer_class = PlantReminderSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return PlantReminder.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        # Ensure the tracked plant belongs to the current user
        tracked_plant_id = self.request.data.get('tracked_plant')
        try:
            tracked_plant = TrackedPlant.objects.get(id=tracked_plant_id, user=self.request.user)
            serializer.save(user=self.request.user, tracked_plant=tracked_plant)
        except TrackedPlant.DoesNotExist:
            raise serializers.ValidationError("The specified plant does not exist or does not belong to you.")

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_upcoming_reminders(request):
    """Get reminders due in the next 7 days"""
    from datetime import datetime, timedelta
    
    today = datetime.now().date()
    seven_days_later = today + timedelta(days=7)
    
    reminders = PlantReminder.objects.filter(
        user=request.user,
        completed=False,
        due_date__gte=today,
        due_date__lte=seven_days_later
    ).order_by('due_date')
    
    serializer = PlantReminderSerializer(reminders, many=True)
    return Response(serializer.data)