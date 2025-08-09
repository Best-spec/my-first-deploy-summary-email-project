from pathlib import Path
from datetime import datetime
import pandas as pd
import glob
import os


class AppointmentService:
    def __init__(self, folder="media/uploads"):
        self.folder_path = Path(folder)
        self.appointment_summary_shared = {
            "appointment count": 0,
            "appointment recommended count": 0
        }
        self.langs = ["ar", "de", "en", "ru", "th", "zh"]
        self.lang_names = {
            "en": "English",
            "th": "Thai",
            "ru": "Russia",
            "de": "German",
            "zh": "Chinese",
            "ar": "Arabic"
        }

    def detect_lang_from_filename(self, filename):
        for lang in self.langs:
            if f"-{lang}" in filename:
                return lang
        return None

    def csv_to_json_with_type(self, filepath, file_type, lang_code):
        df = pd.read_csv(filepath)
        df.columns = df.columns.str.strip().str.replace('\ufeff', '')
        json_list = df.to_dict(orient='records')
        for d in json_list:
            d['file_type'] = file_type
            d['lang_code'] = lang_code
        return json_list

    def calculate_appointment_from_json(self, data_list):
        lang_summary = {lang: {"appointment count": 0, "appointment recommended count": 0} for lang in self.langs}
        total_all_col = 0
        total_all_col_rec = 0

        for row in data_list:
            file_type = row.get("file_type", "appointment")
            lang = row.get("lang_code")
            if lang not in self.langs:
                continue
            if file_type == "appointment-recommended":
                lang_summary[lang]["appointment recommended count"] += 1
                total_all_col_rec += 1
            else:
                lang_summary[lang]["appointment count"] += 1
                total_all_col += 1

        appointment = []
        for lang_code, data in lang_summary.items():
            entry = {
                "Language": self.lang_names[lang_code],
                "Appointment": data["appointment count"],
                "Appointment Recommended": data["appointment recommended count"],
                "Total": data["appointment count"] + data["appointment recommended count"]
            }
            appointment.append(entry)

        self.appointment_summary_shared["appointment count"] = total_all_col
        self.appointment_summary_shared["appointment recommended count"] = total_all_col_rec

        total_entry = {
            "Language": "Total",
            "Appointment": total_all_col,
            "Appointment Recommended": total_all_col_rec,
            "Total": total_all_col + total_all_col_rec
        }
        appointment.append(total_entry)
        return appointment

    def filter_date_range(self, filtered_list, start_date, end_date, date_key="Entry Date"):
        result = []
        start = datetime.strptime(start_date, "%Y-%m-%d")
        end = datetime.strptime(end_date, "%Y-%m-%d")
        for item in filtered_list:
            entry_str = item.get(date_key, "")
            try:
                entry = datetime.strptime(entry_str.split(" ")[0], "%d/%m/%Y")
                if start <= entry <= end:
                    result.append(item)
            except ValueError:
                continue
        return result

    def load_date(self, datetimes):
        start = datetimes[0]['startDate']
        end = datetimes[0]['endDate']
        return start, end

    def find_appointment_from_csv_folder(self, dateset):
        try:
            all_data = []
            recommended_files = glob.glob(os.path.join(self.folder_path, "*appointment-recommended*.csv"))
            for file in recommended_files:
                lang = self.detect_lang_from_filename(file)
                if lang:
                    all_data.extend(self.csv_to_json_with_type(file, "appointment-recommended", lang))

            normal_files = [
                f for f in glob.glob(os.path.join(self.folder_path, "*appointment*.csv"))
                if "appointment-recommended" not in os.path.basename(f)
            ]
            for file in normal_files:
                lang = self.detect_lang_from_filename(file)
                if lang:
                    all_data.extend(self.csv_to_json_with_type(file, "appointment", lang))

            keys_to_show = ["Centers & Clinics", "Entry Date", "file_type", "lang_code"]
            filtered_list = [
                {k: d[k] for k in keys_to_show if k in d}
                for d in all_data
            ]

            start_date, end_date = dateset
            fil = self.filter_date_range(filtered_list, start_date, end_date)
            result = self.calculate_appointment_from_json(fil)
            return result
        except Exception:
            return []
