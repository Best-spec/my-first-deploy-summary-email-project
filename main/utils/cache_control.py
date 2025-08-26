# main/utils/cache_control.py

from main.services.inquiry import _cached_data as inquiry_cache
from main.utils.load_data.feedback_package import reset_feedback_packages_cache
from main.utils.load_data.appointment import _cached_csv_json as appointment_cache

def clear_all_caches():
    inquiry_cache.clear()  # ✅ ล้าง cache แบบ key-range
    reset_feedback_packages_cache()  # ✅ ล้าง feedback/packages
    appointment_cache.clear()  # ✅ ล้าง appointment
    print("🧹 Cleared ALL caches (inquiry, feedback, appointment)")

