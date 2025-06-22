from django.http import JsonResponse
from collections import defaultdict

from .inquiry import find_inquiry
from .appointment import find_appointment_summary
from .feedback_package import FPtotal

json_temp = [
    'General Inquiry',                 
    'Estimated Cost',
    'Other',
    'Contact My Doctor at Bangkok Hospital Pattaya',
    'Package Inquiry',
    'Feedback & Suggestion',
    'Appointment',
    'Appointment Recommended',
    'Web Commerce',
]

def aggregate_summary_for_plot():
    try:
        raw, summary = find_inquiry()        # dict ภาษา-> dict category-> count
        summaryFeed = FPtotal()
        summaryAppointment = find_appointment_summary()  # dict ภาษา-> count fields

        # print("raw:", raw)
        # print("summary:", summary)
        # print("summaryFeed:", summaryFeed)
        # print("summaryAppointment:", summaryAppointment)

        index1 = summary[0].get('General Inquiry')
        index2 = summary[0].get('Estimated Cost')
        index3 = summary[0].get('Other')
        index4 = summary[0].get('Contact My Doctor at Bangkok Hospital Pattaya')
        index5 = summaryFeed[0].get('Packages')
        index6 = summaryFeed[0].get('Feedback')
        index7 = summaryAppointment[0].get('appointment count')
        index8 = summaryAppointment[0].get('appointment recommended count')
        index9 = summaryFeed[0].get('Web Commerce')

        json_temp = [
                {
                    'General Inquiry'                    : 111,
                    'Estimated Cost'                     : 105,
                    'Other'                              : 32,
                    'Contact My Doctor at Bangkok Hospital Pattaya': 14,
                    'Package Inquiry'                    : index5,
                    'Feedback & Suggestion'              : index6,
                    'Appointment'                        : 234,
                    'Appointment Recommended'            : 234,
                    'Web Commerce'                       : 123,
                }
        ];

        # print(json_temp)
        return [json_temp]
        
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    

    