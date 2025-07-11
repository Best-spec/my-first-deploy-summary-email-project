from django.http import JsonResponse
from collections import defaultdict

from .inquiry import cal_inquiry
from .appointment import find_appointment_summary
from .feedback_package import FPtotal
from .compare.result_compare import Resultcompare


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

def cal_all_type_email(date=None):
    try:
        print('in cal type')
        start = date.get('startDate')
        end = date.get('endDate')
        raw, summary = cal_inquiry(start, end)        # dict ภาษา-> dict category-> count
        # summaryFeed = FPtotal(date)
        # summaryAppointment = find_appointment_summary(date)  # dict ภาษา-> count fields
        print(summary)

        # index1 = summary[0].get('General Inquiry', 0)
        # index2 = summary[0].get('Estimated Cost', 0)
        # index3 = summary[0].get('Other', 0)
        # index4 = summary[0].get('Contact Doctor', 0)
        # index5 = summaryFeed[0].get('Packages', 0)
        # index6 = summaryFeed[0].get('Feedback', 0)
        # index7 = summaryAppointment[0].get('appointment count', 0)
        # index8 = summaryAppointment[0].get('appointment recommended count', 0)
        # index9 = summaryFeed[0].get('Web Commerce', 0)

        # json_temp = [
        #         {
        #             'Type Email'                         : 'Total',
        #             'General Inquiry'                    : index1,
        #             'Estimated Cost'                     : index2,
        #             'Other'                              : index3,
        #             'Contact Doctor': index4,
        #             'Package Inquiry'                    : index5,
        #             'Feedback & Suggestion'              : index6,
        #             'Appointment'                        : index7,
        #             'Appointment Recommended'            : index8,
        #             'Web Commerce'                       : index9,
        #         }
        # ];

        

        # print(json_temp)
        return summary
        
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    
def find_all_type_email(date_param):
    try:
        if len(date_param) <= 1:
            print('it 1 !!')
            # return [cal_all_type_email(date_param[0])]
            # print(cal_all_type_email(date_param[0]))
            cal_all_type_email(date_param[0])
        else :
            print('it 2 !!')
            data1 = cal_all_type_email(date_param[0])
            data2 = cal_all_type_email(date_param[1])
            # print(data1)
            print(Resultcompare(data1, data2, date_param))
            return [Resultcompare(data1, data2, date_param)]

    except Exception as e:
        print('From find_all_type_email', e)
    

    