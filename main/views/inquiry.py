from django.http import JsonResponse
from main.models import UploadedFile

def find_inquiry():
    inquiry_json = [
        {
            "language": "th",
            "general_inquiry": 10,
            "estimated_cost": 5,
            "contact_doctor": 3,
            "other": 2,
            "total": 20
        },
        {
            "language": "eng",
            "general_inquiry": 8,
            "estimated_cost": 2,
            "contact_doctor": 1,
            "other": 4,
            "total": 15
        },
        {
            "language": "ar",
            "general_inquiry": 4,
            "estimated_cost": 1,
            "contact_doctor": 0,
            "other": 1,
            "total": 6
        },
        {
            "language": "us",
            "general_inquiry": 7,
            "estimated_cost": 3,
            "contact_doctor": 2,
            "other": 3,
            "total": 15
        },
        {
            "language": "total",
            "general_inquiry": 29,
            "estimated_cost": 11,
            "contact_doctor": 6,
            "other": 10,
            "total": 56
        }
    ]

    return inquiry_json