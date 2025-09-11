from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_POST
from django.contrib.auth import logout
from django.shortcuts import redirect
from main.models import UploadedFile
from . import constants
from main.utils.cache_control import clear_all_caches
from django.contrib.auth.decorators import permission_required
from django.utils.safestring import mark_safe
# from main.utils.read_period import period_min_max
import json

@login_required
@ensure_csrf_cookie
def index(request):
    context = {
        'analysis_actions': constants.ANALYSIS_ACTIONS.values(),
        'permissions': mark_safe(json.dumps({
            "username": request.user.username,
            "can_delete": request.user.has_perm("main.delete_uploadedfile"),
            "is_superuser": request.user.is_superuser,
            "is_staff": request.user.is_staff,
            "user_permissions": list(request.user.get_all_permissions()),
            "can_view": request.user.has_perm("main.view_uploadedfile")
        })),

    }
    return render(request, 'main/index.html', context)

@permission_required('main.add_uploadedfile', raise_exception=True)
def upload_file(request):
    if request.method == 'POST':
        files = request.FILES.getlist('files')
        print("ไฟล์ที่รับมา:", request.FILES)
        uploaded_files = []
        # files_count = UploadedFile.objects.count()
        allowed_extensions = ['.csv', '.xls', '.xlsx']
        
        try:
            for file in files:
                try:
                    if not any(file.name.endswith(ext) for ext in allowed_extensions):
                        return JsonResponse({
                            'success': False,
                            'error': f'ไฟล์ {file.name} ไม่ใช่ไฟล์ CSV หรือ Excel ที่รองรับ'
                        })
                    uploaded_file = UploadedFile.objects.create(
                        name=file.name,
                        file=file,
                        uploaded_by=request.user

                    )
                    uploaded_files.append({
                        'id': uploaded_file.id,
                        'name': uploaded_file.name,
                        'timestamp': uploaded_file.uploaded_at.isoformat(),
                    })
                except Exception as e:
                    return JsonResponse({
                        'success': False,
                        'error': f'ไม่สามารถอัปโหลดไฟล์ {file.name} ได้: {str(e)}'
                    })
            
            # Get all files after upload for immediate display
            all_files = list(UploadedFile.objects.values('id', 'name', 'uploaded_at'))
            return JsonResponse({
                'success': True, 
                'files': uploaded_files,
                'allFiles': all_files,
                'count': UploadedFile.objects.count()
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

    try:
        file = UploadedFile.objects.get(id=file_id)
        file.file.delete()  # ลบไฟล์จริงจาก disk ด้วย
        file.delete()       # ลบ record ออกจาก database
        return JsonResponse({'success': True})
    except UploadedFile.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'File not found'})

@permission_required('main.delete_uploadedfile', raise_exception=True)
@login_required
@require_POST
def delete_all_files(request):
    try:
        count = 0
        user = request.user

        if (user.is_staff):
            upfiles = UploadedFile.objects.all()
        else :
            upfiles = UploadedFile.objects.filter(user)

        for obj in upfiles:
            print(f"🧹 ลบ record id: {obj.id} | file: {obj.file.name}")
            if obj.file:
                obj.file.delete(save=False)  # ✅ ลบจาก disk
            obj.delete()  # ✅ ลบจาก DB
            count += 1
        clear_all_caches()
        return JsonResponse({"success": True, "message": f"ลบ {count} ไฟล์เรียบร้อย"})
    except Exception as e:
        return JsonResponse({"success": False, "message": str(e)})
    
@login_required
@require_POST
def logout_view(request):
    user = request.user
    if user.is_authenticated:
        print(f"ผู้ใช้ {user.username} ออกจากระบบ")
        clear_all_caches()
    logout(request)
    return redirect('/')

# def period(request):
#     return JsonResponse(period_min_max())