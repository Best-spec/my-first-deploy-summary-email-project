"""Utility helpers for file handling and serialization."""


def is_admin_user(user):
    """Return True when a user should see all uploaded files."""
    return user.groups.filter(name='admin').exists() or user.is_superuser or user.is_staff


def serialize_uploaded_file(uploaded_file):
    """Serialize an UploadedFile model for JSON responses."""
    file_name = uploaded_file.file.name.split('/')[-1]
    return {
        'id': uploaded_file.id,
        'name': file_name,
        'url': uploaded_file.file.url,
        'size': uploaded_file.file.size,
    }
