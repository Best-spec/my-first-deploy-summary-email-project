

def raw_to_json_res(raw, data):
    json = []
    for i, obj in enumerate(data):
        json.append({
            "clinic": obj["clinic"],
            "appointment_count": obj["appointment_count"],
            "recommended_count": obj["recommended_count"],
            "total": str(obj["total"]) + str(raw[i]) if i < len(raw) else None  # กัน index error,
        })
    return json