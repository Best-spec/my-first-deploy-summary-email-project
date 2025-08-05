# app/controllers/top_clinic_controller.py
from TopCenter.services.csv_service import load_csv_appointments
from TopCenter.services.clinic_summary_service import summarize_clinic_data
from datetime import datetime

def find_top_clinics_summary(date_ranges, folder_path="media/uploads"):
    langs = ["ar", "de", "en", "ru", "th", "zh-hans"]

    results = []
    for dr in date_ranges:
        start = datetime.strptime(dr['startDate'], "%Y-%m-%d")
        end = datetime.strptime(dr['endDate'], "%Y-%m-%d")
        normal = load_csv_appointments(folder_path, langs, start, end, file_type="appointment")
        recommended = load_csv_appointments(folder_path, langs, start, end, file_type="recommended")
        all_data = normal + recommended
        summary = summarize_clinic_data(all_data)
        results.append(summary)
    
    return results