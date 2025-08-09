from main.views.top_center import csv_to_json


def test_csv_to_json_callable():
    assert callable(csv_to_json)
