from django.http import JsonResponse
from pathlib import Path
import glob
import os
from datetime import datetime
from main.utils.compare.data_loader import *
from main.utils.compare.result_compare import Resultcompare
from main.utils.load_data.appointment import csv_to_json_with_type
from django.conf import settings
import json
import re


appointment_summary_shared = {
    "appointment count": 0,
    "appointment recommended count": 0
}

def detect_lang_from_filename(filename, langs):
    """
    ดึง lang code จากชื่อไฟล์ เช่น appointment-en-xxx.csv
    โดยใช้ regex เพื่อไม่ให้ match แบบมั่ว
    """
    for lang in langs:
        pattern = fr"-({lang})([-\.])"  # -en- หรือ -en.
        if re.search(pattern, filename):
            return lang
    return None



def calculate_appointment_from_json(data_list):

    langs = ["en", "th", "ru", "de", "zh", "ar"]
    lang_names = {
        "en": "English",
        "th": "Thai",
        "ru": "Russia",
        "de": "German",
        "zh": "Chinese",
        "ar": "Arabic"
    }
    lang_summary = {lang: {"appointment count": 0, "appointment recommended count": 0} for lang in langs}

    total_all_col = 0
    total_all_col_rec = 0

    for row in data_list:
        file_type = row.get("file_type", "appointment")
        lang = row.get("lang_code")
        if lang not in langs:
            continue

        if file_type == "appointment-recommended":
            lang_summary[lang]["appointment recommended count"] += 1
            total_all_col_rec += 1
        else:
            lang_summary[lang]["appointment count"] += 1
            total_all_col += 1

    appointment = []
    for lang_code, data in lang_summary.items():
        entry = {
            "Language": lang_names[lang_code],
            "Appointment": data["appointment count"],
            "Appointment Recommended": data["appointment recommended count"],
            "Total": data["appointment count"] + data["appointment recommended count"]
        }
        appointment.append(entry)

    appointment_summary_shared["appointment count"] = total_all_col
    appointment_summary_shared["appointment recommended count"] = total_all_col_rec

    total_entry = {
        "Language": "Total",
        "Appointment": total_all_col,
        "Appointment Recommended": total_all_col_rec,
        "Total": total_all_col + total_all_col_rec
    }
    appointment.append(total_entry)

    return appointment

# รองรับหลาย format
KNOWN_DATE_FORMATS = [
    "%Y-%m-%d",
    "%d/%m/%Y",
    "%d-%m-%Y",
    "%Y/%m/%d",
]

def try_parse_date(date_str):
    for fmt in KNOWN_DATE_FORMATS:
        try:
            return datetime.strptime(date_str, fmt)
        except ValueError:
            continue
    return None

def filter_date_range(filtered_list, start_date, end_date, date_key="Entry Date"):
    result = []

    # แปลง start และ end เป็น datetime object
    start = datetime.strptime(start_date, "%Y-%m-%d")
    end = datetime.strptime(end_date, "%Y-%m-%d")

    for item in filtered_list:
        raw_entry = item.get(date_key, "")
        entry_str = raw_entry.split(" ")[0].strip()  # กัน whitespace

        entry = try_parse_date(entry_str)
        if entry:
            if start <= entry <= end:
                result.append(item)
        else:
            print(f"❌ Invalid date format: {entry_str}")

    return result


def load_date(datetimes):
    start = datetimes[0]['startDate']
    end = datetimes[0]['endDate']
    # print(start, end)
    return start, end

def find_appointment_from_csv_folder(dateset):
    try:
        global appointment_summary_shared
        folder_path = settings.MEDIA_ROOT / 'uploads'
        langs = ["ar", "de", "en", "ru", "th", "zh"]

        all_data = []

        # ไฟล์ appointment recommended
        recommended_files = glob.glob(os.path.join(folder_path, "*appointment-recommended*.csv"))
        for file in recommended_files:
            lang = detect_lang_from_filename(file, langs)
            if lang:
                all_data.extend(csv_to_json_with_type(file, "appointment-recommended", lang))

        # ไฟล์ appointment ปกติ
        normal_files = [
            f for f in glob.glob(os.path.join(folder_path, "*appointment*.csv"))
            if "appointment-recommended" not in os.path.basename(f)
        ]
        for file in normal_files:
            lang = detect_lang_from_filename(file, langs)
            if lang:
                all_data.extend(csv_to_json_with_type(file, "appointment", lang))

        keys_to_show = ["Centers & Clinics","Entry Date","file_type","lang_code"]

        
        filtered_list = [
            {k: d[k] for k in keys_to_show if k in d}
            for d in all_data
        ]

        start_date, end_date = dateset

        fil = filter_date_range(filtered_list, start_date, end_date)
        # print(json.dumps(fil, indent=2))

        result = calculate_appointment_from_json(fil)
        return result
    

    except Exception as e:
        print("🔥 ERROR:", e)
        return []
    
def find_appointment(dateset):
    try:
        if len(dateset) <= 1:
            # print(dateset)
            dateset1 = dateset[0].get('startDate')
            dateset2 = dateset[0].get('endDate')
            table = find_appointment_from_csv_folder((dateset1, dateset2))
            # return [find_appointment_from_csv_folder((dateset1, dateset2))]
            return {
                "dataForTable": table,
                "dataForChart": table
            } 
        else :
            print('it 2 !!')
            dateset1 = dateset[0].get('startDate')
            dateset2 = dateset[0].get('endDate')
            date2set1 = dateset[1].get('startDate')
            date2set2 = dateset[1].get('endDate')
            data1 = find_appointment_from_csv_folder((dateset1, dateset2))
            data2 = find_appointment_from_csv_folder((date2set1, date2set2))
            # return [Resultcompare(data1, data2, dateset)]
            table = Resultcompare(data1, data2, dateset)
            return {
                "dataForTable": table,
                "dataForChart": table
            } 
            # print(Resultcompare(data1, data2, dateset))

    except Exception as e:
        print('From appointment', e)
        
def find_appointment_summary(dateset):
    try:
        total_dict = []
        dateset1 = dateset.get('startDate')
        dateset2 = dateset.get('endDate')
        # print("ได้ๆ", dateset1, dateset2)
        data_sum = find_appointment_from_csv_folder((dateset1, dateset2))
        total_dict = {
            "Appointment": 0,
            "Appointment Recommended": 0
        }
        for item in data_sum:
            if item.get("Language") == "Total":
                continue
            total_dict["Appointment"] += item.get("Appointment", 0)
            total_dict["Appointment Recommended"] += item.get("Appointment Recommended", 0)

        # print("📅 Appointment Summary:", total_dict)
        return [total_dict]
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    

