# Activate the virtual environment
$venvPath = ".\.venv\Scripts\Activate.ps1"
# Check and create virtual environment if it doesn't exist
$venvDir = ".venv"
$venvActivate = "$venvDir\Scripts\Activate.ps1"
if (-not (Test-Path $venvActivate)) {
    Write-Host ".venv not found. Creating virtual environment..."
    python -m venv $venvDir
    if (-not (Test-Path $venvActivate)) {
        Write-Host "Failed to create virtual environment."
        exit 1
    }
    Write-Host "Virtual environment created. Installing requirements..."
    & "$venvDir\Scripts\python.exe" -m pip install --upgrade pip
    if (Test-Path "requirements.txt") {
        & "$venvDir\Scripts\python.exe" -m pip install -r requirements.txt
    } else {
        Write-Host "requirements.txt not found. Skipping package installation."
    }
}
& $venvActivate
Write-Host "Virtual environment activated."


# Run the Python development server
$pythonPath = "python"
$script = "manage.py"
$arguments = "runserver"

#Collect static ถ้าเจอ settings.py (กัน admin site css หายตอน DEBUG=False)
if (Test-Path "manage.py") {
    Write-Host "Running collectstatic..."
    python manage.py collectstatic --noinput
} else {
    Write-Host "manage.py not found. Please ensure you are in the correct directory."
    exit 1
}

if (Test-Path $script) {
    & $pythonPath $script $arguments
} else {
    Write-Host "manage.py not found. Please ensure you are in the correct directory."
    exit 1
}


