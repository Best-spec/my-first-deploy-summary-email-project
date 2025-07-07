from django.http import JsonResponse
from main.models import UploadedFile
from pathlib import Path
from collections import defaultdict
import pandas as pd
import glob
import os
from datetime import datetime
from .compare.data_loader import *
from .compare.result_compare import Resultcompare


appointment_summary_shared = {
    "appointment count": 0,
    "appointment recommended count": 0
}

def detect_lang_from_filename(filename, langs):
    # หา lang code จากชื่อไฟล์ เช่น appointment-en-xxx.csv => en
    for lang in langs:
        if f"-{lang}" in filename:
            return lang
    return None


def csv_to_json_with_type(filepath, file_type, lang_code):
    df = pd.read_csv(filepath)
    df.columns = df.columns.str.strip().str.replace('\ufeff', '')
    json_list = df.to_dict(orient='records')
    # เพิ่มข้อมูล type กับ lang_code ให้แต่ละ dict
    for d in json_list:
        d['file_type'] = file_type
        d['lang_code'] = lang_code
    return json_list


def calculate_appointment_from_json(data_list):
    langs = ["ar", "de", "en", "ru", "th", "zh"]
    lang_names = {
        "ar": "Arabic",
        "de": "German",
        "en": "English",
        "ru": "Russia",
        "th": "Thai",
        "zh": "Chinese"
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


def filter_date_range(filtered_list, start_date, end_date, date_key="Entry Date"):
    result = []

    # start & end ต้องเป็น datetime object ด้วย pattern เดียวกับ entry
    start = datetime.strptime(start_date, "%Y-%m-%d")
    end = datetime.strptime(end_date, "%Y-%m-%d")
    print(f"🔍 Filtering entries from {start.strftime('%d/%m/%Y')} to {end.strftime('%d/%m/%Y')}")

    for item in filtered_list:
        entry_str = item.get(date_key, "")
        try:
            # ใช้ pattern "%d/%m/%Y" แทน
            entry = datetime.strptime(entry_str.split(" ")[0], "%d/%m/%Y")
            if start <= entry <= end:
                print(item["Entry Date"], item.get("lang_code", ''))
                result.append(item)
        except ValueError:
            print(f"❌ Invalid date format: {entry_str}")
            continue

    print(f"✅ Matched entries: {len(result)}")
    return result

def load_date(datetime):
    start = datetime[0]['startDate']
    end = datetime[0]['endDate']
    return start, end

def find_appointment_from_csv_folder(dateset):
    try:
        global appointment_summary_shared
        folder = "media/uploads"
        folder_path = Path(folder)
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

        start_date, end_date = load_date(dateset)

        fil = filter_date_range(filtered_list, start_date, end_date)

        # print(json.dumps(filtered_list, indent=2, ensure_ascii=False)) 
        result = calculate_appointment_from_json(fil)
        return [result]
    

    except Exception as e:
        print("🔥 ERROR:", e)
        return []
    
def find_appointment(dateset):
    try:
        if len(dateset) <= 1:
            # print(dateset)
            return find_appointment_from_csv_folder(dateset)
        else :
            print('it 2 !!')
            set1 = dateset[0]
            set2 = dateset[1]
            data1 = find_appointment_from_csv_folder(set1)
            data2 = find_appointment_from_csv_folder(set2)
            loadSet1(data1)
            loadSet2(data2)
            # print(Resultcompare())
            # return Resultcompare()
    except Exception as e:
        print('From appointment', e)
def find_appointment_summary(datetime):
    try:
        find_appointment_from_csv_folder(datetime)
        print("📅 Appointment Summary:", appointment_summary_shared)
        return [appointment_summary_shared]
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    

