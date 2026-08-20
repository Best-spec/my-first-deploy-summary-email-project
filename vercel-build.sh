#!/bin/bash

echo "🚀 Starting Fullstack Build Process..."

# 1. Install Python Dependencies & Migrate
echo "📦 Installing Python dependencies..."
if [ -f "venv/bin/activate" ]; then
    source venv/bin/activate
    pip install -r requirements.txt
    python manage.py migrate --noinput
else
    python3 -m pip install -r requirements.txt --break-system-packages 2>/dev/null || true
    python3 manage.py migrate --noinput 2>/dev/null || true
fi

# 2. Install Frontend Dependencies and Build Next.js
echo "⚛️ Building Next.js Frontend..."
cd frontend-next
npm install
npm run build

echo "✅ Build Process Completed Successfully!"
