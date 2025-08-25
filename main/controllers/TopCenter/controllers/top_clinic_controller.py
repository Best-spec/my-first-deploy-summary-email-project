# app/controllers/top_clinic_controller.py
from ..services.csv_service import load_csv_appointments
from ..services.clinic_summary_service import summarize_clinic_data
from ..serializers.topCenter_seriallizer import TopCenterSerializer
from main.utils.compare.result_compare import Resultcompare
from django.conf import settings
from .model import mock
from datetime import datetime
import json
import os

def date_to_cal(date_ranges, folder_path=settings.MEDIA_ROOT / 'uploads'):
    # Check if folder_path exists and contains files
    if not os.path.exists(folder_path) or not os.listdir(folder_path):
        return None
    langs = ["ar", "de", "en", "ru", "th", "zh-hans"]
    dr = date_ranges
    start = datetime.strptime(dr['startDate'], "%Y-%m-%d")
    end = datetime.strptime(dr['endDate'], "%Y-%m-%d")
    normal = load_csv_appointments(folder_path, langs, start, end, file_type="appointment")
    recommended = load_csv_appointments(folder_path, langs, start, end, file_type="recommended")
    all_data = normal + recommended
    processed_data, pop_total, spit_total = summarize_clinic_data(all_data)
    return processed_data, pop_total, spit_total


def find_top_clinics_summary(date_ranges): # data_ranges = [{'startDate': 0,'endDate': 0},{...}]
    try :
        if len(date_ranges) < 2 and date_ranges != None:
            print(date_ranges, 'one')

            if date_to_cal(date_ranges[0]) is None:
                print("No data available for the specified date range.")
                return {"error": "ยังไม่ได้อัพโหลดไฟล์ หรือไม่มีข้อมูลจากหลังบ้าน"}
            else:
                summary, pop_total, spit_total = date_to_cal(date_ranges[0])
                print('ok')
                data = {
                    'table': summary,
                    'chart1': pop_total,
                    'chart2': spit_total
                }
                
                json = TopCenterSerializer(data)
                # print(json.dumps(processed_data, indent=2))

                return json.data
        
        else :
            print(date_ranges, 'two')
            summary1, pop_total, spit_total = date_to_cal(date_ranges[0])
            summary2, pop_total2, spit_total2 = date_to_cal(date_ranges[1])

            data = {
                'table': Resultcompare(summary1, summary2, date_ranges),
                'chart1': pop_total,
                'chart2': spit_total
            }
            json = TopCenterSerializer(data)

            return json.data

    
    except Exception as e:
        print('topcenter:', e)



        
#====================== mock ===========================================================================
        results = [
                    {
                        'Centers & clinics': 'Dental Cosmetic and Implant Center', 
                        'appointment_count': 8, 
                        'recommended_count': 17, 
                        'total': 25
                    },
                    ...
                ]