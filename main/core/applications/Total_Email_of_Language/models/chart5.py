

def appointment_by_lang(summary):
    
    plot_data = []

    # เตรียม dict ที่จะสะสมค่ารวม
    bar = {'type': 'Appointment'}
    bar2 = {'type': 'Appointment Recommended'}

    for row in summary:
        lang = row.get('language', '').strip()
        if lang and lang.lower() != 'total':

            bar[lang] = row.get('appointment', 0)
            bar2[lang] = row.get('appointment recommended', 0)

    plot_data.extend([bar, bar2])

    mock = [
        {
        'type': 'Appointment',
        'English': 124,
        'Thai': 8,
        'Russia': 10,
        'German': 20,
        'Chinese': 30,
        'Arabic': 40,
        },
        {
        'type': 'Appointment Recommended',
        'English': 124,
        'Thai': 8,
        'Russia': 10,
        'German': 20,
        'Chinese': 30,
        'Arabic': 40,
        },
    ]
    return plot_data
