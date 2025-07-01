import os
import glob
import pandas as pd
from pathlib import Path
from django.http import JsonResponse
from datetime import datetime
import json

# def find_FeedbackAndPackage(date=None):
#     folder_path = "media/uploads"  # เปลี่ยน path ตามที่ใช้ในโปรเจกต์ของมึง
#     lang_stats = {}

#     # ค้นหาไฟล์
#     feedback = glob.glob(os.path.join(folder_path, "feedback*.csv"))
#     packages = glob.glob(os.path.join(folder_path, "packages*.csv"))

#     def extract_language(filename):
#         basename = os.path.basename(filename).lower()
#         if '-ar' in basename:
#             return 'Arabic'
#         elif '-de' in basename:
#             return 'German'
#         elif '-en' in basename:
#             return 'English'
#         elif '-ru' in basename:
#             return 'Russia'
#         elif '-th' in basename:
#             return 'Thai'
#         elif '-zh' in basename:
#             return 'Chinese'
#         return 'Unknown'

#     # อ่าน feedback
#     for file in feedback:
#         lang = extract_language(file)
#         if lang not in lang_stats:
#             lang_stats[lang] = {'Feedback': 0, 'Packages': 0}
#         try:
#             df = pd.read_csv(file)
#             df.columns = df.columns.str.strip().str.replace('\ufeff', '')
#             if len(df.columns) > 0:
#                 col_name = df.columns[0]
#                 count = len(df[col_name])
#                 lang_stats[lang]['Feedback'] += count
#         except Exception as e:
#             print(f"🔥 Error reading feedback file {file}: {e}")

#     # อ่าน packages
#     for file in packages:
#         lang = extract_language(file)
#         if lang not in lang_stats:
#             lang_stats[lang] = {'Feedback': 0, 'Packages': 0}
#         try:
#             df = pd.read_csv(file)
#             df.columns = df.columns.str.strip().str.replace('\ufeff', '')
#             if len(df.columns) > 0:
#                 col_name = df.columns[0]
#                 count = len(df[col_name])
#                 lang_stats[lang]['Packages'] += count
#         except Exception as e:
#             print(f"🔥 Error reading packages file {file}: {e}")

#     # สร้าง output list
#     result = []
#     total_feedback = total_packages = 0
#     for lang, data in lang_stats.items():
#         total = data['Feedback'] + data['Packages']
#         total_feedback += data['Feedback']
#         total_packages += data['Packages']
#         result.append({
#             "Language": lang,
#             "Feedback": data['Feedback'],
#             "Packages": data['Packages'],
#             "Total": total
#         })

#     # รวม total ทุกภาษา
#     result.append({
#         "Language": "Total",
#         "Feedback": total_feedback,
#         "Packages": total_packages,
#         "Total": total_feedback + total_packages
#     })

#     return [result]

def extract_language(filename):
    basename = os.path.basename(filename).lower()
    if '-ar' in basename:
        return 'Arabic'
    elif '-de' in basename:
        return 'German'
    elif '-en' in basename:
        return 'English'
    elif '-ru' in basename:
        return 'Russia'
    elif '-th' in basename:
        return 'Thai'
    elif '-zh' in basename:
        return 'Chinese'
    return 'Unknown'

def convert_csv_to_json(folder_path="media/uploads"):
    """
    อ่านไฟล์ feedback*.csv และ packages*.csv แล้วแปลงเป็น JSON list
    แต่ละ record จะมี field: [column from csv] + Language + Type
    """
    all_data = []

    feedback_files = glob.glob(os.path.join(folder_path, "feedback*.csv"))
    packages_files = glob.glob(os.path.join(folder_path, "packages*.csv"))

    # อ่าน feedback
    for file in feedback_files:
        lang = extract_language(file)
        try:
            df = pd.read_csv(file)
            df.columns = df.columns.str.strip().str.replace('\ufeff', '')
            df['Language'] = lang
            df['Type'] = 'Feedback'
            all_data.extend(df.to_dict(orient='records'))
        except Exception as e:
            print(f"🔥 Error reading {file}: {e}")

    # อ่าน packages
    for file in packages_files:
        lang = extract_language(file)
        try:
            df = pd.read_csv(file)
            df.columns = df.columns.str.strip().str.replace('\ufeff', '')
            df['Language'] = lang
            df['Type'] = 'Packages'
            all_data.extend(df.to_dict(orient='records'))
        except Exception as e:
            print(f"🔥 Error reading {file}: {e}")

    return all_data

def process_json_list(data_list, date_col='Entry Date', start_date=None, end_date=None):
    """
    คำนวณจำนวน Feedback และ Packages จาก JSON list
    รองรับการกรองช่วงวันที่ด้วย (format วันที่ยืดหยุ่น)
    """
    lang_stats = {}

    dt_start = datetime.strptime(start_date, "%d/%m/%Y").date() #01/04/2025
    dt_end = datetime.strptime(end_date, "%d/%m/%Y").date() #30/04/2025

    print(json.dumps(data_list, indent=2 ,ensure_ascii=False))
    for record in data_list:
        lang = record.get('Language', 'Unknown')
        typ = record.get('Type', 'Unknown')

        if lang not in lang_stats:
            lang_stats[lang] = {'Feedback': 0, 'Packages': 0}

        if typ == 'Feedback':
            lang_stats[lang]['Feedback'] += 1
        elif typ == 'Packages':
            lang_stats[lang]['Packages'] += 1

    # รวมผล
    result = []
    total_feedback = total_packages = 0
    for lang, data in lang_stats.items():
        total = data['Feedback'] + data['Packages']
        total_feedback += data['Feedback']
        total_packages += data['Packages']
        result.append({
            "Language": lang,
            "Feedback": data['Feedback'],
            "Packages": data['Packages'],
            "Total": total
        })

    result.append({
        "Language": "Total",
        "Feedback": total_feedback,
        "Packages": total_packages,
        "Total": total_feedback + total_packages
    })

    return result

def find_FeedbackAndPackage(date_param):
    try:
        start_date = datetime.strptime(date_param["startDate"], "%Y-%m-%d").strftime("%d/%m/%Y")
        end_date = datetime.strptime(date_param["endDate"], "%Y-%m-%d").strftime("%d/%m/%Y")
        print(start_date)
        data = convert_csv_to_json()
        print(data[0]['Type'])
        # print(json.dumps(data, indent=2, ensure_ascii=False))  # พิมพ์ให้ดูสวย อ่านง่าย
        summary = process_json_list(data, date_col='Entry Date', start_date=start_date, end_date=end_date)
        print(summary)
        return [summary]
    except Exception as e:
        print(f"🔥 Error in find_FeedbackAndPackage: {e}")
        return None

def FPtotal():
    raw_json = find_FeedbackAndPackage()
    result = raw_json[0]

    total = [{key: val for key, val in result[-1].items() if key in ("Feedback", "Packages")}]
    print(total)

    return total
        
