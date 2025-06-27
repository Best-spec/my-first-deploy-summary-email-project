from django.http import JsonResponse
from main.models import UploadedFile
from .inquiry import get_total_languages_summary
from .feedback_package import find_FeedbackAndPackage
from .appointment import find_appointment_from_csv_folder
def find_TotalMonth():
    try:
        total_inquiry = get_total_languages_summary()
        total_feedback_package = find_FeedbackAndPackage()
        total_appointment = find_appointment_from_csv_folder()

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

        print(summary)
        return [summary, plot_data, transposed]

    except Exception as e:
        print("🔥 ERROR:", e)
        return [[],[]]



    # print(summary)
    # print(feedback_map)
    # print(appointment_map)

    # raw_data = {
    #     'Inquiry': [111, 90, 10],
    #     'Package': [1, 5, 2],
    #     'Feedback': [3, 2, 0],
    #     'Appointment': [10, 8, 1],
    #     'Appointment Recommended': [20, 15, 3]
    # }
    
    # json = [
    #     {
    #         'Language': 'English',       
    #         'Inquiry': 111,
    #         'Package': 1,
    #         'Feedback': 3, 
    #         'Appointment': 10,
    #         'Appointment Recommended': 20,
    #     }
    # ]
    # return json