import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from main.services.auth_service import (
    authenticate_user,
    create_token_pair,
    refresh_token,
)
from main.utils.cache_control import clear_all_caches


@csrf_exempt
@require_POST
def login_view(request):
    try:
        data = json.loads(request.body.decode('utf-8') or '{}')
    except json.JSONDecodeError:
        return JsonResponse({'success': False, 'error': 'Invalid JSON body'}, status=400)

    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return JsonResponse({'success': False, 'error': 'Username and password are required'}, status=400)

    user = authenticate_user(username=username, password=password)
    if not user:
        return JsonResponse({'success': False, 'error': 'Invalid username or password'}, status=401)

    if not user.is_active:
        return JsonResponse({'success': False, 'error': 'User account is disabled'}, status=403)

    tokens = create_token_pair(user)
    return JsonResponse({
        'success': True,
        'access': tokens['access'],
        'refresh': tokens['refresh'],
        'user': {
            'id': user.id,
            'username': user.username,
        }
    })


@csrf_exempt
@require_POST
def refresh_view(request):
    try:
        data = json.loads(request.body.decode('utf-8') or '{}')
    except json.JSONDecodeError:
        return JsonResponse({'success': False, 'error': 'Invalid JSON body'}, status=400)

    refresh = data.get('refresh')
    if not refresh:
        return JsonResponse({'success': False, 'error': 'Refresh token is required'}, status=400)

    try:
        tokens = refresh_token(refresh)
        return JsonResponse({'success': True, 'access': tokens['access']})
    except ValueError as exc:
        return JsonResponse({'success': False, 'error': str(exc)}, status=401)


@csrf_exempt
@require_POST
def logout_view(request):
    try:
        clear_all_caches()
        return JsonResponse({'success': True, 'message': 'Logged out successfully'})
    except Exception as exc:
        return JsonResponse({'success': False, 'error': str(exc)}, status=500)
