# views.py
from django.http import JsonResponse
from main.models import UploadedFile


def list_uploaded_files(request):
    files = UploadedFile.objects.all()
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