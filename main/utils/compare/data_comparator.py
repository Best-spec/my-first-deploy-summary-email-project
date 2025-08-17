import re

def compareData(data1, data2):
    try:
        result_compare = []

        keys = list(data1[0].keys())

        for i in range(len(data1)):
            obj1 = data1[i]
            obj2 = data2[i] if i < len(data2) else {}

            compare_result = {}

            for key in keys[1:]:  # ข้าม clinic ไป
                val1 = map_val_type(obj1, key)
                val2 = map_val_type(obj2, key)

                val1 = str_check(val1)
                val2 = str_check(val2)

                percent = explain_percent_change(val1, val2)
                # print(type(percent), percent)
                compare_result[f"percent_{key}"] = percent

                # print(f"{key}: {val1} → {val2} = {percent}")

            result_compare.append(compare_result)

        return result_compare
    except Exception as e:
        print('from compareData:', e)

def explain_percent_change(new, old):
    if old == 0:
        return "N/A"
    change = ((new - old) / old) * 100
    return f"{change:.2f}"

def map_val_type(obj, key):
    return obj.get(key, 0)

def str_check(val):
    if isinstance(val, str):
        match = re.search(r'\((\d+)\)', val)
        if match:
            return int(match.group(1))
        try:
            return float(val.replace('%','').strip())
        except:
            return 0
    return val