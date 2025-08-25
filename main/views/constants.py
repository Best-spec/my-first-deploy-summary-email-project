from main.controllers.TopCenter.controllers.top_clinic_controller import find_top_clinics_summary
from main.controllers.Total_Email_of_Language.services.total_services import find_TotalMonth
from django.http import JsonResponse

from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json

ANALYSIS_ACTIONS = {
    'top-center': {
        'id': 'top-center', 'name': 'Top Center', 'color': 'red', 'icon': '⭐',
        'function': find_top_clinics_summary
    },
    'total-month': {
        'id': 'total-month', 'name': 'Total Email by Language', 'color': 'teal', 'icon': '📈',
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
        date = body.get('date')
        Web_Commerce = body.get('Web_Commerce')

        action = ANALYSIS_ACTIONS.get(action_id)
        if not action:
            return JsonResponse({'error': f'Invalid action_id: {action_id}'}, status=400)

        # ดึงฟังก์ชันแล้วเรียกใช้
        func = action.get('function')
        if not func:
            return JsonResponse({'error': f'No function defined for {action_id}'}, status=500)
            
        if action_id == 'total-month':
            data = func(date, Web_Commerce)
            print(Web_Commerce)
        else :
            data = func(date)
        return JsonResponse({
            'status': 'success',
            'msg': 'Data fetched successfully',
            'data': data
        })

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    




res = {
    "status": "success",
    "msg": "Data fetched successfully",
    "data": {
        "dataForTable": [
            {"Language": "EN", "Appointment": 10, "Recommended": 5, "Total": 15},
            {"Language": "TH", "Appointment": 7, "Recommended": 3, "Total": 10}
        ],
        "dataForChart": {
            "appointment_count": 17,
            "appointment_recommended_count": 8
        }
    }
}
