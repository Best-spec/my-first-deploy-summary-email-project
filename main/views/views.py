from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.contrib.auth import logout
from django.shortcuts import redirect
from main.utils.cache_control import clear_all_caches
from django.contrib.auth.decorators import permission_required, login_required
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.safestring import mark_safe
from . import constants
import json


# Import upload service and file service
from main.services.upload_service import (
    process_uploaded_files,
    get_all_uploaded_files,
    get_uploaded_files_count
)
from main.services.file_service import (
    delete_uploaded_file as delete_uploaded_file_service,
    delete_all_uploaded_files as delete_all_uploaded_files_service,
)

@login_required
@ensure_csrf_cookie
def index(request):
    context = {
        'analysis_actions': constants.ANALYSIS_ACTIONS.values(),
        'permissions': mark_safe(json.dumps({
            'username': request.user.username,
            'can_delete': request.user.has_perm('main.delete_uploadedfile'),
            'is_superuser': request.user.is_superuser,
            'is_staff': request.user.is_staff,
            'user_permissions': list(request.user.get_all_permissions()),
            'can_view': request.user.has_perm('main.view_uploadedfile'),
        })),
    }
    return render(request, 'main/index.html', context)


@permission_required('main.add_uploadedfile', raise_exception=True)
def upload_file(request):
    """
    Handle file upload requests.
    
    Only accepts POST requests with file(s) in the 'files' parameter.
    Files are validated through the upload service.
    """
    if request.method == 'POST':
        files = request.FILES.getlist('files')
        print("ไฟล์ที่รับมา:", request.FILES)
        
        try:
            # Process files through the upload service
            result = process_uploaded_files(files, request.user)
            
            if not result['success']:
                return JsonResponse({
                    'success': False,
                    'error': result['error']
                })
            
            # Get all files after upload for immediate display
            all_files = get_all_uploaded_files()
            return JsonResponse({
                'success': True, 
                'files': result['uploaded_files'],
                'allFiles': all_files,
                'count': get_uploaded_files_count()
            })
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': f'เกิดข้อผิดพลาดในการอัปโหลด: {str(e)}'
            })
    
    return JsonResponse({
        'success': False,
        'error': 'Invalid request method'
    })

@permission_required('main.delete_uploadedfile', raise_exception=True)
@require_POST
def delete_uploaded_file(request):
    file_id = request.POST.get('file_id')

    if not file_id:
        return JsonResponse({'success': False, 'message': 'Missing file ID'})

    result = delete_uploaded_file_service(file_id, request.user)
    return JsonResponse(result)

@permission_required('main.delete_uploadedfile', raise_exception=True)
@login_required
@require_POST
def delete_all_files(request):
    result = delete_all_uploaded_files_service(request.user)
    if result['success']:
        clear_all_caches()
        return JsonResponse({
            'success': True,
            'message': f'ลบ {result["count"]} ไฟล์เรียบร้อย'
        })
    return JsonResponse(result)
    
@login_required
@require_POST
def logout_view(request):
    user = request.user
    if user.is_authenticated:
        print(f"ผู้ใช้ {user.username} ออกจากระบบ")
        clear_all_caches()
    logout(request)
    return redirect('/')