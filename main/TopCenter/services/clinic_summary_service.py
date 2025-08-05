# app/services/clinic_summary_service.py
from collections import defaultdict
from TopCenter.models.clinic_model import CLINIC_LIST, CLINIC_NAME_MAP

def summarize_clinic_data(raw_data):
    normal = defaultdict(int)
    recommended = defaultdict(int)

    for item in raw_data:
        name = item["Centers & Clinics"]
        target_dict = normal if item["Type"] == "appointment" else recommended
        eng_name = name if name in CLINIC_LIST else CLINIC_NAME_MAP.get(name)
        if eng_name:
            target_dict[eng_name] += 1

    result = []
    for clinic in CLINIC_LIST:
        n = normal[clinic]
        r = recommended[clinic]
        if n + r > 0:
            result.append({
                "Centers & clinics": clinic,
                "appointment_count": n,
                "recommended_count": r,
                "total": n + r
            })
    result.sort(key=lambda x: x["total"], reverse=True)
    return result[:20]
