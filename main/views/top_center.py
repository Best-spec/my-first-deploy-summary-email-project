import os
import glob
import pandas as pd
from collections import defaultdict
from django.http import JsonResponse

def find_top_clinics_summary(folder_path="media/uploads"):
    langs = ["ar", "de", "en", "ru", "th", "zh-hans"]

    centers_and_clinics = {
        "Ambulance Service": 0,
        "Prestige Wellness Center": 0,
        "Dermatology and Plastic Surgery Center": 0,
        "Breast Center": 0,
        "Breast Feeding Clinic": 0,
        "Cardiac Care Unit": 0,
        "Cardiac Cath Lab": 0,
        "Cardiac Rehabilitations": 0,
        "Dental Cosmetic and Implant Center": 0,
        "Diabetes Mellitus (DM) & Endocrinology Center": 0,
        "Diagnostic Imaging Dept (JTH)": 0,
        "Ear Nose Throat Center": 0,
        "Emergency Medical Service Center": 0,
        "Emergency & Accident Dept(JTH)": 0,
        "Eye Center": 0,
        "Fertility Center": 0,
        "Gastrointestinal & Liver Center": 0,
        "Gastrointestinal": 0,
        "Health Promotion Center": 0,
        "Hearing Speech Balance Tinnitus Center": 0,
        "Heart Center": 0,
        "Hemodialysis Center": 0,
        "Hyperbaric Oxygen Therapy": 0,
        "Diagnostic Imaging and Interventional Radiology Center": 0,
        "ICU - Trauma and Surgery": 0,
        "Intermediate Intensive Care": 0,
        "Laboratory": 0,
        "Labour Room": 0,
        "Lasik and SuperSight Surgery Center": 0,
        "Internal Medicine Center": 0,
        "Mental Health Center": 0,
        "Neonatal Intensive Care Unit (NICU)": 0,
        "Neuroscience Center": 0,
        "Nursery": 0,
        "Women's Health Center": 0,
        "Oncology Center": 0,
        "Operating Room": 0,
        "Orthopedic Center": 0,
        "Pediatric Intensive Care Unit or PICU": 0,
        "Child Health Center": 0,
        "Rehabilitation Center": 0,
        "Surgery Center": 0,
        "Urology Center": 0,
        "Wound Care Unit": 0,
        "Hospital Director Office": 0,
        "Medical Staff Organization": 0,
        "Anesthetic": 0,
        "BPH Clinic : Bangsare": 0,
        "BPH Clinic : Bo Win": 0,
        "BPH Clinic : Kreua Sahaphat": 0,
        "ICU Medicine": 0,
        "ICU Neurosciences": 0,
        "KOH LARN Clinic": 0,
        "Nutrition Therapeutic": 0,
        "U-Tapao Clinic": 0,
        "Jomtien Hospital": 0,
    }

    name_map = {
        "แผนกเคลื่อนย้ายผู้ป่วยทางการแพทย์": "Ambulance Service",
        "ศูนย์ส่งเสริมสุขภาพ": "Prestige Wellness Center",
        "ศูนย์ผิวพรรณและศัลยกรรมความงาม": "Dermatology and Plastic Surgery Center",
        "ศูนย์เต้านม": "Breast Center",
        "ศูนย์สุขภาพสตรี": "Breast Feeding Clinic",
        "ศูนย์หัวใจ": "Cardiac Care Unit",
        "ศูนย์ทันตกรรมความงามและรากเทียม": "Dental Cosmetic and Implant Center",
        "ศูนย์เบาหวานและต่อมไร้ท่อ": "Diabetes Mellitus (DM) & Endocrinology Center",
        "ศูนย์วินิจฉัยและรังสีร่วมรักษา": "Diagnostic Imaging Dept (JTH)",
        "ศูนย์หู คอ จมูก": "Ear Nose Throat Center",
        "แผนกฉุกเฉิน": "Emergency Medical Service Center",
        "ศูนย์ตา": "Eye Center",
        "ศูนย์มีบุตรยาก": "Fertility Center",
        "ศูนย์ระบบทางเดินอาหารและตับ": "Gastrointestinal & Liver Center",
        "ศูนย์เวชศาสตร์ฟื้นฟู": "Rehabilitation Center",
        "ศูนย์สมองและระบบประสาท": "Neuroscience Center",
        "ศูนย์สุขภาพจิต": "Mental Health Center",
        "ศูนย์อายุรกรรมทั่วไป": "Internal Medicine Center",
        "ศูนย์ศัลยกรรมทั่วไป": "Surgery Center",
        "ศูนย์ศัลยกรรมกระดูกและข้อ": "Orthopedic Center",
        "ศูนย์กุมารเวช": "Child Health Center",
        "ศูนย์ศัลยกรรมระบบทางเดินปัสสาวะ": "Urology Center",
        "ศูนย์โรคมะเร็ง": "Oncology Center",
        "ศูนย์แก้ไขสายตาด้วยเลสิคและซุปเปอร์ไซต์": "Lasik and SuperSight Surgery Center",
        "ศูนย์ดูแลแผล": "Wound Care Unit",
        "ศูนย์โภชนบำบัด": "Nutrition Therapeutic",
    }

    total_normal_counts = defaultdict(int)
    total_recommended_counts = defaultdict(int)

    def count_from_files(file_pattern, target_counts):
        files = glob.glob(file_pattern)
        for file in files:
            df = pd.read_csv(file)
            df.columns = df.columns.str.strip().str.replace('\ufeff', '')
            if len(df.columns) < 2:
                continue
            col_name = df.columns[1]
            for dept in df[col_name].astype(str).str.strip():
                if dept in centers_and_clinics:
                    target_counts[dept] += 1
                else:
                    key = name_map.get(dept)
                    if key:
                        target_counts[key] += 1

    for lang in langs:
        count_from_files(os.path.join(folder_path, f"appointment-{lang}-*.csv"), total_normal_counts)
        count_from_files(os.path.join(folder_path, f"appointment-recommended-{lang}-*.csv"), total_recommended_counts)

    result = [
        {
            "clinic": k,
            "appointment_count": total_normal_counts[k],
            "recommended_count": total_recommended_counts[k],
            "total": total_normal_counts[k] + total_recommended_counts[k]
        }
        for k in centers_and_clinics
    ]

    result = [r for r in result if r["total"] > 0]
    result = sorted(result, key=lambda x: x["total"], reverse=True)[:20]

    # เพิ่ม total summary รวมท้ายรายการ
    total_sum = {
        "clinic": "Total",
        "appointment_count": sum(r["appointment_count"] for r in result),
        "recommended_count": sum(r["recommended_count"] for r in result),
        "total": sum(r["total"] for r in result),
    }
    result.append(total_sum)

    return [result]