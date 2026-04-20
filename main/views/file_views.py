from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import ensure_csrf_cookie
from django.contrib.auth.decorators import permission_required
from main.services.file_service import list_uploaded_files_for_user


@permission_required('main.view_uploadedfile', raise_exception=True)
@login_required
@ensure_csrf_cookie
def list_uploaded_files(request):
    """Return JSON list of uploaded files for the current user."""
    files = list_uploaded_files_for_user(request.user)
    return JsonResponse({'success': True, 'files': files})
