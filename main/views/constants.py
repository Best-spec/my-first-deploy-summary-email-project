from .inquiry import find_inquiry
from .appointment import find_appointment
from .feedback_package import find_FeedbackAndPackage, FPtotal
from .plot_all import aggregate_summary_for_plot
from .top_center import find_top_clinics_summary
from .total_month import find_TotalMonth
from django.http import JsonResponse

from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json

ANALYSIS_ACTIONS = {
    'inquiry': {
        'id': 'inquiry', 'name': 'Inquiry', 'color': 'blue', 'icon': '💬',
        'function': find_inquiry
    },
    'appointment': {
        'id': 'appointment', 'name': 'Appointment', 'color': 'green', 'icon': '📅',
        'function': find_appointment
    },
    'feedback': {
        'id': 'feedback', 'name': 'Feedback', 'color': 'purple', 'icon': '❤️',
        'function': find_FeedbackAndPackage
    },
    'plot-all': {
        'id': 'plot-all', 'name': 'Plot All', 'color': 'orange', 'icon': '📊',
        'function': aggregate_summary_for_plot
    },
    'top-center': {
        'id': 'top-center', 'name': 'Top Center', 'color': 'red', 'icon': '⭐',
        'function': find_top_clinics_summary
    },
    'total-month': {
        'id': 'total-month', 'name': 'Total Month', 'color': 'teal', 'icon': '📈',
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

        action = ANALYSIS_ACTIONS.get(action_id)
        if not action:
            return JsonResponse({'error': f'Invalid action_id: {action_id}'}, status=400)

        # ดึงฟังก์ชันแล้วเรียกใช้
        func = action.get('function')
        if not func:
            return JsonResponse({'error': f'No function defined for {action_id}'}, status=500)

        data = func()
        return JsonResponse({'data': data})

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
