
import json


def find_percentage(data): #input json
    sum_inquiry = 0
    sum_appointment = 0
    grand_total = 0
    webCommerce_percent = 0

    for obj in data:
        print('--------------------------')
        print(json.dumps(obj, indent=3))

    for i in range(len(data)):
            if i == 0 :
                for val in data[i].values():
                    sum_inquiry += val
            elif i == 1:
                for val in data[i].values():
                    sum_appointment += val
            elif i == 2:
                webCommerce_percent += data[i]
            elif i == 3:
                grand_total += data[i]
    # print('---------------------')
    # print(sum_inquiry)
    # print(sum_appointment)
    # print(grand_total)

    inquiry_percent = (sum_inquiry / grand_total) * 100 if grand_total != 0 else 0
    appointment_percent = (sum_appointment / grand_total) * 100 if grand_total != 0 else 0
    webCommerce_percent = (webCommerce_percent / grand_total) * 100 if grand_total != 0 else 0
    
    # print('---------------------')

    # print(f"Inquiry: {inquiry_percent:.2f}%")        # Inquiry: 30.00%
    # print(f"Appointment: {appointment_percent:.2f}%") # Appointment: 70.00%
    # print(f"webCommerce_percent: {webCommerce_percent:.2f}%") # Appointment: 70.00%

    percentage = [{
        "Inquiry_%": f"{inquiry_percent:.2f}",
        "Appointment_%": f"{appointment_percent:.2f}",
        "webCommerce_percent_%": f"{webCommerce_percent:.2f}",
    }]
    print(percentage)
    return percentage


    