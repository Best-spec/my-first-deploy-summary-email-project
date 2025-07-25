#!/bin/bash

python manage.py migrate --noinput

python manage.py shell <<EOF
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'adminpassword')
    print('Created superuser admin')
else:
    print('Superuser admin exists')
EOF

gunicorn filemanager.wsgi:application --bind 0.0.0.0:$PORT