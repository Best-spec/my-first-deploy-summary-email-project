from django.http import JsonResponse
from django.apps import apps

def db_summary(request):
    result = {}
    for model in apps.get_models():
        try:
            count = model.objects.count()
            result[model.__name__] = count
        except Exception as e:
            result[model.__name__] = f'error: {str(e)}'
    return JsonResponse(result)


def list_model_data(request, model_name):
    model = apps.get_model('yourappname', model_name)
    data = list(model.objects.all().values()[:20])
    return JsonResponse(data, safe=False)