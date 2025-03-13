import os
from pathlib import Path
from datetime import timedelta

# Base directory
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'your-secret-key'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['localhost', '127.0.0.1']  # ✅ Fixed allowed hosts for local testing

# URL configuration
ROOT_URLCONF = 'backend.urls'

# Installed Apps
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
     'rest_framework_simplejwt.token_blacklist', 
    'rest_framework',  # Django REST Framework
    'rest_framework_simplejwt',  # ✅ Add JWT Authentication
    'corsheaders',  # CORS for frontend-backend communication
    'api',  # Your custom app
        "rest_framework.authtoken"
]

# Middleware
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # ✅ Ensure CORS is enabled
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# CORS Allowed Origins
CORS_ALLOW_ALL_ORIGINS = True  # ✅ Ensure only specific origins are allowed
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",  # ✅ Allow frontend running on React
]

# Database Configuration (PostgreSQL)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'sho',
        'USER': 'postgres',
        'PASSWORD': '123',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Static files
STATIC_URL = '/static/'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Templates Configuration
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / "templates"],  # ✅ Fixed template path
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
}

# ✅ Ensure Simple JWT settings are configured correctly
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=30),  # Increase token lifetime
    'REFRESH_TOKEN_LIFETIME': timedelta(days=90),  # Longer refresh token lifespan
    'ROTATE_REFRESH_TOKENS': False,  # Prevent refresh token from expiring unless user logs out
    'BLACKLIST_AFTER_ROTATION': True,  # Blacklist token on logout
    'AUTH_HEADER_TYPES': ('Bearer',),
}

APPEND_SLASH = False

# Custom User Model
AUTH_USER_MODEL = "api.User"

# Media files (Uploaded files)
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')