# 📁 services/inquiry/loader.py
import pandas as pd
from pathlib import Path
from datetime import datetime
from .constants import LANG_MAP

def load_csv_to_dataframe(start_date=None, end_date=None):
    folder_path = Path("media/uploads")
    df_list = []

    for file in folder_path.glob("inquiry-form-*.csv"):
        try:
            df = pd.read_csv(file)
            df.columns = df.columns.str.replace('\ufeff', '').str.strip('"')
            col_name = df.columns[0]
            date_col = "Entry Date"
            df["language"] = next((LANG_MAP[suffix] for suffix in LANG_MAP if suffix in file.name), None)
            df = df.rename(columns={col_name: "question"})
            df[date_col] = pd.to_datetime(df[date_col], errors='coerce')

            if start_date:
                df = df[df[date_col].dt.date >= datetime.strptime(start_date, "%d/%m/%Y").date()]
            if end_date:
                df = df[df[date_col].dt.date <= datetime.strptime(end_date, "%d/%m/%Y").date()]

            df = df[["language", "question"]].dropna()
            df_list.append(df)

        except Exception as e:
            print(f"❌ Failed to process {file}: {e}")
            continue

    return pd.concat(df_list, ignore_index=True) if df_list else pd.DataFrame(columns=["language", "question"])