from rest_framework.permissions import BasePermission

class IsAdmin(BasePermission):
    """Only Admins can access this API"""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'Admin'

class IsGardener(BasePermission):
    """Only Gardeners can access this API"""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'Gardener'

class IsSupervisor(BasePermission):
    """Only Supervisors can access this API"""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'Supervisor'

class IsHomeowner(BasePermission):
    """Only Homeowners can access this API"""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'Homeowner'
