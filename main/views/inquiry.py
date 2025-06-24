from django.http import JsonResponse
from main.models import UploadedFile
from collections import defaultdict
import pandas as pd
from pathlib import Path

LANG_MAP = {
    "-th": "Thai",
    "-en": "English",
    "-ar": "Arabic",
    "-ru": "Russian",
    "-de": "German",
    "-zh": "Chinese",
}

categories = {
    'English' : [
        "General Inquiry",
        "Estimated Cost",
        "Contact My Doctor at Bangkok Hospital Pattaya",
        "Other"
    ],

    'Thai' : [
        "สอบถามทั่วไป",
        "ค่าใช้จ่าย",
        "ติดต่อกับหมอประจำตัวที่โรงพยาบาลกรุงเทพพัทยา",
        "อื่นๆ"
    ],

    'Russia' : [
        "Общий запрос",
        "Узнать про цену",
        "Написать врачу",
        "Другое"
    ],
    'Arabic' : [
        "General Inquiry",
        "Estimated Cost",
        "Contact My Doctor at Bangkok Hospital Pattaya",
        "Other"
    ],

    'Chinese' : [
        "普通咨询",
        "预估价格咨询",
        "联系芭提雅曼谷医院医生",
        "其他"
    ],

    'German' : [
        "Allgemeine Anfrage",
        "Vorraussichtliche Kosten",
        "Arzt im Bangkok Hospital Pattaya kontaktieren",
        "Andere"
    ]
}

category_mapping = {
    'General Inquiry': ['General Inquiry', 'Allgemeine Anfrage', 'Общий запрос', 'สอบถามทั่วไป', '普通咨询'],
    'Estimated Cost': ['Estimated Cost', 'Vorraussichtliche Kosten', 'Узнать про цену', 'ค่าใช้จ่าย', '预估价格咨询'],
    'Contact Doctor': ['Contact My Doctor at Bangkok Hospital Pattaya', 'Arzt im Bangkok Hospital Pattaya kontaktieren', 'Написать врачу', 'ติดต่อกับหมอประจำตัวที่โรงพยาบาลกรุงเทพพัทยา', '联系芭提雅曼谷医院医生'],
    'Other': ['Other', 'Andere', 'Другое', 'อื่นๆ', '其他']
}


def find_inquiry():
    try:
        folder_path = Path("media/uploads")
        inquiry_json = []

        files = folder_path.glob("inquiry-form-*.csv")

        # เก็บผลลัพธ์ summary
        summary = defaultdict(lambda: defaultdict(int))

        # คอลัมน์ที่ใช้ดูประเภท inquiry
        for file in files:
            try:
                df = pd.read_csv(file)
                df.columns = df.columns.str.replace('\ufeff', '').str.strip('"')
                col_name = df.columns[0]
                # print(col_name)
            except Exception as e:
                print(f"Failed to process {file}: {e}")
                continue

            if "-en" in file.name:
                lang = "English"
            elif "-th" in file.name:
                lang = "Thai"
            elif "-ru" in file.name:
                lang = "Russia"
            elif "-de" in file.name:
                lang = "German"
            elif "-ar" in file.name:
                lang = "Arabic"
            elif "-zh" in file.name:
                lang = "Chinese"
            else:
                continue

            for cat in categories.get(lang, []):
                count = df[col_name].astype(str).str.strip().eq(cat).sum()
                summary[lang][cat] += count
                # print(cat)
            
        summary_dict = {
            lang: {cat: int(count) for cat, count in summary[lang].items()}
            for lang in summary
        }
        
        # สร้าง reverse mapping เพื่อหาประเภทจากชื่อคำถาม
        reverse_mapping = {}
        for category, questions in category_mapping.items():
            for question in questions:
                reverse_mapping[question] = category
        
        # สร้างตารางใหม่โดยจำแนกตามประเภทคำถาม
            category_summary = {}
            all_languages = list(summary_dict.keys())

            # เตรียมข้อมูลสำหรับแต่ละประเภทคำถาม
            for category in category_mapping.keys():
                category_summary[category] = {}
                for lang in all_languages:
                    category_summary[category][lang] = 0

            # รวบรวมข้อมูลจากแต่ละภาษา
            for lang, questions in summary_dict.items():
                for question, count in questions.items():
                    category = reverse_mapping.get(question, 'Other')
                    category_summary[category][lang] += count

            # เตรียม header (สลับแกน: ภาษาเป็นแถว, ประเภทคำถามเป็นคอลัมน์)
        all_categories = list(category_mapping.keys())

        output = []

        # step 1: รวมข้อมูลต่อแถว (language)
        for lang in all_languages:
            row = {"language": lang}
            row_total = 0
            for category in all_categories:
                count = category_summary[category].get(lang, 0)
                row[category] = count
                row_total += count
            row["Total Language"] = row_total  # ← total per row
            output.append(row)

        # step 2: รวมข้อมูลแนวตั้ง (total ต่อ category)
        total_row = {"language": "Total inquiry"}
        grand_total = 0
        for category in all_categories:
            cat_total = sum(category_summary[category].values())
            total_row[category] = cat_total
            grand_total += cat_total

        total_row["Total Language"] = grand_total  # ← total สุดท้าย
        output.append(total_row)

        data_chart = {
            "name": "All Language Inquiry",  # ใส่ key แรก
            **{
                category: sum(category_summary[category].values())
                for category in category_summary
            }
        }


        for_table = output
        for_chart = [data_chart]
        # print(grand_total)
        return for_table, for_chart
    
    except Exception as e:
        print("🔥 ERROR:", e)

def get_total_languages_summary():
    try:
        table, _ = find_inquiry()  # ดึงข้อมูลตารางจาก find_inquiry()

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