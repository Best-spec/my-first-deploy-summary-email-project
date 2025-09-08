from django.views import View
from django.http import JsonResponse
from django.conf import settings
import polars as pl
from pathlib import Path

class LoadAllCSV(View):
    def get(self, request, *args, **kwargs):
        folder_path = Path(settings.MEDIA_ROOT) / 'uploads'
        csv_files = list(folder_path.glob("*.csv"))

        # if not csv_files:
        #     return JsonResponse({"error": "No matching CSV files found."}, status=404)

        try:
            print("จํานวนไฟล์ที่นับได้:",len(csv_files))
            frames = [pl.read_csv(f).lazy() for f in csv_files]
            df = pl.concat(frames)
            print(df.head())

        #     summary = df.filter(pl.col("lang") == "Thai")\
        #                 .groupby("email_type")\
        #                 .agg(pl.count().alias("total"))\
        #                 .sort("total", descending=True)\
        #                 .collect()
            return JsonResponse(safe=False)
        
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
