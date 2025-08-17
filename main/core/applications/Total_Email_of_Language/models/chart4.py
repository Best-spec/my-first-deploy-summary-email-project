


def inquiry_by_lang(summary):

    plot_data = []

    # เตรียม dict ที่จะสะสมค่ารวม
    bar = {'type': 'General Inquiry'}
    bar2 = {'type': 'Estimated Cost'}
    bar3 = {'type': 'Contact Doctor'}
    bar4 = {'type': 'Other'}
    bar5 = {'type': 'feedback'}
    bar6 = {'type': 'packages'}

    for row in summary:
        lang = row.get('language', '').strip()
        if lang and lang.lower() != 'total':

            bar[lang] = row.get('General Inquiry', 0)
            bar2[lang] = row.get('Estimated Cost', 0)
            bar3[lang] = row.get('Contact Doctor', 0)
            bar4[lang] = row.get('Other', 0)
            bar5[lang] = row.get('feedback', 0)
            bar6[lang] = row.get('packages', 0)

    plot_data.extend([bar, bar2, bar3, bar4, bar5, bar6])

    mock = [
        {
        'type': 'General Inquiry',
        'English': 124,
        'Thai': 8,
        'Russia': 10,
        'German': 20,
        'Chinese': 30,
        'Arabic': 40,
        },
        {
        'type': 'Estimated Cost',
        'English': 124,
        'Thai': 8,
        'Russia': 10,
        'German': 20,
        'Chinese': 30,
        'Arabic': 40,
        },
        {
        'type': 'Contact Doctor',
        'English': 124,
        'Thai': 8,
        'Russia': 10,
        'German': 20,
        'Chinese': 30,
        'Arabic': 40,
        },
        {
        'type': 'Other',
        'English': 124,
        'Thai': 8,
        'Russia': 10,
        'German': 20,
        'Chinese': 30,
        'Arabic': 40,
        },
        {
        'type': 'feedback',
        'English': 124,
        'Thai': 8,
        'Russia': 10,
        'German': 20,
        'Chinese': 30,
        'Arabic': 40,
        },
        {
        'type': 'packages',
        'English': 124,
        'Thai': 8,
        'Russia': 10,
        'German': 20,
        'Chinese': 30,
        'Arabic': 40,
        },
    ]
    return plot_data
