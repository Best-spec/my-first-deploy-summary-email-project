import logging
import os
import sys
import types
from unittest.mock import patch

# สร้างโมดูล pandas ปลอมและเพิ่ม PYTHONPATH ของโปรเจ็กต์
sys.modules.setdefault("pandas", types.ModuleType("pandas"))
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from main.TopCenter.controllers.top_clinic_controller import find_top_clinics_summary


def test_find_top_clinics_summary(caplog):
    fake_summary = [{
        "Centers & clinics": "ClinicA",
        "appointment_count": 1,
        "recommended_count": 0,
        "total": 1,
    }]

    def fake_load(folder_path, langs, start, end, file_type="appointment"):
        return [{"Centers & Clinics": "ClinicA", "Type": file_type}]

    def fake_summarize(data):
        return fake_summary

    with patch(
        "main.TopCenter.controllers.top_clinic_controller.load_csv_appointments",
        side_effect=fake_load,
    ) as mock_load, patch(
        "main.TopCenter.controllers.top_clinic_controller.summarize_clinic_data",
        side_effect=fake_summarize,
    ) as mock_summary:
        date_ranges = [{"startDate": "2024-01-01", "endDate": "2024-01-31"}]
        with caplog.at_level(logging.DEBUG):
            result = find_top_clinics_summary(date_ranges, folder_path="dummy")

    expected = {
        "table": fake_summary,
        "topcenter": fake_summary,
        "total": fake_summary,
    }

    assert result == expected
    assert mock_load.call_count == 2
    assert mock_summary.call_count == 1
    assert "ClinicA" in caplog.text
    assert "date ranges" in caplog.text

