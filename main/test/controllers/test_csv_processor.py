import pytest
from datetime import datetime
from unittest.mock import patch, MagicMock
from main.TopCenter.services.csv_service import load_csv_appointments

@pytest.mark.skip(reason="pandas dependency not installed")
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
    columns_mock = MagicMock()
    str_mock = MagicMock()
    str_mock.strip.return_value = str_mock
    str_mock.replace.return_value = ["No", "Clinic Name", "Entry Date"]
    columns_mock.str = str_mock
    df_mock.columns = columns_mock
    df_mock.iterrows.return_value = iter([
        (0, {"Clinic Name": "Heart Center", "Entry Date": "2025-04-08 12:00:00"}),
        (1, {"Clinic Name": "แผนกเคลื่อนย้ายผู้ป่วยทางการแพทย์", "Entry Date": "08/04/2025"})
    ])
    mock_read_csv.return_value = df_mock

    result = load_csv_appointments(
        folder_path="media/uploads",
        langs=["en"],
        start_date=datetime(2025, 4, 1),
        end_date=datetime(2025, 4, 30),
    )

    assert isinstance(result, list)
    assert len(result) > 0
