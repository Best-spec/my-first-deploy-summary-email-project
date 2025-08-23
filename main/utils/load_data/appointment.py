import pandas as pd


# 🔁 Cache สำหรับ json ที่แปลงแล้ว
_cached_csv_json = {}

def clear_appointment_cache():
    global _cached_csv_json
    _cached_csv_json = {}


def csv_to_json_with_type(filepath, file_type, lang_code):
    global _cached_csv_json

    cache_key = f"{filepath}_{file_type}_{lang_code}"
    if cache_key in _cached_csv_json:
        print('app cache: ใช้แคชเก่า')
        return _cached_csv_json[cache_key]
    else :
        print('app cache : โหลดข้อมูลใหม่')

    try:
        df = pd.read_csv(filepath)
        df.columns = df.columns.str.strip().str.replace('\ufeff', '')
        json_list = df.to_dict(orient='records')

        for d in json_list:
            d['file_type'] = file_type
            d['lang_code'] = lang_code

        _cached_csv_json[cache_key] = json_list
        return json_list

    except Exception as e:
        print(f"❌ Failed to read {filepath}: {e}")
        return []
    



