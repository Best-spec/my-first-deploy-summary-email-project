"""
Upload utilities for file handling and validation.
Contains constants and helper functions for file uploads.
"""

# Allowed file extensions for upload
ALLOWED_EXTENSIONS = ['.csv', '.xls', '.xlsx']

# Maximum file size in bytes (e.g., 50MB)
MAX_FILE_SIZE = 50 * 1024 * 1024  # 50MB


def is_file_extension_allowed(filename):
    """
    Check if the file extension is in the allowed list.
    
    Args:
        filename (str): The name of the file to check
        
    Returns:
        bool: True if the extension is allowed, False otherwise
    """
    return any(filename.endswith(ext) for ext in ALLOWED_EXTENSIONS)


def validate_file_extension(filename):
    """
    Validate file extension and return appropriate error message if invalid.
    
    Args:
        filename (str): The name of the file to validate
        
    Returns:
        tuple: (is_valid: bool, error_message: str or None)
    """
    if not is_file_extension_allowed(filename):
        error_msg = f'ไฟล์ {filename} ไม่ใช่ไฟล์ CSV หรือ Excel ที่รองรับ'
        return False, error_msg
    return True, None


def validate_file_size(file):
    """
    Validate file size.
    
    Args:
        file: Django UploadedFile object
        
    Returns:
        tuple: (is_valid: bool, error_message: str or None)
    """
    if file.size > MAX_FILE_SIZE:
        error_msg = f'ไฟล์ {file.name} มีขนาดใหญ่เกินไป (สูงสุด {MAX_FILE_SIZE // (1024*1024)}MB)'
        return False, error_msg
    return True, None


def validate_uploaded_file(file):
    """
    Validate an uploaded file for both extension and size.
    
    Args:
        file: Django UploadedFile object
        
    Returns:
        tuple: (is_valid: bool, error_message: str or None)
    """
    # Check extension
    is_valid, error_msg = validate_file_extension(file.name)
    if not is_valid:
        return False, error_msg
    
    # Check size
    is_valid, error_msg = validate_file_size(file)
    if not is_valid:
        return False, error_msg
    
    return True, None
