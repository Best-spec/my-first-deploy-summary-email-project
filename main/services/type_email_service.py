from django.http import JsonResponse
from datetime import datetime, timedelta

from main.views.inquiry import cal_inquiry
from main.views.appointment import find_appointment_summary
from main.views.feedback_package import FPtotal
from main.views.compare.result_compare import Resultcompare


class TypeEmailService:
    @classmethod
    def cal_all_type_email(cls, date):
        try:
            start = date.get('startDate')
            end = date.get('endDate')
            raw, summary = cal_inquiry(start, end)
            summaryFeed = FPtotal(date)
            summaryAppointment = find_appointment_summary(date)

            index1 = summary[0].get('General Inquiry')
            index2 = summary[0].get('Estimated Cost')
            index3 = summary[0].get('Other')
            index4 = summary[0].get('Contact Doctor')
            index5 = summaryFeed[0].get('Packages')
            index6 = summaryFeed[0].get('Feedback')
            index7 = summaryAppointment[0].get('Appointment')
            index8 = summaryAppointment[0].get('Appointment Recommended')

            json_temp = {
                'Type Email': 'Total',
                'General Inquiry': index1,
                'Estimated Cost': index2,
                'Other': index3,
                'Contact Doctor': index4,
                'Package Inquiry': index5,
                'Feedback & Suggestion': index6,
                'Appointment': index7,
                'Appointment Recommended': index8,
            }
            return json_temp
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    @classmethod
    def map_spit_date(cls, date):
        start_date = datetime.strptime(date['startDate'], "%Y-%m-%d")
        end_date = datetime.strptime(date['endDate'], "%Y-%m-%d")

        current = start_date
        list_data_by_date = []
        while current <= end_date:
            date_list = {
                'startDate': current.strftime("%Y-%m-%d"),
                'endDate': current.strftime("%Y-%m-%d")
            }
            data_per_day = cls.cal_all_type_email(date_list)
            new_item = {'Date': date_list['startDate']}
            new_item.update(data_per_day)
            list_data_by_date.append(new_item)
            current += timedelta(days=1)

        return list_data_by_date

    @classmethod
    def find_all_type_email(cls, date_param):
        try:
            if len(date_param) <= 1:
                table = cls.cal_all_type_email(date_param[0])
                line = cls.map_spit_date(date_param[0])
                return {
                    'table': [table],
                    'chart1': [table],
                    'chart2': line,
                }
            else:
                data1 = cls.cal_all_type_email(date_param[0])
                data2 = cls.cal_all_type_email(date_param[1])
                line = cls.map_spit_date(date_param[0])
                table = Resultcompare([data1], [data2], date_param)
                return {
                    'table': table,
                    'chart1': table,
                    'chart2': line,
                }
        except Exception as e:
            print('From find_all_type_email', e)
