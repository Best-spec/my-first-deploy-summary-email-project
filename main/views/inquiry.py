from django.http import JsonResponse
from main.models import UploadedFile
from collections import defaultdict
import pandas as pd
from pathlib import Path
from datetime import datetime
# from compare.data_loader import loadSet1, loadSet2
# from compare.result_compare import Resultcompare

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
    return all_data

# def calculate_inquiry_summary(json):
#     try:
#         print(datetime)
#         folder_path = Path("media/uploads")
#         inquiry_json = []

#         files = folder_path.glob("inquiry-form-*.csv")

#         # เก็บผลลัพธ์ summary
#         summary = defaultdict(lambda: defaultdict(int))

#         # คอลัมน์ที่ใช้ดูประเภท inquiry
#         for file in files:
#             try:
#                 df = pd.read_csv(file)
#                 df.columns = df.columns.str.replace('\ufeff', '').str.strip('"')
#                 col_name = df.columns[0]
#                 # print(col_name)
#             except Exception as e:
#                 print(f"Failed to process {file}: {e}")
#                 continue

#             if "-en" in file.name:
#                 lang = "English"
#             elif "-th" in file.name:
#                 lang = "Thai"
#             elif "-ru" in file.name:
#                 lang = "Russia"
#             elif "-de" in file.name:
#                 lang = "German"
#             elif "-ar" in file.name:
#                 lang = "Arabic"
#             elif "-zh" in file.name:
#                 lang = "Chinese"
#             else:
#                 continue

#             for cat in categories.get(lang, []):
#                 count = df[col_name].astype(str).str.strip().eq(cat).sum()
#                 summary[lang][cat] += count
#                 # print(cat)
            
#         summary_dict = {
#             lang: {cat: int(count) for cat, count in summary[lang].items()}
#             for lang in summary
#         }
        
#         # สร้าง reverse mapping เพื่อหาประเภทจากชื่อคำถาม
#         reverse_mapping = {}
#         for category, questions in category_mapping.items():
#             for question in questions:
#                 reverse_mapping[question] = category
        
#         # สร้างตารางใหม่โดยจำแนกตามประเภทคำถาม
#             category_summary = {}
#             all_languages = list(summary_dict.keys())

#             # เตรียมข้อมูลสำหรับแต่ละประเภทคำถาม
#             for category in category_mapping.keys():
#                 category_summary[category] = {}
#                 for lang in all_languages:
#                     category_summary[category][lang] = 0

#             # รวบรวมข้อมูลจากแต่ละภาษา
#             for lang, questions in summary_dict.items():
#                 for question, count in questions.items():
#                     category = reverse_mapping.get(question, 'Other')
#                     category_summary[category][lang] += count

#             # เตรียม header (สลับแกน: ภาษาเป็นแถว, ประเภทคำถามเป็นคอลัมน์)
#         all_categories = list(category_mapping.keys())

#         output = []

#         # step 1: รวมข้อมูลต่อแถว (language)
#         for lang in all_languages:
#             row = {"language": lang}
#             row_total = 0
#             for category in all_categories:
#                 count = category_summary[category].get(lang, 0)
#                 row[category] = count
#                 row_total += count
#             row["Total Language"] = row_total  # ← total per row
#             output.append(row)

#         # step 2: รวมข้อมูลแนวตั้ง (total ต่อ category)
#         total_row = {"language": "Total inquiry"}
#         grand_total = 0
#         for category in all_categories:
#             cat_total = sum(category_summary[category].values())
#             total_row[category] = cat_total
#             grand_total += cat_total

#         total_row["Total Language"] = grand_total  # ← total สุดท้าย
#         output.append(total_row)

#         data_chart = {
#             "name": "All Language Inquiry",  # ใส่ key แรก
#             **{
#                 category: sum(category_summary[category].values())
#                 for category in category_summary
#             }
#         }


#         for_table = output
#         for_chart = [data_chart]
#         # print(grand_total)
#         return for_table, for_chart
    
#     except Exception as e:
#         print("🔥 ERROR:", e)


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
        all_languages = list(summary.keys())
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

        if missing_questions:
            print("📌 คำถามที่ไม่เข้า category mapping:")
            for lang, qs in missing_questions.items():
                print(f"🔹 {lang}:")
                for q in qs:
                    print(f"    - {q}")

        return output, [data_chart]

    except Exception as e:
        print("🔥 ERROR:", e)
        return [], []


def cal(start, end):
    start_date = datetime.strptime(start, "%Y-%m-%d").strftime("%d/%m/%Y")
    end_date = datetime.strptime(end, "%Y-%m-%d").strftime("%d/%m/%Y")
    json_data = load_csv_to_json(start_date=start_date, end_date=end_date)
    for_table, for_chart = calculate_inquiry_summary(json_data)
    # print(for_table, for_chart)
    return for_table, for_chart


def find_inquiry(date_param):
    try:
        if len(date_param) <= 1:
            print(date_param, len(date_param))
            start = date_param[0]['startDate']
            end = date_param[0]['endDate']
            for_table, for_chart = cal(start, end)
            return for_table, for_chart

        else:
            print('มากกว่าสอง')
            startset1 = date_param[0]['startDate']
            endset1 = date_param[0]['endDate']
            startset2 = date_param[1]['startDate']
            endset2 = date_param[1]['endDate']
            print(date_param)
            # loadSet1(startset1, endset1)
            # loadSet2(startset2, endset2)
            # # set1 = cal(startset1, endset1)
            # # set2 = cal(startset2, endset2)
            # for_table, for_chart = Resultcompare()
            # return for_table, for_chart



    except Exception as e:
        print("🔥 ERROR in find_inquiry():", e)
        return [], []

# def find_inquiry(datetime):
#     try:
#         print(datetime)
#         folder_path = Path("media/uploads")
#         inquiry_json = []

#         files = folder_path.glob("inquiry-form-*.csv")

#         # เก็บผลลัพธ์ summary
#         summary = defaultdict(lambda: defaultdict(int))

#         # คอลัมน์ที่ใช้ดูประเภท inquiry
#         for file in files:
#             try:
#                 df = pd.read_csv(file)
#                 df.columns = df.columns.str.replace('\ufeff', '').str.strip('"')
#                 col_name = df.columns[0]
#                 # print(col_name)
#             except Exception as e:
#                 print(f"Failed to process {file}: {e}")
#                 continue

#             if "-en" in file.name:
#                 lang = "English"
#             elif "-th" in file.name:
#                 lang = "Thai"
#             elif "-ru" in file.name:
#                 lang = "Russia"
#             elif "-de" in file.name:
#                 lang = "German"
#             elif "-ar" in file.name:
#                 lang = "Arabic"
#             elif "-zh" in file.name:
#                 lang = "Chinese"
#             else:
#                 continue

#             for cat in categories.get(lang, []):
#                 count = df[col_name].astype(str).str.strip().eq(cat).sum()
#                 summary[lang][cat] += count
#                 # print(cat)
            
#         summary_dict = {
#             lang: {cat: int(count) for cat, count in summary[lang].items()}
#             for lang in summary
#         }
        
#         # สร้าง reverse mapping เพื่อหาประเภทจากชื่อคำถาม
#         reverse_mapping = {}
#         for category, questions in category_mapping.items():
#             for question in questions:
#                 reverse_mapping[question] = category
        
#         # สร้างตารางใหม่โดยจำแนกตามประเภทคำถาม
#             category_summary = {}
#             all_languages = list(summary_dict.keys())

#             # เตรียมข้อมูลสำหรับแต่ละประเภทคำถาม
#             for category in category_mapping.keys():
#                 category_summary[category] = {}
#                 for lang in all_languages:
#                     category_summary[category][lang] = 0

#             # รวบรวมข้อมูลจากแต่ละภาษา
#             for lang, questions in summary_dict.items():
#                 for question, count in questions.items():
#                     category = reverse_mapping.get(question, 'Other')
#                     category_summary[category][lang] += count

#             # เตรียม header (สลับแกน: ภาษาเป็นแถว, ประเภทคำถามเป็นคอลัมน์)
#         all_categories = list(category_mapping.keys())

#         output = []

#         # step 1: รวมข้อมูลต่อแถว (language)
#         for lang in all_languages:
#             row = {"language": lang}
#             row_total = 0
#             for category in all_categories:
#                 count = category_summary[category].get(lang, 0)
#                 row[category] = count
#                 row_total += count
#             row["Total Language"] = row_total  # ← total per row
#             output.append(row)

#         # step 2: รวมข้อมูลแนวตั้ง (total ต่อ category)
#         total_row = {"language": "Total inquiry"}
#         grand_total = 0
#         for category in all_categories:
#             cat_total = sum(category_summary[category].values())
#             total_row[category] = cat_total
#             grand_total += cat_total

#         total_row["Total Language"] = grand_total  # ← total สุดท้าย
#         output.append(total_row)

#         data_chart = {
#             "name": "All Language Inquiry",  # ใส่ key แรก
#             **{
#                 category: sum(category_summary[category].values())
#                 for category in category_summary
#             }
#         }


#         for_table = output
#         for_chart = [data_chart]
#         # print(grand_total)
#         return for_table, for_chart
    
#     except Exception as e:
#         print("🔥 ERROR:", e)

def get_total_languages_summary(date):
    try:
        table, _ = find_inquiry(date)  # ดึงข้อมูลตารางจาก find_inquiry()

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