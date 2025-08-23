import os
import glob
import pandas as pd
from pathlib import Path
from django.http import JsonResponse
from datetime import datetime
import json
from main.utils.compare.result_compare import Resultcompare
from main.utils.load_data.feedback_package import convert_csv_to_json


# def extract_language(filename):
#     basename = os.path.basename(filename).lower()
#     if '-ar' in basename:
#         return 'Arabic'
#     elif '-de' in basename:
#         return 'German'
#     elif '-en' in basename:
#         return 'English'
#     elif '-ru' in basename:
#         return 'Russia'
#     elif '-th' in basename:
#         return 'Thai'
#     elif '-zh' in basename:
#         return 'Chinese'
#     return 'Unknown'

# def convert_csv_to_json(folder_path="media/uploads"):
#     """
#     อ่านไฟล์ feedback*.csv และ packages*.csv แล้วแปลงเป็น JSON list
#     แต่ละ record จะมี field: [column from csv] + Language + Type
#     """
#     all_data = []

#     feedback_files = glob.glob(os.path.join(folder_path, "feedback*.csv"))
#     packages_files = glob.glob(os.path.join(folder_path, "packages*.csv"))

#     # อ่าน feedback
#     for file in feedback_files:
#         lang = extract_language(file)
#         try:
#             df = pd.read_csv(file)
#             df.columns = df.columns.str.strip().str.replace('\ufeff', '')
#             df['Language'] = lang
#             df['Type'] = 'Feedback'
#             all_data.extend(df.to_dict(orient='records'))
#         except Exception as e:
#             print(f"🔥 Error reading {file}: {e}")

#     # อ่าน packages
#     for file in packages_files:
#         lang = extract_language(file)
#         try:
#             df = pd.read_csv(file)
#             df.columns = df.columns.str.strip().str.replace('\ufeff', '')
#             df['Language'] = lang
#             df['Type'] = 'Packages'
#             all_data.extend(df.to_dict(orient='records'))
#         except Exception as e:
#             print(f"🔥 Error reading {file}: {e}")
#     # print(json.dumps(all_data, indent=2))
#     return all_data

def process_json_list(data_list, date_col='Entry Date', start_date=None, end_date=None):
    """
    คำนวณจำนวน Feedback และ Packages จาก JSON list
    รองรับการกรองช่วงวันที่ด้วย (format วันที่ยืดหยุ่น)
    """
    lang_stats = {}

    dt_start = None
    dt_end = None

    # แปลงวันที่เริ่มต้นและสิ้นสุดที่รับเข้ามาให้อยู่ในรูปแบบ datetime.date
    if start_date:
        try:
            dt_start = datetime.strptime(start_date, "%d/%m/%Y").date()
        except ValueError:
            print(f"คำเตือน: รูปแบบวันที่เริ่มต้น '{start_date}' ไม่ถูกต้อง. ควรเป็น DD/MM/YYYY")
            return [] # อาจจะต้องการจัดการข้อผิดพลาดในรูปแบบอื่น
    if end_date:
        try:
            dt_end = datetime.strptime(end_date, "%d/%m/%Y").date()
        except ValueError:
            print(f"คำเตือน: รูปแบบวันที่สิ้นสุด '{end_date}' ไม่ถูกต้อง. ควรเป็น DD/MM/YYYY")
            return [] # อาจจะต้องการจัดการข้อผิดพลาดในรูปแบบอื่น

    for record in data_list:
        entry_date_str = record.get(date_col)
        if not entry_date_str:
            continue # ข้ามรายการที่ไม่มีคอลัมน์วันที่

        record_date = None
        # เพิ่มรูปแบบวันที่และเวลาที่คุณมีเข้าไปในลิสต์
        date_formats = ["%Y-%m-%d %H:%M:%S", "%d/%m/%Y", "%Y-%m-%d", "%d-%m-%Y"] # เพิ่มรูปแบบใหม่ที่นี่
        for fmt in date_formats:
            try:
                # แปลงเป็น datetime object ก่อน แล้วค่อยเอาแค่ส่วน date มาเปรียบเทียบ
                record_datetime = datetime.strptime(entry_date_str, fmt)
                record_date = record_datetime.date() # เอาเฉพาะส่วนวันที่มาใช้ในการกรอง
                break # หากแปลงได้แล้ว ให้ออกจากลูป
            except ValueError:
                continue # ลองรูปแบบถัดไป

        if not record_date:
            print(f"คำเตือน: ไม่สามารถแยกวิเคราะห์วันที่ '{entry_date_str}' ได้. ข้ามรายการนี้.")
            continue # ข้ามรายการที่ไม่สามารถแปลงวันที่ได้

        # --- ส่วนของการกรองข้อมูลตามวันที่ ---
        if dt_start and record_date < dt_start:
            continue # ข้ามถ้าวันที่ในรายการอยู่ก่อนวันเริ่มต้น
        if dt_end and record_date > dt_end:
            continue # ข้ามถ้าวันที่ในรายการอยู่หลังวันสิ้นสุด
        # --- สิ้นสุดส่วนของการกรองข้อมูลตามวันที่ ---

        lang = record.get('Language', 'Unknown')
        typ = record.get('Type', 'Unknown')

        if lang not in lang_stats:
            lang_stats[lang] = {'Feedback': 0, 'Packages': 0}

        if typ == 'Feedback':
            lang_stats[lang]['Feedback'] += 1
        elif typ == 'Packages':
            lang_stats[lang]['Packages'] += 1

    # สรุปผลลัพธ์
    # result = []
    # total_feedback = total_packages = 0
    # for lang, data in lang_stats.items():
    #     total = data['Feedback'] + data['Packages']
    #     total_feedback += data['Feedback']
    #     total_packages += data['Packages']
    #     result.append({
    #         "Language": lang,
    #         "Feedback": data['Feedback'],
    #         "Packages": data['Packages'],
    #         "Total": total
    #     })

    all_languages = ["English", "Thai", "Russia", "German", "Chinese", "Arabic"]

    result = []
    total_feedback = total_packages = 0
    for lang in all_languages:
        data = lang_stats.get(lang, {'Feedback': 0, 'Packages': 0})
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
def cal_FeedbackAndPackage(date_param):
    try:
        start_date = datetime.strptime(date_param["startDate"], "%Y-%m-%d").strftime("%d/%m/%Y")
        end_date = datetime.strptime(date_param["endDate"], "%Y-%m-%d").strftime("%d/%m/%Y")
        # print(start_date)
        data = convert_csv_to_json()
        # print(data[0])
        # print(json.dumps(data, indent=2, ensure_ascii=False))  # พิมพ์ให้ดูสวย อ่านง่าย
        summary = process_json_list(data, start_date=start_date, end_date=end_date)
        # print(summary)
        return summary
    except Exception as e:
        print(f"🔥 Error in find_FeedbackAndPackage: {e}")
        return None
    
def find_FeedbackAndPackage(date_param):
    try:
        if len(date_param) <= 1:
            # print(date_param, len(date_param))
            # return [cal_FeedbackAndPackage(date_param[0])]
            table =  cal_FeedbackAndPackage(date_param[0])
            return {
                "dataForTable": table,
                "dataForChart": table
            }

        else:
            print('มากกว่าสอง')
            data1 = cal_FeedbackAndPackage(date_param[0])
            data2 = cal_FeedbackAndPackage(date_param[1])
            # return [Resultcompare(data1, data2, date_param)]
            table = Resultcompare(data1, data2, date_param)
            return {
                "dataForTable": table,
                "dataForChart": table
            }
            # print(Resultcompare(data1, data2, date_param))



    except Exception as e:
        print("🔥 ERROR in find_FeedbackAndPackage():", e)
        return [], []

def FPtotal(date_param):
    try:
        raw_json = cal_FeedbackAndPackage(date_param)
        total = {
            "Feedback": 0,
            "Packages": 0
        }

        for item in raw_json:
            total["Feedback"] += item.get("Feedback", 0)
            total["Packages"] += item.get("Packages", 0)

        return [total]
    except Exception as e:
        print("Error FPtotal:",e)
        
