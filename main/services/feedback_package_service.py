import os
import glob
import csv
from datetime import datetime


class FeedbackPackageService:
    def __init__(self, folder_path="media/uploads"):
        self.folder_path = folder_path

    def _extract_language(self, filename):
        basename = os.path.basename(filename).lower()
        if '-ar' in basename:
            return 'Arabic'
        if '-de' in basename:
            return 'German'
        if '-en' in basename:
            return 'English'
        if '-ru' in basename:
            return 'Russia'
        if '-th' in basename:
            return 'Thai'
        if '-zh' in basename:
            return 'Chinese'
        return 'Unknown'

    def convert_csv_to_json(self, folder_path=None):
        folder = folder_path or self.folder_path
        all_data = []
        feedback_files = glob.glob(os.path.join(folder, "feedback*.csv"))
        packages_files = glob.glob(os.path.join(folder, "packages*.csv"))

        def read_csv(files, typ):
            for file in files:
                lang = self._extract_language(file)
                try:
                    with open(file, newline='', encoding='utf-8') as f:
                        reader = csv.DictReader(f)
                        for row in reader:
                            row = {k.strip().replace('\ufeff', ''): v for k, v in row.items()}
                            row['Language'] = lang
                            row['Type'] = typ
                            all_data.append(row)
                except Exception:
                    continue

        read_csv(feedback_files, 'Feedback')
        read_csv(packages_files, 'Packages')
        return all_data

    def process_json_list(self, data_list, date_col='Entry Date', start_date=None, end_date=None):
        lang_stats = {}
        dt_start = datetime.strptime(start_date, "%d/%m/%Y").date() if start_date else None
        dt_end = datetime.strptime(end_date, "%d/%m/%Y").date() if end_date else None

        for record in data_list:
            entry_date_str = record.get(date_col)
            if not entry_date_str:
                continue

            record_date = None
            date_formats = ["%Y-%m-%d %H:%M:%S", "%d/%m/%Y", "%Y-%m-%d", "%d-%m-%Y"]
            for fmt in date_formats:
                try:
                    record_date = datetime.strptime(entry_date_str, fmt).date()
                    break
                except ValueError:
                    continue
            if not record_date:
                continue

            if dt_start and record_date < dt_start:
                continue
            if dt_end and record_date > dt_end:
                continue

            lang = record.get('Language', 'Unknown')
            typ = record.get('Type', 'Unknown')
            if lang not in lang_stats:
                lang_stats[lang] = {'Feedback': 0, 'Packages': 0}
            if typ == 'Feedback':
                lang_stats[lang]['Feedback'] += 1
            elif typ == 'Packages':
                lang_stats[lang]['Packages'] += 1

        all_languages = ["English", "Thai", "Russia", "German", "Chinese", "Arabic"]
        result = []
        total_feedback = total_packages = 0
        for lang in all_languages:
            data = lang_stats.get(lang, {'Feedback': 0, 'Packages': 0})
            total = data['Feedback'] + data['Packages']
            total_feedback += data['Feedback']
            total_packages += data['Packages']
            result.append({
                "Language": lang,
                "Feedback": data['Feedback'],
                "Packages": data['Packages'],
                "Total": total,
            })

        result.append({
            "Language": "Total",
            "Feedback": total_feedback,
            "Packages": total_packages,
            "Total": total_feedback + total_packages,
        })
        return result

    def cal_FeedbackAndPackage(self, date_param):
        start_date = datetime.strptime(date_param["startDate"], "%Y-%m-%d").strftime("%d/%m/%Y")
        end_date = datetime.strptime(date_param["endDate"], "%Y-%m-%d").strftime("%d/%m/%Y")
        data = self.convert_csv_to_json()
        return self.process_json_list(data, start_date=start_date, end_date=end_date)
