from django.http import JsonResponse
import json
from main.services.type_email_service import TypeEmailService


def find_all_type_email(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST method is allowed'}, status=405)
    try:
        date_param = json.loads(request.body)
        data = TypeEmailService.find_all_type_email(date_param)
        return JsonResponse(data, safe=False)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
