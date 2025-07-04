import csv
import random
from datetime import datetime, timedelta
from pathlib import Path

# Centers and Clinics list
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

Inquiry = [
    "General Inquiry", "Estimated Cost", "Contact My Doctor at Bangkok Hospital Pattaya", "Other"
]

start_date = datetime.strptime("01/04/2025", "%d/%m/%Y")
end_date = datetime.strptime("30/04/2025", "%d/%m/%Y")
date_range = (end_date - start_date).days

def gen(lang):
    # Generate rows
    rows = []
    for _ in range(100):
        name = lang
        inquiry = random.choice(Inquiry)
        center = random.choice(centers_and_clinics_list)
        entry_date = (start_date + timedelta(days=random.randint(0, date_range))).strftime("%d/%m/%Y")
        rows.append([name, entry_date])
    return rows

# File path

def write(lang, rows):
    # Write to CSV
    csv_path = Path(f"./my-first-deploy-summary-email-project-master/Fake_data/packages-promotion-form-{lang}.csv")
    with open(csv_path, mode='w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(["packages", "Entry Date"])
        writer.writerows(rows)


def init():
    lang = ['en', 'ar', 'ru', 'th', 'de', 'zh-hans']
    for lang in lang:
        rows = gen(lang)
        write(lang, rows)

init()



