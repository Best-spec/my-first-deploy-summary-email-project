# app/services/clinic_summary_service.py
from collections import defaultdict
from ..models.clinic_model import CLINIC_LIST, CLINIC_NAME_MAP

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

    processed_data = sorted(result, key=lambda x: x["total"], reverse=True)[:20]
    # ถ้าต้องการแยก pop_total และ spit_total
    pop_total = [{"Centers & clinics": d["Centers & clinics"],
                "appointment_count": d["appointment_count"],
                "recommended_count": d["recommended_count"]} for d in processed_data]

    spit_total = [{"Centers & clinics": d["Centers & clinics"],"total": d["total"]} for d in processed_data]
    
    return processed_data, pop_total, spit_total