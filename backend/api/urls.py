from django.urls import path, include
from .views import (
    RegisterView, ProfileView, get_users, DashboardView, UserInfoView,
    login_view, LogoutView, get_user_profile, update_user_profile,
    PlantViewSet, get_plant_categories, get_soil_types,
    get_sunlight_options, get_watering_options, TrackedPlantViewSet,
    PlantReminderViewSet, get_upcoming_reminders
)
from rest_framework.routers import DefaultRouter
from .views import UserViewSet
from rest_framework_simplejwt.views import TokenRefreshView

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'plants', PlantViewSet, basename='plant')
router.register(r'tracked-plants', TrackedPlantViewSet, basename='tracked-plant')
router.register(r'plant-reminders', PlantReminderViewSet, basename='plant-reminder')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', login_view, name='login'),
    path('profile/', get_user_profile, name='profile'),
    path('profile/update/', update_user_profile, name='update_profile'),
    path('user-info/', UserInfoView.as_view(), name='user-info'),
    path('users/', get_users, name='get-users'),  # ✅ Users List ka API endpoint
    path('dashboard/', DashboardView.as_view(), name='dashboard'),  # ✅ Dashboard View ka route
    path('logout/', LogoutView.as_view(), name='logout'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # Plant-related URLs
    path('plants/categories/', get_plant_categories, name='plant-categories'),
    path('plants/soil-types/', get_soil_types, name='soil-types'),
    path('plants/sunlight-options/', get_sunlight_options, name='sunlight-options'),
    path('plants/watering-options/', get_watering_options, name='watering-options'),
    # Plant tracking URLs
    path('upcoming-reminders/', get_upcoming_reminders, name='upcoming-reminders'),
]

urlpatterns += router.urls
