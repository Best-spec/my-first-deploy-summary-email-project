import os

# Ensure the directory exists
os.makedirs("media/uploads", exist_ok=True)

# Fake normal appointment data (English)
appointment_data = [
    "No,Clinic",
    "1,ศูนย์เวชศาสตร์ฟื้นฟู",
    "2,ศูนย์ศัลยกรรมทั่วไป",
    "3,ศูนย์หัวใจ",
    "4,แผนกฉุกเฉิน",
    "5,ศูนย์มีบุตรยาก",
    "6,ศูนย์ระบบทางเดินอาหารและตับ",
    "7,ศูนย์อายุรกรรมทั่วไป",
    "8,ศูนย์ศัลยกรรมกระดูกและข้อ",
    "9,ศูนย์สุขภาพจิต",
    "10,แผนกเคลื่อนย้ายผู้ป่วยทางการแพทย์"
]

# Fake recommended appointment data (English)
recommended_data = [
    "No,Clinic",
    "1,ศูนย์ดูแลแผล",
    "2,ศูนย์โภชนบำบัด",
    "3,ศูนย์ตา",
    "4,ศูนย์ส่งเสริมสุขภาพ",
    "5,ศูนย์กุมารเวช",
    "6,ศูนย์หัวใจ",
    "7,แผนกฉุกเฉิน"
]

# Write normal appointment file
with open("./appointment-en-fake.csv", "w", encoding="utf-8") as f:
    f.write("\n".join(appointment_data))

# Write recommended appointment file
with open("./appointment-recommended-en-fake.csv", "w", encoding="utf-8") as f:
    f.write("\n".join(recommended_data))
