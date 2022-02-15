"""
Development settings.
"""

from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = 'django-insecure-so72wicdd-#nyft$z2sb+4pf#qf6h_2nyrg644jv#k1fw096li'

DEBUG = True

ALLOWED_HOSTS = []

STATIC_ROOT = Path.joinpath(BASE_DIR, 'frontend')

STATIC_URL = '/static/'
