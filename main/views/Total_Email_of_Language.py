from django.http import JsonResponse
from main.models import UploadedFile
from .inquiry import get_total_languages_summary
from .feedback_package import cal_FeedbackAndPackage
from .appointment import find_appointment_from_csv_folder
from .compare.result_compare import Resultcompare

def cal_TotalMonth(date=None):
    try:
        dateset1 = date.get('startDate')
        dateset2 = date.get('endDate')
        # print("cal total ใช้งานได้")
        # print("date", date)
        total_inquiry = get_total_languages_summary(date)
        total_feedback_package = cal_FeedbackAndPackage(date)
        total_appointment = find_appointment_from_csv_folder((dateset1, dateset2))
        # print("inquiry",total_inquiry)
        # print("feedback",total_feedback_package)
        # print("appointment",total_appointment)

        # flatten ถ้าเป็น list ซ้อน
        if isinstance(total_feedback_package, list) and isinstance(total_feedback_package[0], dict) is False:
            total_feedback_package = total_feedback_package[0]
        if isinstance(total_appointment, list) and isinstance(total_appointment[0], dict) is False:
            total_appointment = total_appointment[0]

        summary = []

        feedback_map = {row["Language"]: row for row in total_feedback_package if row["Language"] != "Total"}
        appointment_map = {row["Language"]: row for row in total_appointment if row["Language"] != "Total"}

        for row in total_inquiry:
            lang = row.get("language")
            if lang != "Total inquiry":
                feedback_row = feedback_map.get(lang, {})
                appoint_row = appointment_map.get(lang, {})

                inquiry = row.get("Total Language", 0)
                feedback = feedback_row.get("Feedback", 0)
                packages = feedback_row.get("Packages", 0)
                appointment = appoint_row.get("Appointment", 0)
                appointment_recommended = appoint_row.get("Appointment Recommended", 0)

                summary.append({
                    "language": lang,
                    "inquiry": inquiry,
                    "feedback": feedback,
                    "packages": packages,
                    "appointment": appointment,
                    "appointment recommended": appointment_recommended,
                    "total all": inquiry + feedback + packages + appointment + appointment_recommended,
                })
                # print(summary)

        # ✅ เพิ่มแถวรวม
        total_row = {
            "language": "Total",
            "inquiry": sum(item["inquiry"] for item in summary),
            "feedback": sum(item["feedback"] for item in summary),
            "packages": sum(item["packages"] for item in summary),
            "appointment": sum(item["appointment"] for item in summary),
            "appointment recommended": sum(item["appointment recommended"] for item in summary),
        }
        # ✨ เพิ่ม total all ของ total row
        total_row["total all"] = (
            total_row["inquiry"] +
            total_row["feedback"] +
            total_row["packages"] +
            total_row["appointment"] +
            total_row["appointment recommended"]
        )

        summary.append(total_row)

        # เตรียมข้อมูลสำหรับ plot (ตัด total all ออก และตัดแถวรวม)
        plot_data = []
        for row in summary:
            if row["language"] != "Total":  # ไม่เอาแถวรวม
                plot_row = {k: v for k, v in row.items() if k != "total all"}
                plot_data.append(plot_row)

        categories = ["inquiry", "feedback", "packages", "appointment", "appointment recommended"]

        # สร้างแกน x ตาม category ปกติ
        transposed = []

        for cat in categories:
            row = {"category": cat}
            for entry in plot_data:
                lang = entry["language"]
                row[lang] = entry.get(cat, 0)
            transposed.append(row)

        # ✅ เพิ่ม row สำหรับ "total all" (รวม inquiry+feedback+... ต่อภาษา)
        total_all_row = {"category": "total all"}
        for entry in plot_data:
            lang = entry["language"]
            total_all_row[lang] = (
                entry.get("inquiry", 0) +
                entry.get("feedback", 0) +
                entry.get("packages", 0) +
                entry.get("appointment", 0) +
                entry.get("appointment recommended", 0)
            )
        transposed.append(total_all_row)

        # print(summary)
        return summary, plot_data, transposed

    except Exception as e:
        print("🔥 ERROR:", e)
        return [[],[]]
    
def find_TotalMonth(date):
    try:
        if len(date) <= 1:
            print("it 1")
            total, plot_data, transposed = cal_TotalMonth(date[0])
            return [total, plot_data, transposed]
        else :
            print("it 2")
            totalset1, plot_data, transposed = cal_TotalMonth(date[0])
            totalset2, plot_data, transposed = cal_TotalMonth(date[1])
            return [Resultcompare(totalset1, totalset2, date)]
    except Exception as e:
        print("error from cal total",e)