

def compareData(data1, data2):
    result_compare = []
    print('from compareData')

    def explain_percent_change(new, old):
        if old == 0:
            return "⚠️ เปรียบเทียบไม่ได้ (old = 0)"
        change = ((new - old) / old) * 100
        return f"{change:.2f}"

    # ดึง key list จาก dict ตัวแรกใน data1
    keys = list(data1[0].keys())

    for i in range(len(data1)):
        obj1 = data1[i]
        obj2 = data2[i] if i < len(data2) else {}

        compare_result = {}

        for key in keys[1:]:
            # ข้าม 'clinic' เพราะไม่ต้องเอามาคิด % เปลี่ยนแปลง


            val1 = obj1.get(key, 0)
            val2 = obj2.get(key, 0)

            # ถ้าเจอ string หรือ None ให้แทนเป็น 0
            val1 = val1 if val1 and not isinstance(val1, str) else 0
            val2 = val2 if val2 and not isinstance(val2, str) else 0

            percent = explain_percent_change(val2, val1)
            compare_result[f"percent_{key}"] = percent

            # print(f"{key}: {val1} → {val2} = {percent}")

        result_compare.append(compare_result)

    print('-----------------------------------------')
    return result_compare
# def compareData(data1, data2):
#     result_compare = []
#     print('from compareDate')
#     # print(data1, data2)

#     def explain_percent_change(new, old):
#         if old == 0:
#             return "⚠️ เปรียบเทียบไม่ได้ (old = 0)"
#         change = ((new - old) / old) * 100
#         if change > 0:
#             return f"{change:.2f}"
#         elif change < 0:
#             return f"{change:.2f}"
#         else:
#             return 0.00

#     obj2 = list(data2[0].keys())
#     # print(obj2)
#     for i, (key, val) in enumerate(data1[0].items()):
#         keys = obj2[i]
#         value2 = data2[i].get(keys)
#         # print(keys, value2)
#         app_count1 = val if val and not isinstance(val, str) else 0
#         app_count2 = value2 if value2 and not isinstance(value2, str) else 0
#         percent_appointment_count = explain_percent_change(app_count2, app_count1)
#         # print("it percenterrrr",percent_appointment_count)
#         print(f'{keys} {app_count1} vs {app_count2} = {percent_appointment_count}')
#         percent_appointment_count = explain_percent_change(val, value2)

#         r_count1 = obj.get("recommended_count", 0)
#         r_count2 = obj2.get("recommended_count", 0)
#         percent_recommended_count = explain_percent_change(r_count2, r_count1)

#         total1 = obj.get("total", 0)
#         total2 = obj2.get("total", 0)
#         total_result = explain_percent_change(total2, total1)

#         result_compare.append({
#             'percent_appointment_count': percent_appointment_count,
#             'percent_recommended_count': percent_recommended_count,
#             'total_result': total_result
#         })

#     print('-----------------------------------------')
#     return result_compare

    

