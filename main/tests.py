import os
import glob
import pandas as pd
from pathlib import Path
import json
import math

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
        "ru": "Russian",
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

    total_entry = {
        "Language": "Total",
        "Appointment": total_all_col,
        "Appointment Recommended": total_all_col_rec,
        "Total": total_all_col + total_all_col_rec
    }
    appointment.append(total_entry)

    return appointment


def find_appointment_from_csv_folder(folder_path):
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
        {k: d[k] for k in keys_to_show if k in d and not (isinstance(d[k], float) and math.isnan(d[k]))}
        for d in all_data
    ]

    print(json.dumps(filtered_list, indent=2, ensure_ascii=False))
    # # คำนวณผลจาก json list
    # print(json.dumps(all_data, indent=2, ensure_ascii=False))   
    result = calculate_appointment_from_json(filtered_list)
    return result


if __name__ == "__main__":
    folder = "C:/Users/bphdigital/Desktop/Coding/my-first-deploy-summary-email-project-master/media/uploads"
    res = find_appointment_from_csv_folder(folder)
    print(folder)
    print(res)
