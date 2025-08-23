# 📁 services/inquiry/loader.py
import pandas as pd
from pathlib import Path
from datetime import datetime
from .constants import LANG_MAP


# 📁 services/inquiry/loader.py
def load_csv_all():
    folder_path = Path("media/uploads")
    df_list = []

    for file in folder_path.glob("inquiry-form-*.csv"):
        try:
            df = pd.read_csv(file)
            df.columns = df.columns.str.replace('\ufeff', '').str.strip('"')
            if "Entry Date" not in df.columns:
                print(f"⚠️ {file.name} ไม่มี Entry Date ข้ามไป")
                continue
            col_name = df.columns[0]
            df = df.rename(columns={col_name: "question"})
            df["Entry Date"] = pd.to_datetime(df["Entry Date"], errors='coerce')
            df["language"] = next((LANG_MAP[suffix] for suffix in LANG_MAP if suffix in file.name), None)
            df = df[["Entry Date", "language", "question"]].dropna()
            df_list.append(df)

        except Exception as e:
            print(f"❌ Failed to process {file}: {e}")
            continue

    return pd.concat(df_list, ignore_index=True) if df_list else pd.DataFrame(columns=["Entry Date", "language", "question"])
