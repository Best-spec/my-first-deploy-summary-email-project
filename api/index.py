import os
import sys

# Add the project root directory to python path
root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

# Set default settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'main.settings.settings')

from main.settings.wsgi import application

# Vercel Serverless Function Handler
app = application
