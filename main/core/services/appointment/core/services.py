def find_appointment_from_csv_folder(dateset):
    try:
        global appointment_summary_shared
        folder = "media/uploads"
        folder_path = Path(folder)
        langs = ["ar", "de", "en", "ru", "th", "zh"]

        all_data = []

        # ไฟล์ appointment recommended
        recommended_files = glob.glob(os.path.join(folder_path, "*appointment-recommended*.csv"))
        for file in recommended_files:
            lang = detect_lang_from_filename(file, langs)
            if lang:
                all_data.extend(csv_to_json_with_type(file, "appointment-recommended", lang))

        # ไฟล์ appointment ปกติ
        normal_files = [
            f for f in glob.glob(os.path.join(folder_path, "*appointment*.csv"))
            if "appointment-recommended" not in os.path.basename(f)
        ]
        for file in normal_files:
            lang = detect_lang_from_filename(file, langs)
            if lang:
                all_data.extend(csv_to_json_with_type(file, "appointment", lang))

        keys_to_show = ["Centers & Clinics","Entry Date","file_type","lang_code"]

        
        filtered_list = [
            {k: d[k] for k in keys_to_show if k in d}
            for d in all_data
        ]

        start_date, end_date = dateset

        fil = filter_date_range(filtered_list, start_date, end_date)

        # print(json.dumps(filtered_list, indent=2, ensure_ascii=False)) 
        result = calculate_appointment_from_json(fil)
        return result
    

    except Exception as e:
        print("🔥 ERROR:", e)
        return []