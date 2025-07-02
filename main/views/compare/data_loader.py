from django.http import JsonResponse
from main.models import UploadedFile
from pathlib import Path
from collections import defaultdict
import pandas as pd
import glob
import os
from datetime import datetime

from views.appointment import find_appointment_from_csv_folder

def loadSet1():
    return find_appointment_from_csv_folder

def loadSet2():
    return find_appointment_from_csv_folder        