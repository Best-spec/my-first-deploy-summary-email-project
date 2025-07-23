from django.http import JsonResponse
from main.models import UploadedFile
from collections import defaultdict
import pandas as pd
from pathlib import Path
from datetime import datetime
from .compare.data_loader import *
from .compare.result_compare import Resultcompare
import json

LANG_MAP = {
    "-th": "Thai",
    "-en": "English",
    "-ar": "Arabic",    
    "-ru": "Russia",  # ✅ ให้ตรงกับ categories
    "-de": "German",
    "-zh": "Chinese",
}

categories = {
    'English': [
        "General Inquiry",
        "Estimated Cost",
        "Contact My Doctor at Bangkok Hospital Pattaya",
        "Other"
    ],
    'Thai': [
        "สอบถามทั่วไป",
        "ค่าใช้จ่าย",
        "ติดต่อกับหมอประจำตัวที่โรงพยาบาลกรุงเทพพัทยา",
        "อื่นๆ"
    ],
    'Russia': [  # ✅ เปลี่ยนจาก 'Russia'
        "Общий запрос",
        "Узнать про цену",
        "Написать врачу",
        "Другое"
    ],
    'Arabic': [
        "General Inquiry",
        "Estimated Cost",
        "Contact My Doctor at Bangkok Hospital Pattaya",
        "Other"
    ],
    'Chinese': [
        "普通咨询",
        "预估价格咨询",
        "联系芭提雅曼谷医院医生",
        "其他"
    ],
    'German': [
        "Allgemeine Anfrage",
        "Vorraussichtliche Kosten",
        "Arzt im Bangkok Hospital Pattaya kontaktieren",
        "Andere"
    ]
}

category_mapping = {
    'General Inquiry': [
        'General Inquiry', 'Allgemeine Anfrage', 'Общий запрос', 'สอบถามทั่วไป', '普通咨询'
    ],
    'Estimated Cost': [
        'Estimated Cost', 'Vorraussichtliche Kosten', 'Узнать про цену', 'ค่าใช้จ่าย', '预估价格咨询'
    ],
    'Contact Doctor': [
        'Contact My Doctor at Bangkok Hospital Pattaya', 'Arzt im Bangkok Hospital Pattaya kontaktieren',
        'Написать врачу', 'ติดต่อกับหมอประจำตัวที่โรงพยาบาลกรุงเทพพัทยา', '联系芭提雅曼谷医院医生'
    ],
    'Other': [
        'Other', 'Andere', 'Другое', 'อื่นๆ', '其他'
    ]
}



def load_csv_to_json(start_date=None, end_date=None):
    folder_path = Path("media/uploads")
    all_data = []

    files = folder_path.glob("inquiry-form-*.csv")

    for file in files:
        try:
            df = pd.read_csv(file)
            df.columns = df.columns.str.replace('\ufeff', '').str.strip('"')
            col_name = df.columns[0]
            date_col = "Entry Date"
            count = df[col_name].astype(str).str.strip().str.lower().eq("general inquiry").sum()
        except Exception as e:
            print(f"❌ Failed to read {file}: {e}")
            continue

        # ✅ หาภาษา
        lang = next((LANG_MAP[suffix] for suffix in LANG_MAP if suffix in file.name), None)
        if not lang:
            continue

        try:
            df[date_col] = pd.to_datetime(df[date_col], errors='coerce') #total all
            # print(df[date_col])
        except Exception as e:
            print(f"⚠️ Date parse error in {file}: {e}")
            continue

        if start_date:
            start_dt = datetime.strptime(start_date, "%d/%m/%Y").date()
            df = df[df[date_col].dt.date >= start_dt]

        if end_date:
            end_dt = datetime.strptime(end_date, "%d/%m/%Y").date()
            df = df[df[date_col].dt.date <= end_dt]

        for val in df[col_name].astype(str).str.strip():
            all_data.append({
                "language": lang,
                "question": val
            })
        
        # print(json.dumps(all_data, indent=2, ensure_ascii=False))
    return all_data

def calculate_inquiry_summary(data_json):
    try:
        # เตรียม summary → lang → question → count
        summary = defaultdict(lambda: defaultdict(int))

        for row in data_json:
            lang = row["language"]
            question = row["question"].strip()
            summary[lang][question] += 1

        # 🔁 reverse mapping แบบ normalize (strip + lower)
        reverse_mapping = {
            q.strip().lower(): cat
            for cat, questions in category_mapping.items()
            for q in questions
        }

        # 🔁 normalize question ก่อนใช้
        category_summary = defaultdict(lambda: defaultdict(int))
        missing_questions = defaultdict(set)

        for lang, questions in summary.items():
            for question, count in questions.items():
                norm_q = question.strip().lower()
                cat = reverse_mapping.get(norm_q, "Other")

                if cat == "Other":
                    missing_questions[lang].add(question)

                category_summary[cat][lang] += count

        # เตรียม header
        all_languages = ["English", "Thai", "Russia", "German", "Chinese", "Arabic"]
        all_categories = list(category_mapping.keys())

        output = []
        for lang in all_languages:
            row = {"language": lang}
            row_total = 0
            for category in all_categories:
                count = category_summary[category].get(lang, 0)
                row[category] = count
                row_total += count
            row["Total Language"] = row_total
            output.append(row)

        total_row = {"language": "Total inquiry"}
        grand_total = 0
        for category in all_categories:
            cat_total = sum(category_summary[category].values())
            total_row[category] = cat_total
            grand_total += cat_total
        total_row["Total Language"] = grand_total
        output.append(total_row)

        data_chart = {
            "name": "All Language Inquiry",
            **{
                category: sum(category_summary[category].values())
                for category in category_summary
            }
        }
        
        # print(json.dumps(output, indent=2, ensure_ascii=False))
        return output, [data_chart]

    except Exception as e:
        print("🔥 ERROR:", e)
        return [], []


def cal_inquiry(start, end):
    start_date = datetime.strptime(start, "%Y-%m-%d").strftime("%d/%m/%Y")
    end_date = datetime.strptime(end, "%Y-%m-%d").strftime("%d/%m/%Y")
    json_data = load_csv_to_json(start_date=start_date, end_date=end_date)
    for_table, for_chart = calculate_inquiry_summary(json_data)
    # print(for_table, for_chart)
    return for_table, for_chart


def find_inquiry(date_param):
    try:
        if len(date_param) <= 1:
            # print(date_param, len(date_param))
            start = date_param[0]['startDate']
            end = date_param[0]['endDate']
            for_table, for_chart = cal_inquiry(start, end)
            return {
                "dataForTable": for_table,
                "dataForChart": for_chart
            }

        else:
            print('มากกว่าสอง')
            startset1 = date_param[0]['startDate']
            endset1 = date_param[0]['endDate']
            startset2 = date_param[1]['startDate']
            endset2 = date_param[1]['endDate']
            table1, chart1 = cal_inquiry(startset1, endset1)
            table2, chart2 = cal_inquiry(startset2, endset2)
            print(Resultcompare(table1, table2, date_param))
            # return [Resultcompare(table1, table2, date_param)]
            return {
                "dataForTable": Resultcompare(table1, table2, date_param),
                "dataForChart": chart1
            }



    except Exception as e:
        print("🔥 ERROR in find_inquiry():", e)
        return [], []


def get_total_languages_summary(date_param):
    try:
        table, _ = cal_inquiry(date_param['startDate'], date_param['endDate'])  # ดึงข้อมูลตารางจาก find_inquiry()

        result = []
        for row in table:
            lang = row.get("language")
            total = row.get("Total Language", 0)
            if lang and "Total Language" in row:
                result.append({
                    "language": lang,
                    "Total Language": total
                })
        # print(result)
        return result

    except Exception as e:
        print("🔥 ERROR (get_total_languages_summary):", e)
        return []