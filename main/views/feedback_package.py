import os
import glob
import pandas as pd
from pathlib import Path
from django.http import JsonResponse


def find_FeedbackAndPackage():
    folder_path = "media/uploads"  # เปลี่ยน path ตามที่ใช้ในโปรเจกต์ของมึง
    lang_stats = {}

    # ค้นหาไฟล์
    feedback = glob.glob(os.path.join(folder_path, "feedback*.csv"))
    packages = glob.glob(os.path.join(folder_path, "packages*.csv"))

    def extract_language(filename):
        basename = os.path.basename(filename).lower()
        if '-ar' in basename:
            return 'Arabic'
        elif '-de' in basename:
            return 'German'
        elif '-en' in basename:
            return 'English'
        elif '-ru' in basename:
            return 'Russian'
        elif '-th' in basename:
            return 'Thai'
        elif '-zh' in basename:
            return 'Chinese'
        return 'Unknown'

    # อ่าน feedback
    for file in feedback:
        lang = extract_language(file)
        if lang not in lang_stats:
            lang_stats[lang] = {'Feedback': 0, 'Packages': 0}
        try:
            df = pd.read_csv(file)
            df.columns = df.columns.str.strip().str.replace('\ufeff', '')
            if len(df.columns) > 0:
                col_name = df.columns[0]
                count = len(df[col_name])
                lang_stats[lang]['Feedback'] += count
        except Exception as e:
            print(f"🔥 Error reading feedback file {file}: {e}")

    # อ่าน packages
    for file in packages:
        lang = extract_language(file)
        if lang not in lang_stats:
            lang_stats[lang] = {'Feedback': 0, 'Packages': 0}
        try:
            df = pd.read_csv(file)
            df.columns = df.columns.str.strip().str.replace('\ufeff', '')
            if len(df.columns) > 0:
                col_name = df.columns[0]
                count = len(df[col_name])
                lang_stats[lang]['Packages'] += count
        except Exception as e:
            print(f"🔥 Error reading packages file {file}: {e}")

    # สร้าง output list
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

    # รวม total ทุกภาษา
    result.append({
        "Language": "Total",
        "Feedback": total_feedback,
        "Packages": total_packages,
        "Total": total_feedback + total_packages
    })

    return [result]

def FPtotal():
    raw_json = find_FeedbackAndPackage()
    result = raw_json[0]

    total = [{key: val for key, val in result[-1].items() if key in ("Feedback", "Packages")}]
    print(total)

    return total
        
