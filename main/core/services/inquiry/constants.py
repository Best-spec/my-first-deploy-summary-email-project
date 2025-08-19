
# 📁 services/inquiry/constants.py
LANG_MAP = {
    "-th": "Thai",
    "-en": "English",
    "-ar": "Arabic",    
    "-ru": "Russia",
    "-de": "German",
    "-zh": "Chinese",
}

# ✅ บังคับเรียงตามลำดับนี้ เพื่อให้หลังบ้านกับหน้าบ้าน sync กัน
all_languages = [
    "English",
    "Thai",
    "Russia",
    "German",
    "Chinese",
    "Arabic"
]

categories = {
    'English': [
        "General Inquiry",
        "Estimated Cost",
        "Contact My Doctor at Bangkok Hospital Pattaya",
        "Other"
    ],
    'Thai': [
        "สอบถามทั่วไป",
        "ค่าใช้จ่าย",
        "ติดต่อกับหมอประจำตัวที่โรงพยาบาลกรุงเทพพัทยา",
        "อื่นๆ"
    ],
    'Russia': [
        "Общий запрос",
        "Узнать про цену",
        "Написать врачу",
        "Другое"
    ],
    'German': [
        "Allgemeine Anfrage",
        "Vorraussichtliche Kosten",
        "Arzt im Bangkok Hospital Pattaya kontaktieren",
        "Andere"
    ],
    'Chinese': [
        "普通咨询",
        "预估价格咨询",
        "联系芭提雅曼谷医院医生",
        "其他"
    ],
    'Arabic': [
        "General Inquiry",
        "Estimated Cost",
        "Contact My Doctor at Bangkok Hospital Pattaya",
        "Other"
    ]
}

category_mapping = {
    'General Inquiry': [
        'General Inquiry', 'Allgemeine Anfrage', 'Общий запрос', 'สอบถามทั่วไป', '普通咨询'
    ],
    'Estimated Cost': [
        'Estimated Cost', 'Vorraussichtliche Kosten', 'Узнать про цену', 'ค่าใช้จ่าย', '预估价格咨询'
    ],
    'Contact Doctor': [
        'Contact My Doctor at Bangkok Hospital Pattaya', 'Arzt im Bangkok Hospital Pattaya kontaktieren',
        'Написать врачу', 'ติดต่อกับหมอประจำตัวที่โรงพยาบาลกรุงเทพพัทยา', '联系芭提雅曼谷医院医生'
    ],
    'Other': [
        'Other', 'Andere', 'Другое', 'อื่นๆ', '其他'
    ]
}
