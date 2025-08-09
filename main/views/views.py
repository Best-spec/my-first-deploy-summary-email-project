from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_POST
from main.services.file_service import FileService
from main.models import UploadedFile
from . import constants
import logging

logger = logging.getLogger(__name__)

file_service = FileService()


@login_required
@ensure_csrf_cookie
def index(request):
    files = file_service.all()
    context = {
        'files': files,
        'analysis_actions': constants.ANALYSIS_ACTIONS.values(),
    }
    return render(request, 'main/index.html', context)


def upload_file(request):
    if request.method != 'POST':
        return JsonResponse({'success': False, 'error': 'Invalid request method'})

    files = request.FILES.getlist('files')
    try:
        uploaded_files = file_service.upload_files(files)
        all_files = file_service.list_files()
        return JsonResponse({
            'success': True,
            'files': uploaded_files,
            'allFiles': all_files,
            'count': len(all_files)
        })
    except ValueError as e:
        return JsonResponse({'success': False, 'error': str(e)})
    except Exception as e:
        return JsonResponse({'success': False, 'error': f'เกิดข้อผิดพลาดในการอัปโหลด: {str(e)}'})


@require_POST
def delete_uploaded_file(request):
    file_id = request.POST.get('file_id')
    if not file_id:
        return JsonResponse({'success': False, 'message': 'Missing file ID'})
    try:
        file_service.delete_file(file_id)
        return JsonResponse({'success': True})
    except UploadedFile.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'File not found'})
