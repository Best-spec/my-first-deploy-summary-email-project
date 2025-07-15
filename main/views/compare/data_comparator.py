

def compareData(data1, data2):
    result_compare = []
    # print('from compareData')

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

    

