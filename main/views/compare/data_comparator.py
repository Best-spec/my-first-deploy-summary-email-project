


def compareData(data1, data2):
    result_compare = []

    def explain_percent_change(new, old):
        if old == 0:
            return "⚠️ เปรียบเทียบไม่ได้ (old = 0)"
        change = ((new - old) / old) * 100
        if change > 0:
            return f"{change:.2f}"
        elif change < 0:
            return f"{change:.2f}"
        else:
            return 0.00

    for i, obj in enumerate(data1):
        obj2 = data2[i]

        app_count1 = obj.get("appointment_count", 0)
        app_count2 = obj2.get("appointment_count", 0)
        percent_appointment_count = explain_percent_change(app_count2, app_count1)

        r_count1 = obj.get("recommended_count", 0)
        r_count2 = obj2.get("recommended_count", 0)
        percent_recommended_count = explain_percent_change(r_count2, r_count1)

        total1 = obj.get("total", 0)
        total2 = obj2.get("total", 0)
        total_result = explain_percent_change(total2, total1)

        result_compare.append({
            'percent_appointment_count': percent_appointment_count,
            'percent_recommended_count': percent_recommended_count,
            'total_result': total_result
        })

    print('-----------------------------------------')
    return result_compare

    

