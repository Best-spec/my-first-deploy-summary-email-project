from datetime import datetime
import pandas as pd
from django.conf import settings

# ภาษาในชื่อไฟล์
LANG_MAP = {
    "-th": "Thai",
    "-en": "English",
    "-ar": "Arabic",
    "-ru": "Russia",
    "-de": "German",
    "-zh-hans": "Chinese",
    "-zh": "Chinese",
}

# 🔁 Cache
_cached_data = {}


def load_all_csv_files_to_json(start_date=None, end_date=None):
    folder_path = settings.MEDIA_ROOT / 'uploads'
    files = folder_path.glob("inquiry-form-*.csv")
    all_data = []

    for file in files:
        try:
            df = pd.read_csv(file)
            df.columns = df.columns.str.replace('\ufeff', '').str.strip('"')

            col_name = df.columns[0]  # เช่น "Type of Inquiry"
            if col_name not in df.columns:
                continue

            lang = next((LANG_MAP[suffix] for suffix in LANG_MAP if suffix in file.name), None)
            if not lang:
                continue

            df["Entry Date"] = pd.to_datetime(df["Entry Date"], errors='coerce')

            if start_date:
                start_dt = datetime.strptime(start_date, "%d/%m/%Y").date()
                df = df[df["Entry Date"].dt.date >= start_dt]

            if end_date:
                end_dt = datetime.strptime(end_date, "%d/%m/%Y").date()
                df = df[df["Entry Date"].dt.date <= end_dt]

            for val in df[col_name].astype(str).str.strip():
                all_data.append({
                    "language": lang,
                    "question": val
                })

        except Exception as e:
            print(f"❌ Failed to process {file.name}: {e}")
    
    return all_data

def load_csv_to_json(start_date=None, end_date=None):
    global _cached_data
    cache_key = f"{start_date}_{end_date}"
    if cache_key in _cached_data:
        print('load old cache')
        return _cached_data[cache_key]
    else :
        print('load new cache')

    results = load_all_csv_files_to_json(start_date, end_date)
    _cached_data[cache_key] = results
    return results


def reset_inquiry_cache():
    global _cached_data
    _cached_data = {}
    print('🧹 Cleared inquiry cache')
