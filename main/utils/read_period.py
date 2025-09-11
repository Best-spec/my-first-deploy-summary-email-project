# from main.utils.load_data.csv.load_csv import LoadAllCSV
from datetime import datetime
import polars as pl

# def format_date_ddmmyyyy_to_yyyymmdd(date_str):
#     return datetime.strptime(date_str, "%d/%m/%Y").strftime("%Y-%m-%d")

# def period_min_max(column='Entry Date'):
#     all_files = LoadAllCSV()
#     df = all_files.date_all_files()

#     if df.is_empty():
#         # all_files = None
#         return {'min': None, 'max': None}

#     min = df.select(pl.col(column).min()).item()
#     max = df.select(pl.col(column).max()).item()

#     return {
#         'min': format_date_ddmmyyyy_to_yyyymmdd(min),
#         'max': format_date_ddmmyyyy_to_yyyymmdd(max)
#     }
