import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from main.services.analysis_service import perform_analysis


@csrf_exempt
@require_POST
def analyze(request):
    """Handle analysis requests and return JSON results."""
    try:
        body = json.loads(request.body.decode('utf-8') or '{}')
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON body'}, status=400)

    action_id = body.get('action_id')
    date = body.get('date')
    web_commerce = body.get('Web_Commerce')

    try:
        data = perform_analysis(action_id, date, web_commerce)
        return JsonResponse({
            'status': 'success',
            'msg': 'Data fetched successfully',
            'data': data
        })
    except ValueError as exc:
        return JsonResponse({'error': str(exc)}, status=400)
    except Exception as exc:
        return JsonResponse({'error': str(exc)}, status=500)
