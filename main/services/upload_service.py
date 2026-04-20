"""
Upload service for handling file upload business logic.
Contains functions for processing uploaded files.
"""

from main.models import UploadedFile
from main.utils.upload_utils import validate_uploaded_file


def process_uploaded_files(files, user):
    """
    Process and save uploaded files to the database.
    
    Args:
        files (list): List of Django UploadedFile objects
        user: Django User object
        
    Returns:
        dict: Result containing:
            - success (bool): Whether all files were uploaded successfully
            - uploaded_files (list): List of successfully uploaded file data
            - error (str): Error message if any file failed validation
            - error_file (str): Name of file that caused the error (if any)
    """
    uploaded_files = []
    
    for file in files:
        # Validate file before processing
        is_valid, error_msg = validate_uploaded_file(file)
        if not is_valid:
            return {
                'success': False,
                'uploaded_files': uploaded_files,
                'error': error_msg,
                'error_file': file.name
            }
        
        try:
            # Create and save the UploadedFile record
            uploaded_file = UploadedFile.objects.create(
                name=file.name,
                file=file,
                uploaded_by=user
            )
            
            uploaded_files.append({
                'id': uploaded_file.id,
                'name': uploaded_file.name,
                'timestamp': uploaded_file.uploaded_at.isoformat(),
            })
            
        except Exception as e:
            return {
                'success': False,
                'uploaded_files': uploaded_files,
                'error': f'ไม่สามารถอัปโหลดไฟล์ {file.name} ได้: {str(e)}',
                'error_file': file.name
            }
    
    return {
        'success': True,
        'uploaded_files': uploaded_files,
        'error': None,
        'error_file': None
    }


def get_all_uploaded_files():
    """
    Get all uploaded files from the database.
    
    Returns:
        list: List of dicts containing file id, name, and uploaded_at timestamp
    """
    return list(UploadedFile.objects.values('id', 'name', 'uploaded_at'))


def get_uploaded_files_count():
    """
    Get the total count of uploaded files.
    
    Returns:
        int: Number of uploaded files
    """
    return UploadedFile.objects.count()
