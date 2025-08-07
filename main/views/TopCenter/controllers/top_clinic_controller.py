# app/controllers/top_clinic_controller.py
from main.views.TopCenter.services.csv_service import load_csv_appointments
from main.views.TopCenter.services.clinic_summary_service import summarize_clinic_data
from .model import mock
from datetime import datetime
import json

def find_top_clinics_summary(date_ranges, folder_path="media/uploads"):
    # langs = ["ar", "de", "en", "ru", "th", "zh-hans"]

    # results = []
    # for dr in date_ranges:
    #     start = datetime.strptime(dr['startDate'], "%Y-%m-%d")
    #     end = datetime.strptime(dr['endDate'], "%Y-%m-%d")
    #     normal = load_csv_appointments(folder_path, langs, start, end, file_type="appointment")
    #     recommended = load_csv_appointments(folder_path, langs, start, end, file_type="recommended")
    #     all_data = normal + recommended
    #     summary = summarize_clinic_data(all_data)
    #     results.append(summary)
    
    # print(json.dumps(results, indent=2))
    # print(date_ranges)
    return {
        "table": mock,
        "chart1": mock,
        "chart2": mock
    }

    results = [
                [
                    {
                        'Centers & clinics': 'Dental Cosmetic and Implant Center', 
                        'appointment_count': 8, 
                        'recommended_count': 17, 
                        'total': 25
                    },
                    ...
                ]
            ]