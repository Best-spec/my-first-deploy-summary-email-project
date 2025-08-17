import json

def raw_to_json_res(raw, data1, data2, dateParam):
    result = []


    for i, obj1 in enumerate(data1):
        raw_item = raw[i]
        first_key = next(iter(obj1.keys()), None)  # ดึง key ตัวแรก (ถ้ามี)
        keys = list(obj1.keys())[1:]

        entry = {
            first_key: f"{obj1.get(first_key)}  (% change)"
        } if first_key else {}

        for key in keys:
            percent_key = f"percent_{key}"
            entry[key] = raw_item.get(percent_key)


        # sub ข้อมูลชุดแรก
        sub = [{
            "date_range": f'{dateParam[0].get("startDate")} - {dateParam[0].get("endDate")}',
        }]
        for key in keys:
            sub[0][key] = obj1.get(key)

        # ถ้ามี data2
        if i < len(data2):
            obj2 = data2[i]
            sub2 = {
                "date_range2": f'{dateParam[1].get("startDate")} - {dateParam[1].get("endDate")}',
            }
            for key in keys:
                sub2[key] = obj2.get(key)
            sub.append(sub2)

        # ใส่ sub ลง entry
        entry["sub"] = sub
        result.append(entry)
    # print(result)
    json_string = json.dumps(result, indent=2, ensure_ascii=False)

    print(json_string)
    return result