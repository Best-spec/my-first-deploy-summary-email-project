from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_POST
from main.models import UploadedFile
from . import constants
from main.utils.cache_control import clear_all_caches

@login_required
@ensure_csrf_cookie
def index(request):
    files = UploadedFile.objects.all()
    context = {
        'files': files,
        'analysis_actions': constants.ANALYSIS_ACTIONS.values(),
    }
    return render(request, 'main/index.html', context)

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
                        file=file
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


@login_required
@require_POST
def delete_all_files(request):
    try:
        count = 0
        for obj in UploadedFile.objects.all():
            print(f"🧹 ลบ record id: {obj.id} | file: {obj.file.name}")
            if obj.file:
                obj.file.delete(save=False)  # ✅ ลบจาก disk
            obj.delete()  # ✅ ลบจาก DB
            count += 1
        clear_all_caches()
        return JsonResponse({"success": True, "message": f"ลบ {count} ไฟล์เรียบร้อย"})
    except Exception as e:
        return JsonResponse({"success": False, "message": str(e)})

    
