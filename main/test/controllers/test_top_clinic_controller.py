from main.core.apps.TopCenter.services.csv_service import load_csv_appointments
import pytest
from datetime import datetime


def test_load_csv_appointments():
    # Mock data for testing
    folder_path = "test_data"
    langs = ["en"]
    start_date = datetime(2023, 1, 1)
    end_date = datetime(2023, 12, 31)
    
    # Call the function with mock data
    result = load_csv_appointments(folder_path, langs, start_date, end_date)
    
    # Check if the result is a list
    assert isinstance(result, list), "Result should be a list"
    
    # Check if the result contains dictionaries with expected keys
    if result:
        assert all("Centers & Clinics" in item and "Entry Date" in item and "Type" in item for item in result), \
            "Each item should contain 'Centers & Clinics', 'Entry Date', and 'Type' keys"