from main.views.inquiry import cal_inquiry
from main.views.appointment import find_appointment_summary
from main.views.feedback_package import FPtotal
from django.http import JsonResponse
from datetime import datetime, timedelta


def data_per_date(date): # {'startDate': 2025-04-01, 'endDate': 2025-04-30}
    try:
        # print(date)
        start = date.get('startDate')
        end = date.get('endDate')
        raw, summary = cal_inquiry(start, end)        # dict ภาษา-> dict category-> count
        summaryFeed = FPtotal(date)
        summaryAppointment = find_appointment_summary(date)  # dict ภาษา-> count fields
        # print("feed :",summaryAppointment)

        index1 = summary[0].get('General Inquiry')
        index2 = summary[0].get('Estimated Cost')
        index3 = summary[0].get('Other')
        index4 = summary[0].get('Contact Doctor')
        index5 = summaryFeed[0].get('Packages')
        index6 = summaryFeed[0].get('Feedback')
        index7 = summaryAppointment[0].get('Appointment')
        index8 = summaryAppointment[0].get('Appointment Recommended')


        json_temp = {
                    'date'                               : start,
                    'General Inquiry'                    : index1,
                    'Estimated Cost'                     : index2,
                    'Other'                              : index3,
                    'Contact Doctor': index4,
                    'Package Inquiry'                    : index5,
                    'Feedback & Suggestion'              : index6,
                    'Appointment'                        : index7,
                    'Appointment Recommended'            : index8,
                };

        

        return json_temp
        
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    

def loop_date_range(date_dict):
    start_str = date_dict['startDate']
    end_str = date_dict['endDate']

    start_date = datetime.strptime(start_str, '%Y-%m-%d')
    end_date = datetime.strptime(end_str, '%Y-%m-%d')

    current = start_date
    results = []

    while current <= end_date:
        day_str = current.strftime('%Y-%m-%d')
        single_day_dict = {
            'startDate': day_str,
            'endDate': day_str
        }

        result = data_per_date(single_day_dict)  # 👈 เอาไปใช้ตรงนี้
        results.append(result)

        current += timedelta(days=1)

    return results