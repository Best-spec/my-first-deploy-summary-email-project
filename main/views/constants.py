from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from main.config.actions import ANALYSIS_ACTIONS

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
            logger.debug("%s", Web_Commerce)
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
