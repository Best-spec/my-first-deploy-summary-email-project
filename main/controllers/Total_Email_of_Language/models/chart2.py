from django.http import JsonResponse
from datetime import datetime, timedelta
from main.services.inquiry import cal_inquiry
from main.services.appointment import find_appointment_summary
from main.services.feedback_package import FPtotal
from main.utils.compare.result_compare import Resultcompare



def cal_all_type_email(date): # {'startDate': 2025-04-01, 'endDate': 2025-04-30}
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
                    'Type Email'                         : 'Total',
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

def map_spit_date(date):
    start_date = datetime.strptime(date['startDate'], "%Y-%m-%d")
    end_date = datetime.strptime(date['endDate'], "%Y-%m-%d")

    list_data_by_date = []
    current = start_date
    while current <= end_date:
        date_key = current.strftime("%Y-%m-%d")
        date_display = current.strftime("%d/%m/%Y")

        date_dict = {'startDate': date_key, 'endDate': date_key}
        data_per_day = cal_all_type_email(date_dict)
        data_per_day['date'] = date_display

        list_data_by_date.append(data_per_day)
        current += timedelta(days=1)

    return list_data_by_date

def find_all_type_email(date_param):
    try:
        if len(date_param) <= 1:
            print('it 1 !!')
            table = cal_all_type_email(date_param[0])
            line = map_spit_date(date_param[0])
            return {
               "table": [table],
               "chart1": [table],
               "chart2": line
            }

        print('it 2 !!')
        data1 = cal_all_type_email(date_param[0])
        data2 = cal_all_type_email(date_param[1])
        line = map_spit_date(date_param[0])
        table = Resultcompare([data1], [data2], date_param)
        return {
            "table": table,
            "chart1": table,
            "chart2": line
        }

    except Exception as e:
        print('From find_all_type_email', e)
