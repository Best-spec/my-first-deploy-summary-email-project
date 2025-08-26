#!/bin/bash

export DJANGO_SETTINGS_MODULE=main.settings.settings 
echo "🔧 Running migrations..."
python manage.py migrate --noinput

echo "🚀 Starting server..."
gunicorn main.settings.wsgi:application --bind 0.0.0.0:$PORT
