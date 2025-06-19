from django.http import JsonResponse
from main.models import UploadedFile

def find_Appointment():
    appointment = [
        {
            "Language": "thailand",
            "Appointment": 10,
            "Appointment Recommended": 5,
            "total": 15
        },
        {
            "Language": "eng",
            "Appointment": 55,
            "Appointment Recommended": 20,
            "total": 75
        },
    ]
    return appointment