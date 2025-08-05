# tests/controllers/test_top_clinic_controller.py

import pytest
from datetime import datetime
from unittest.mock import patch
from main.TopCenter.controllers.top_clinic_controller import find_top_clinics_summary



@patch("main.TopCenter.controllers.top_clinic_controller.load_csv_appointments")
@patch("main.TopCenter.controllers.top_clinic_controller.summarize_clinic_data")
def test_find_top_clinics_summary(mock_summarize, mock_load):
    # Arrange
    date_ranges = [
        {"startDate": "2025-04-01", "endDate": "2025-04-15"},
        {"startDate": "2025-04-16", "endDate": "2025-04-31"},
    ]

    assert find_top_clinics_summary(date_ranges) == 10

