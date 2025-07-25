#!/bin/bash

echo "🔧 Running migrations..."
python manage.py migrate --noinput

echo "👤 Creating or updating superuser from env..."

export DJANGO_SETTINGS_MODULE=filemanager.settings  # 👈 ต้องระบุ settings ก่อน

python - <<END
import os
import django

django.setup()  # 👈 ต้อง setup ก่อนใช้ model

username = os.environ.get('DJANGO_SUPERUSER_USERNAME')
password = os.environ.get('DJANGO_SUPERUSER_PASSWORD')
email = os.environ.get('DJANGO_SUPERUSER_EMAIL', 'admin@example.com')

from django.contrib.auth import get_user_model
User = get_user_model()

if not username or not password:
    print("❌ Superuser env vars not set properly.")
    exit(1)

# try:
#     user = User.objects.get(username=username)
#     user.set_password(password)
#     user.email = email
#     user.save()
#     print(f"✅ Updated password for user {username}")
# except User.DoesNotExist:
#     User.objects.create_superuser(username, email, password)
#     print(f"✅ Created superuser {username}")
END

echo "🚀 Starting server..."
gunicorn filemanager.wsgi:application --bind 0.0.0.0:$PORT
