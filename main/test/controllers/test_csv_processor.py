import pytest
from unittest.mock import patch, MagicMock
from main.TopCenter.services.csv_service import load_csv_appointments

@patch("main.TopCenter.services.csv_service.glob.glob")
@patch("main.TopCenter.services.csv_service.pd.read_csv")
def test_csv_to_json_reads_valid_files(mock_read_csv, mock_glob):
    # Mock return for glob
    mock_glob.side_effect = [
        ["media/uploads/appointment-en-2025-05-08.csv"],  # normal
        ["media/uploads/appointment-recommended-en-2025-05-08.csv"]  # recommended
    ]

    # สร้าง dataframe mock ขึ้นมา
    df_mock = MagicMock()
    df_mock.columns = ["No", "Clinic Name", "Entry Date"]
    df_mock.columns.str.strip.return_value = df_mock.columns
    df_mock.iterrows.return_value = iter([
        (0, {"Clinic Name": "Heart Center", "Entry Date": "2024-08-01 12:00:00"}),
        (1, {"Clinic Name": "แผนกเคลื่อนย้ายผู้ป่วยทางการแพทย์", "Entry Date": "01/08/2024"})
    ])
    mock_read_csv.return_value = df_mock

    result = load_csv_appointments(folder_path="media/uploads", langs=["en"], start_date="01/04/2025", end_date="31/04/2025")

    assert "normal_appointments" in result
    assert "recommended_appointments" in result
    assert len(result["normal_appointments"]) > 0
    assert len(result["recommended_appointments"]) > 0
