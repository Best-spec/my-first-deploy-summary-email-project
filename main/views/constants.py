from .inquiry import find_inquiry, get_total_languages_summary
from .appointment import find_appointment_from_csv_folder
from .feedback_package import find_FeedbackAndPackage, FPtotal
from .Type_email import aggregate_summary_for_plot
from .top_center import find_top_clinics_summary_main
from .Total_Email_of_Language import find_TotalMonth
from django.http import JsonResponse

from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json

ANALYSIS_ACTIONS = {
    'inquiry': {
        'id': 'inquiry', 'name': 'Type Inquiry', 'color': 'blue', 'icon': '💬',
        'function': find_inquiry
    },
    'appointment': {
        'id': 'appointment', 'name': 'Type Appointment', 'color': 'green', 'icon': '📅',
        'function': find_appointment_from_csv_folder
    },
    'feedback': {
        'id': 'feedback', 'name': 'Type Feedback', 'color': 'purple', 'icon': '❤️',
        'function': find_FeedbackAndPackage
    },
    'plot-all': {
        'id': 'plot-all', 'name': 'Type Email', 'color': 'orange', 'icon': '📊',
        'function': aggregate_summary_for_plot
    },
    'top-center': {
        'id': 'top-center', 'name': 'Top Center', 'color': 'red', 'icon': '⭐',
        'function': find_top_clinics_summary_main
    },
    'total-month': {
        'id': 'total-month', 'name': 'Total Email of Language', 'color': 'teal', 'icon': '📈',
        'function': find_TotalMonth
    },
}

@csrf_exempt
def analyze(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST method is allowed'}, status=405)

    try:
        body = json.loads(request.body)
        action_id = body.get('action_id')
        datetime = body.get('date')

        action = ANALYSIS_ACTIONS.get(action_id)
        if not action:
            return JsonResponse({'error': f'Invalid action_id: {action_id}'}, status=400)

        # ดึงฟังก์ชันแล้วเรียกใช้
        func = action.get('function')
        if not func:
            return JsonResponse({'error': f'No function defined for {action_id}'}, status=500)

        data = func(datetime)
        return JsonResponse({'data': data})

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
