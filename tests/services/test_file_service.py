from main.TopCenter.services.clinic_data_service import csv_to_json


def test_csv_to_json_callable():
    assert callable(csv_to_json)
