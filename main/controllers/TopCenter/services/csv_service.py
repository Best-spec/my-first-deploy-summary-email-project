# app/services/csv_service.py
import pandas as pd
import os, glob
from ..utils.date_parser import parse_date
from datetime import datetime

def load_csv_appointments(folder_path, langs, start_date, end_date, file_type="appointment"):
    all_data = []
    for lang in langs:
        pattern = f"{file_type}-{lang}-*.csv" if file_type != "recommended" else f"appointment-recommended-{lang}-*.csv"
        files = glob.glob(os.path.join(folder_path, pattern))
        for file in files:
            try:
                df = pd.read_csv(file)
                df.columns = df.columns.str.strip().str.replace('\ufeff', '')
                if 'Entry Date' not in df.columns or len(df.columns) < 2:
                    continue
                clinic_col = df.columns[1]
                for _, row in df.iterrows():
                    entry_date = str(row['Entry Date']).strip()
                    date_obj, clean_date_str = parse_date(entry_date)
                    if date_obj and (
                        (start_date and date_obj < start_date) or
                        (end_date and date_obj > end_date)
                    ):
                        continue
                    all_data.append({
                        "Centers & Clinics": str(row[clinic_col]).strip(),
                        "Entry Date": clean_date_str,
                        "Type": file_type
                    })
            except Exception as e:
                print(f"❌ Error reading {file}: {e}")
    return all_data