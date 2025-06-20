from django.http import JsonResponse
from main.models import UploadedFile
from pathlib import Path
from collections import defaultdict
import pandas as pd

from pathlib import Path
from collections import defaultdict
import pandas as pd
import glob
import os

def find_appointment():
    try:
        folder = "media/uploads"
        folder_path = Path(folder)
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
        total_all_col_rec, total_all_col = 0, 0

        # อ่านไฟล์ recommended
        recommended_files = glob.glob(os.path.join(folder, "*appointment-recommended*.csv"))
        for file in recommended_files:
            df = pd.read_csv(file)
            df.columns = df.columns.str.strip().str.replace('\ufeff', '')
            col_name = df.columns[1]
            count = len(df[col_name])
            total_all_col_rec += count

            for lang in langs:
                if f"-{lang}" in file:
                    lang_summary[lang]["appointment recommended count"] += count
                    break

        # อ่านไฟล์ปกติ
        normal_files = [
            f for f in glob.glob(os.path.join(folder, "*appointment*.csv"))
            if "appointment-recommended" not in os.path.basename(f)
        ]
        for file in normal_files:
            df = pd.read_csv(file)
            df.columns = df.columns.str.strip().str.replace('\ufeff', '')
            col_name = df.columns[1]
            count = len(df[col_name])
            total_all_col += count

            for lang in langs:
                if f"-{lang}" in file:
                    lang_summary[lang]["appointment count"] += count
                    break

        # รวมข้อมูลเป็น list of dict
        appointment = []
        for lang_code, data in lang_summary.items():
            entry = {
                "Language": lang_names[lang_code],
                "Appointment": data["appointment count"],
                "Appointment Recommended": data["appointment recommended count"],
                "Total": data["appointment count"] + data["appointment recommended count"]
            }
            appointment.append(entry)

        # รวม total ทั้งหมด
        total_entry = {
            "Language": "Total",
            "Appointment": total_all_col,
            "Appointment Recommended": total_all_col_rec,
            "Total": total_all_col + total_all_col_rec
        }
        appointment.append(total_entry)

        return [appointment]

    except Exception as e:
        print("🔥 ERROR:", e)
        return []
