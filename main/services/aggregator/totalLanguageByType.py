from main.services.inquiry import cal_inquiry
from main.services.appointment import find_appointment_summary
from main.services.feedback_package import FPtotal
from django.http import JsonResponse
from datetime import datetime, timedelta


from datetime import datetime, timedelta
from django.http import JsonResponse

# ✅ Global cache สำหรับเก็บข้อมูลรายวัน
_cached_summary_per_date = {}

# ✅ ล้าง cache ทั้งหมด
def clear_summary_cache():
    global _cached_summary_per_date
    _cached_summary_per_date = {}
    print("🧹 Cleared ALL summary cache.")

# ✅ ล้าง cache เฉพาะวัน
def clear_summary_cache_except(keys_to_keep):
    keys_to_keep = set(keys_to_keep)
    keys_to_delete = [k for k in _cached_summary_per_date if k not in keys_to_keep]
    for k in keys_to_delete:
        del _cached_summary_per_date[k]

def data_per_date(date):  # {'startDate': '2025-04-01', 'endDate': '2025-04-01'}
    try:
        start = date.get('startDate')
        end = date.get('endDate')
        key = start  # ใช้ startDate เป็น key ของ cache

        # 👇 เช็กอีกรอบ (หลังล้าง)
        if key in _cached_summary_per_date:
            return _cached_summary_per_date[key]

        raw, summary = cal_inquiry(start, end)
        summaryFeed = FPtotal(date)
        summaryAppointment = find_appointment_summary(date)

        json_temp = {
            'date': start,
            'General Inquiry':              summary[0].get('General Inquiry', 0),
            'Estimated Cost':               summary[0].get('Estimated Cost', 0),
            'Other':                        summary[0].get('Other', 0),
            'Contact Doctor':               summary[0].get('Contact Doctor', 0),
            'Package Inquiry':              summaryFeed[0].get('Packages', 0),
            'Feedback & Suggestion':        summaryFeed[0].get('Feedback', 0),
            'Appointment':                  summaryAppointment[0].get('Appointment', 0),
            'Appointment Recommended':      summaryAppointment[0].get('Appointment Recommended', 0),
        }

        _cached_summary_per_date[key] = json_temp  # ✅ เก็บ cache
        return json_temp

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

    

def loop_date_range(date_dict):
    start_str = date_dict['startDate']
    end_str = date_dict['endDate']

    start_date = datetime.strptime(start_str, '%Y-%m-%d')
    end_date = datetime.strptime(end_str, '%Y-%m-%d')

    # 🔑 เตรียม key ล่วงหน้า
    expected_keys = []
    current = start_date
    while current <= end_date:
        expected_keys.append(current.strftime('%Y-%m-%d'))
        current += timedelta(days=1)

    # ✅ ล้าง cache ที่ไม่ใช่ช่วงนี้
    clear_summary_cache_except(expected_keys)

    # 🔁 แล้วค่อยลูปคำนวณ
    results = []
    for key in expected_keys:
        single_day_dict = {
            'startDate': key,
            'endDate': key
        }
        result = data_per_date(single_day_dict)
        results.append(result)

    return results