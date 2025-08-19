# services/inquiry/cache.py
from .loader import load_csv_all

PRELOADED_INQUIRY_DF = None

def preload_all_inquiry_files():
    global PRELOADED_INQUIRY_DF
    PRELOADED_INQUIRY_DF = load_csv_all()
