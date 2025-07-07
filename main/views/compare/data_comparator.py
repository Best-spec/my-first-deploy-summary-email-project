


def compareData(data1, data2):
    result_compare = []

    # แปลงเป็น dict เพื่อเข้าถึงตาม clinic
    data1_dict = {item['clinic']: item['total'] for item in data1}
    data2_dict = {item['clinic']: item['total'] for item in data2}

    def explain_percent_change(new, old):
        if old == 0:
            return "⚠️ เปรียบเทียบไม่ได้ (old = 0)"
        change = ((new - old) / old) * 100
        if change > 0:
            return f"✅ โตขึ้น {change:.2f}%"
        elif change < 0:
            return f"❌ ลดลง {abs(change):.2f}%"
        else:
            return "⭕ เท่ากัน 0.00%"

    for clinic, total1 in data1_dict.items():
        total2 = data2_dict.get(clinic, 0)  # ถ้า data2 ไม่มี ให้เป็น 0
        result = explain_percent_change(total2, total1)
        print(f"{clinic}: {total1} → {total2} = {result}")
        
        result_compare.append({
            "clinic": clinic,
            "result": result
        })
    # print(result_compare)
    return result_compare

    

