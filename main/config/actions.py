from main.views.TopCenter.controllers.top_clinic_controller import find_top_clinics_summary
from main.views.Total_Email_of_Language import find_TotalMonth

ANALYSIS_ACTIONS = {
    'top-center': {
        'id': 'top-center',
        'name': 'Top Center',
        'color': 'red',
        'icon': '⭐',
        'function': find_top_clinics_summary,
    },
    'total-month': {
        'id': 'total-month',
        'name': 'Total Email by Language',
        'color': 'teal',
        'icon': '📈',
        'function': find_TotalMonth,
    },
}
