from django.views import View
from django.http import JsonResponse
from django.conf import settings
import polars as pl
from pathlib import Path

# class LoadAllCSV(View):
#     def get_folder_path(self):
#         return Path(settings.MEDIA_ROOT) / 'uploads'

#     def load_csv_files(self, folder_path):
#         return list(folder_path.glob("*.csv"))

#     def read_csv_files(self, all_files, columns='Entry Date'):
#         return [pl.read_csv(f, columns=columns).lazy() for f in all_files]
    
#     def sum_all_dataframes(self, frames):
#         if not frames:
#             return pl.DataFrame()
#         return pl.concat(frames).collect()
    
#     def date_all_files(self):
#         folder_path = self.get_folder_path()
#         all_files = self.load_csv_files(folder_path)
#         lazy_frames = self.read_csv_files(all_files)
#         all_files = self.sum_all_dataframes(lazy_frames)
#         return all_files
