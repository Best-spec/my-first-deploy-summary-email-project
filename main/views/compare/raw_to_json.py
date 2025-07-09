

def raw_to_json_res(raw, data):
    result = []
    
    for i, obj in enumerate(data):
        result.append({
            "clinic": str(obj["clinic"]) + str('  (เดือนปัจจุบัน)'),
            "appointment_count": obj["appointment_count"],
            "recommended_count": obj["recommended_count"],
            "total": obj["total"],
            "sub": [
                {
                    "date_range": "vs (2025-04-16 - 2025-04-30)",
                    "appointment_count": 200,
                    "recommended_count": 15,
                    "total": 215
                },
                {
                    "type": "compare",
                    "appointment_count_change": -10.5,
                    "recommended_count_change": 4.3,
                    "total_change": 9.1
                }
            ]
        })
    
    print(result)
    return result


# const clinics = [
#   {
#     clinic: "Ear Nose Throat Center",
#     appointment_count: 23,
#     recommended_count: 1,
#     total: 44,

#     // ‼️ sub‑period report ของคลินิกเดียวกัน
#     sub: [
#       {
#         date_range: "2025‑04‑01 – 2025‑04‑15",
#         appointment_count: 100,
#         recommended_count: 10,
#         total: 110
#       },
#       {
#         date_range: "2025‑04‑16 – 2025‑04‑30",
#         appointment_count: 200,
#         recommended_count: 15,
#         total: 215
#       },
#       {
#         // แถวสรุป % เปลี่ยนเทียบสองช่วง
#         type: "compare",          // บอกว่าเป็น compare row
#         appointment_change: 10.5, // +10.5 %
#         recommended_change: 4.3,  // +4.3 %
#         total_change: 9.1         // +9.1 %
#       }
#     ]
#   }
# ];
# 1-10 : 10
# 11-20 : 10
# comapre : 20%
# json = [{
#             'clinic': 'Ear Nose Throat Center', 
#             'appointment_count': 23, 
#             'recommended_count': 1, 
#             'total': 44,
#             'sub': [
#             { date: '2025-04-01 - 2025-04-15', 'appointment_count': 100, 'recommended_count': 10, 'total': 110 },
#             { date: '2025-04-16 - 2025-04-30', 'appointment_count': 200, 'recommended_count': 15, 'total': 215 },
#             { %change: 'compare', 'appointment_count': %, 'recommended_count': %, 'total': % },
#             ],
#         }]