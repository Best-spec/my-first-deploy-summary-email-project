# services/inquiry/utils.py
import pandas as pd
from datetime import datetime
from main.core.services.inquiry.cache import PRELOADED_INQUIRY_DF

def filter_inquiry_by_date(start, end):
    if PRELOADED_INQUIRY_DF is None:
        print("⚠️ ยังไม่มีข้อมูล preload")
        return pd.DataFrame()

    start_dt = datetime.strptime(start, "%Y-%m-%d").date()
    end_dt = datetime.strptime(end, "%Y-%m-%d").date()

    df = PRELOADED_INQUIRY_DF.copy()
    df["Entry Date"] = pd.to_datetime(df["Entry Date"], errors="coerce")
    return df[(df["Entry Date"].dt.date >= start_dt) & (df["Entry Date"].dt.date <= end_dt)]
