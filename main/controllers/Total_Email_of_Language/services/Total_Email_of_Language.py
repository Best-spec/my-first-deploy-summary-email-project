from main.services.inquiry import get_total_languages_summary, cal_inquiry 
from main.services.feedback_package import cal_FeedbackAndPackage
from main.services.appointment import find_appointment_from_csv_folder
from main.utils.percentage.cal_percentage import find_percentage, cal_percent

def cal_TotalMonth(date, Web_Commerce):
    try:
        dateset1 = date.get('startDate')
        dateset2 = date.get('endDate')

        # print(dateset1, dateset2)
        # total_inquiry = get_total_languages_summary(date)
        total_inquiry, chart = cal_inquiry(dateset1, dateset2)
        total_feedback_package = cal_FeedbackAndPackage(date)
        total_appointment = find_appointment_from_csv_folder((dateset1, dateset2))

        # flatten ถ้า list ซ้อน
        if isinstance(total_feedback_package, list) and isinstance(total_feedback_package[0], dict) is False:
            total_feedback_package = total_feedback_package[0]
        if isinstance(total_appointment, list) and isinstance(total_appointment[0], dict) is False:
            total_appointment = total_appointment[0]

        summary = []
        percent_dict = []

        feedback_map = {row["Language"]: row for row in total_feedback_package if row["Language"] != "Total"}
        appointment_map = {row["Language"]: row for row in total_appointment if row["Language"] != "Total"}
        Web_Commerce = int(Web_Commerce)
        
        for row in total_inquiry:
            lang = row.get("language")
            if lang != "Total inquiry":
                feedback_row = feedback_map.get(lang, {})
                appoint_row = appointment_map.get(lang, {})

                # 👉 ใช้ inquiry ย่อยแทน Total Language
                general_inquiry = row.get("General Inquiry", 0)
                estimated_cost = row.get("Estimated Cost", 0)
                contact_doctor = row.get("Contact Doctor", 0)
                other = row.get("Other", 0)

                inquiry_total = general_inquiry + estimated_cost + contact_doctor + other

                feedback = feedback_row.get("Feedback", 0)
                packages = feedback_row.get("Packages", 0)
                appointment = appoint_row.get("Appointment", 0)
                appointment_recommended = appoint_row.get("Appointment Recommended", 0)

                for_inquiry = inquiry_total + feedback + packages
                for_appointment = appointment + appointment_recommended


                percent_dict.append({
                    "lang": lang,
                    "percent_inquiry": for_inquiry,
                    "percent_appointment": for_appointment
                })

                #Header + row each lang
                summary.append({
                    "language": lang,
                    "General Inquiry": general_inquiry,
                    "Estimated Cost": estimated_cost,
                    "Contact Doctor": contact_doctor,
                    "Other": other,
                    "feedback": feedback,
                    "packages": packages,
                    "appointment": appointment,
                    "appointment recommended": appointment_recommended,
                    "Web Commerce": 0,
                    "total Email": inquiry_total + feedback + packages + appointment + appointment_recommended,
                    '%Total Inquiry': 0, 
                    '%Total Appointment': 0, 
                    '%_webCommerce': 0
                })  
        
        
        # custom row
        # ✅ รวมแถว Total
        total_row = {
            "language": "Total",
            "General Inquiry": sum(item.get("General Inquiry", 0) for item in summary),
            "Estimated Cost": sum(item.get("Estimated Cost", 0) for item in summary),
            "Contact Doctor": sum(item.get("Contact Doctor", 0) for item in summary),
            "Other": sum(item.get("Other", 0) for item in summary),
            "feedback": sum(item["feedback"] for item in summary),
            "packages": sum(item["packages"] for item in summary),
            "appointment": sum(item["appointment"] for item in summary),
            "appointment recommended": sum(item["appointment recommended"] for item in summary),
            "Web Commerce": Web_Commerce,
        }

        total_row_inquiry = {
            "General Inquiry": sum(item.get("General Inquiry", 0) for item in summary),
            "Estimated Cost": sum(item.get("Estimated Cost", 0) for item in summary),
            "Contact Doctor": sum(item.get("Contact Doctor", 0) for item in summary),
            "Other": sum(item.get("Other", 0) for item in summary),
            "feedback": sum(item["feedback"] for item in summary),
            "packages": sum(item["packages"] for item in summary),
            "language": [item.get('language') for item in summary],
        }
        total_row_appointment = {
            "appointment": sum(item["appointment"] for item in summary),
            "appointment recommended": sum(item["appointment recommended"] for item in summary),
        }

        
        total_row["total Email"] = (
            total_row["General Inquiry"] +
            total_row["Estimated Cost"] +
            total_row["Contact Doctor"] +
            total_row["Other"] +
            total_row["feedback"] +
            total_row["packages"] +
            total_row["appointment"] +
            total_row["appointment recommended"] +
            total_row["Web Commerce"]
        )

        percent_inquiry = [item for item in cal_percent(percent_dict, total_row["total Email"])]

        for item, percent in zip(summary, percent_inquiry):
            item['%Total Inquiry'] = str(round(percent.get("inquiry", 0), 2)) + '%' + f' ({percent.get("inquiry_val", 0)})'
            item['%Total Appointment'] = str(round(percent.get("appointment", 0), 2)) + '%' + f' ({percent.get("appointment_val", 0)})'
        
        for_percentage = [total_row_inquiry, total_row_appointment, Web_Commerce, total_row["total Email"]]
        total_percent = find_percentage(for_percentage)

        total_row.update(total_percent[0])
        # print(json.dumps(summary, indent=2, ensure_ascii=False))
        summary.append(total_row)

        # 📊 เตรียมข้อมูลสำหรับกราฟ
        plot_data = []
        for row in summary:
            if row["language"] != "Total":
                plot_row = {k: v for k, v in row.items() if k != "total Email"}
                plot_data.append(plot_row)

        categories = [
            "General Inquiry",
            "Estimated Cost",
            "Contact Doctor",
            "Other",
            "feedback",
            "packages",
            "appointment",
            "appointment recommended"
        ]

        # สลับแกน
        transposed = []
        for cat in categories:
            row = {"category": cat}
            for entry in plot_data:
                lang = entry["language"]
                row[lang] = entry.get(cat, 0)
            transposed.append(row)

        # ✅ เพิ่ม total all ต่อภาษา
        total_all_row = {"category": "total Email"}
        for entry in plot_data:
            lang = entry["language"]
            total_all_row[lang] = sum(entry.get(cat, 0) for cat in categories)
        transposed.append(total_all_row)
        return summary, plot_data, transposed

    except Exception as e:
        print("🔥 ERROR:", e)
        return [[], []]