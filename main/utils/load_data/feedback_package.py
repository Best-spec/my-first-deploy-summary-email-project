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

# 🔁 Global cache
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

    # 📥 โหลด feedback
    for file in feedback_files:
        lang = extract_language(file)
        try:
            df = pd.read_csv(file)
            df.columns = df.columns.str.strip().str.replace('\ufeff', '')
            df["Language"] = lang
            df["Type"] = "Feedback"
            all_data.extend(df.to_dict(orient="records"))
        except Exception as e:
            print(f"🔥 Error reading {file}: {e}")

    # 📥 โหลด packages
    for file in packages_files:
        lang = extract_language(file)
        try:
            df = pd.read_csv(file)
            df.columns = df.columns.str.strip().str.replace('\ufeff', '')
            df["Language"] = lang
            df["Type"] = "Packages"
            all_data.extend(df.to_dict(orient="records"))
        except Exception as e:
            print(f"🔥 Error reading {file}: {e}")

    _cached_feedback_packages = all_data
    return all_data
