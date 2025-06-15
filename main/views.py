from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.core.files.storage import default_storage
from django.views.decorators.http import require_POST
from .models import UploadedFile
import json
import os
import mimetypes
import pandas as pd

# Dictionary of analysis actions with their properties
ANALYSIS_ACTIONS = {
    'inquiry': {'id': 'inquiry', 'name': 'Inquiry', 'color': 'blue', 'icon': '💬'},
    'appointment': {'id': 'appointment', 'name': 'Appointment', 'color': 'green', 'icon': '📅'},
    'feedback': {'id': 'feedback', 'name': 'Feedback', 'color': 'purple', 'icon': '❤️'},
    'plot-all': {'id': 'plot-all', 'name': 'Plot All', 'color': 'orange', 'icon': '📊'},
    'top-center': {'id': 'top-center', 'name': 'Top Center', 'color': 'red', 'icon': '⭐'},
    'total-month': {'id': 'total-month', 'name': 'Total Month', 'color': 'teal', 'icon': '📈'},
}

sales_data = [
    {
    'name': 'เครื่องใช้ไฟฟ้า',
    'icon': '🔌',
    'sales': '2,458,000',
    'profit': '425,000',
    'growth_rate': 12.8,
    'growth_positive': True
    },
    {
    'name': 'เสื้อผ้า',
    'icon': '👕',
    'sales': '1,850,000',
    'profit': '380,000',
    'growth_rate': 8.5,
    'growth_positive': True
    },
    {
    'name': 'อาหาร',
    'icon': '🍔',
    'sales': '3,200,000',
    'profit': '640,000',
    'growth_rate': -2.3,
    'growth_positive': False
    },
    {
    'name': 'เครื่องสำอาง',
    'icon': '💄',
    'sales': '950,000',
    'profit': '285,000',
    'growth_rate': 15.2,
    'growth_positive': True
    }
    ]

@ensure_csrf_cookie
def index(request):
    files = UploadedFile.objects.all()
    context = {
        'files': files,
        'analysis_actions': ANALYSIS_ACTIONS.values(),
        'sales_data': sales_data
    }
    return render(request, 'main/index.html', context)

def upload_file(request):
    if request.method == 'POST':
        files = request.FILES.getlist('files')
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
def delete_file(request, file_id):
    file_id = int(file_id)  # Ensure file_id is an integer
    try:
        file = UploadedFile.objects.get(id=file_id)
        file.file.delete()  # ลบจาก disk
        file.delete()       # ลบจาก database
        return JsonResponse({'status': 'ok'})
    except UploadedFile.DoesNotExist:
        return JsonResponse({'error': 'File not found'}, status=404)

def showtest(request):
    return render(request, 'main/test.html')

def showDF_file(request):
    try:
        # results = []
        # for file in UploadedFile.objects.all():
        #     if file.name.endswith('.csv'): 
        #         df = pd.read_csv(file.file)  
        #     elif file.name.endswith(('.xls', '.xlsx')):
        #         df = pd.read_excel(file.file)
        #     else:
        #         raise ValueError(f'Unsupported file type: {file.name}')

        #     df = df.where(pd.notnull(df), None)  # ✅ แปลง NaN เป็น None
        #     results.append({
        #         'data': df.to_dict(orient='records'),
        #         'columns': df.columns.tolist(),
        #         'rows': len(df)
        #     })
        # df = df.where(pd.notnull(df), None)
        # results = df.to_dict(orient='records')
        results = "จาก back"
        return JsonResponse({'success': True, 'results': results})

    except UploadedFile.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'ไม่เจอไฟล์'})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})