# 📁 services/inquiry/service.py
from datetime import datetime
from .loader import load_csv_to_dataframe
from .summarizer import calculate_inquiry_summary
from main.views.compare.result_compare import Resultcompare

def cal_inquiry(start, end):
    start_date = datetime.strptime(start, "%Y-%m-%d").strftime("%d/%m/%Y")
    end_date = datetime.strptime(end, "%Y-%m-%d").strftime("%d/%m/%Y")
    df = load_csv_to_dataframe(start_date, end_date)
    return calculate_inquiry_summary(df)

def find_inquiry(date_param):
    try:
        if len(date_param) <= 1:
            table, chart = cal_inquiry(date_param[0]['startDate'], date_param[0]['endDate'])
            return {
                "dataForTable": table,
                "dataForChart": chart
            }
        table1, chart1 = cal_inquiry(date_param[0]['startDate'], date_param[0]['endDate'])
        table2, _ = cal_inquiry(date_param[1]['startDate'], date_param[1]['endDate'])
        return {
            "dataForTable": Resultcompare(table1, table2, date_param),
            "dataForChart": chart1
        }
    except Exception as e:
        print("🔥 ERROR in find_inquiry():", e)
        return [], []

def get_total_languages_summary(date_param):
    try:
        table, _ = cal_inquiry(date_param['startDate'], date_param['endDate'])
        return [{"language": row["language"], "Total Language": row["Total Language"]} for row in table if "Total Language" in row]
    except Exception as e:
        print("🔥 ERROR (get_total_languages_summary):", e)
        return []