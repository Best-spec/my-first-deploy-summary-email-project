from django.http import JsonResponse
from main.models import UploadedFile
from pathlib import Path
from collections import defaultdict
import pandas as pd
import glob
import os
from datetime import datetime

from views.appointment import find_appointment_from_csv_folder
from views.inquiry import cal

def loadSet1(start, end):
    return cal(start, end)
    
def loadSet2(start, end):
    return cal(start, end)
