def group_by_country_type(summary):
    types = ['General Inquiry', 'Estimated Cost', 'Contact Doctor', 'Other', 'feedback', 'packages', 'appointment', 'appointment recommended']
    result = {}

    for row in summary:
        lang = row.get('language', '').strip()
        if not lang or lang.lower() == 'total':
            continue

        if lang not in result:
            result[lang] = {t: 0 for t in types}

        for t in types:
            result[lang][t] += row.get(t, 0)

    return result
