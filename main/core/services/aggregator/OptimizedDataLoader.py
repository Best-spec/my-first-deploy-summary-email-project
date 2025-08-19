from main.views.inquiry import cal_inquiry
from main.views.appointment import find_appointment_summary
from main.views.feedback_package import FPtotal
from datetime import datetime, timedelta
import gc

# ✨ Global RAM Cache ตัวเดียวสำหรับช่วงโหลดล่าสุด
_PRELOADED_DATA = {}
_PRELOADED_RANGE = (None, None)

def safe_first(lst):
    return lst[0] if lst else {}

def preload_data_once(start_date: str, end_date: str):
    global _PRELOADED_DATA, _PRELOADED_RANGE

    # ถ้าช่วงเวลาเปลี่ยน ให้ล้าง cache เก่าก่อน
    if _PRELOADED_RANGE != (start_date, end_date):
        _PRELOADED_DATA.clear()
        gc.collect()

        raw, summary = cal_inquiry(start_date, end_date)
        feed = FPtotal({'startDate': start_date, 'endDate': end_date})
        appointment = find_appointment_summary({'startDate': start_date, 'endDate': end_date})
        print('summary : ',summary)
        current = datetime.strptime(start_date, "%Y-%m-%d")
        end = datetime.strptime(end_date, "%Y-%m-%d")

        while current <= end:
            key = current.strftime('%Y-%m-%d')

            _PRELOADED_DATA[key] = {
                'summary': [entry for entry in summary if entry.get('date') == key],
                'feed': [entry for entry in feed if entry.get('date') == key],
                'appointment': [entry for entry in appointment if entry.get('date') == key],
            }

            current += timedelta(days=1)
            # print(_PRELOADED_DATA[key])


        _PRELOADED_RANGE = (start_date, end_date)
    # print()


def build_json_per_day(date_str: str, day_data: dict) -> dict:
    summary = safe_first(day_data.get('summary'))
    feed = safe_first(day_data.get('feed'))
    appointment = safe_first(day_data.get('appointment'))

    return {
        'date': date_str,
        'General Inquiry': summary.get('General Inquiry', 0),
        'Estimated Cost': summary.get('Estimated Cost', 0),
        'Other': summary.get('Other', 0),
        'Contact Doctor': summary.get('Contact Doctor', 0),
        'Package Inquiry': feed.get('Packages', 0),
        'Feedback & Suggestion': feed.get('Feedback', 0),
        'Appointment': appointment.get('Appointment', 0),
        'Appointment Recommended': appointment.get('Appointment Recommended', 0),
    }


def generate_filtered_data(date_range: dict):
    start_str = date_range['startDate']
    end_str = date_range['endDate']

    # ❌ จะ preload ใหม่ก็ต่อเมื่อช่วงเวลาเปลี่ยนจริงๆ
    preload_data_once(start_str, end_str)

    result = []
    current = datetime.strptime(start_str, "%Y-%m-%d")
    end = datetime.strptime(end_str, "%Y-%m-%d")

    while current <= end:
        key = current.strftime('%Y-%m-%d')
        day_data = _PRELOADED_DATA.get(key, {})
        json = build_json_per_day(key, day_data)
        result.append(json)
        current += timedelta(days=1)

    return result
