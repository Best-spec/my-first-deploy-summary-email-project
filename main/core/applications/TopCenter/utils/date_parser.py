# app/utils/date_parser.py
from datetime import datetime

def parse_date(date_str):
    formats = ['%Y-%m-%d %H:%M:%S', '%d/%m/%Y %H:%M:%S', '%Y-%m-%d', '%d/%m/%Y']
    for fmt in formats:
        try:
            dt = datetime.strptime(date_str, fmt)
            return dt, dt.strftime('%Y-%m-%d')  # แปลงวันที่ให้ standardized
        except ValueError:
            continue
    return None, date_str