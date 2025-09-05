# views.py
from django.http import JsonResponse
from main.models import UploadedFile


def list_uploaded_files(request):
    if request.user.groups.filter(name='admin').exists() or request.user.is_superuser or request.user.is_staff:
        files = UploadedFile.objects.all()  
    else:
        files = UploadedFile.objects.filter(uploaded_by=request.user)
        
    data = []
    for f in files:
        try:
            file_name = f.file.name.split('/')[-1]
            file_url = f.file.url
            file_size = f.file.size
            data.append({
                'id': f.id,
                'name': file_name,
                'url': file_url,
                'size': file_size,
            })
        except Exception as e:
            print('Error processing file:', f.id, e)
            
    return JsonResponse({'success': True,
                         'files': data,
                         'output': 'from views'
                        })