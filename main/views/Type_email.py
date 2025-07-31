from django.http import JsonResponse
from collections import defaultdict
from datetime import datetime, timedelta

from .inquiry import cal_inquiry
from .appointment import find_appointment_summary
from .feedback_package import FPtotal
from .compare.result_compare import Resultcompare


json_temp = [{
    'Date',
    'General Inquiry',                 
    'Estimated Cost',
    'Other',
    'Contact My Doctor at Bangkok Hospital Pattaya',
    'Package Inquiry',
    'Feedback & Suggestion',
    'Appointment',
    'Appointment Recommended',
    'Web Commerce',
}]

def map_parts(s):
    parts = list(map(int, s.strip().split()))

    if len(parts) == 1:
        a = parts[0]
        return a
    elif len(parts) >= 2:
        a, b = parts[0], parts[1]
        return a, b
    else:
        print("ไม่มีตัวเลขเลย")

def cal_all_type_email(date):
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

    current = start_date
    list_data_by_date = [];
    new_item = {}
    while current <= end_date:
        # print(current.strftime("%Y-%m-%d"))
        date_list = {
            'startDate': current.strftime("%Y-%m-%d"),
            'endDate': current.strftime("%Y-%m-%d")
        }
        data_per_day = cal_all_type_email(date_list)
        new_item = {'Date': date_list['startDate']}
        new_item.update(data_per_day)
        list_data_by_date.append(new_item)
        current += timedelta(days=1)
    
    return list_data_by_date


def find_all_type_email(date_param):
    try:
        if len(date_param) <= 1:
            print('it 1 !!')
            table = cal_all_type_email(date_param[0])
            line = map_spit_date(date_param[0])
            # print(line)
            return {
                "dataForTable": [table],
                "dataForChart": [table],
                "dataForChart2": line
            }
        else :
            print('it 2 !!')
            data1 = cal_all_type_email(date_param[0])
            data2 = cal_all_type_email(date_param[1])
            # line = map_spit_date(date_param[0])
            table = Resultcompare([data1], [data2], date_param)
            return {
                "dataForTable": table,
                "dataForChart": table,
                # "dataForChart2": line
            }

    except Exception as e:
        print('From find_all_type_email', e)

