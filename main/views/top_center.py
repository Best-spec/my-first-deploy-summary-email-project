import pandas as pd
import os
import glob
from collections import defaultdict
import json
from datetime import datetime
from .compare.data_loader import *
from .compare.result_compare import Resultcompare

def csv_to_json(folder_path="media/uploads", langs=None, start_date=None, end_date=None):
    """
    อ่านไฟล์ CSV จากโฟลเดอร์ที่ระบุ แปลงข้อมูลที่เกี่ยวข้องให้เป็นรายการของพจนานุกรม
    พร้อมดึง Entry Date และ Type โดยกรองตามช่วงวันที่ในคอลัมน์ 'Entry Date' ของ CSV

    อาร์กิวเมนต์:
        folder_path (str): พาธไปยังโฟลเดอร์ที่มีไฟล์ CSV
        langs (list): รายการรหัสภาษาที่ใช้สำหรับชื่อไฟล์
        start_date (str, optional): วันที่เริ่มต้นการกรอง (รูปแบบ 'DD/MM/YYYY')
        end_date (str, optional): วันที่สิ้นสุดการกรอง (รูปแบบ 'DD/MM/YYYY')

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

    # แปลง start_date และ end_date เป็นวัตถุ datetime เพื่อการเปรียบเทียบ
    filter_start_dt = None
    filter_end_dt = None
    if start_date:
        try:
            filter_start_dt = datetime.strptime(start_date, '%d/%m/%Y')
        except ValueError:
            print(f"Warning: รูปแบบ start_date '{start_date}' ไม่ถูกต้อง. คาดหวัง DD/MM/YYYY.")
            start_date = None
    if end_date:
        try:
            filter_end_dt = datetime.strptime(end_date, '%d/%m/%Y')
        except ValueError:
            print(f"Warning: รูปแบบ end_date '{end_date}' ไม่ถูกต้อง. คาดหวัง DD/MM/YYYY.")
            end_date = None

    for lang in langs:
        # ประมวลผลการนัดหมายปกติ
        normal_files = glob.glob(os.path.join(folder_path, f"appointment-{lang}-*.csv"))
        for file in normal_files:
            try:
                df = pd.read_csv(file)
                df.columns = df.columns.str.strip().str.replace('\ufeff', '')

                if len(df.columns) < 2 or 'Entry Date' not in df.columns:
                    # ไม่จำเป็นต้องมีวันที่ในชื่อไฟล์อีกต่อไป ดังนั้น glob.glob จะหาไฟล์ที่ชื่อตรงกับ appointment-{lang}-*.csv
                    # โดยไม่สนใจวันที่ในชื่อไฟล์ หากคุณมีไฟล์ที่ไม่มีวันที่ในชื่อและต้องการให้มันถูกรวมด้วย
                    print(f"Warning: ไฟล์ '{file}' ไม่มีคอลัมน์ที่ 2 หรือ 'Entry Date'. ข้ามไฟล์นี้.")
                    continue

                clinic_column_name = df.columns[1]
                file_type = "appointment"

                for index, row in df.iterrows():
                    clinic_name = str(row[clinic_column_name]).strip()
                    entry_date_full_str = str(row['Entry Date']).strip() # ดึงวันที่เต็มรูปแบบ (รวมเวลา)

                    # ตัดส่วนเวลาออก (ถ้ามี) และพยายามแปลงเป็นวันที่เท่านั้น
                    row_date_dt = None
                    entry_date_only_str = entry_date_full_str # Default to full string if parsing fails
                    try:
                        # ลองแปลงเป็น datetime object ก่อน
                        # รูปแบบทั่วไปที่พบ: 'YYYY-MM-DD HH:MM:SS' หรือ 'DD/MM/YYYY HH:MM:SS'
                        # หรือเพียงแค่ 'YYYY-MM-DD' หรือ 'DD/MM/YYYY'
                        
                        # ลองรูปแบบ YYYY-MM-DD HH:MM:SS
                        if '-' in entry_date_full_str and ':' in entry_date_full_str:
                            row_date_dt = datetime.strptime(entry_date_full_str, '%Y-%m-%d %H:%M:%S')
                            entry_date_only_str = row_date_dt.strftime('%Y-%m-%d') # กำหนด output เป็น YYYY-MM-DD
                        # ลองรูปแบบ DD/MM/YYYY HH:MM:SS
                        elif '/' in entry_date_full_str and ':' in entry_date_full_str:
                             row_date_dt = datetime.strptime(entry_date_full_str, '%d/%m/%Y %H:%M:%S')
                             entry_date_only_str = row_date_dt.strftime('%d/%m/%Y') # กำหนด output เป็น DD/MM/YYYY
                        # ลองรูปแบบ YYYY-MM-DD (ไม่มีเวลา)
                        elif '-' in entry_date_full_str:
                            row_date_dt = datetime.strptime(entry_date_full_str, '%Y-%m-%d')
                            entry_date_only_str = entry_date_full_str
                        # ลองรูปแบบ DD/MM/YYYY (ไม่มีเวลา)
                        elif '/' in entry_date_full_str:
                            row_date_dt = datetime.strptime(entry_date_full_str, '%d/%m/%Y')
                            entry_date_only_str = entry_date_full_str
                        else:
                            raise ValueError("Unrecognized date format") # หากไม่ตรงกับรูปแบบที่คาดหวัง

                        # ตรวจสอบและกรองวันที่จากคอลัมน์ 'Entry Date' (เฉพาะส่วนวันที่)
                        if filter_start_dt or filter_end_dt:
                            if (filter_start_dt and row_date_dt < filter_start_dt) or \
                               (filter_end_dt and row_date_dt > filter_end_dt):
                                continue # ข้ามแถวนี้หากวันที่ไม่อยู่ในช่วง

                    except ValueError:
                        print(f"Warning: รูปแบบวันที่ในคอลัมน์ 'Entry Date' ของไฟล์ '{file}' แถวที่ {index+1} ('{entry_date_full_str}') ไม่ถูกต้อง หรือไม่สามารถ parse ได้. ข้ามการกรองวันที่สำหรับแถวนี้.")
                        # ถ้าไม่สามารถ parse วันที่ได้ จะไม่กรองแถวนี้ด้วยเงื่อนไขวันที่
                        # และจะใช้ entry_date_full_str เป็นค่า Entry Date ใน JSON Output

                    all_data["normal_appointments"].append({
                        "Centers & Clinics": clinic_name,
                        "Entry Date": entry_date_only_str, # ใช้เฉพาะส่วนวันที่ที่ตัดแล้ว หรือ string เดิม
                        "Type": file_type
                    })
            except Exception as e:
                print(f"เกิดข้อผิดพลาดในการอ่านไฟล์ {file}: {e}")

        # ประมวลผลการนัดหมายที่แนะนำ
        recommended_files = glob.glob(os.path.join(folder_path, f"appointment-recommended-{lang}-*.csv"))
        for file in recommended_files:
            try:
                df = pd.read_csv(file)
                df.columns = df.columns.str.strip().str.replace('\ufeff', '')

                if len(df.columns) < 2 or 'Entry Date' not in df.columns:
                    print(f"Warning: ไฟล์ '{file}' ไม่มีคอลัมน์ที่ 2 หรือ 'Entry Date'. ข้ามไฟล์นี้.")
                    continue

                clinic_column_name = df.columns[1]
                file_type = "recommended"

                for index, row in df.iterrows():
                    clinic_name = str(row[clinic_column_name]).strip()
                    entry_date_full_str = str(row['Entry Date']).strip()

                    row_date_dt = None
                    entry_date_only_str = entry_date_full_str
                    try:
                        if '-' in entry_date_full_str and ':' in entry_date_full_str:
                            row_date_dt = datetime.strptime(entry_date_full_str, '%Y-%m-%d %H:%M:%S')
                            entry_date_only_str = row_date_dt.strftime('%Y-%m-%d')
                        elif '/' in entry_date_full_str and ':' in entry_date_full_str:
                             row_date_dt = datetime.strptime(entry_date_full_str, '%d/%m/%Y %H:%M:%S')
                             entry_date_only_str = row_date_dt.strftime('%d/%m/%Y')
                        elif '-' in entry_date_full_str:
                            row_date_dt = datetime.strptime(entry_date_full_str, '%Y-%m-%d')
                            entry_date_only_str = entry_date_full_str
                        elif '/' in entry_date_full_str:
                            row_date_dt = datetime.strptime(entry_date_full_str, '%d/%m/%Y')
                            entry_date_only_str = entry_date_full_str
                        else:
                            raise ValueError("Unrecognized date format")

                        if filter_start_dt or filter_end_dt:
                            if (filter_start_dt and row_date_dt < filter_start_dt) or \
                               (filter_end_dt and row_date_dt > filter_end_dt):
                                continue

                    except ValueError:
                        print(f"Warning: รูปแบบวันที่ในคอลัมน์ 'Entry Date' ของไฟล์ '{file}' แถวที่ {index+1} ('{entry_date_full_str}') ไม่ถูกต้อง หรือไม่สามารถ parse ได้. ข้ามการกรองวันที่สำหรับแถวนี้.")

                    all_data["recommended_appointments"].append({
                        "Centers & Clinics": clinic_name,
                        "Entry Date": entry_date_only_str,
                        "Type": file_type
                    })
            except Exception as e:
                print(f"เกิดข้อผิดพลาดในการอ่านไฟล์ {file}: {e}")
    return all_data

def process_clinic_data(raw_json_data):
    """
    ประมวลผลข้อมูล JSON ดิบเพื่อเพื่อนับจำนวนการนัดหมายสำหรับแต่ละคลินิก.
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
        dept = item["Centers & Clinics"]
        if dept in centers_and_clinics:
            total_normal_counts[dept] += 1
        else:
            key = name_map.get(dept)
            if key:
                total_normal_counts[key] += 1

    # ประมวลผลการนัดหมายที่แนะนำ
    for item in raw_json_data["recommended_appointments"]:
        dept = item["Centers & Clinics"]
        if dept in centers_and_clinics:
            total_recommended_counts[dept] += 1
        else:
            key = name_map.get(dept)
            if key:
                total_recommended_counts[key] += 1

    processed_data = []
    for k in centers_and_clinics_list:
        normal_count = total_normal_counts[k]
        recommended_count = total_recommended_counts[k]
        total = normal_count + recommended_count
        if total > 0:
            processed_data.append({
                "Centers & clinics": k,
                "appointment_count": normal_count,
                "recommended_count": recommended_count,
                "total": total
            })

    processed_data = sorted(processed_data, key=lambda x: x["total"], reverse=True)[:20]
    # print([obj.get('normal_appointments') for i, obj in enumerate(raw_json_data)])
    return processed_data

def output_to_json(processed_data, output_file_name="top_clinics_summary.json"):
    """
    บันทึกข้อมูลคลินิกที่ประมวลผลแล้วลงในไฟล์ JSON.
    """
    with open(output_file_name, 'w', encoding='utf-8') as f:
        json.dump(processed_data, f, ensure_ascii=False, indent=4)
    print(f"สรุปคลินิกยอดนิยมถูกบันทึกที่ {output_file_name}")

def sumf_top(start, end):
    folder_path="media/uploads"
    start_date = datetime.strptime(start, "%Y-%m-%d").strftime("%d/%m/%Y")
    end_date = datetime.strptime(end, "%Y-%m-%d").strftime("%d/%m/%Y")
    date_range_str = ""
    if start_date and end_date:
        date_range_str = f"ตั้งแต่ {start_date} ถึง {end_date}"
    elif start_date:
        date_range_str = f"ตั้งแต่ {start_date} เป็นต้นไป"
    elif end_date:
        date_range_str = f"จนถึง {end_date}"
    else:
        date_range_str = "ทุกวันที่ที่มีอยู่"

    print(f"--- กำลังเริ่มต้นการประมวลผลข้อมูลคลินิก {date_range_str} ---")

    print("ขั้นตอนที่ 1: กำลังอ่าน CSV และแปลงเป็นข้อมูลคล้าย JSON ดิบ (พร้อมกรองวันที่ในคอลัมน์ 'Entry Date' และตัดเวลา)...")
    langs = ["ar", "de", "en", "ru", "th", "zh-hans"]
    raw_data = csv_to_json(folder_path=folder_path, langs=langs,
                           start_date=start_date, end_date=end_date)

    print("ขั้นตอนที่ 2: กำลังประมวลผลข้อมูลดิบเพื่อนับจำนวนการนัดหมายของคลินิก...")
    processed_clinic_info = process_clinic_data(raw_data)

    print("--- การประมวลผลข้อมูลคลินิกเสร็จสมบูรณ์แล้ว ---")
    return processed_clinic_info

def find_top_clinics_summary_main(date_param=None):
    """
    ฟังก์ชันหลักเพื่อควบคุมการทำงานในการค้นหาคลินิกยอดนิยม.

    อาร์กิวเมนต์:
        folder_path (str): พาธไปยังโฟลเดอร์ที่มีไฟล์ CSV.
        output_file (str): ชื่อไฟล์ JSON เอาต์พุต.
        start_date (str, optional): วันที่เริ่มต้นการกรอง (รูปแบบ 'DD/MM/YYYY').
        end_date (str, optional): วันที่สิ้นสุดการกรอง (รูปแบบ 'DD/MM/YYYY').

    ส่งคืน:
        list: รายการคลินิกยอดนิยมที่จัดเรียงแล้ว.
    """ 
    try:
        if len(date_param) <= 1:
            print(date_param, len(date_param))
            start = date_param[0]['startDate']
            end = date_param[0]['endDate']
            for_table = sumf_top(start, end)
            print(for_table)
            return {
               "dataForTable": for_table,
               "dataForChart": for_table,
            }
        else:
            print('มากกว่าสอง')
            startset1 = date_param[0]['startDate']
            endset1 = date_param[0]['endDate']
            startset2 = date_param[1]['startDate']
            endset2 = date_param[1]['endDate']
            datatop1 = sumf_top(startset1, endset1)
            datatop2 = sumf_top(startset2, endset2)
            print(Resultcompare(datatop1, datatop2, date_param))
            return {
                "dataForTable": Resultcompare(datatop1, datatop2, date_param),
                "dataForChart": Resultcompare(datatop1, datatop2, date_param)
            }

    except Exception as e:
        print("🔥 ERROR in topCetner():", e)
        return [], [] 
    
    