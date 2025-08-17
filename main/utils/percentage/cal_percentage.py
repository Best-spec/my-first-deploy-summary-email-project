
import json


def find_percentage(data): #input json
    sum_inquiry = 0
    sum_appointment = 0
    grand_total = data[3]
    webCommerce = 0

    for i in range(len(data)):
        # print(data[i])
        if i == 0:
            for val in data[i].values():
                if isinstance(val, int):
                    sum_inquiry += val
                    each_inquiry = f"{(val / grand_total) * 100 if grand_total != 0 else 0:.2f}"
        elif i == 1:
            for val in data[i].values():
                # print("val ====",val, grand_total)
                sum_appointment += val
                each_appointment = f"{(val / grand_total) * 100 if grand_total != 0 else 0:.2f}"
        elif i == 2:
            webCommerce += data[i]

    # print('---------------------')
    # print(sum_inquiry)
    # print(sum_appointment)
    # print(grand_total)

    inquiry_percent = (sum_inquiry / grand_total) * 100 if grand_total != 0 else 0
    appointment_percent = (sum_appointment / grand_total) * 100 if grand_total != 0 else 0
    webCommerce_percent = (webCommerce / grand_total) * 100 if grand_total != 0 else 0
    
    # print('---------------------')

    # print(f"Inquiry: {inquiry_percent:.2f}%")        # Inquiry: 30.00%
    # print(f"Appointment: {appointment_percent:.2f}%") # Appointment: 70.00%
    # print(f"webCommerce_percent: {webCommerce_percent:.2f}%") # Appointment: 70.00%

    percentage = {
        "%Total Inquiry": f"{inquiry_percent:.2f}% ({sum_inquiry})",
        "%Total Appointment": f"{appointment_percent:.2f}% ({sum_appointment})",
        "%_webCommerce": f"{webCommerce_percent:.2f}% ({webCommerce})",
    }


    # print(json.dumps(percentage, indent=2))
    result = [percentage]

    return result


def cal_percent(data, grand_total):
    
    result = []
    for item in data:
        inquiry = item.get('percent_inquiry', 0)
        appointment = item.get('percent_appointment', 0)
        result.append({
            "inquiry": (inquiry / grand_total) * 100 if grand_total != 0 else 0,
            "appointment": (appointment / grand_total) * 100 if grand_total != 0 else 0,
            "inquiry_val": inquiry,
            "appointment_val": appointment,
        })
    return result
    


    