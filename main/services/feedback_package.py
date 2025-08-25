from datetime import datetime
import json
from main.utils.compare.result_compare import Resultcompare
from main.utils.load_data.feedback_package import convert_csv_to_json


from datetime import datetime

def process_json_list(data_list, start_date=None, end_date=None):
    """
    กรองตามวันที่ แล้วสรุปผลแบบนับ Feedback / Packages ต่อภาษา
    """
    lang_stats = {}

    # แปลงช่วงวันที่
    dt_start = datetime.strptime(start_date, "%d/%m/%Y").date() if start_date else None
    dt_end = datetime.strptime(end_date, "%d/%m/%Y").date() if end_date else None

    # format วันที่ที่รองรับ
    date_formats = ["%Y-%m-%d %H:%M:%S", "%d/%m/%Y", "%Y-%m-%d", "%d-%m-%Y"]

    for record in data_list:
        date_str = record.get("Entry Date", "").strip().split(" ")[0]
        record_date = None

        # แปลงวันที่ให้รอด
        for fmt in date_formats:
            try:
                record_date = datetime.strptime(date_str, fmt).date()
                break
            except ValueError:
                continue
        if not record_date:
            continue

        # กรองช่วงวันที่
        if dt_start and record_date < dt_start:
            continue
        if dt_end and record_date > dt_end:
            continue

        # นับข้อมูล
        lang = record.get('Language', 'Unknown')
        typ = record.get('Type', 'Unknown')

        if lang not in lang_stats:
            lang_stats[lang] = {'Feedback': 0, 'Packages': 0}

        if typ == 'Feedback':
            lang_stats[lang]['Feedback'] += 1
        elif typ == 'Packages':
            lang_stats[lang]['Packages'] += 1
    # print(f"✅ Processed {len(data_list)} records. Stats: {lang_stats}")

    # ---- สร้าง result output แบบที่ต้องการ ----
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
    # print(f"✅ Final summarized result: {len(result)}")
    return result

def cal_FeedbackAndPackage(date_param):
    try:
        start_date = datetime.strptime(date_param["startDate"], "%Y-%m-%d").strftime("%d/%m/%Y")
        end_date = datetime.strptime(date_param["endDate"], "%Y-%m-%d").strftime("%d/%m/%Y")
        data = convert_csv_to_json()
        summary = process_json_list(data, start_date=start_date, end_date=end_date)
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
            if item.get("Language") == "Total":
                continue  # ข้าม เพราะมันรวมอยู่แล้ว

            total["Feedback"] += item.get("Feedback", 0)
            total["Packages"] += item.get("Packages", 0)

        return [total]
    except Exception as e:
        print("Error FPtotal:",e)
        
