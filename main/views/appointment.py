from django.http import JsonResponse
from .compare.result_compare import Resultcompare
from main.services.appointment_service import AppointmentService


def find_appointment_from_csv_folder(dateset):
    service = AppointmentService()
    return service.find_appointment_from_csv_folder(dateset)


def find_appointment(dateset):
    try:
        service = AppointmentService()
        if len(dateset) <= 1:
            dateset1 = dateset[0].get('startDate')
            dateset2 = dateset[0].get('endDate')
            table = service.find_appointment_from_csv_folder((dateset1, dateset2))
            return {
                "dataForTable": table,
                "dataForChart": table
            }
        else:
            dateset1 = dateset[0].get('startDate')
            dateset2 = dateset[0].get('endDate')
            date2set1 = dateset[1].get('startDate')
            date2set2 = dateset[1].get('endDate')
            data1 = service.find_appointment_from_csv_folder((dateset1, dateset2))
            data2 = service.find_appointment_from_csv_folder((date2set1, date2set2))
            table = Resultcompare(data1, data2, dateset)
            return {
                "dataForTable": table,
                "dataForChart": table
            }
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


def find_appointment_summary(dateset):
    try:
        service = AppointmentService()
        dateset1 = dateset.get('startDate')
        dateset2 = dateset.get('endDate')
        data_sum = service.find_appointment_from_csv_folder((dateset1, dateset2))
        total_dict = {
            "Appointment": 0,
            "Appointment Recommended": 0
        }
        for item in data_sum:
            total_dict["Appointment"] += item.get("Appointment", 0)
            total_dict["Appointment Recommended"] += item.get("Appointment Recommended", 0)
        return [total_dict]
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
