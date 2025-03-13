from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Plant

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ('Additional Info', {'fields': ('role',)}),
    )
    list_display = ('username', 'email', 'role', 'is_staff', 'is_active')
    list_filter = ('role', 'is_staff', 'is_active')
    search_fields = ('username', 'email')

@admin.register(Plant)
class PlantAdmin(admin.ModelAdmin):
    list_display = ('name', 'scientific_name', 'category', 'soil_type', 'sunlight', 'watering_schedule')
    list_filter = ('category', 'soil_type', 'sunlight', 'watering_schedule')
    search_fields = ('name', 'scientific_name')
    ordering = ('name',)

admin.site.site_header = "Gardening App Admin"
admin.site.site_title = "Gardening App Admin Panel"
admin.site.index_title = "Welcome to the Gardening App Administration"
