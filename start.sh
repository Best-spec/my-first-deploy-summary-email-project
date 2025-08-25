#!/bin/bash

export DJANGO_SETTINGS_MODULE=filemanager.settings 
echo "🔧 Running migrations..."
python manage.py migrate --noinput

echo "🚀 Starting server..."
gunicorn filemanager.wsgi:application --bind 0.0.0.0:$PORT
