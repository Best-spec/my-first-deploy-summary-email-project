

def Grand_Total_By_Language(data):
    mock = [
        {
            'language': 'English',
            'General Inquiry': 55,
            'Estimated Cost': 51,
            'Contact Doctor': 7,
            'Other': 10,
            'feedback': 0,
            'packages': 1,
            'appointment': 116,
            'appointment recommended': 86,
            'Web Commerce': 0,
            '%Total Inquiry': '31.79% (124)',
            '%Total Appointment': '51.79% (202)',
            '%_webCommerce': 0
        },
        {
            'language': 'Thai',
            'General Inquiry': 2,
            'Estimated Cost': 3,
            'Contact Doctor': 0,
            'Other': 0,
            'feedback': 2,
            'packages': 1,
            'appointment': 0,
            'appointment recommended': 18,
            'Web Commerce': 0,
            '%Total Inquiry': '2.05% (8)',
            '%Total Appointment': '4.62% (18)',
            '%_webCommerce': 0
        },
        {
            'language': 'Russia',
            'General Inquiry': 2,
            'Estimated Cost': 5,
            'Contact Doctor': 1,
            'Other': 1,
            'feedback': 1,
            'packages': 0,
            'appointment': 2,
            'appointment recommended': 7,
            'Web Commerce': 0,
            '%Total Inquiry': '2.56% (10)',
            '%Total Appointment': '2.31% (9)',
            '%_webCommerce': 0
        },
        {
            'language': 'German',
            'General Inquiry': 1,
            'Estimated Cost': 1,
            'Contact Doctor': 0,
            'Other': 0,
            'feedback': 0,
            'packages': 0,
            'appointment': 0,
            'appointment recommended': 1,
            'Web Commerce': 0,
            '%Total Inquiry': '0.51% (2)',
            '%Total Appointment': '0.26% (1)',
            '%_webCommerce': 0
        },
        {
            'language': 'Chinese',
            'General Inquiry': 1,
            'Estimated Cost': 0,
            'Contact Doctor': 0,
            'Other': 0,
            'feedback': 0,
            'packages': 0,
            'appointment': 0,
            'appointment recommended': 2,
            'Web Commerce': 0,
            '%Total Inquiry': '0.26% (1)',
            '%Total Appointment': '0.51% (2)',
            '%_webCommerce': 0
        },
        {
            'language': 'Arabic',
            'General Inquiry': 0,
            'Estimated Cost': 0,
            'Contact Doctor': 0,
            'Other': 1,
            'feedback': 0,
            'packages': 0,
            'appointment': 0,
            'appointment recommended': 0,
            'Web Commerce': 0,
            '%Total Inquiry': '0.26% (1)',
            '%Total Appointment': '0.0% (0)',
            '%_webCommerce': 0
        }
    ]


    total = [{'language':item['language'], 'Total by language':item['total Email']} for item in data if item['language'] != 'Total']

    return total