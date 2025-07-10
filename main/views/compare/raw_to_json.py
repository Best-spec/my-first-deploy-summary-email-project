def raw_to_json_res(raw, data1, data2, dateParam):
    result = []
    for i, obj in enumerate(data1):

        # print(raw[i])
        entry = {
            "clinic": str(obj["clinic"]) + "  (% change)",
            "appointment_count": raw[i].get("percent_appointment_count"),
            "recommended_count": raw[i].get("percent_recommended_count"),
            "total": raw[i].get("total_result"),    
            "sub": [
                {
                    "date_range": f'{dateParam[0].get("startDate")} - {dateParam[0].get("endDate")}',
                    "appointment_count": obj["appointment_count"],
                    "recommended_count": obj["recommended_count"],
                    "total": obj["total"]
                }
            ]
        }
        # ถ้ามีข้อมูลของ data2 ที่ตรง index ให้เอาเข้าไปใน sub ด้วย
        if i < len(data2):
            obj2 = data2[i]
            entry["sub"].append({
                "date_range2": f'{dateParam[1].get("startDate")} - {dateParam[1].get("endDate")}',
                "appointment_count": obj2["appointment_count"],
                "recommended_count": obj2["recommended_count"],
                "total": obj2["total"]
            })
        result.append(entry)
    return result
