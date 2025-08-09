import os
from main.services.feedback_package_service import FeedbackPackageService



def _create_csv(path, filename, rows):
    file_path = os.path.join(path, filename)
    with open(file_path, "w", encoding="utf-8") as f:
        f.write("Entry Date,Value\n")
        for row in rows:
            f.write(f"{row['Entry Date']},{row['Value']}\n")
    return file_path


def test_convert_csv_to_json(tmp_path):
    _create_csv(tmp_path, "feedback-en.csv", [
        {"Entry Date": "2023-01-01", "Value": 1},
        {"Entry Date": "2023-01-02", "Value": 2},
    ])
    _create_csv(tmp_path, "packages-en.csv", [
        {"Entry Date": "2023-01-01", "Value": 1},
    ])

    service = FeedbackPackageService()
    data = service.convert_csv_to_json(folder_path=str(tmp_path))
    assert len(data) == 3
    assert {item["Type"] for item in data} == {"Feedback", "Packages"}
    assert {item["Language"] for item in data} == {"English"}


def test_process_json_list():
    service = FeedbackPackageService()
    data_list = [
        {"Entry Date": "01/01/2023", "Language": "English", "Type": "Feedback"},
        {"Entry Date": "02/01/2023", "Language": "English", "Type": "Packages"},
        {"Entry Date": "03/01/2023", "Language": "Thai", "Type": "Feedback"},
    ]
    result = service.process_json_list(data_list, start_date="01/01/2023", end_date="02/01/2023")
    english = next(item for item in result if item["Language"] == "English")
    assert english["Feedback"] == 1
    assert english["Packages"] == 1
    total = result[-1]
    assert total["Total"] == 2


def test_cal_FeedbackAndPackage(tmp_path):
    _create_csv(tmp_path, "feedback-en.csv", [
        {"Entry Date": "2023-01-01", "Value": 1},
        {"Entry Date": "2023-01-02", "Value": 2},
    ])
    _create_csv(tmp_path, "packages-en.csv", [
        {"Entry Date": "2023-01-01", "Value": 1},
    ])
    service = FeedbackPackageService(folder_path=str(tmp_path))
    result = service.cal_FeedbackAndPackage({"startDate": "2023-01-01", "endDate": "2023-01-03"})
    english = next(item for item in result if item["Language"] == "English")
    assert english["Feedback"] == 2
    assert english["Packages"] == 1
    total = result[-1]
    assert total["Feedback"] == 2
    assert total["Packages"] == 1
