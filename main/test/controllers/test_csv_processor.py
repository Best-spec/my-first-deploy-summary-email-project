from main.servicesOrigin.appointment import csv_to_json_with_type, detect_lang_from_filename
import glob
from pathlib import Path

path = "media/uploads"
all_data = []
recommended_files = glob.glob(f"{path}/*appointment-recommended*.csv")
for file in recommended_files:
    lang = detect_lang_from_filename(file, ["ar", "de", "en", "ru", "th", "zh"])
    if lang:
        all_data.extend(csv_to_json_with_type(file, "appointment-recommended", lang))
print(all_data)
