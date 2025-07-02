import pandas as pd
import os
import glob
from collections import defaultdict
import json
import re # สำหรับใช้ regular expression ในการดึงวันที่

def csv_to_json(folder_path="media/uploads", langs=None):
    """
    อ่านไฟล์ CSV จากโฟลเดอร์ที่ระบุ แปลงข้อมูลที่เกี่ยวข้องให้เป็นรายการของพจนานุกรม
    พร้อมดึง Entry Date และ Type จากชื่อไฟล์ โดยคงรูปแบบวันที่เดิมไว้

    อาร์กิวเมนต์:
        folder_path (str): พาธไปยังโฟลเดอร์ที่มีไฟล์ CSV
        langs (list): รายการรหัสภาษาที่ใช้สำหรับชื่อไฟล์

    ส่งคืน:
        dict: พจนานุกรมที่มีสองคีย์คือ 'normal_appointments' และ 'recommended_appointments',
              แต่ละคีย์เก็บรายการของพจนานุกรมที่มี "Centers & Clinics", "Entry Date" และ "Type"
    """
    if langs is None:
        langs = ["ar", "de", "en", "ru", "th", "zh-hans"]

    all_data = {
        "normal_appointments": [],
        "recommended_appointments": []
    }

    # รูปแบบสำหรับดึงวันที่ YYYY/MM/DD จากชื่อไฟล์
    # ตัวอย่าง: appointment-en-2025/07/01.csv หรือ appointment-recommended-en-2025/07/01.csv
    # เปลี่ยน regex ให้รองรับ '/' ในวันที่
    date_pattern = re.compile(r"-\w{2}-(\d{4}/\d{2}/\d{2}).*\.csv")

    for lang in langs:
        # ประมวลผลการนัดหมายปกติ
        normal_files = glob.glob(os.path.join(folder_path, f"appointment-{lang}-*.csv"))
        for file in normal_files:
            match = date_pattern.search(file)
            # ดึงวันที่ออกมาโดยไม่ต้องแปลง
            entry_date = match.group(1) if match else "Unknown Date"
            file_type = "appointment"

            try:
                df = pd.read_csv(file)
                df.columns = df.columns.str.strip().str.replace('\ufeff', '')
                # ตรวจสอบว่ามีคอลัมน์ที่ 2 (index 1) หรือไม่
                if len(df.columns) >= 2:
                    clinic_column_name = df.columns[1] # คอลัมน์ที่ 2 คือ index 1
                    for dept in df[clinic_column_name].astype(str).str.strip():
                        all_data["normal_appointments"].append({
                            "Centers & Clinics": dept,
                            "Entry Date": entry_date,
                            "Type": file_type
                        })
            except Exception as e:
                print(f"เกิดข้อผิดพลาดในการอ่านไฟล์ {file}: {e}")

        # ประมวลผลการนัดหมายที่แนะนำ
        recommended_files = glob.glob(os.path.join(folder_path, f"appointment-recommended-{lang}-*.csv"))
        for file in recommended_files:
            match = date_pattern.search(file)
            # ดึงวันที่ออกมาโดยไม่ต้องแปลง
            entry_date = match.group(1) if match else "Unknown Date"
            file_type = "recommended"

            try:
                df = pd.read_csv(file)
                df.columns = df.columns.str.strip().str.replace('\ufeff', '')
                if len(df.columns) >= 2:
                    clinic_column_name = df.columns[1] # คอลัมน์ที่ 2 คือ index 1
                    for dept in df[clinic_column_name].astype(str).str.strip():
                        all_data["recommended_appointments"].append({
                            "Centers & Clinics": dept,
                            "Entry Date": entry_date,
                            "Type": file_type
                        })
            except Exception as e:
                print(f"เกิดข้อผิดพลาดในการอ่านไฟล์ {file}: {e}")
    return all_data

def process_clinic_data(raw_json_data):
    """
    ประมวลผลข้อมูล JSON ดิบเพื่อเพื่อนับจำนวนการนัดหมายสำหรับแต่ละคลินิก

    อาร์กิวเมนต์:
        raw_json_data (dict): พจนานุกรมที่มีรายการ 'normal_appointments' และ 'recommended_appointments'

    ส่งคืน:
        list: รายการของพจนานุกรม ซึ่งแต่ละพจนานุกรมแสดงถึงคลินิกที่มี
              จำนวนการนัดหมาย ('appointment_count', 'recommended_count', 'total')
    """
    centers_and_clinics_list = [
        "Ambulance Service", "Prestige Wellness Center", "Dermatology and Plastic Surgery Center",
        "Breast Center", "Breast Feeding Clinic", "Cardiac Care Unit", "Cardiac Cath Lab",
        "Cardiac Rehabilitations", "Dental Cosmetic and Implant Center", "Diabetes Mellitus (DM) & Endocrinology Center",
        "Diagnostic Imaging Dept (JTH)", "Ear Nose Throat Center", "Emergency Medical Service Center",
        "Emergency & Accident Dept(JTH)", "Eye Center", "Fertility Center", "Gastrointestinal & Liver Center",
        "Gastrointestinal", "Health Promotion Center", "Hearing Speech Balance Tinnitus Center",
        "Heart Center", "Hemodialysis Center", "Hyperbaric Oxygen Therapy",
        "Diagnostic Imaging and Interventional Radiology Center", "ICU - Trauma and Surgery",
        "Intermediate Intensive Care", "Laboratory", "Labour Room", "Lasik and SuperSight Surgery Center",
        "Internal Medicine Center", "Mental Health Center", "Neonatal Intensive Care Unit (NICU)",
        "Neuroscience Center", "Nursery", "Women's Health Center", "Oncology Center",
        "Operating Room", "Orthopedic Center", "Pediatric Intensive Care Unit or PICU",
        "Child Health Center", "Rehabilitation Center", "Surgery Center", "Urology Center",
        "Wound Care Unit", "Hospital Director Office", "Medical Staff Organization",
        "Anesthetic", "BPH Clinic : Bangsare", "BPH Clinic : Bo Win",
        "BPH Clinic : Kreua Sahaphat", "ICU Medicine", "ICU Neurosciences",
        "KOH LARN Clinic", "Nutrition Therapeutic", "U-Tapao Clinic", "Jomtien Hospital",
    ]
    # แปลง list เป็น dict เพื่อให้ง่ายต่อการตรวจสอบและเพิ่มค่าเริ่มต้นเป็น 0
    centers_and_clinics = {clinic_name: 0 for clinic_name in centers_and_clinics_list}


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
        "ศูนย์สุขภาพสตรี": "Women's Health Center",
    }

    total_normal_counts = defaultdict(int)
    total_recommended_counts = defaultdict(int)

    # ประมวลผลการนัดหมายปกติ
    for item in raw_json_data["normal_appointments"]:
        dept = item["Centers & Clinics"] # ใช้คีย์ใหม่
        if dept in centers_and_clinics:
            total_normal_counts[dept] += 1
        else:
            key = name_map.get(dept)
            if key:
                total_normal_counts[key] += 1

    # ประมวลผลการนัดหมายที่แนะนำ
    for item in raw_json_data["recommended_appointments"]:
        dept = item["Centers & Clinics"] # ใช้คีย์ใหม่
        if dept in centers_and_clinics:
            total_recommended_counts[dept] += 1
        else:
            key = name_map.get(dept)
            if key:
                total_recommended_counts[key] += 1

    processed_data = []
    # วนลูปจาก centers_and_clinics_list เพื่อให้แน่ใจว่าคลินิกทั้งหมดถูกพิจารณา
    for k in centers_and_clinics_list:
        normal_count = total_normal_counts[k]
        recommended_count = total_recommended_counts[k]
        total = normal_count + recommended_count
        # เพิ่มเฉพาะคลินิกที่มีการนัดหมายรวมมากกว่า 0
        if total > 0:
            processed_data.append({
                "clinic": k,
                "appointment_count": normal_count,
                "recommended_count": recommended_count,
                "total": total
            })

    # จัดเรียงและเลือก 20 อันดับแรก
    processed_data = sorted(processed_data, key=lambda x: x["total"], reverse=True)[:20]
    return processed_data

def output_to_json(processed_data, output_file_name="top_clinics_summary.json"):
    """
    บันทึกข้อมูลคลินิกที่ประมวลผลแล้วลงในไฟล์ JSON.

    อาร์กิวเมนต์:
        processed_data (list): รายการของพจนานุกรมที่มีข้อมูลคลินิกที่ประมวลผลแล้ว.
        output_file_name (str): ชื่อไฟล์ JSON เอาต์พุต.
    """
    with open(output_file_name, 'w', encoding='utf-8') as f:
        json.dump(processed_data, f, ensure_ascii=False, indent=4)
    print(f"สรุปคลินิกยอดนิยมถูกบันทึกที่ {output_file_name}")

def find_top_clinics_summary_main(folder_path=None, output_file="top_clinics_summary.json"):
    """
    ฟังก์ชันหลักเพื่อควบคุมการทำงานในการค้นหาคลินิกยอดนิยม.

    อาร์กิวเมนต์:
        folder_path (str): พาธไปยังโฟลเดอร์ที่มีไฟล์ CSV.
        output_file (str): ชื่อไฟล์ JSON เอาต์พุต.

    ส่งคืน:
        list: รายการคลินิกยอดนิยมที่จัดเรียงแล้ว.
    """
    print(f"--- กำลังเริ่มต้นการประมวลผลข้อมูลคลินิก ---")

    # 1. CSV เป็น JSON
    print("ขั้นตอนที่ 1: กำลังอ่าน CSV และแปลงเป็นข้อมูลคล้าย JSON ดิบ...")
    langs = ["ar", "de", "en", "ru", "th", "zh-hans"]
    raw_data = csv_to_json(folder_path=folder_path, langs=langs)

    # 2. JSON เป็นข้อมูลที่ประมวลผลแล้ว
    print("ขั้นตอนที่ 2: กำลังประมวลผลข้อมูลดิบเพื่อนับจำนวนการนัดหมายของคลินิก...")
    processed_clinic_info = process_clinic_data(raw_data)


    # 3. ข้อมูลที่ประมวลผลแล้วเป็น JSON สำหรับเอาต์พุต
    print(f"ขั้นตอนที่ 3: กำลังบันทึกข้อมูลที่ประมวลผลแล้วไปยัง {output_file}...")
    output_to_json(processed_clinic_info, output_file)

    print("--- การประมวลผลข้อมูลคลินิกเสร็จสมบูรณ์แล้ว ---")
    return processed_clinic_info

if __name__ == "__main__":
    folder = "C:/Users/bphdigital/Desktop/Coding/my-first-deploy-summary-email-project-master/media/uploads"
    res = find_top_clinics_summary_main(folder)
    print(folder)
    print(res)
