import os
import glob
import pandas as pd
import json
from django.conf import settings

# 🌍 ภาษาจากชื่อไฟล์
LANG_MAP = {
    "-ar": "Arabic",
    "-de": "German",
    "-en": "English",
    "-ru": "Russia",
    "-th": "Thai",
    "-zh": "Chinese",
}

def extract_language(filename):
    basename = os.path.basename(filename).lower()
    for suffix, lang in LANG_MAP.items():
        if suffix in basename:
            return lang
    return "Unknown"

# # 🔁 Global cache
_cached_feedback_packages = None

def reset_feedback_packages_cache():
    global _cached_feedback_packages
    _cached_feedback_packages = None

def convert_csv_to_json(folder_path=settings.MEDIA_ROOT / 'uploads'):
    """
    อ่านไฟล์ feedback*.csv และ packages*.csv แล้วแปลงเป็น JSON list
    แต่ละ record จะมี field: [column from csv] + Language + Type
    """
    global _cached_feedback_packages

    if _cached_feedback_packages is not None:
        return _cached_feedback_packages

    all_data = []

    feedback_files = glob.glob(os.path.join(folder_path, "feedback*.csv"))
    packages_files = glob.glob(os.path.join(folder_path, "packages*.csv"))

    def safe_read(file, type_name):
        lang = extract_language(file)
        try:
            df = pd.read_csv(file)

            # ทำให้แน่ใจว่า column ทั้งหมดเป็น string ก่อน strip
            df.columns = [str(col).strip().replace('\ufeff', '') for col in df.columns]

            # Add extra columns
            df["Language"] = lang
            df["Type"] = type_name

            # ลบ row ที่เป็น NaN ทั้งแถว
            df.dropna(how='all', inplace=True)

            # ป้องกัน error strip ใน value
            records = []
            for row in df.to_dict(orient="records"):
                safe_row = {
                    k: str(v).strip() if isinstance(v, str) else v
                    for k, v in row.items()
                }
                records.append(safe_row)

            all_data.extend(records)

        except Exception as e:
            print(f"🔥 Error reading {file}: {e}")

    # 📥 โหลด feedback
    for file in feedback_files:
        safe_read(file, "Feedback")

    # 📥 โหลด packages
    for file in packages_files:
        safe_read(file, "Packages")

    _cached_feedback_packages = all_data
    return all_data
