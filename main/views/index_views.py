from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import ensure_csrf_cookie
from . import constants


@login_required
@ensure_csrf_cookie
def index(request):
    safe_actions = []
    for action in constants.ANALYSIS_ACTIONS.values():
        safe_actions.append({
            'id': action.get('id'),
            'name': action.get('name'),
            'color': action.get('color'),
            'icon': action.get('icon'),
        })

    response_data = {
        'analysis_actions': safe_actions,
        'permissions': {
            'username': request.user.username,
            'can_delete': request.user.has_perm('main.delete_uploadedfile'),
            'is_superuser': request.user.is_superuser,
            'is_staff': request.user.is_staff,
            'user_permissions': list(request.user.get_all_permissions()),
            'can_view': request.user.has_perm('main.view_uploadedfile'),
        }
    }
    return JsonResponse(response_data)
