"""File-related business logic service."""

from main.models import UploadedFile
from main.utils.file_utils import serialize_uploaded_file, is_admin_user


def list_uploaded_files_for_user(user):
    """Return serialized uploaded files available to the given user."""
    if is_admin_user(user):
        files = UploadedFile.objects.all()
    else:
        files = UploadedFile.objects.filter(uploaded_by=user)

    return [serialize_uploaded_file(f) for f in files]


def delete_uploaded_file(file_id, user):
    """Delete a single uploaded file if the user has access."""
    if is_admin_user(user):
        file = UploadedFile.objects.filter(id=file_id).first()
    else:
        file = UploadedFile.objects.filter(id=file_id, uploaded_by=user).first()

    if not file:
        return {
            'success': False,
            'message': 'File not found or access denied'
        }

    file.file.delete(save=False)
    file.delete()
    return {
        'success': True,
    }


def delete_all_uploaded_files(user):
    """Delete all uploaded files available to the given user."""
    if is_admin_user(user):
        files = UploadedFile.objects.all()
    else:
        files = UploadedFile.objects.filter(uploaded_by=user)

    count = 0
    for obj in files:
        if obj.file:
            obj.file.delete(save=False)
        obj.delete()
        count += 1

    return {
        'success': True,
        'count': count,
    }
