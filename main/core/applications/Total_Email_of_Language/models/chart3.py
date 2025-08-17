

def Total_Email_Type_By_Language(summary):

    plot_data = []

    # เตรียม dict ที่จะสะสมค่ารวม
    bar = {'type': 'Inquiry'}
    bar2 = {'type': 'Appointment'}

    for row in summary:
        lang = row.get('language', '').strip()
        if lang and lang.lower() != 'total':

            # ดึงค่าของ inquiry ตามหมวดต่าง ๆ
            inquiry = (
                row.get('General Inquiry', 0) +
                row.get('Estimated Cost', 0) +
                row.get('Contact Doctor', 0) +
                row.get('Other', 0) +
                row.get('feedback', 0) +  # ตรวจสอบชื่อ key ให้ตรง
                row.get('packages', 0)
            )
            bar[lang] = inquiry

            # ดึงค่าของ appointment
            appointment = (
                row.get('appointment', 0) +
                row.get('appointment recommended', 0)
            )
            bar2[lang] = appointment

    plot_data.append(bar)
    plot_data.append(bar2)

    test = [{
        'type': 'inquiry',
        'English': 124,
        'Thai': 8,
        'Russia': 10,
        'German': 20,
        'Chinese': 30,
        'Arabic': 40,
    },

    {
        'type': 'Appointment',
        'English': 124,
        'Thai': 8,
        'Russia': 10,
        'German': 20,
        'Chinese': 30,
        'Arabic': 40,
    }]
    return plot_data